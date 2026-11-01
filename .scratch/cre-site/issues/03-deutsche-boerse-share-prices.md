# Deutsche Börse and listed property company share prices

Label: wayfinder:research
Status: resolved
Blocked by: none

## Question

Can listed property company share prices (e.g. Vonovia, LEG, Aroundtown, TAG, Hamborner, DIC Asset) or a listed real estate index be obtained from Deutsche Börse through an API that passes the Open source test (free to call, documented, licence allows public redisplay)? Report the API, access terms, rate limits, delay, history length and redistribution licence.

If Deutsche Börse fails the test, find an alternative source that passes (check DBnomics first, then other open APIs) and report its terms in the same format. If nothing passes, say so plainly: the share-price series then moves to Out of scope.

## Answer

Nothing found passes the Open source test, so listed property company share prices are ruled out of scope for this effort.

- Deutsche Börse has no REST API. Its only free offer is a 15-minute-delayed pre/post-trade file download (MiFIR Art. 13(1)), kept until midnight of the next business day, with no history and no index. The licence is free only if the data is not commercialised; redistribution needs the paid MDDA. Whether free public display is allowed is unconfirmed (licence pages returned 404).
- DBnomics has 94 providers and none carry equity prices.
- Twelve Data and EODHD forbid public display on free or personal plans. Alpha Vantage, Yahoo, Financial Modeling Prep and Stooq are unconfirmed or have no usable terms.

Reopens only if Deutsche Börse confirms in writing (data.services@deutsche-boerse.com) that free public display of the delayed feed is allowed.

Findings: [research/deutsche-boerse-share-prices.md](../research/deutsche-boerse-share-prices.md)
