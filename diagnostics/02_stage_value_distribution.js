/**
 * Diagnostic: stored values of dmn_demand.stage.
 * Result on our instance: demand=86, project=14.
 */
var ga = new GlideAggregate('dmn_demand');
ga.addAggregate('COUNT');
ga.groupBy('stage');
ga.query();
while (ga.next()) {
    gs.info('stage=' + ga.getValue('stage') + ' | count=' + ga.getAggregate('COUNT'));
}
