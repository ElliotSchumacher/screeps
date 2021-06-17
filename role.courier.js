var roleCourier = {

    spawn: function(stage) {
        let body;
        switch (stage) {
            case 1:
                body = [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            case 2:
                body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            case 3: 
                body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            case 4: 
                body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            default:
                body = [WORK, CARRY, MOVE];
                break;
        }
        let name = "courier-" + stage + "-" + Game.time;
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
            let warehouse = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                           structure.store.getUsedCapacity() > 0;
                }
            });
            if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(warehouse, {visualizePathStyle: {stroke: '#ffaa00'}});
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
	},

    /** @param {Room} room 
     *  @return {boolean} true if courier count < room stage.
     *                    false otherwise
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "courier"; 
        });
        return creeps.length < Math.ceil(room.memory.stage / 2);
    }
};

module.exports = roleCourier;