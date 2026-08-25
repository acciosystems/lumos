# Security exceptions

This file records accepted dependency-audit findings that are outside the deployed runtime and have a time-bounded review date.

## GHSA-ggr8-5vv4-36mx — `deepmerge-ts`

- **Severity:** High (CVE-2026-40345)
- **Affected resolution:** `deepmerge-ts@7.1.5`
- **Reachability:** `prisma` → `@prisma/config` → `deepmerge-ts`; Prisma is a development-only CLI dependency in `@lumos/database`.
- **Runtime impact:** The package is not included in the production dependency graph or application bundle. The vulnerable recursive-object merge path is not called by the deployed application.
- **Current mitigation:** Keep Prisma on the supported 7.x line; do not force `deepmerge-ts@8` through an override because `@prisma/config@7.10.0` pins the 7.x API.
- **Exception owner:** Lumos maintainers
- **Review deadline:** 2026-09-25
- **Tracking:** [ACC-53](https://linear.app/acciosystems/issue/ACC-53/re-audit-prisma-deepmerge-ts-security-exception), assigned to `baxthus` and due 2026-09-25.
- **Review command:** `bun audit`
- **Exit condition:** Re-audit after a compatible Prisma 7 patch or stable Prisma release makes `deepmerge-ts@8.0.0` available without an unsupported override.
