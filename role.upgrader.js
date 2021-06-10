var roleUpgrader = {

    spawn: function() {
        let body = [WORK, CARRY, MOVE];
        let name = "upgrader-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "upgrader"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                           structure.store.getUsedCapacity() > 0;
                }
            });
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;