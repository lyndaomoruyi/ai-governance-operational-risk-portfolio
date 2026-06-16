# UAT Test Cases

## UAT-001 — AI use case with restricted data is risk-rated High/Critical
- **Steps:** Enter restricted data and customer-impacting workflow
- **Expected Result:** Risk tier is High or Critical
- **Status:** Pass

## UAT-002 — Missing evidence triggers review gap
- **Steps:** Set evidence to missing SOC 2 or model card
- **Expected Result:** Dashboard shows missing evidence count and issue action
- **Status:** Pass

## UAT-003 — Overdue review appears in dashboard
- **Steps:** Set next review date before current date
- **Expected Result:** Dashboard overdue review count increases
- **Status:** Pass

## UAT-004 — Human oversight gap is flagged
- **Steps:** Set oversight to Limited oversight for customer-impacting use case
- **Expected Result:** Risk score increases and control gap is documented
- **Status:** Pass

## UAT-005 — Vendor-hosted use case requires due diligence
- **Steps:** Set platform type to Vendor-hosted SaaS
- **Expected Result:** Vendor due diligence control applies
- **Status:** Pass

## UAT-006 — Closed issue excluded from open issue count
- **Steps:** Change issue status to Closed
- **Expected Result:** Open issue count decreases
- **Status:** Pass

## UAT-007 — Approved low-risk internal documentation use case is acceptable
- **Steps:** Internal only, low data, complete evidence
- **Expected Result:** Risk tier remains Low/Moderate
- **Status:** Pass

## UAT-008 — Hold status is preserved for high-risk exceptions
- **Steps:** Set status to Hold
- **Expected Result:** Use case remains in hold category for follow-up
- **Status:** Pass
