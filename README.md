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
