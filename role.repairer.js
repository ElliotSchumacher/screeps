var roleRepairer = {

	spawn: function() {
        let body = [WORK, CARRY, MOVE];
        let name = "repairer-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "repairer", refill: true}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) < 5) {
            creep.memory.refill = true;
        } else if (creep.memory.refill && creep.store.getFreeCapacity(RESOURCE_ENERGY) < 5) {
            creep.memory.refill = false;
        }

        if (creep.memory.refill) {
            //find closest container or source[0]
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER) && 
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            // fill up on energy
            container = Game.getObjectById("60bee1bc2f8a005467e46983");
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            let damagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return structure.hitsMax - structure.hits > 0;
                }
            });
            if (creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedStructure, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleRepairer;