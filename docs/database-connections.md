# Production database connections

## Target provider and placement

Production is planned to use Neon directly, without the Vercel Marketplace integration. Provision
the production compute in AWS South America East (`sa-east-1`), matching the Vercel `gru1` region
configured for the web application. Record the actual provider configuration and review date after
the production Neon project is created.

Vercel recommends running functions in the same region as the database. Neon lists AWS South
America East (Sao Paulo) as an available region.

Sources:

- https://vercel.com/docs/regions
- https://neon.com/demos/regional-latency

## Connection paths

| Workload          | Environment variable  | Neon endpoint                        | Availability                  |
| ----------------- | --------------------- | ------------------------------------ | ----------------------------- |
| Web runtime       | `DATABASE_URL`        | Pooled hostname containing `-pooler` | Vercel and local runtime      |
| Prisma migrations | `DIRECT_DATABASE_URL` | Direct hostname without `-pooler`    | Operator or migration CI only |

For the target production configuration, maintain both values in Doppler. Do not commit either
connection string or copy the direct credential into the Vercel runtime environment.

Neon uses PgBouncer in transaction mode for pooled endpoints. Session-level state, `LISTEN`,
session-level advisory locks, and SQL `PREPARE` are not supported on this path. Prisma migrations
must use the direct endpoint.

Source: https://neon.com/docs/connect/connection-pooling

## Target MVP connection budget

The initial production compute should use a fixed 0.25 CU. Neon documents the following limits
for that size:

| Limit                        |                               Value | Use in Lumos                               |
| ---------------------------- | ----------------------------------: | ------------------------------------------ |
| Direct Postgres connections  |                                 112 | Provider maximum                           |
| Neon-reserved connections    |                                   7 | Not available to the application           |
| Usable direct connections    |                                 105 | Includes migration and administrative work |
| PgBouncer client connections |                              10,000 | Serverless client sockets                  |
| PgBouncer server pool        | approximately 100 per role/database | Active runtime transactions                |
| `pg` pool per Vercel isolate |                                   1 | Application setting                        |

The target database-active runtime budget is 100 concurrent transactions. This is a
conservative `floor(0.9 * 112)` calculation, matching Neon's documented PgBouncer
`default_pool_size` rule. Do not run a production migration while the runtime pool is saturated;
the remaining direct capacity is intentionally small.

Vercel can autoscale function invocations beyond this value and does not expose a lower
repository-level instance cap. The budget applies to active Postgres connections, which Neon
PgBouncer bounds and queues. Requests that wait too long fail through the application's existing
query and transaction timeouts; do not add a distributed concurrency limiter for this MVP.

Before production release, verify the configured direct limit in the Neon console or with
`SHOW max_connections`, record the result in this document, and recalculate the budget if the
compute size or autoscaling range differs from this target.

Sources:

- https://neon.com/docs/manage/endpoints/
- https://neon.com/docs/connect/connection-pooling
- https://vercel.com/docs/functions/concurrency-scaling

## Runtime safeguards and operations

Each Vercel isolate uses one `pg` connection with a three-second acquisition timeout, 10-second
statement/query timeouts, a three-second lock timeout, and a three-second transaction wait with a
10-second transaction timeout. Database saturation and timeout events are emitted with service
`lumos/database`.

Create an Axiom warning for any acquisition timeout or saturation event. Escalate when three or
more occur within five minutes, or when they recur in two consecutive five-minute windows. During
an escalation, inspect Neon connection and CPU metrics, identify slow queries, and defer
migrations. Increase Neon compute only after sustained legitimate traffic demonstrates that the
recorded budget is insufficient.

Review this document when changing the Neon plan, compute sizing, endpoint region, Vercel region,
Fluid Compute setting, or the application pool configuration.
