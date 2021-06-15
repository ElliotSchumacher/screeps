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
        // console.log(damagedStructures);
        // console.log(damagedStructures.length);
        // console.log(damagedStructures[0].hitsMax - damagedStructures[0].hits);
        // console.log(totalDamage);
        for (let index = 0; index < damagedStructures.length; index++) {
            let structure = damagedStructures[index];
            // console.log(structure);
            totalDamage = totalDamage + (structure.hitsMax - structure.hits);
            // console.log(totalDamage);
        }
        console.log("totalDamage: " + totalDamage);
        let desiredCreepCount = Math.ceil(totalDamage / 10000);
        return desiredCreepCount - creeps.length > 0;
    }
};

module.exports = roleRepairer;