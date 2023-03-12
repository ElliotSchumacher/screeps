var roleRepairer = {

    DAMAGE_CHECK_INTERVAL:80,

	spawn: function(stage) {
        let body;
        switch (stage) {
            case 0:
                body = [WORK, CARRY, MOVE];
                break;
            case 1:
                body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                break;
            case 2: case 3: case 4: case 5: case 6:
                body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
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
            let damagedStructures = creep.room.find(FIND_STRUCTURES, {
                filter: function(structure) {
                    return structure.hitsMax - structure.hits > 0;
                }
            });
            damagedStructures = damagedStructures.sort(function(struct1, struct2) {
                let weight1 = struct1.hits + 45 * creep.pos.getRangeTo(struct1);
                let weight2 = struct2.hits + 45 * creep.pos.getRangeTo(struct2);
                return weight1 - weight2;
            });
            if (damagedStructures.length > 0) {
                if (creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let idleFlags = creep.room.find(FIND_FLAGS, {
                    filter: function(flag) {
                        return flag.name == "idle";
                }
            });
                if(idleFlags.length > 0) {
                    creep.moveTo(idleFlags[0]);
                }
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
        // console.log("totalDamage: " + totalDamage);
        let lastDamageCheckTicks = room.memory.lastDamageCheckTicks;
        let lastTotalDamage = room.memory.lastTotalDamage;
        let currentTicks = Game.time;
        if (!lastDamageCheckTicks || !lastTotalDamage) {
            room.memory.lastDamageCheckTicks = currentTicks;
            room.memory.lastTotalDamage = totalDamage;
            return false;
        } else if (currentTicks - lastDamageCheckTicks > this.DAMAGE_CHECK_INTERVAL) {
            console.log("lastTotalDamage: " + lastTotalDamage);
            console.log("totalDamage: " + totalDamage);
            room.memory.lastDamageCheckTicks = currentTicks;
            room.memory.lastTotalDamage = totalDamage;
            // return (totalDamage > lastTotalDamage && creeps.length < Math.floor((room.memory.stage + 1) / 2 + 1)) || creeps.length < 1;
            return (totalDamage > lastTotalDamage && creeps.length < 3) || creeps.length < 1;
        } else {
            return false;
        }
    }
};

module.exports = roleRepairer;