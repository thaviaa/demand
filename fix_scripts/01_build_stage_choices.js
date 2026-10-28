/**
 * Fix Script: Build Stage (Filter) choices
 * Bug 269437
 *
 * Deletes existing choices on dmn_demand.u_demand_stage and rebuilds:
 *   demand_<value>  "Demand <label>"   from dmn_demand state (fallback: task)
 *   project_<value> "Project <label>"  from pm_project state (fallback: planned_task, task)
 *
 * Safe to re-run. Run BEFORE the backfill.
 */
var TABLE = 'dmn_demand', FIELD = 'u_demand_stage', seq = 0, n = 0;

var del = new GlideRecord('sys_choice');
del.addQuery('name', TABLE);
del.addQuery('element', FIELD);
del.deleteMultiple();

function getStates(tables) {
    for (var i = 0; i < tables.length; i++) {
        var st = new GlideRecord('sys_choice');
        st.addQuery('name', tables[i]);
        st.addQuery('element', 'state');
        st.addQuery('language', 'en');
        st.addQuery('inactive', false);
        st.orderBy('sequence');
        st.query();
        if (st.hasNext()) return st;
    }
    return null;
}

function addChoices(prefix, labelPrefix, tables) {
    var st = getStates(tables);
    while (st && st.next()) {
        var c = new GlideRecord('sys_choice');
        c.initialize();
        c.name = TABLE;
        c.element = FIELD;
        c.language = 'en';
        c.value = prefix + '_' + st.getValue('value');
        c.label = labelPrefix + ' ' + st.getValue('label');
        c.sequence = (seq += 10);
        c.insert();
        n++;
    }
}

addChoices('demand', 'Demand', ['dmn_demand', 'task']);
addChoices('project', 'Project', ['pm_project', 'planned_task', 'task']);
gs.info('Bug 269437: created ' + n + ' choices on ' + TABLE + '.' + FIELD);
