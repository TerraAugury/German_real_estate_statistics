# 03: Credit vdpResearch and bulwiengesa as the source of their series

**What to build:** Every Bundesbank series whose original source is vdpResearch GmbH or bulwiengesa AG credits that firm by name next to the figures, with the Bundesbank named as the publisher: in the Citation line, in the Sources & licences attribution column, and in Series details, which also show the Bundesbank's own original-source comment. This keeps the promise made in the permission requests (`.scratch/licence-checks/issues/01-licence-checks.md`). The two firms are credited from the manifest, so the credit is visible on the Sources page without reading snapshots; a test keeps the manifest in step with what the Bundesbank's metadata names.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] The 25 vdpResearch series and the 9 bulwiengesa series carry a credit naming the firm, and their attribution wording in both languages names the firm and the Bundesbank as publisher
- [x] Their Citation line reads "Source: {firm}, published by {publisher} / Licence ... / Data to ..." in English and German
- [x] Their Series details give the Bundesbank's original-source comment as published
- [x] Series from any other source (including the Bundesbank series from other originators) keep their current wording
- [x] A test fails if a committed snapshot's original-source comment names vdpResearch or bulwiengesa and the manifest does not credit that firm
- [x] Tests cover the Citation line, Series details and the Sources table in both languages
