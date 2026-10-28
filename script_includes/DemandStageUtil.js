/**
 * Script Include: DemandStageUtil
 * Bug 269437 - Demand List cannot Filter on Stage as a Choice Dropdown
 *
 * Accessible from: All application scopes
 * Client callable: false
 *
 * Mirrors the OOB Stage decoration on dmn_demand:
 *   - Linked project  -> "project_" + pm_project.state
 *   - No project      -> "demand_"  + dmn_demand.state
 */
var DemandStageUtil = Class.create();
DemandStageUtil.prototype = {
    initialize: function () {},
    type: 'DemandStageUtil'
};

/**
 * @param {GlideRecord} dmn - a dmn_demand record
 * @returns {string} choice value for u_demand_stage
 */
DemandStageUtil.getValue = function (dmn) {
    if (!dmn.project.nil()) {
        var p = dmn.project.getRefRecord();
        if (p.isValidRecord()) {
            return 'project_' + p.getValue('state');
        }
    }
    return 'demand_' + dmn.getValue('state');
};
