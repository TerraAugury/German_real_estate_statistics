# DBnomics economic indicators for Germany, relevant to commercial real estate (CRE)

Method: every series code below was returned by the live DBnomics Web API v22 (`https://api.db.nomics.world/v22/series/{provider}/{dataset}?q=...&observations=1`) on 2026-11-01. "Start" and "Last obs" are the first and last non-null observations in the API response. "Indexed" is the series `indexed_at` date, i.e. DBnomics' last fetch of that series, the closest thing to "last update" the API exposes. API docs: https://docs.db.nomics.world/web-api/.

## Key findings

1. **There is no ifo provider on DBnomics.** `/providers/ifo` returns "not found", the provider list has no ifo or ZEW entry, and `/search?q=ifo business climate` returns 0 hits. Substitutes: European Commission surveys via Eurostat (`ei_bssi_m_r2`, `ei_bsbu_m_r2`) and OECD business tendency surveys (`OECD/DSD_STES@DF_BTS`). The API metadata does not say whether those national surveys derive from ifo, so this is not claimed.
2. **The Bundesbank (provider code `BUBA`) publishes a commercial property indicator system, `BUBA/BBDZ1`**: 101 series covering price indices (office, retail, multi-family), commercial real-estate lending and building permits, annual and quarterly. It is the only dataset here that is itself CRE-specific.
3. **DESTATIS has construction price indices specific to office buildings and to industrial and commercial buildings** (quarterly, from 1958).
4. **Freshness differs a lot by mirror** (Indexed column): ECB and DESTATIS were indexed Oct 2026; BUBA Jun to Jul 2026 (data ends Q1 2026 or May/Jun 2026); Eurostat **2026-01-22** (data ends Nov/Dec 2025, GDP at 2025-Q3). Prefer DESTATIS or BUBA over Eurostat for Germany.
5. **Identifier gotchas:** the provider code is `BUBA`, not `Bundesbank`. Series ids contain dots, and DESTATIS ids start with `DG.`. The DESTATIS dataset code is the Genesis table code, e.g. `61261BV001`.

## Frequency mismatch against CRE KPIs

Typical CRE KPIs (rents, yields, capital values) are quarterly or annual.

- **Monthly** (unemployment, HICP/CPI, bank rates, confidence, permits, construction output): aggregate to quarters (mean or end-of-period for rates and indices, sum for flows such as permits) and document the choice.
- **Daily or event data** (Bund yield `D.I.ZST...`; ECB key rates `ECB/FM B.U2...KR...` are recorded on dates of change): resample or forward-fill first. Do not correlate raw.
- **Annual only**: `BUBA/BBDZ1` `A.*` series. Most also exist as `Q.*`, so prefer those.
- Macro data arrive with a lag and GDP is revised; use an explicit lag and note the vintage. DBnomics serves the latest vintage by default.

## 1. CRE-specific: Bundesbank commercial property indicators

Provider `BUBA`, dataset `BBDZ1` ("System of indicators for the German commercial property market").

| Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|
| `Q.B10.N.G000.P0100.A` | Commercial property price index, total (`P0102` office, `P0104` retail, `P0106` multi-family; `G010`/`G020` variants are other breakdowns) | Q | 2013-Q1 | 2026-Q1 | 2026-06-06 |
| `A.B10.N.G000.P0100.A` | Same, annual | A | 2013 | 2025 | 2026-06-06 |
| `Q.B10.N.G200.P0410.A` | Association of German Pfandbrief Banks commercial index (`P0420`, `P0430` variants) | Q | 2010-Q1 (`P0430`: 2013-Q1) | 2026-Q1 | 2026-06-06 |
| `A.B10.N.G150.P0200.A` | bulwiengesa AG commercial index (`P0210`, `P0220`; `G250` and `G300` series are related bulwiengesa series) | A | 1995 | 2025 | 2026-06-06 |
| `Q.B20.N.G400.F0010.A` | Mortgage loans to domestic enterprises excluding residential (`F0010` to `F0060`, `G450` `F0200` to `F0220` for y/y) | Q | 2000-Q1 | 2026-Q1 | 2026-06-06 |
| `Q.B20.N.G555.F0700.A` | Loans entailing commercial real-estate exposure, domestic borrowers (`G560`, `G565`, `G570`, `G575`, `G580` families) | Q | 2003-Q1 (`G560`+: 2004-Q1) | 2025-Q4 | 2026-06-06 |
| `Q.B30.N.G600.R0010.A` | Building permit index, floor space (`R0020`, `R0030` variants) | Q | 2010-Q1 | 2026-Q1 | 2026-06-06 |
| `A.B30.N.G650.R0200.A` | Building permits and completions, floor space | A | 1992 | 2025 | 2026-06-06 |
| `Q.B30.Y.G700.R0420.A` | GDP (use side), total economy excluding government | Q | 1991-Q1 | 2026-Q1 | 2026-06-06 |

