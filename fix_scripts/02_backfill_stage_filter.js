/**
 * Fix Script: Backfill Stage (Filter)
 * Bug 269437
 *
 * Populates dmn_demand.u_demand_stage for all existing demands.
 * Requires Script Include DemandStageUtil and the choices from 01_build_stage_choices.js.
 * Run once per environment.
 */
var gr = new GlideRecord('dmn_demand');
gr.query();
var n = 0;
while (gr.next()) {
    gr.setValue('u_demand_stage', DemandStageUtil.getValue(gr));
    gr.setWorkflow(false);    // no notifications / SPM rollups
    gr.autoSysFields(false);  // don't touch updated / updated_by
    gr.update();
    n++;
}
gs.info('Bug 269437: backfilled ' + n + ' demands');
