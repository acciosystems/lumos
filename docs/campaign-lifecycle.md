# Campaign lifecycle semantics

Campaign `startDate` and `endDate` are inclusive calendar dates interpreted in
`America/Sao_Paulo`. The database stores them as PostgreSQL `DATE` values; no
time of day is part of a campaign period.

The effective lifecycle is:

- `PENDING` before `startDate`. The campaign is private to its organizer and
  cannot receive participation, donations, progress changes, or updates.
- `ACTIVE` from the beginning of `startDate` through the end of `endDate`.
- `COMPLETED` at midnight on the São Paulo calendar day after `endDate`.
- `CANCELLED` when the organizer cancels the campaign. Terminal states cannot
  be reopened.

Public and owner reads use the same date window and derive the effective status
for rows that have not yet been touched on a boundary day. Detail reads and
state-changing mutations reconcile the requested row in a short transaction.
This keeps behavior correct in serverless deployments without process-local
timers. Reconciliation is idempotent and scoped to the requested campaign.

Campaign creation rejects an `endDate` in the past. Pending campaigns may be
edited or cancelled by their organizer. Active campaigns may be edited only
while their revised period still includes the current São Paulo date.

Accountability follows the completed state. Its deadline remains 23:59:59 in
São Paulo on the seventh calendar day after `endDate`; the original submission
timestamp and server-calculated on-time result are preserved during corrections.