Warnings:
- Commercial property price indices (`P0100` to `P0126`) start **2013-Q1**, about 53 quarterly observations. That window is falling rates then one rate shock (2022 to 2023), so a correlation with rates or inflation is dominated by a single regime change.
- Only the bulwiengesa series (annual) reach 1995; Pfandbrief banks series start 2004 (A) and 2010 (Q).
- The API returns truncated series names. Resolve the exact meaning of the `G`/`P`/`F`/`R` codes through the dataset's `dimensions_values_labels`.

## 2. Interest rates

| Provider/Dataset | Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|---|
| ECB/FM | `B.U2.EUR.4F.KR.DFR.LEV` | Deposit facility rate (dates of change) | D (events) | 1999-01-01 | 2026-09-16 | 2026-10-31 |
| ECB/FM | `B.U2.EUR.4F.KR.MRR_FR.LEV` | Main refinancing rate (dates of change) | D (events) | 1999-01-01 | 2026-09-16 | 2026-10-31 |
| ECB/FM | `M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA` | Euribor 3M, monthly average | M | 1994-01 | 2026-09 | 2026-10-31 |
| BUBA/BBIN1 | `M.D0.ECB.ECBFAC.EUR.ME` | ECB deposit facility rate, end of month (`ECBMIN`, `ECBREF` for refi and marginal lending) | M | 1999-01 | 2026-06 | 2026-07-01 |
| BUBA/BBSIS | `M.I.ZAR.ZI.EUR.S1311.B.A604.R10XX.R.A.A._Z._Z.A` | 10y Federal securities yield (term structure), monthly | M | 1972-09 | 2026-06 | 2026-07-04 |
| BUBA/BBSIS | `D.I.ZST.ZI.EUR.S1311.B.A604.R10XX.R.A.A._Z._Z.A` | 10y yield (Svensson), daily | D | 1997-08-07 | 2026-07-03 | 2026-07-04 |
| BUBA/BBSEI | `M.ERZ.GVB.DE._Z.R10XX` | Expected real interest rate, 10y Bunds | M | 1989-10 | 2026-06 | 2026-06-26 |
| BUBA/BBIM1 | `M.DE.B.A2A.A.R.A.2240.EUR.N` | New-business rate, loans to non-financial corporations | M | 2003-01 | 2026-05 | 2026-07-04 |
| BUBA/BBIM1 | `M.DE.B.A2A.D.R.1.2240.EUR.N` | Same, loans over EUR 1m, floating or up to 3m fixation (nearest to CRE ticket size) | M | 2010-06 | 2026-05 | 2026-07-04 |
| BUBA/BBIM1 | `M.DE.B.A2C.A.R.A.2250.EUR.N` | Housing-loan new-business rate (residential benchmark) | M | 2003-01 | 2026-05 | 2026-07-04 |
| ECB/MIR | `M.DE.B.A2A.A.R.A.2240.EUR.N` | Same corporate rate, ECB side | M | 2000-01 | 2026-08 | see Indexed note below |
| ECB/MIR | `M.DE.B.A2C.AM.R.A.2250.EUR.N` | Lending for house purchase rate | M | 2003-01 | 2026-08 | see note |
| Eurostat/irt_lt_mcby_m | `M.MCBY.DE` | Long-term (10y) bond yield, Germany | M | 1980-01 | 2025-12 | 2026-01-22 |

Notes:
- No CRE-only lending rate exists; the over-EUR-1m corporate series (from 2010-06 only) is the best proxy.
- ECB/MIR `indexed_at` was not captured in this run (output truncated); the series reaches 2026-08, so it was indexed after that.

## 3. Inflation

