var roleUpgrader = {

    spawn: function(stage, room) {
        let body;
        let links = room.find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType == STRUCTURE_LINK;
            }
        });
        if (links.length < 2) {
            switch (stage) {
                case 0:
                    body = [WORK, CARRY, MOVE];
                    break;
                case 1:
                    body = [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                    break;
                case 2:
                    body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                    break;
                case 3:
                    body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case 4:
                    body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case 5:
                    body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case 6: case 7: case 8:
                    body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                default:
                    body = [WORK, CARRY, MOVE];
                    break;
            }
        } else {
            switch (stage) {
                case 6: case 7: case 8:
                    body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
                    break;
                default:
                    body = [WORK, WORK, WORK, CARRY, MOVE];
                    break;
            }
            
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
                    return (structure.structureType == STRUCTURE_STORAGE ||
                            structure.structureType == STRUCTURE_CONTAINER || 
                            structure.structureType == STRUCTURE_LINK) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (warehouse) {
                if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(warehouse, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if there are fewer than 2 upgraders. false otherwise
     **/
    // TODO: Make it so that 1 or 2 are desired when building is underway, 4 else.
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "upgrader"; 
        });
        let links = room.find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType == STRUCTURE_LINK;
            }
        });
        let desiredCount;
        if (links.length < 2) {
            desiredCount = 1;
            // desiredCount = 2;
            // desiredCount = 4;
        } else {
            // desiredCount = 1;
            desiredCount = 2;
        }
        return creeps.length < desiredCount;
    }
};

module.exports = roleUpgrader;