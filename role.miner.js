var roleMiner = {

    spawn: function(stage) {
        let homeRoomName = Memory.homeRoom
        let sourceCount = Game.rooms[homeRoomName].find(FIND_SOURCES).length;
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
                body = [WORK, WORK, WORK, WORK, CARRY, MOVE];
                break;
            case 2:
                body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
                break;
            case 3:
                body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
                break;
            case 4: case 5: case 6: case 7: case 8:
                body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
                break;
            default:
                body = [WORK, WORK, WORK, CARRY, MOVE];
                break;
        }
        let name = "miner-" + stage + "-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "miner",
                                                      sourceIndex: sourceIndex, link: false}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        let flags = creep.room.find(FIND_FLAGS, {
            filter: function (flag) {
                return flag.name == "miner" + creep.memory.sourceIndex;
            }
        });

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            let sources = creep.room.find(FIND_SOURCES);
            let source = sources[creep.memory.sourceIndex];
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(flags[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 5) {
            let warehouses = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                           structure.store.getFreeCapacity() > 0;
                }
            });
            if (warehouses.length > 0) {
                warehouses = warehouses.sort(function(struct1, struct2) {
                    let portionFull1 = struct1.store.getUsedCapacity(RESOURCE_ENERGY) / 
                                    struct1.store.getCapacity(RESOURCE_ENERGY);
                    let portionFull2 = struct2.store.getUsedCapacity(RESOURCE_ENERGY) /
                                    struct2.store.getCapacity(RESOURCE_ENERGY);
                    return portionFull1 - portionFull2;
                });
                let lowestWarehousePortion = warehouses[0].store.getUsedCapacity(RESOURCE_ENERGY) /
                                            warehouses[0].store.getCapacity(RESOURCE_ENERGY);
                if (lowestWarehousePortion > 0.9) {
                    if (creep.memory.link) {
                        this.transferToLink(creep);
                    } else {
                        if (warehouses[0] && creep.transfer(warehouses[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(warehouses[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                    creep.memory.link = !creep.memory.link;
                } else {
                    if (warehouses[0] && creep.transfer(warehouses[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(warehouses[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else {
                this.transferToLink(creep);
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if number of miners is less than number of sources.
     *                    false otherwise
     **/
    // TODO: Instead of checking the number of warehouses in the room, only check how many
    // flags have warehouses adjacent to them. This will prevent miners from being spawned to
    // harvest sources that don't have any adjacent containers preventing idle miners.
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "miner"; 
        });
        let sources = room.find(FIND_SOURCES);
        let warehouses = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_STORAGE;
            }
        });
        let warehouseCount = warehouses.length; 
        return creeps.length < sources.length && room.memory.stage > 0 && creeps.length < warehouseCount;
    },

    transferToLink: function(creep) {
        let links = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: function (structure) {
                return structure.structureType == STRUCTURE_LINK;
            }
        });
        let status = creep.transfer(links[0], RESOURCE_ENERGY)
        if (status == ERR_NOT_IN_RANGE) {
            creep.moveTo(flags[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return status == OK;
    }
};

module.exports = roleMiner;