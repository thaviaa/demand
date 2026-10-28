# Demand List – Filterable Stage (Bug 269437)

ADO Bug **269437**: *Demand List cannot Filter on Stage as a Choice Dropdown* (also not sortable).
Iteration: ITS - ServiceNow\Release 2.0.0\Sprint P58.

## Root cause

OOB `dmn_demand.stage` is a **Decoration** field (`list_decoration=demand_stage`), not a Choice field.
It has no choice list, so the condition builder shows a text box, and the list cannot sort on it.
The stored value is only `demand` or `project`; the label users see ("Demand Qualified",
"Project Work in Progress") is computed at render time.

The OOB dictionary is left untouched. Changing its type would cause an upgrade skip and could break the decoration.

## How the Stage label is derived

Confirmed against the list during UAT:

| Condition | Label shown |
|---|---|
| Demand has a linked `project` | `Project` + the **project's** state label |
| No linked project | `Demand` + the **demand's** state label (even when `stage = project`) |

The first build used `stage + demand state`. UAT found every converted demand showing
"Project Completed", because demand state is Completed after conversion. This repo contains the corrected logic.

## Solution

A custom Choice field, `u_demand_stage` (label **Stage (Filter)**), on `dmn_demand`, kept in sync by business rules.

| File | Record type | Purpose |
|---|---|---|
| `script_includes/DemandStageUtil.js` | Script Include | Single source of the stage logic |
| `business_rules/dmn_demand_set_stage_filter.js` | Business Rule (`dmn_demand`) | Sets the field when demand State or Project changes |
| `business_rules/pm_project_sync_demand_stage.js` | Business Rule (`pm_project`) | Updates linked demands when the project's State changes |
| `fix_scripts/01_build_stage_choices.js` | Fix Script | Builds `demand_*` and `project_*` choices |
| `fix_scripts/02_backfill_stage_filter.js` | Fix Script | Populates existing demands |
| `diagnostics/*.js` | Background scripts | Investigation and verification queries |

## Field setup

- Table: `dmn_demand`
- Column name: `u_demand_stage`
- Type: Choice, *Dropdown with --None--*
- Label: **Stage (Filter)** (use **Stage** only if the decoration column is removed from the list layout)
- Choice values: `demand_<state value>` / `project_<state value>`

## Deployment order

Run everything inside the Bug 269437 update set, not Default.

1. Create the `u_demand_stage` field.
2. Create Script Include `DemandStageUtil` (Accessible from: All application scopes, Client callable: false).
3. Run `fix_scripts/01_build_stage_choices.js`.
4. Create both business rules (settings are in the header of each file).
5. Run `fix_scripts/02_backfill_stage_filter.js`.
6. Add **Stage (Filter)** to the Demand list layout.
7. Confirm the update set captured the field, the Script Include, both BRs, and the `sys_choice` records.
   Script-inserted choices are not always tracked. If they are missing, open *Configure > Choices* on the field and save once.
8. The backfill is data, not config. Run it as a fix script in each environment.

## Test plan

- [ ] Stage (Filter) shows a dropdown in the condition builder.
- [ ] The column sorts ascending and descending.
- [ ] Stage and Stage (Filter) match row for row on the Demand list. Include:
  - converted demands (e.g. "Project Pending", "Project Work in Progress")
  - `stage = project` with no linked project (e.g. DMND0001116 → "Demand Qualified", DMND0001117 → "Demand Completed")
- [ ] Changing a demand's State updates Stage (Filter).
- [ ] Changing a linked project's State updates the demand's Stage (Filter).
- [ ] Converting a demand to a project updates Stage (Filter).
- [ ] No extra notifications fire during backfill (`setWorkflow(false)`).

## Maintenance

If a new State value is added to `dmn_demand` or `pm_project`, re-run `01_build_stage_choices.js`.
