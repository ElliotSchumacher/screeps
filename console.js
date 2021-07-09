// Spawn harvester creep
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "harvester-" + Game.time, {memory: {role: "harvester"}});
// Spawn upgrader creep
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "upgrader-" + Game.time, {memory: {role: "upgrader"}});
// Spawn builder creep
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "builder-" + Game.time, {memory: {role: "builder"}});

// Setup links in memory
let linkId = "60dc1767ec9a30f246663a1f";
Game.getObjectById(linkId).room.memory.links = {};
//sets link with given Id to have a recieving link
let linkId = "60d56941e23798bd2b543fdb";
let recievingLinkId = "60d59f94803fd459a4af7d44";
Game.getObjectById(linkId).room.memory.links[linkId] = {};
Game.getObjectById(linkId).room.memory.links[linkId].targetLink = recievingLinkId;

// Set a deposit location
Memory.deposits = [];
Memory.deposits[0] = {id: "60e37a59f2f3bc0ef7d80ea5", resourceType: RESOURCE_SILICON};

// Set home room
Memory.homeRoom = "W29N5";

// Prints total damage for a room
let room = Game.rooms["W29N5"];
let damagedStructures = room.find(FIND_STRUCTURES, {
    filter: function (structure) {
        return (structure.hitsMax - structure.hits > 0) && 
                structure.structureType != STRUCTURE_WALL;
    }
});
let totalDamage = 0;
console.log(damagedStructures);
console.log(damagedStructures.length);
console.log(damagedStructures[0].hitsMax - damagedStructures[0].hits);
console.log(totalDamage);
for (let index = 0; index < damagedStructures.length; index++) {
    let structure = damagedStructures[index];
    console.log(structure);
    totalDamage = totalDamage + (structure.hitsMax - structure.hits);
    console.log(totalDamage);
}
console.log("totalDamage: " + totalDamage);

// Prints out all roles
const ROLES = {
    "harvester" : {"counts": 0, "priority": 0},
    "upgrader" : {"counts": 2, "priority": 5},
    "builder" : {"counts": 1, "priority": 4},
    "miner" : {"counts": 2, "priority": 2},
    "cleaner" : {"counts": 0, "priority": 6},
    "repairer" : {"counts": 1, "priority": 2},
    "courier" : {"counts": 1, "priority": 3}
};
for (let role in ROLES) {
    console.log(role);
}

//Sorts roles by priority
const ROLES = {
    "harvester" : {"counts": 0, "priority": 0},
    "upgrader" : {"counts": 2, "priority": 5},
    "builder" : {"counts": 1, "priority": 4},
    "miner" : {"counts": 2, "priority": 2},
    "cleaner" : {"counts": 0, "priority": 6},
    "repairer" : {"counts": 1, "priority": 2},
    "courier" : {"counts": 1, "priority": 3}
};
let roles = Object.keys(ROLES).sort(function(role1, role2) {
    console.log("role1: " + role1);
    console.log("role2: " + role2);
    return ROLES[role1].priority - ROLES[role2].priority;
});