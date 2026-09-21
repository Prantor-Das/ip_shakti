# IP-SAKTI corpus

Only documents present on disk and listed in `manifest.json` are eligible for ingestion. The three seed files currently present were downloaded from official publishers and are checksum-tracked by `pnpm ingest`.

## Priority download list

The team should obtain the current official versions, from the named official source, before adding further manifest entries:

- India Code / IP India: Patents Act 1970 and Patents Rules (as amended 2024); GI Act and Rules; Trade Marks Act; Designs Act; Copyright Act; PPV&FR Act.
- NBA / India Code: Biological Diversity Act (as amended 2023) and Biological Diversity Rules 2024.
- AYUSH / CDSCO: Drugs and Cosmetics Act and Rules (ASU provisions); Drugs and Magic Remedies (Objectionable Advertisements) Act.
- FSSAI: Ayurveda Aahar Regulations.
- WIPO / WTO / CBD: TRIPS; Convention on Biological Diversity; Nagoya Protocol; WIPO GRATK Treaty (2024); PCT; Madrid; Hague; Budapest Treaty.

For each addition, record the official publisher URL, version, as-of date, jurisdiction, instrument type, and a stable local filename. Do not add summaries or legal interpretations to the manifest; source text belongs in the downloaded document and its extracted chunks.
