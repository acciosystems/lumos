# Request deadlines

Production requests run on Vercel with a 60-second function duration. Business work must finish
within 40 seconds. The remaining time is reserved for compensation, response serialization, and
observability delivery.

| Dependency or stage               |                             Deadline | Retry policy                                       | Failure behavior                                                          |
| --------------------------------- | -----------------------------------: | -------------------------------------------------- | ------------------------------------------------------------------------- |
| Foreground RPC work               |                           40 seconds | None                                               | Stop new external work and return a gateway timeout.                      |
| Compensation                      |        55 seconds from request start | None                                               | Attempt durable intent updates and bounded cleanup.                       |
| PostgreSQL connection acquisition |                            5 seconds | None                                               | Emit database timeout telemetry and return a gateway timeout.             |
| PostgreSQL statement/query        |                        10/12 seconds | None                                               | Emit database timeout telemetry and return a gateway timeout.             |
| PostgreSQL transaction            | 3-second wait, 10-second transaction | None                                               | Emit database timeout telemetry and return a gateway timeout.             |
| R2 HEAD, COPY, and DELETE         |                            5 seconds | One SDK attempt                                    | Return a gateway timeout; copied objects are compensated when applicable. |
| Resend handoff                    |                            5 seconds | Caller may retry with the existing idempotency key | Return the existing authentication service-unavailable response.          |
| Axiom event delivery              |                            2 seconds | None                                               | Drop the event and write the safe stderr fallback diagnostic.             |

Presigned upload URL generation is local signing work rather than an R2 request. Browser uploads
occur directly between the browser and R2 and are reconciled by the upload-intent workflow.

## Accountability publication

At most ten evidence objects can be submitted. Their R2 validation and copy operations start in
parallel. Each copied object is recorded in memory before a later database operation can fail, so
the existing compensation path can delete the published object and preserve durable cleanup state.

When any task fails, publication waits for all already-started tasks to settle before compensation
begins. This prevents a late copy from escaping cleanup. The returned evidence order remains the
order requested by the organizer.

## Observability and responses

R2 timeout errors include only dependency name, safe operation stage, and elapsed milliseconds.
The RPC timeout middleware records those fields on the request event and returns a consistent 504
response. Database timeout kinds are handled by the same middleware. Neither the timeout event nor
the response includes object keys, file names, payloads, credentials, or provider response bodies.
