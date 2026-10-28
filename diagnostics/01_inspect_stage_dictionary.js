/**
 * Diagnostic: inspect dmn_demand.stage dictionary, overrides, and choices.
 * Result on our instance: type=decoration, choice=0,
 * attrs=list_decoration=demand_stage, 0 choices.
 */
var d = new GlideRecord('sys_dictionary');
d.addQuery('name', 'IN', 'dmn_demand,task');
d.addQuery('element', 'stage');
d.query();
while (d.next()) {
    gs.info(d.name + '.stage | type=' + d.internal_type +
        ' | choice=' + d.choice + ' | calculated=' + d.virtual +
        ' | attrs=' + d.attributes);
}
var o = new GlideRecord('sys_dictionary_override');
o.addQuery('name', 'dmn_demand');
o.addQuery('element', 'stage');
o.query();
while (o.next()) gs.info('OVERRIDE: ' + o.getDisplayValue());

var c = new GlideAggregate('sys_choice');
c.addQuery('name', 'dmn_demand');
c.addQuery('element', 'stage');
c.addAggregate('COUNT');
c.query();
if (c.next()) gs.info('dmn_demand.stage choices: ' + c.getAggregate('COUNT'));