| Provider/Dataset | Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|---|
| DESTATIS/61111BM001 | `DG.PREIS1` | Consumer price index | M | 1991-01 | 2026-09 | 2026-10-13 |
| DESTATIS/61111BJ001 | `DG.PREIS1` | Same, annual | A | 1991 | 2025 | 2026-03-14 |
| BUBA/BBDP1 | `M.DE.N.VPI.C.A00000.VGJ.LV` | National CPI, y/y % | M | 1949-06 | 2026-06 | 2026-07-02 |
| BUBA/BBDP1 | `M.DE.N.HVPI.C.A00000.VGJ.LV` | HICP, y/y % | M | 1997-01 | 2026-06 | 2026-07-02 |
| BUBA/BBDP1 | `M.DE.N.HVPI.C.E2C041.VGJ.LV` | HICP: actual rents paid for housing, y/y % | M | 1998-01 | 2026-05 | 2026-07-02 |
| BUBA/BBDP1 | `M.DE.N.EPG.G.GP19SA000000.I21.A` | Industrial producer prices (cost-push) | M | 1991-01 | 2026-05 | 2026-07-02 |
| ECB/ICP | `M.DE.N.000000.4.ANR` | HICP y/y, Germany | M | 1996-01 | **2025-12** | 2026-10-31 |
| Eurostat/prc_hicp_manr | `M.RCH_A.CP00.DE` | HICP y/y, Germany | M | 1997-01 | 2025-12 | 2026-01-22 |

Note: ECB/ICP for Germany ends 2025-12 although the dataset was indexed 2026-10-31, so it is stale relative to DESTATIS and BUBA. The HICP rent sub-index is residential rent, not commercial.

## 4. GDP

| Provider/Dataset | Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|---|
| BUBA/BBNZ1 | `Q.DE.N.H.0000.L` | GDP, price adjusted, national accounts ESA 2010 (2024 revision), unadjusted | Q | 1970-Q1 | 2026-Q1 | 2026-05-23 |
| BUBA/BBNZ1 | `A.DE.N.H.0000.L` | Same, annual | A | 1950 | 2025 | 2026-05-23 |
| Eurostat/namq_10_gdp | `Q.CLV10_MEUR.SCA.B1GQ.DE` | GDP, chain-linked volumes (2010), SCA | Q | 1991-Q1 | 2025-Q3 | 2026-01-22 |
| Eurostat/namq_10_gdp | `Q.CLV_PCH_PRE.SCA.B1GQ.DE` | GDP q/q % change, SCA | Q | 1991-Q2 | 2025-Q3 | 2026-01-22 |

Only annual national-accounts tables were found in DESTATIS (`81000BJ*`); no quarterly DESTATIS GDP dataset appeared in the 6,423-dataset catalogue, so BUBA is the freshest quarterly GDP.

## 5. Unemployment and labour market

| Provider/Dataset | Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|---|
| BUBA/BBDL1 | `M.DE.Y.UNE.UBA000.A0000.A01.D00.0.R00.A` | Registered unemployment rate, SA | M | 1991-12 | 2026-06 | 2026-07-01 |
| BUBA/BBDL1 | `Q.DE.Y.UNE.UBA000.A0000.A01.D00.0.R00.A` | Same, quarterly SA | Q | 1992-Q1 | 2026-Q2 | not captured |
| DESTATIS/13211BM001 | `DG.ERW112` | Unemployment, % of civilian labour force | M | 2005-01 | 2026-10 | 2026-10-31 |
| DESTATIS/13211BM001 | `DG.ERW007` | Registered vacancies | M | 2005-01 | 2026-10 | 2026-10-31 |
| Eurostat/une_rt_m | `M.SA.TOTAL.PC_ACT.T.DE` | ILO unemployment rate, SA | M | 1991-01 | 2025-11 | 2026-01-22 |
| BUBA/BBWCAF1 | `A.GESAMTWIRT.G.0000.DE._T.A.GVE.EB.I20` | Negotiated basic pay rates, overall economy | A | 1991 | 2025 | 2026-06-26 |

Registered (about 6.3%) and ILO (about 3.8%) rates differ by definition; do not mix levels. DESTATIS monthly series start 2005-01.

## 6. Credit and lending

| Provider/Dataset | Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|---|
| BUBA/BBDZ1 | `Q.B20.N.G400.F0010.A`, `Q.B20.N.G450.F0200.A` | Mortgage loans to enterprises excluding residential | Q | 2000-Q1 | 2026-Q1 | 2026-06-06 |
| BUBA/BBDZ1 | `Q.B20.N.G555.F0700.A` | Loans entailing commercial real-estate exposure | Q | 2003-Q1 | 2025-Q4 | 2026-06-06 |
| BUBA/BBIM1 | `M.DE.B.A2A.A.B.A.2240.EUR.N` | New-business volume, loans to non-financial corporations | M | 2003-01 | 2026-05 | 2026-07-04 |
| BUBA/BBIM1 | `M.DE.B.A2C.A.B.A.2250.EUR.N` | New-business volume, housing loans to households | M | 2003-01 | 2026-05 | 2026-07-04 |
| BUBA/BBBU2 | `Q.DE.ALL.O.E.Z.B3.ST.S.FNET` | Bank Lending Survey: enterprise credit standards, net %, backward looking | Q | 2003-Q1 | 2026-Q2 | 2026-04-29 |

`BBBU2` has 771 series; a search for "commercial real estate" returned nothing. `ECB/BLS` (23,491 series) was not mapped to German CRE items. BLS demand sub-series such as `Q.DE.ALL.DR.E.LE.B3.ZZ.D.FNET` have only 17 observations (from 2022-Q2).

## 7. Construction costs, output and permits

| Provider/Dataset | Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|---|
| DESTATIS/61261BV001 | `DG.BAULEISTBW.BPNG1.STEMW1.PRE002` | Construction price index, **office buildings**, incl. VAT | Q | 1958-Q1 | 2026-Q3 | 2026-10-09 |
| DESTATIS/61261BV001 | `DG.BAULEISTBW.BPNG2.STEMW1.PRE002` | Same, **industrial and commercial buildings** | Q | 1958-Q1 | 2026-Q3 | 2026-10-09 |
| DESTATIS/61261BV001 | `DG.BAULEISTBW.BPNBK.STEMW1.PRE002` | Same, residential (benchmark) | Q | 1958-Q1 | 2026-Q3 | 2026-10-09 |
| BUBA/BBDP1 | `Q.DE.N.BP.O.B1A0000000.I21.A` | Construction price index, total | Q | 1968-Q1 | 2026-Q1 | 2026-07-02 |
| Eurostat/sts_copi_q | `Q.COST.CPA_F41001_X_410014.NSA.I21.DE` | Construction costs, residential buildings | Q | 2000-Q1 | 2025 (not pinned) | 2026-01-22 |
| BUBA/BBDE1 | `M.DE.N.BAA1.A2R410050.G.C.I21.L` | Output, construction of buildings and civil engineering | M | 1950-01 | 2026-04 | 2026-07-03 |
| BUBA/BBDE1 | `M.DE.W.AEA1.P2XF00000.B2.V.I21.A` | Orders received, main construction industry | M | 1991-01 | 2026-04 | 2026-07-03 |
| Eurostat/sts_cobp_m | `M.BPRM_SQM.CPA_F41002.SCA.I21.DE` | Building permits, **non-residential**, m2 useful floor area, index 2021=100, SCA | M | 2000-01 | 2025-11 | 2026-01-22 |
| Eurostat/sts_cobp_q | `Q.BPRM_SQM.CPA_F41002.SCA.I21.DE` | Same, quarterly (`CPA_F41002_X_410023` = non-residential excluding offices) | Q | 2000-Q1 | 2025-Q3 | 2026-01-22 |
| DESTATIS/31111BM003 | `DG.BAUART3.GBD-NW-S.FLC002` | Permits, prefabricated-element new construction, other non-residential buildings, useful floor space | M | 2003-01 | 2026-08 | 2026-10-18 |
| DESTATIS/31111BM003 | `DG.BAUART3.GBD-NW-S.VKB001` | Same, estimated construction costs | M | 2003-01 | 2026-08 | 2026-10-18 |
| BUBA/BBDZ1 | `Q.B30.N.G600.R0010.A` | Building permit index, floor space | Q | 2010-Q1 | 2026-Q1 | 2026-06-06 |

Notes:
- The DESTATIS `BAUART3...GBD-NW-S` series covers only prefabricated-element construction, **not total non-residential permits**. Total non-residential series exist under other dimension values of the same dataset and were not isolated.
- Eurostat non-residential permits are the cleaner commercial measure but end 2025-11.
- The DESTATIS office-building price index is the most relevant cost series: long history and current.

## 8. Business confidence and sentiment

| Provider/Dataset | Series id | Content | Freq | Start | Last obs | Indexed |
|---|---|---|---|---|---|---|
| OECD/DSD_STES@DF_BTS | `DEU.M.BCICP.PB.F.Y._Z._Z.N` | Composite business confidence, construction | M | 1985-01 | 2026-05 | 2026-06-10 |
| OECD/DSD_STES@DF_BTS | `DEU.M.BCICP.PB.GTU.Y._Z._Z.N` | Composite business confidence, services | M | 1995-04 | 2026-05 | 2026-06-10 |
| OECD/DSD_STES@DF_BTS | `DEU.M.BCICP.PB.G47.Y._Z._Z.N` | Composite business confidence, retail | M | 1985-01 | 2026-05 | 2026-06-10 |
| OECD/DSD_STES@DF_BTS | `DEU.M.BCICP.PB.C.Y._Z._Z.N` | Composite business confidence, manufacturing | M | 1962-12 | 2026-05 | 2026-06-10 |
| OECD/DSD_STES@DF_CLI | `DEU.M.LI.IX._Z.AA.IX._Z.H` | Composite leading indicator | M | 1961-01 | 2026-05 | 2026-06-09 |
| Eurostat/ei_bssi_m_r2 | `M.BS-ESI-I.SA.DE` | Economic sentiment indicator, SA | M | 1980-01 | 2025-12 | 2026-01-22 |
| Eurostat/ei_bssi_m_r2 | `M.BS-CCI-BAL.SA.DE` | Construction confidence, SA | M | 1980-01 | 2025-12 | 2026-01-22 |
| Eurostat/ei_bssi_m_r2 | `M.BS-RCI-BAL.SA.DE` | Retail confidence, SA | M | 1984-02 | 2025-12 | 2026-01-22 |
| Eurostat/ei_bssi_m_r2 | `M.BS-SCI-BAL.SA.DE` | Services confidence, SA | M | 1995-04 | 2025-12 | 2026-01-22 |
| Eurostat/ei_bssi_m_r2 | `M.BS-CSMCI-BAL.SA.DE` | Consumer confidence, SA | M | 1985-01 | 2025-12 | 2026-01-22 |

Closest CRE proxies: retail and services confidence (space demand) and construction confidence. ifo is not available.

## 9. Other candidates

- Residential comparison indices: `BUBA/BBDY1` (67 series, e.g. `A.B10.N.G100.P0010.A`, annual from 2004); `ECB/RESR` (e.g. `A.DE._T.N._TR.TVAL.10.TB.N.IX`, annual 2003 to 2025); Eurostat `prc_hpi_q`, `ei_hppi_q`.
- Insolvencies (tenant stress): `DESTATIS/52411BM001` monthly, e.g. `DG.FOR002` (expected claims against enterprises), 2003-01 to 2026-07, indexed 2026-10-09; annual in `52411BJ*`.
- Not on DBnomics: ifo, ZEW, and property-level rents and yields.

## Licence

The DBnomics API exposes only a `terms_of_use` URL per provider, no machine-readable licence field.

| Provider | Terms URL listed by DBnomics | Checked in this run |
|---|---|---|
| BUBA | https://www.bundesbank.de/Redaktion/EN/Dossier/Service/terms_of_use.html?notFirst=true&docId=109018 | **Not verified**: fetch returned no usable text |
| DESTATIS | https://www-genesis.destatis.de/genesis/online?Menu=Impressum | **Not verified**: fetch returned no usable text |
| ECB | https://www.ecb.europa.eu/home/disclaimer/html/index.en.html | **Verified**: content may be distributed or reproduced if accurate and the ECB is cited as source |
| Eurostat | https://ec.europa.eu/eurostat/about/policies/copyright | **Not verified**: page fetched with no licence text |
| OECD | https://www.oecd.org/termsandconditions/ | **Not verified**: fetch returned no usable text |

Read each provider's terms before redistributing. From memory, not checked against primary pages today: Eurostat reuse is generally under Commission Decision 2011/833/EU, and Destatis open data generally under "Data licence Germany - attribution - Version 2.0". Treat both as claims to confirm.

## Misleading-correlation risks

- **Uneven freshness**: Eurostat ends Nov/Dec 2025 while DESTATIS/ECB reach autumn 2026. Mixing them truncates or misaligns the sample.
- **Short CRE histories**: Bundesbank commercial price indices start 2013-Q1 (about 53 quarters); trends in that window (rates down then up, prices up then down) produce spurious correlations. Use changes, report n, and prefer `Q.*` over `A.*`.
- **Series breaks and short coverage**: DESTATIS unemployment from 2005; corporate loans over EUR 1m from 2010-06; ECB BLS demand sub-series from 2022-Q2 (17 points).
- **Definition differences**: registered vs ILO unemployment; HICP vs national CPI.
- **Revisions**: GDP and permits are revised; DBnomics serves the latest vintage by default.
