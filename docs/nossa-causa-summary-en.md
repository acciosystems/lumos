# Nossa Causa — Project Summary (Capstone Project)

**Fictional company:** AccioLabs

## Overview

Nossa Causa is a web platform to centralize and manage donation campaigns, replacing informal coordination via Facebook/WhatsApp groups with a dedicated environment that offers management tools, filters, and transparency for organizers and donors.

## Problem it solves

Today, physical-item donation campaigns rely on informal social media groups, making coordination, tracking, and accountability difficult. The platform centralizes this process, offering participation indicators, organizer-published updates, and public participation data. For monetary donations, organizers provide their own payment details (PIX key, bank account number), avoiding payment-processor fees — relying only on their own bank's fees.

## Donation model

- **Physical**: organizer creates a campaign to collect items at a defined location.
- **Virtual**: organizer shares a PIX key/bank account to receive donations directly.

## Feature priority

| Priority                   | Feature                       | Description                                                                                         |
| -------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| **P0 — Core (MVP)**        | Physical campaigns            | Create campaigns with a location and needed items                                                   |
|                            | Virtual campaigns             | Donations via PIX/bank account provided by the organizer                                            |
|                            | Filters                       | Search by topic and region                                                                          |
|                            | Management tools              | Dashboard for organizers to track participants and stats                                            |
|                            | Transparency                  | Public CNPJ (Brazilian tax ID) for organizations + mandatory post-campaign accounting               |
|                            | Public participation data     | Visible participant count for physical campaigns                                                    |
| **P1 — Important**         | Reputation system             | Scores last-minute cancellations, accounting-deadline compliance, and campaign organization quality |
|                            | Reporting system              | Lets users flag problematic campaigns or organizers                                                 |
| **P2 — Nice to have**      | Rewards system                | Per-user participation ID enabling rankings/rewards set by organizers                               |
|                            | Notification system           | Possible future enhancement considered technically infeasible within the MVP scope                  |
| **P3 — Future (post-MVP)** | Payment processor integration | Stripe, Polar, etc., as an optional alternative to direct PIX/bank transfer                         |

## Open questions

- **Accounting deadline**: define the grace period (e.g., fixed one-week window vs. a calculation based on the quantity of donated items). Missing this deadline constitutes a violation of the platform's terms.
