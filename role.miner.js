var roleMiner = {

    spawn: function() {
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

        let body = [WORK, WORK, WORK, CARRY, MOVE];
        let name = "miner-" + Game.time;
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
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });
            if (container && creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleMiner;