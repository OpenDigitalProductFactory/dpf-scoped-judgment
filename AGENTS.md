# Component working agreement

Read README.md, PROVENANCE.json, DEPENDENCY-BOUNDARY.json and MIGRATION.md first. This is an isolated reusable component, not the DPF/DPF2 application or Linux host. Do not mutate either consumer, production data, credentials or infrastructure as a side effect. Retain canonical ownership of identity, time, authority, qualification and effect/result custody in the host. Run npm run check and report exact source/toolchain/test scope; fixture success is not production/native/company acceptance. Shared compatibility sources stay frozen until their explicit dependency migration. Never add a parallel service/store or copy an adjacent application to make a test pass.

## Delivery scope

This repository owns its package source, exports, build, provenance and component
conformance. Use its GitHub issue/PR workflow and DCO-signed commits described in
CONTRIBUTING.md. A linked host backlog item coordinates adoption; it does not
replace this repository's delivery record. If an integration refuses an action,
record the refusal and continue only unrelated authorized work. Do not switch
credentials or invent a receipt to make the denied action succeed.

Build and test here with the pinned Node/npm/TypeScript toolchain. Component
checks must run without a DPF portal, database, Docker, model or customer corpus.
Keep `private: true`; a local candidate tarball is not permission to publish a
package or deploy either consumer. Run `npm run check`: original-source
provenance, original advisory fixtures, emitted build, and a clean installed
tarball consumer are distinct evidence. Keep all four results explicit.

The installed consumer must resolve only declared package exports and actual
emitted files/declarations, with no workspace alias, source-tree import or
symlinked package. Preserve source bytes and legal notices; adjust generated
declarations through the build rather than rewriting provenance hashes.

DPF and DPF2 each own their actual callers, same-slice retirement, state and
receipt compatibility, integration, acceptance, deployment and rollback. Their
own AGENTS.md and governed delivery apply to those changes. This package cannot
grant host authority or establish OS/native enforcement. Before changing shared
semantics or making a consuming release, complete the canonical-owner and
compatibility migration in DEPENDENCY-BOUNDARY.json and MIGRATION.md.
