var structureTower = {

    TARGET_LIST : [FIND_HOSTILE_CREEPS, FIND_MY_CREEPS, FIND_STRUCTURES],

    /** @param {Tower} creep **/
    run: function(tower, enemies) {
        let index = -1;
        let target;
        while (!target && index < this.TARGET_LIST.length) {
            index = index + 1;
            let searchConstant = this.TARGET_LIST[index];
            let filterFunc = this.getFilter(searchConstant, tower);
            target = tower.pos.findClosestByRange(searchConstant, {filter: filterFunc});
        }
        switch (this.TARGET_LIST[index]) {
            case FIND_HOSTILE_CREEPS:
                tower.attack(target);
                break;
            case FIND_MY_CREEPS:
                tower.heal(target);
                break;
            case FIND_STRUCTURES:
                tower.repair(target);
                break;
            default:
                break;
        }
	},
    
    getFilter: function(target, tower) {
        let filter;
        switch (target) {
            case FIND_MY_CREEPS:
                filter = function(creep) {
                    return creep.hits < creep.hitsMax;
                }
                break;
            case FIND_STRUCTURES:
                filter = function(structure) {
                    return tower.pos.inRangeTo(structure, 5) && 
                           structure.hits < structure.hitsMax;
                }
                break;
            default:
                filter = undefined;
                break;
        }
        return filter;
    }
};

module.exports = structureTower;