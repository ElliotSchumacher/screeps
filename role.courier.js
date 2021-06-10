var roleCourier = {

    spawn: function() {
        let body = [WORK, CARRY, MOVE];
        let name = "courier-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "courier", refill: true}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.refill = true;
        } else if (creep.memory.refill && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.refill = false;
        }

        if (creep.memory.refill) {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                           structure.store.getUsedCapacity() > 0;
                }
            });
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && 
                        (structure.store.getUsedCapacity(RESOURCE_ENERGY) / 
                        structure.store.getCapacity(RESOURCE_ENERGY) < .80);
                }
            });
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(structure) {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleCourier;