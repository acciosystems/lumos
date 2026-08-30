# Campaign mutation idempotency

`campaign.create` and `campaign.publishUpdate` require a client-generated UUID
in `operationKey`. The client reuses the key when retrying the same logical
request and generates a new key when the payload changes.

The API stores a SHA-256 fingerprint of the validated payload, the authenticated
actor, the operation kind, and a server-generated resource ID. The operation key
is globally unique. A matching retry returns the resource associated with the
stored ID; reuse with a different actor, operation, or payload returns a
conflict.

Reservations are retained for 24 hours. Expired records are removed
opportunistically in bounded batches during these mutations. The retention
window is the retry guarantee: a request retried after expiration may receive a
new resource ID.

Operation keys are persisted only in the idempotency table and are not logged.
Raw request payloads are not persisted. Logs record the operation kind,
reservation ID, and lifecycle outcome (`reserved`, `replayed`, `committed`, or
`conflict`). Cleanup failures are logged as best-effort maintenance failures and
do not invalidate a successful mutation.
