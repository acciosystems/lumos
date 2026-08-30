# Production observability

## Delivery contract

Production server events are emitted by evlog and sent directly from the application to the
Axiom Ingest API:

```text
evlog event -> direct HTTPS POST -> Axiom dataset
```

Vercel Log Drains are not part of this path. On Vercel, `waitUntil` only keeps the invocation
alive until the direct Axiom request settles. Vercel does not receive or forward the event
payload through a Log Drain.

Each event is sent immediately in a one-element JSON array. Delivery has a two-second deadline
and no application retry. There is no in-process batch, flush interval, retry backoff, or
shutdown flush. Consequently, instance termination cannot strand a partial batch or timer.

The transport uses these server-only environment variables:

- `AXIOM_TOKEN`: API token with ingest permission for the target dataset.
- `AXIOM_DATASET`: target dataset name.
- `AXIOM_URL`: optional Axiom base URL. The default is `https://api.axiom.co`.

## Service attribution

Events use the following stable service names:

| Source                               | Service          |
| ------------------------------------ | ---------------- |
| Nitro requests                       | `lumos/web`      |
| Better Auth routes                   | `lumos/auth`     |
| oRPC requests and storage operations | `lumos/rpc`      |
| Email delivery                       | `lumos/email`    |
| Database telemetry                   | `lumos/database` |

Nitro is the only process-wide evlog initializer. Request integrations and standalone events
set service overrides explicitly, so module initialization order cannot change attribution.
Production logging enables evlog redaction and does not apply application sampling.

## Failure behavior

Axiom HTTP errors, network errors, timeouts, and partial ingest rejections do not fail the
business request. They produce one structured stderr diagnostic with:

- `event = logging_delivery_dropped`
- `droppedCount`
- source service, event ID, and request ID when present
- a safe failure code and optional HTTP status

The diagnostic never contains the original event, response body, API token, or request headers.
It is the fallback signal when Axiom itself is unavailable.

Configure an Axiom threshold monitor for production traffic with **Alert on no data** enabled.
Choose a range that tolerates normal low-traffic periods. Also monitor application error counts
by `service` and `level`.

## Verification

After a production deployment:

1. Invoke representative web, authentication, RPC, email, and storage paths.
2. Confirm their events appear in the configured Axiom dataset with the expected service and
   correlation fields.
3. Confirm sensitive identity fields are redacted or masked.
4. Trigger the transport test endpoint or a controlled invalid token in a non-production
   deployment and verify one `logging_delivery_dropped` diagnostic is emitted.
5. Confirm the Axiom no-data monitor has an active notifier.
