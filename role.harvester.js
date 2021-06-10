var roleHarvester = {

    spawn: function() {
        let body = [WORK, CARRY, MOVE];
        let name = "harvester-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "harvester"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            // harvest recourcez
            let source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if no couriers and no harvesters. false otherwise
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && 
            (creep.memory.role == "courier" || creep.memory.role == "harvester"); 
        });
        return creeps.length == 0;
    }
};

module.exports = roleHarvester;