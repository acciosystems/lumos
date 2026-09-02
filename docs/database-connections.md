# Production database connections

## Target provider and placement

Production is planned to use Neon directly, without the Vercel Marketplace integration. Provision
the production compute in AWS South America East (`sa-east-1`), matching the Vercel `gru1` region
configured for the web application. Before release, verify that the deployed database region and
the selected Vercel plan support this repository-controlled placement.

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

## Tier-independent connection contract

The repository does not assume a Neon compute size or Vercel plan tier. It controls the following
limits independently of those choices:

| Limit                               | Application setting |
| ----------------------------------- | ------------------: |
| `pg` connections per Vercel isolate |                   1 |
| Connection acquisition wait         |           3 seconds |
| Statement and query duration        |          10 seconds |
| Lock wait                           |           3 seconds |
| Interactive transaction wait        |           3 seconds |
| Interactive transaction duration    |          10 seconds |

Neon PgBouncer queues client work when the role/database server pool is occupied. Vercel can
autoscale beyond the database's active-connection capacity and does not expose a lower
repository-level instance cap. The application therefore limits each isolate to one client
connection and fails requests that cannot acquire or use it within the configured timeouts; it
does not use a process-local or distributed concurrency limiter.

Before production release, verify the selected Neon compute's `max_connections`, PgBouncer server
pool, and client-connection capacity in the provider configuration. Reserve enough direct capacity
for administration and do not run a production migration while runtime connections are saturated.
If the selected provider capacity cannot sustain the intended traffic with these safeguards,
increase capacity or reduce operational concurrency before release rather than encoding a plan
tier in the repository.

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
