var roleUpgrader = {

    spawn: function(stage) {
        let body;
        switch (stage) {
            case 0:
                body = [WORK, CARRY, MOVE];
                break;
            case 1:
                body = [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            case 2:
                body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            case 3:
                body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            case 4:
                body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            default:
                body = [WORK, CARRY, MOVE];
                break;
        }
        let name = "upgrader-" + stage + "-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "upgrader", stage: stage}});
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
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if there are fewer than 2 upgraders. false otherwise
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "upgrader"; 
        });
        return creeps.length < 2;
    }
};

module.exports = roleUpgrader;