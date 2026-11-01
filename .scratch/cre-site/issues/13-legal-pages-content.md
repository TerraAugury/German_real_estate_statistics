# Legal pages content and operator identity

Label: wayfinder:task
Type: task (HITL)
Status: resolved
Blocked by: 09 (resolved)

## Question

Supply the operator identity and contact details for the Impressum, and the Terms and conditions and Privacy policy text (EN and DE), for the pages fixed in ticket 09. The Privacy policy must reflect no cookies and no analytics, with Cloudflare Pages server logs. A human, ideally with legal review, provides or approves the text; the spec only needs the content or a pointer to it.

## Answer

Not legal advice. This settles content outline, required facts, and who supplies and reviews them; no legal text is drafted here. A Cyprus- or EU-qualified lawyer who reads German must review the final text before launch (new gating ticket 15).

**Legal frame.** The Provider is Terra Augury Ltd (Cyprus), also the GDPR controller. GDPR applies in full; the complaint authority is the Cyprus Commissioner for Personal Data Protection. The Terms are governed by Cypriot law, with consumers' mandatory local rights unaffected and no jurisdiction clause against consumers. German law (DDG section 5) is not assumed to bind a Cyprus provider; the country-of-origin rule points to Cypriot provider-information duties (believed Law 156(I)/2004, for the reviewer to confirm). The Impressum is kept anyway as the page German readers expect. Binding language reverses ticket 10 for legal pages: **English is binding**, German is a reviewed translation (Privacy must be plain German for German visitors). Legal pages otherwise use the ordinary EN-first flow, same files (`content/en|de/...`), review record and production build rule.

**Impressum ("Impressum" DE, "Legal notice" EN; slug/route per ticket 10).** Fields: company name and legal form; address; Cyprus registration number and the Registrar of Companies; VAT number if registered; directors or authorised representative; email (plain text, no mailto, role mailbox) plus phone as second contact; named person responsible for content, as a cautious nod to MStV section 18(2) (flagged for the reviewer, not asserted as required). Address decision: **postcode and city only**, chosen by the project owner to limit spam and scams. **Accepted risk:** EU rules ask for a geographic address, so this is likely non-compliant; the reviewer must rule on it, and the fallback is the registered office address from the Cyprus register.

**Privacy policy.** Controller Terra Augury Ltd and contact; server logs (IP, time, URL, user agent) at Cloudflare as processor with its DPA and transfer basis (Data Privacy Framework or standard contractual clauses); legal basis Art. 6(1)(f); retention as set by Cloudflare; no cookies, no local storage, no analytics, no third-party requests; the language redirect reads `Accept-Language` and stores nothing; email enquiries processed only to reply; outbound links (DBnomics, publishers) lead to separate controllers; rights Art. 15-21; complaint to the Cyprus Commissioner; no obligation to provide data, no automated decisions; privacy contact if different. GitHub Actions is not mentioned (no visitor data). **Build rule:** fonts and scripts self-hosted, no request to any third-party host, so these statements stay true.

**Terms.** Ten clauses: (1) scope and provider; (2) the fixed short-form disclaimer, EN and DE, from ticket 11; (3) no warranty on completeness, accuracy, timeliness, data from third parties; (4) no endorsement by source publishers or DBnomics, derived values (Links) are our own calculation; (5) liability limited only as mandatory law permits; (6) data and attribution: Sources & licences governs each series; charts and figures may be reused with the source line kept and a link to the site; no open licence for the site's own text in release one; (7) external links; (8) changes to the Terms; (9) Cypriot law, consumer rights unaffected; (10) severability. **If 08 or 14 end in a refusal:** the affected series leaves the site; the Terms change only if clause 6's reuse permission depends on a refused licence. Not resolved here.

**No promotion.** Release one is an information site operated by Terra Augury Ltd. About names the operator; no promotional content or sales contact.

**Facts and drafting.** The project owner supplies real details privately in an uncommitted facts file; nothing is invented and no real details are written into the map or tickets. Required fields: company name and legal form, registered address (or the postcode and city chosen above), registration number, VAT number if any, directors, responsible person, general email, phone, privacy email. The build phase drafts EN, then German, from this outline; the owner records review per file.

**Constraints on siblings**
- 10 bilingual workflow: legal pages are no longer DE-authoritative; they follow the EN-first flow.
- 09 information architecture: EN label of the legal page is "Legal notice"; footer link text follows.
- New ticket 15 gates the production deploy with 08 and 14.
