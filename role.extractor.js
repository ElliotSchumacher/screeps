var roleExtractor = {

    spawn: function(stage) {
        let body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
        let name = "extractor-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "extractor"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        let minerals = creep.room.find(FIND_MINERALS);
        if (minerals.length > 0) {
            let mineral = minerals[0];
            let flags = creep.room.find(FIND_FLAGS, {
                filter: function(flag) {
                    return flag.name == "extractor";
                }
            });
            if (creep.store.getFreeCapacity(mineral.mineralType) > 0) {
                if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(flags[0], {visualizePathStyle: {stroke: '#ffaa00'}});                }
            }
            if (creep.store.getUsedCapacity(mineral.mineralType) > 0) {
                let terminals = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: function(structure) {
                        return structure.structureType == STRUCTURE_TERMINAL;
                    }
                });
                if (creep.transfer(terminals[0], mineral.mineralType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(flags[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} 
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.memory.role == "extractor" && room == creep.room;
        });
        let extractorStructure = room.find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType == STRUCTURE_EXTRACTOR;
            }
        });
        let mineral = room.find(FIND_MINERALS)[0];
        return (creeps.length < 1 && extractorStructure.length > 0) &&
                mineral.mineralAmount > 0;
    }
};

module.exports = roleExtractor;