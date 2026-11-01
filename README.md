# dpf-scoped-judgment

Scope-aware advisory judgment and option scoring.

A separate component source home for DPF and the DPF2 Linux business-appliance destination. This initial commit seeds the exact merged extraction; it is not a production-qualified library release or an OS service.

## Source and verification

Source: [56f3a5d2d57d](https://github.com/OpenDigitalProductFactory/opendigitalproductfactory/tree/56f3a5d2d57d751eb3ac435dcca4133c5ff46686), merged by [PR #6724](https://github.com/OpenDigitalProductFactory/opendigitalproductfactory/pull/6724). `PROVENANCE.json` pins every imported file to its original Git blob and SHA-256. Apache-2.0 license and original notices are retained; component-specific notice is in `examples/scoped-judgment/NOTICE`.

Use Node **24.16.0**. Run `npm ci --ignore-scripts`, then `npm run check`. The pinned TypeScript **6.0.3** compiler builds and executes the original isolated consumer in a temporary directory. No DPF checkout, database, Docker, provider credential or model inference is needed. [scoped-judgment example](examples/scoped-judgment/README.md) explains its supported semantics and limits. Relative `.ts` imports are emitted with standard extension rewriting.

No package is published: `private:true` prevents accidental npm publication. Browser/native/professional qualification and useful company outcomes require the actual receiving implementation. Source checks and fixture smoke tests cannot establish them.

## Ownership and migration

This repository owns the candidate component's evolution. The files remain in their original relative source layout for an auditable move-only bootstrap. `DEPENDENCY-BOUNDARY.json` identifies shared frozen compatibility sources. They must not become independent forks; first consuming release requires one canonical package owner and removal of displaced snapshots after parity. Existing DPF and DPF2 consumers are unchanged.

See [MIGRATION.md](MIGRATION.md) for the transition and [CONTRIBUTING.md](CONTRIBUTING.md) for maintenance. Separate Git ownership does not imply another process, database, permission system or deployment. Company, Workroom, GPP/TAK, GAID/JSI, current admission and transactional effect/result owners retain their authority.

Upstream qualification limit: Synthetic advisory contract fixture only; no authenticated ownership, corpus quality, human admission, enforcement or production qualification.

## Private installed foundation candidate

`0.1.0-candidate.2` emits ESM and declarations with explicit package exports.
The root exposes advisory judgment; supported subpaths are `decision-scopes`,
`bounded-trusted-json`, `option-scoring`, `quality-gates`, `option-identities`,
`uncertain-retry` and `scoped-advice`. Other deep paths are unsupported.
`npm run check` verifies original provenance, nine original advisory scenarios,
the build and a freshly installed tarball consumer including hostile/deep/large
JSON rejection. Build inputs are Node 24.16.0 and TypeScript 6.0.3.

This package is the canonical owner of decision scopes and bounded trusted JSON
under the merged component cutover design. The new JSON leaf is copied unchanged
from upstream merge 46f8a5ca9cb75aa871a223b70acc6dcc65d15a67 with its own
per-file revision in PROVENANCE.json; the original provenance entries stay intact.
No shared vocabulary semantics change. GPP must depend downward on this artifact
and retire its emitted scope copy. Other components and products must migrate
their own callers and retire displaced copies in their accepted slices.

Maintainers use this repository's AGENTS.md, CONTRIBUTING.md, GitHub Issues and
DCO-signed PR/standalone CI. DPF coordination is BI-076F22CC under BI-B8A4DE44;
it is not evidence of native DPF admission. GitHub integration issue creation
was denied on the first component repository; no credential workaround was used.
Public package release, product adoption and native qualification remain held.
Rollback before adoption is to retain the seed and prior product imports. After
adoption each product owns restoring its exact prior dependency and callers.

Candidate `.1` corrects only version/runtime-engine metadata: strict installation
is supported on the two tested Node versions, 24.16.0 and 24.22.0. The build
stays pinned to 24.16.0/TypeScript 6.0.3; pure source/API semantics are unchanged.
The prior `.0` archive stays immutable. The receiving matrix is Darwin arm64,
not product, actual browser/CSP or Linux enforcement qualification.

Candidate `0.1.0-candidate.2` adds strict-install admission for Node 24.22.1, the patch used by current DPF CI. Build inputs remain pinned to Node 24.16.0/TypeScript 6.0.3. Qualification runs the clean installed receiver on the exact added patch as well as the prior receiving profile; source, emitted APIs and authority semantics are unchanged. Earlier candidate archives remain immutable. This is synthetic receiving evidence, not product, browser/CSP or OS acceptance.
