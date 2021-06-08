var roleCleaner = {

    spawn: function() {
        let body = [WORK, CARRY, MOVE];
        let name = "cleaner-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "cleaner", unloading: true}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        
        let droppedResource = creep.room.findClosestByRange(FIND_DROPPED_RESOURCES);
        // if inventory is full or list of dropped recources is empty
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 || !droppedResource) {
            // set unloading to true
            creep.memory.unloading = true;
        } else if (creep.memory.unloading && creep.store.getUsedCapacity(RESOURCE_ENERGY) < 5) {
        // else if unloading is true and inventory is empty
            // set unloading to false
            creep.memory.unloading = false;
        }
        // if unloading
        if (creep.memory.unloading) { 
            // travel to a spawn, extension or tower and transfer it to that structure
            let structure = creep.room.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
        // else 
            // create list of dropped recourses
            let resource = creep.room.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (resource) {
            // if list exists
                // find closest dropped resource
                // harvest it
                if (creep.pickup(resouce) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
            // else // no dropped recouce
                //move to spawn
                creep.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleCleaner;