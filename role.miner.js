var roleMiner = {

    spawn: function(stage) {
        let sourceCount = Game.rooms["W29N5"].find(FIND_SOURCES).length;
        let livingMiners = _.filter(Game.creeps, function(creep) {
            return creep.memory.role == "miner";
        });
        let sourceIndex;
        if (livingMiners.length == 0) {
            sourceIndex = 0;
        } else {
            let livingMinersSource = livingMiners[0].memory.sourceIndex;
            sourceIndex = (livingMinersSource + 1) % sourceCount;
        }

        let body;
        switch (stage) {
            case 1:
                body = [WORK, WORK, WORK, CARRY, MOVE];
                break;
            case 2:
                body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
                break;
            case 3:
                body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
                break;
            case 4:
                body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
                break;
            default:
                body = [WORK, WORK, WORK, CARRY, MOVE];
                break;
        }
        let name = "miner-" + stage + "-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "miner", sourceIndex: sourceIndex}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        let sources = creep.room.find(FIND_SOURCES);
        let source = sources[creep.memory.sourceIndex];
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 5) {
            let warehouses = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                           structure.store.getFreeCapacity() > 0;
                }
            });
            if (warehouses[0] && creep.transfer(warehouses[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(warehouses[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if number of miners is less than number of sources.
     *                    false otherwise
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "miner"; 
        });
        let sources = room.find(FIND_SOURCES);
        return creeps.length < sources.length && room.memory.stage > 0;
    }
};

module.exports = roleMiner;