var roleMiner = {

    spawn: function(source) {
        let body = [WORK, WORK, WORK, MOVE];
        let name = "miner-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "miner", source_index: source}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        let sources = creep.room.find(FIND_SOURCES);
        let source = sources[creep.memory.source_index];
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        });
        if (container && creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleMiner;