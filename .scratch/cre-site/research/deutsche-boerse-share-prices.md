# Listed property company share prices: can Deutsche Börse (or an alternative) pass the "Open source" test?

Researched 2026-11-01. Test: free to call, documented, licence allows public redisplay on a website.

## Verdict

- **Deutsche Börse: fails.** No REST API found. Only a free 15-minute-delayed trade-record file feed (MiFIR Art. 13(1)), and its licence is free only for non-commercial use. A public site that redisplays prices is not clearly covered, and redistribution needs the paid Market Data Dissemination Agreement (MDDA).
- **DBnomics: fails (no data).** 94 providers, none carry equity prices or a real estate share index.
- **Other APIs checked (Twelve Data, EODHD, Alpha Vantage, Yahoo): none confirmed to pass.** Free tiers are for personal/internal use; public display needs a paid redistribution licence.
- **Plain answer: nothing found that passes all three criteria.** Fallbacks are in section 4.

## 1. Deutsche Börse

- **API:** none found. The only free offer is the "Delayed Data" service on the Market Data Services site: a web view (mvs.deutsche-boerse.com) and per-venue gzip file downloads (extract to JSON; pre-trade and post-trade files for Xetra, Börse Frankfurt, Tradegate, Eurex, EEX). The page names no API or SFTP access. Source: https://mds.deutsche-boerse.com/mds-en/real-time-data/Delayed-data
- **Legal basis:** "free-of-charge access to delayed pre-trade and post-trade Market Data" under MiFIR Art. 13(1) (same page).
- **Delay:** 15 minutes. Updated once per minute, timestamps in UTC.
- **History:** none beyond a short window; data stays available until midnight of the next business day. These are order-book/trade records, not OHLC series or an index.
- **Rate limit:** not stated.
- **Redistribution licence:** the licence terms page (https://mfs.deutsche-boerse.com, as quoted in search results; direct fetch returned 404) says use of Delayed Data is licensed free of charge only while the user does not commercialize it. Passing it to third parties for a fee, or selling value-added services built on it, requires a licence under the MDDA. Wording on free public website display is not on the page; not confirmed. The Agreements & Guidelines subpage returned 404. Contact given: data.services@deutsche-boerse.com.
- **Paid route:** MDDA price list (https://mds.deutsche-boerse.com/resource/blob/5353326/f9313161de341a08d960547c512c9490/data/MDDA_Price_List_15_6.pdf) shows delayed distribution fees, e.g. Xetra Core about EUR 1,820 per month delayed. Figure is from a search snippet, not verified in the PDF.
- **Index:** no listed real estate index feed found in the free delayed service.

Conclusion: not an open API, and redistribution is at best unclear and probably requires a contract.

## 2. DBnomics

Provider list (https://db.nomics.world/providers): 94 providers (ECB, Eurostat, BIS, IMF, OECD, BUBA, DESTATIS, etc.). The only exchange-like entry is ICE (no region listed); no Yahoo, Stooq, Xetra or stock-price provider. DBnomics holds macro/statistical series, not share prices. ICE contents not checked.

## 3. Other providers

| Provider | Free? | Rate limit | Public redisplay on free tier | Evidence |
|---|---|---|---|---|
| Twelve Data | Free tier | not confirmed | **No.** Free tier internal use only; no commercial use (s2.3(l)); external display needs a Redistribution Rights Add-On or written agreement (s2.2(e), s2.4) | https://twelvedata.com/terms |
| EODHD | Paid (100,000 requests/day per key) | n/a | **No** for Non-Professional users ("redistributing, displaying" prohibited; personal capacity only). A public website is business use. | https://eodhd.com/financial-apis/terms-conditions |
| Alpha Vantage | Free key | 25 requests/day; unlimited for verified open-source/educational projects | **Unconfirmed.** ToS PDF unreadable here; support page states no redistribution policy and does not mention Xetra coverage | https://www.alphavantage.co/support/ |
| Yahoo Finance | No official API | n/a | Only Yahoo API terms found (https://legal.yahoo.com/us/en/yahoo/terms/product-atos/apiforydn/index.html) cover Yahoo developer APIs, reserve rate limits and bar deriving income; no grant for public price display of finance data | linked |
| Financial Modeling Prep | Free tier | not verified | Secondary sources only: display/redistribution needs a specific agreement | search result, not primary |
| Stooq | Free CSV downloads | n/a | No terms page retrievable | https://stooq.com/ |

None grants free public redisplay. Xetra prices also carry exchange licensing on top of the vendor's terms.

## 4. Practical options

1. Ask Deutsche Börse (data.services@deutsche-boerse.com) whether non-commercial free public display of the 15-minute delayed feed is permitted, and with what attribution.
2. If the site is a verified open-source project, read Alpha Vantage's Terms of Service and check German ticker coverage (both unverified here).
3. Show no live prices: link out to the company's investor-relations or exchange page.
4. Use open macro/housing series from DBnomics (Eurostat, BUBA, DESTATIS) and omit equity prices.
5. Pay for a redistribution licence (Twelve Data add-on or the DB MDDA).

## Not verified

- Full text of the DB Delayed Data licence and Agreements & Guidelines pages (404 or short extract only).
- Alpha Vantage Terms of Service (PDF unreadable here).
- Twelve Data free-tier rate limit; Stooq terms; contents of the DBnomics ICE provider.
