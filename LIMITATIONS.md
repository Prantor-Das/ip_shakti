# Current limitations

This document records the boundaries of the current build and the staged roadmap. It is not a legal or product commitment.

## Out of scope in this build

- Knowledge-graph construction or graph-based reasoning.
- Agentic multi-source orchestration; the active pipeline is a single retrieval-and-generation flow per jurisdiction.
- Paid-source connectors, including any connector requiring separately logged permission or subscription access.
- A full voice experience. `NEXT_PUBLIC_ENABLE_VOICE` is reserved for the future voice feature; the current UI does not provide microphone input.
- Accounts, authentication, user profiles, saved chats, or server-side conversation persistence.
- A filing service, legal representation, legal opinion, or automatic legal conclusion.

## Corpus coverage

The checked-in manifest currently contains three seed documents: the India Patents Act, the international Nagoya Protocol, and the WIPO GRATK Treaty. Coverage is therefore incomplete and cannot stand in for a complete statute, regulation, treaty, case-law, registry or prior-art search. The priority acquisition list is in [corpus/README.md](./corpus/README.md). `/sources` is the authoritative view of active, ingested records and chunk counts.

The assistant cannot answer reliably about a document that has not been downloaded, listed in `corpus/manifest.json`, ingested successfully and marked active in Supabase. Superseded documents are intentionally excluded from retrieval.

## Languages

The UI language list currently contains English, Hindi, Bengali, Tamil, Telugu and Marathi. Retrieval and generation remain in English. Bhashini is attempted first and Gemini is the fallback; either provider can fail or produce a translation that needs human review. Protected citation markers and legal references are checked, but translation quality is not guaranteed.

## Accuracy and answer boundaries

- Retrieval quality depends on the corpus, embeddings, similarity thresholds, extracted PDF text and Supabase availability.
- An answer can abstain when evidence is insufficient, but an answer is not a guarantee that every relevant source was found.
- Citations identify retrieved chunks; they do not replace reading the official source or checking the current version.
- Static helper/classification wording has open legal-review markers and must not be treated as validated legal text.
- The service provides information, not legal advice. Do not enter unpublished or confidential invention details.

## Privacy and persistence

There are no accounts, cookies or saved user conversations. Browser language and first-visit notice state may use local storage. Questions are processed by Google Gemini and, when configured, Bhashini. Server audit metadata is retained according to `AUDIT_RETENTION_DAYS`; question and answer text is omitted unless `LOG_CONTENT=true`.

## Open human review items

The repository currently contains these explicit review markers:

- Native-speaker review of all six message bundles: `lib/i18n/messages/en.json`, `hi.json`, `bn.json`, `ta.json`, `te.json` and `mr.json` (`TODO(native-review)`).
- Legal review of classification copy in `lib/classification-copy.ts` for nutraceutical/Ayurveda Aahar, cosmetic, classical, proprietary, phytopharmaceutical, new-drug and uncertainty/escalation wording (`TODO(legal-review)`).
- Legal review of the explanatory TKDL wording in `app/abs-tkdl/page.tsx` against the ingested TKDL corpus (`TODO(legal-review)`).
- Team, institution and contact credits in this README are placeholders (`TODO(team-name)`, `TODO(institution)`, `TODO(contact)`).

Complete these reviews before presenting the affected copy as authoritative.
