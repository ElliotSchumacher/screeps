var roleRepairer = {

	spawn: function(stage) {
        let body;
        switch (stage) {
            case 0:
                body = [WORK, CARRY, MOVE];
                break;
            case 1:
                body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                break;
            case 2:
                body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            case 3:
                body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            case 4:
                body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                break;
            default:
                body = [WORK, CARRY, MOVE];
                break;
        }
        let name = "repairer-" + stage + "-" + Game.time;
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
            let warehouse = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) && 
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (warehouse) {
                if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(warehouse, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            let damagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.hitsMax - structure.hits > 0) && 
                            structure.structureType != STRUCTURE_WALL;
                }
            });
            if (creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedStructure, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if no repairer & damage > 0; 1 repairer & damage 10000.
     *                    false otherwise
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "repairer"; 
        });
        if (creeps.length > 1) {
            return false;
        }
        let damagedStructures = room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.hitsMax - structure.hits > 0) && 
                        structure.structureType != STRUCTURE_WALL;
            }
        });
        let totalDamage = 0;
        for (let index = 0; index < damagedStructures.length; index++) {
            let structure = damagedStructures[index];
            totalDamage = totalDamage + (structure.hitsMax - structure.hits);
        }
        console.log("totalDamage: " + totalDamage);
        let desiredCreepCount = Math.ceil(totalDamage / 10000);
        return desiredCreepCount - creeps.length > 0;
    }
};

module.exports = roleRepairer;