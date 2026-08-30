# Authentication rate limiting

## Storage choice

Production authentication rate limits use Better Auth's database storage with the existing
PostgreSQL and Prisma stack. This gives every Vercel instance one durable counter and uses Better
Auth's atomic database increment when requests arrive concurrently.

A separate Redis-compatible service is not part of the MVP. It would add another provider,
credentials, availability boundary, and operational path for traffic that is currently small. A
secondary store should be reconsidered if authentication traffic creates measurable PostgreSQL
contention or requires substantially lower counter latency.

The `rate_limits` table contains the Better Auth counter key, count, and last-request timestamp.
Expired counters are reset during the next atomic consume and old rows are eligible for Better
Auth's opportunistic cleanup. Cleanup is registered with Vercel `waitUntil` so the database query
can finish after the response. The `lastRequest` index supports that cleanup query.

## Limits

Limits are applied per normalized client IP and endpoint.

| Endpoint group                     |     Window | Maximum requests |
| ---------------------------------- | ---------: | ---------------: |
| All other authentication endpoints | 60 seconds |              100 |
| Sign-in                            | 60 seconds |               10 |
| Sign-up                            | 10 minutes |                5 |
| Request password reset             | 15 minutes |                3 |
| Complete password reset            | 15 minutes |                5 |
| Send verification email            | 15 minutes |                3 |
| Verify email                       | 15 minutes |                5 |
| Passkey authentication steps       | 60 seconds |               10 |
| Passkey registration steps         | 10 minutes |                5 |

The internal top-level window remains 15 minutes because Better Auth uses it as the database
cleanup horizon. A final catch-all rule restores the 60-second default for ordinary requests and
preserves Better Auth's stricter built-in rules. This prevents cleanup from deleting an active
long-window counter.

The passkey authentication and registration flows each use two endpoints. Each endpoint has its
own counter, so a normal two-step flow consumes one request from each endpoint's limit.

These are initial operational values. Tune them from blocked-request metrics and support reports,
not from individual request logs.

## Client IP trust boundary

The production origin is directly exposed through Vercel. Vercel overwrites `X-Forwarded-For`
with the public client IP, and Better Auth is configured to accept that header. Better Auth
normalizes IPv4 representations and groups IPv6 addresses by `/64` before constructing counter
keys.

Do not place an additional proxy or CDN in front of Vercel without reviewing this configuration.
The new boundary must overwrite or sanitize its client-IP header, and Better Auth must be updated
to trust only that boundary.

Rate-limit telemetry never includes the resolved IP, request URL, query string, body, email,
cookie, credential, or token.

## Responses and telemetry

Blocked requests return HTTP `429` with both retry headers containing the same whole-second delay:

- `X-Retry-After`, supplied by Better Auth for client compatibility.
- `Retry-After`, added at the application boundary as the standard HTTP header.

Each blocked request emits an `auth_rate_limit_exceeded` structured event under the `authRateLimit`
field with only the bounded endpoint category, HTTP method, blocked outcome, and retry delay.
Telemetry delivery is best effort and cannot change the authentication response.
