/**
 * Business Rule: Set Stage (Filter)
 * Bug 269437
 *
 * Table:     dmn_demand
 * When:      before
 * Insert:    true
 * Update:    true
 * Condition: State changes OR Project changes
 */
(function executeRule(current, previous /*null when async*/) {
    current.u_demand_stage = DemandStageUtil.getValue(current);
})(current, previous);
