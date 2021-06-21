var roleCleaner = {

    spawn: function(stage) {
        let body;
        switch (stage) {
            case 0:
                body = [WORK, CARRY, MOVE];
                break;
            case 1:
                body = [WORK, CARRY, CARRY, MOVE, MOVE];
                break;
            case 2:
                body = [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            case 3: 
                body = [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            case 4: 
                body = [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                break;
            default:
                body = [WORK, CARRY, MOVE];
                break;
        }
        let name = "cleaner-" + stage + "-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "cleaner", unloading: true}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        
        let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        // if inventory is full or list of dropped recources is empty
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.unloading = true;
        } else if (creep.memory.unloading && creep.store.getUsedCapacity(RESOURCE_ENERGY) < 5) {
            creep.memory.unloading = false;
        }
        if (creep.memory.unloading) { 
            // travel to a spawn, extension or tower and transfer it to that structure
            let structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            let resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            let ruin = creep.pos.findClosestByRange(FIND_RUINS, {
                filter: function(ruin) {
                    return ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (resource) {
                if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else if (ruin) {
                if (creep.withdraw(ruin) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ruin, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	},
    
    /** @param {Room} room 
     *  @return {boolean} true if no cleaners exist and there is something to pick up.
     *                    false otherwise
     **/
    spawnRequired: function(room) {
        return false;
        const searchCriteria = [FIND_DROPPED_RESOURCES, FIND_TOMBSTONES, FIND_RUINS];
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "cleaner"; 
        });
        if (creeps.length > 0) {
            return false;
        } else {
            for (let criteria in searchCriteria) {
                let targets = room.find(criteria, {
                    filter: function(target) {
                        return target.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets) {
                    return true;
                }
            }
            return false;
        }
    }
};

module.exports = roleCleaner;