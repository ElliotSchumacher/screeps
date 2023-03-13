var roleBuilder = {

	spawn: function(stage) {
        let body;
        switch (stage) {
            case 0:
                body = [WORK, CARRY, MOVE];
                break;
            case 1:
                body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            case 2:
                body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                break;
            case 3:
                body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                break;
            case 4:
                body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            case 5: case 6: case 7: case 8:
                body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                break;
            default:
                body = [WORK, CARRY, MOVE];
                break;
        }
        let name = "builder-" + stage + "-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "builder"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    } else {
            let warehouse = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                           structure.store.getUsedCapacity() > 0;
                }
            });
            if (warehouse) {
                if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(warehouse, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                // let source = creep.pos.findClosestByRange(FIND_SOURCES);
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if construction site exists and builders are less
     *                    than 1. false otherwise
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "builder"; 
        });
        return creeps.length < 2 && (room.find(FIND_CONSTRUCTION_SITES).length > 0);
    }
};

module.exports = roleBuilder;