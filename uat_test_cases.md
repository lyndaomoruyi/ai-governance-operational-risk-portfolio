# UAT Test Cases

| Test ID | Scenario | Expected Result | Validation |
|---|---|---|---|
| UAT-001 | Inventory below reorder threshold | System assigns stockout risk and elevated rating | Pass if risk type and rating match rule |
| UAT-002 | Documentation status missing approval | System flags documentation control gap | Pass if control gap appears in register |
| UAT-003 | Vendor follow-up overdue | System assigns escalation or follow-up risk | Pass if owner/action generated |
| UAT-004 | Client reporting overdue | System flags client reporting risk | Pass if dashboard and action log reflect issue |
| UAT-005 | Low-risk item with complete documentation | System classifies as monitoring or low risk | Pass if no unnecessary escalation |
| UAT-006 | High-risk record | Human validation checkpoint required | Pass if validation status is required before final reporting |
