# Request deadlines

Production requests run on Vercel with a 60-second function duration. Business work must finish
within 40 seconds. The remaining time is reserved for compensation, response serialization, and
observability delivery.

See [database connections](./database-connections.md) for the provider connection budget and
operational escalation thresholds.

| Dependency or stage               |                             Deadline | Retry policy                                       | Failure behavior                                                          |
| --------------------------------- | -----------------------------------: | -------------------------------------------------- | ------------------------------------------------------------------------- |
| Foreground RPC work               |                           40 seconds | None                                               | Stop new external work and return a gateway timeout.                      |
| Compensation                      |        55 seconds from request start | None                                               | Attempt durable intent updates and bounded cleanup.                       |
| PostgreSQL connection acquisition |                            3 seconds | None                                               | Emit database timeout telemetry and return a gateway timeout.             |
| PostgreSQL statement/query        |                        10/10 seconds | None                                               | Emit database timeout telemetry and return a gateway timeout.             |
| PostgreSQL transaction            | 3-second wait, 10-second transaction | None                                               | Emit database timeout telemetry and return a gateway timeout.             |
| R2 HEAD, COPY, and DELETE         |                            5 seconds | One SDK attempt                                    | Return a gateway timeout; copied objects are compensated when applicable. |
| Resend handoff                    |                            5 seconds | Caller may retry with the existing idempotency key | Return the existing authentication service-unavailable response.          |
| Pwned Passwords range check       |                            2 seconds | None                                               | Allow the password operation and emit a safe failure event.               |
| Axiom event delivery              |                            2 seconds | None                                               | Drop the event and write the safe stderr fallback diagnostic.             |

Presigned upload URL generation is local signing work rather than an R2 request. Browser uploads
occur directly between the browser and R2 and are reconciled by the upload-intent workflow.

## Enforcement

Nitro creates one request-local deadline before request-body handling and authentication enrichment;
TanStack Start then reuses it for SSR, server functions, and API routes. HTTP and in-process RPC
calls, authentication session checks, email, password-compromise checks, and Axiom delivery reuse
that deadline rather than creating nested windows. Foreground work rejects before the 40-second
cutoff and before each database transaction, query, or R2 operation. A client disconnect aborts
foreground work through the same context. Database operations already in flight remain bounded by
the configured PostgreSQL timeouts.

Cleanup that repairs a durable upload or avatar state runs under the compensation context instead.
It is awaited before the RPC handler settles. R2 work cannot start after 55 seconds from the
original request start. Because PostgreSQL queries cannot be aborted by the request signal, new
compensation database work stops at 42 seconds, reserving the maximum 13-second
acquisition-and-query budget and the final five seconds for response serialization and logging.
Serverless execution after a response is not used for required cleanup.

Removed campaign-asset cleanup selects at most five oldest tombstones, runs no more than two
cleanup operations concurrently, and stops starting work after eight seconds. Unfinished
tombstones remain in PostgreSQL for a later eligible request to retry.

## Accountability publication

At most ten evidence objects can be submitted. Their R2 validation and copy operations start in
parallel. Each published destination is recorded durably before its copy starts and in memory after
it succeeds, so immediate compensation and later maintenance can delete the object if needed.

When any task fails, publication waits for all already-started tasks to settle before compensation
begins. This prevents a late copy from escaping cleanup. The returned evidence order remains the
order requested by the organizer.

## Observability and responses

R2 timeout errors include only dependency name, safe operation stage, and elapsed milliseconds.
The RPC timeout middleware records those fields on the request event and returns a consistent 504
response. Database timeout kinds are handled by the same middleware. Neither the timeout event nor
the response includes object keys, file names, payloads, credentials, or provider response bodies.

The Pwned Passwords check sends only the first five characters of the password's SHA-1 hash. A
confirmed match rejects the password with a generic validation response. Timeouts, transport and
HTTP failures, and malformed provider responses fail open: the password operation continues after
at most two seconds and emits an `auth_password_compromise_check_failed` event. That event contains
only a failure kind, elapsed duration, and optional HTTP status; it never contains a password, hash
prefix or suffix, request URL, or provider response body. This availability tradeoff is reviewed as
part of changes to the authentication security boundary.
