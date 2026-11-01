"""Writes fixtures.json. Independent of the TS module: pure-Python resampling,
year-on-year change and lag pairing; scipy.stats.spearmanr for rho.
Run: python tests/link/gen_fixtures.py  (needs scipy)"""
import json, random, datetime as dt
from pathlib import Path
from scipy.stats import spearmanr

MIN = {"Q": 40, "A": 10}
MAXLAG = {"Q": 8, "A": 3}
PER = {("M", "Q"): 3, ("M", "A"): 12, ("Q", "A"): 4, ("Q", "Q"): 1, ("A", "A"): 1}


def qidx(y, m):  # month -> quarter index
    return y * 4 + (m - 1) // 3


def pidx(p, target):
    y = int(p[:4])
    if target == "A":
        return y
    return y * 4 + int(p[6]) - 1 if p[5] == "Q" else qidx(y, int(p[5:7]))


def levels(series, target):
    f, obs = series["freq"], [o for o in series["obs"] if o["value"] is not None]
    groups = {}
    if f == "D":
        ev = sorted((dt.date.fromisoformat(o["period"]), o["value"]) for o in obs)
        first, last = ev[0][0], ev[-1][0]
        days = {}
        d = first
        while d <= last:
            v = [x for dd, x in ev if dd <= d][-1]
            i = d.year if target == "A" else qidx(d.year, d.month)
            days.setdefault(i, []).append(v)
            d += dt.timedelta(days=1)
        out = {}
        for i, vs in days.items():
            if target == "A":
                n = (dt.date(i + 1, 1, 1) - dt.date(i, 1, 1)).days
            else:
                y, q = divmod(i, 4)
                end = dt.date(y + 1, 1, 1) if q == 3 else dt.date(y, 3 * q + 4, 1)
                n = (end - dt.date(y, 3 * q + 1, 1)).days
            if len(vs) == n:
                out[i] = sum(vs) / n
        return out
    for o in obs:
        groups.setdefault(pidx(o["period"], target), []).append(o["value"])
    k = PER[(f, target)]
    return {i: sum(v) / k for i, v in groups.items() if len(v) == k}


def changes(lv, target, rule):
    step = 1 if target == "A" else 4
    return {
        i: ((v / lv[i - step] - 1) * 100 if rule == "pct" else v - lv[i - step])
        for i, v in lv.items()
        if i - step in lv and (rule == "diff" or lv[i - step] != 0)
    }


def expected(kpi, ind):
    t = "A" if kpi["freq"] == "A" else "Q"
    ck = changes(levels(kpi, t), t, kpi["change"])
    ci = changes(levels(ind, t), t, ind["change"])
    lags = []
    for lag in range(-MAXLAG[t], MAXLAG[t] + 1):
        ts = sorted(i for i in ck if i - lag in ci)
        rho = None
        if len(ts) >= MIN[t]:
            rho = float(spearmanr([ck[i] for i in ts], [ci[i - lag] for i in ts])[0])
        lags.append({"lag": lag, "n": len(ts), "rho": rho})
    ok = [l for l in lags if l["rho"] is not None]
    l0 = next(l for l in lags if l["lag"] == 0)
    if l0["rho"] is None or len(ok) < 3:
        return {"shown": False, "n0": l0["n"]}
    best = ok[0]
    for l in ok:
        if abs(l["rho"]) > abs(best["rho"]):
            best = l
    return {"shown": True, "lags": lags, "headline": l0, "strongest": best}


def annual(y0, n, rnd, hi=20):
    return [{"period": str(y0 + i), "value": rnd.randint(0, hi)} for i in range(n)]


def monthly(y, m, n, rnd, hi=20):
    out = []
    for _ in range(n):
        out.append({"period": f"{y}-{m:02d}", "value": rnd.randint(0, hi)})
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)
    return out


def quarterly(y0, n, rnd, hi=30):
    return [{"period": f"{y0 + i // 4}-Q{i % 4 + 1}", "value": rnd.randint(1, hi)} for i in range(n)]


r = random.Random(7)
cases = {}

# annual KPI vs monthly indicator: 2024 only has 7 months (incomplete), 2012 has a gap month
ind = monthly(1999, 1, 307, r)
ind[(2012 - 1999) * 12 + 4]["value"] = None
cases["annual_vs_monthly"] = (
    {"freq": "A", "change": "pct", "obs": annual(2000, 25, r, 50) },
    {"freq": "M", "change": "diff", "obs": ind},
)
cases["quarterly_vs_monthly"] = (
    {"freq": "Q", "change": "pct", "obs": quarterly(2005, 60, r)},
    {"freq": "M", "change": "pct", "obs": [dict(o, value=o["value"] + 5) for o in monthly(2004, 1, 192, r)]},
)
cases["quarterly_vs_quarterly"] = (
    {"freq": "Q", "change": "diff", "obs": quarterly(2008, 56, r)},
    {"freq": "Q", "change": "diff", "obs": quarterly(2007, 60, r)},
)
cases["too_few_lags"] = (  # 10 changes: lag 0 passes, +-1 have 9
    {"freq": "A", "change": "diff", "obs": annual(2010, 11, r)},
    {"freq": "A", "change": "diff", "obs": annual(2010, 11, r)},
)
cases["three_lags_exactly"] = (  # 11 changes: lags -1, 0, 1 pass
    {"freq": "A", "change": "diff", "obs": annual(2010, 12, r)},
    {"freq": "A", "change": "diff", "obs": annual(2010, 12, r)},
)
ev, d = [], dt.date(1998, 3, 10)
while d < dt.date(2025, 6, 2):
    ev.append({"period": d.isoformat(), "value": r.randint(0, 16) / 4})
    d += dt.timedelta(days=r.randint(60, 200))
cases["annual_vs_event_dated"] = (
    {"freq": "A", "change": "pct", "obs": annual(1999, 27, r, 50)},
    {"freq": "D", "change": "diff", "obs": ev},
)

out = [{"name": k, "kpi": a, "indicator": b, "expected": expected(a, b)} for k, (a, b) in cases.items()]
Path(__file__).with_name("fixtures.json").write_text(json.dumps(out, indent=1))
for c in out:
    e = c["expected"]
    print(c["name"], e["shown"], e.get("n0", e.get("headline", {}).get("n")))
