var roleRetriever = {

    spawn: function(stage) {
        let body = [WORK, CARRY, MOVE];
        let name = "retriever-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "retriever"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        let depositData = Memory.deposits[0];
        if (depositData) {
            let resourceType = depositData.resourceType;
            if (creep.store.getUsedCapacity(resourceType) == 0) {
                let deposit = Game.getObjectById(depositData.id);
                if (deposit) {
                    if (creep.harvest(deposit) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(deposit, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    let flag = Game.flags["deposit"];
                    creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let homeRoomName = Memory.homeRoom;
                // console.log(homeRoomName);
                if (creep.room == Game.rooms[homeRoomName]) {
                    let warehouse = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: function(structure) {
                            return (structure.structureType == STRUCTURE_TERMINAL ||
                                    structure.structureType == STRUCTURE_STORAGE) &&
                                    structure.store.getFreeCapacity(resourceType) > 0;
                        }
                    });
                    if (creep.transfer(warehouse, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(warehouse, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    let homeSpawner = Game.spawns["Spawn1"];
                    creep.moveTo(homeSpawner, {visualizePathStyle: {stroke: '#ffaa00'}})
                }
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} 
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.memory.role == "retriever";
        });
        let depositExists = Memory.deposits[0] != null;
        return creeps.length == 0 && depositExists;
    }
};

module.exports = roleRetriever;