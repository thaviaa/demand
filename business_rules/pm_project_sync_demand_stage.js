/**
 * Business Rule: Sync Demand Stage (Filter)
 * Bug 269437
 *
 * Table:     pm_project
 * When:      after
 * Update:    true
 * Condition: State changes
 *
 * Keeps dmn_demand.u_demand_stage current when the linked project's state moves.
 */
(function executeRule(current, previous /*null when async*/) {
    var d = new GlideRecord('dmn_demand');
    d.addQuery('project', current.getUniqueValue());
    d.query();
    while (d.next()) {
        d.setValue('u_demand_stage', DemandStageUtil.getValue(d));
        d.setWorkflow(false);    // no notifications / SPM rollups
        d.autoSysFields(false);  // don't touch updated / updated_by
        d.update();
    }
})(current, previous);
