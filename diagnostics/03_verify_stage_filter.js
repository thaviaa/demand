/**
 * Verification: find demands whose Stage (Filter) doesn't match the expected value.
 * Expect 0 mismatches after backfill.
 */
var gr = new GlideRecord('dmn_demand');
gr.query();
var bad = 0, total = 0;
while (gr.next()) {
    total++;
    var expected = DemandStageUtil.getValue(gr);
    if (gr.getValue('u_demand_stage') != expected) {
        bad++;
        gs.info('MISMATCH ' + gr.number + ' | stored=' + gr.getValue('u_demand_stage') +
            ' | expected=' + expected);
    }
}
gs.info('Checked ' + total + ', mismatches: ' + bad);
