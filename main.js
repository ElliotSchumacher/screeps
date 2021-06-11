var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCleaner = require('role.cleaner');
var roleRepairer = require('role.repairer');
var roleCourier = require('role.courier');
var _ = require('lodash');
var helper = require("helper");

const ROOM = "W29N5";
const ROLES = {
    "harvester" : {"counts": 0, "priority": 0, "module": roleHarvester},
    "upgrader" : {"counts": 2, "priority": 5, "module": roleUpgrader},
    "builder" : {"counts": 1, "priority": 4, "module": roleBuilder},
    "miner" : {"counts": 2, "priority": 2, "module": roleMiner},
    "cleaner" : {"counts": 0, "priority": 6, "module": roleCleaner},
    "repairer" : {"counts": 1, "priority": 2, "module": roleRepairer},
    "courier" : {"counts": 1, "priority": 3, "module": roleCourier}
};

let prioritizedRoles;

module.exports.loop = function () {
    // Perform setup commands
    if (!prioritizedRoles) {
        prioritizedRoles = helper.prioritizeRoles(ROLES);
    }
    // Generate pixels
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    // Remove dead screeps from memmory
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Deleted creep memory with name " + name);
        }
    }
    // Set room stage
    let room = Game.rooms[ROOM];
    let extensionCount = room.find(FIND_MY_STRUCTURES, {
        filter: function(structure) { return structure.structureType == STRUCTURE_EXTENSION}
    }).length;
    let stage = Math.floor(extensionCount / 5);
    // console.log("extensionCount: " + extensionCount);
    // console.log("stage: " + stage);
    room.memory.stage = stage;

    let spawn = Game.spawns["Spawn1"];
    // if not already spawning
    if (!spawn.spawning) {
        let index = 0;
        let spawnRoleFound = false;
        // console.log("NOT SPAWNING");
        // console.log("prioritizedRoles.length: " + prioritizedRoles.length);
        while (index < prioritizedRoles.length && !spawnRoleFound) {
            let role = prioritizedRoles[index];
            // console.log("role: " + role);
            // console.log(ROLES[role]);
            let shouldSpawn = ROLES[role].module.spawnRequired(room);
            // console.log("shouldSpawn: " + role + ": " + shouldSpawn);
            if (shouldSpawn) {
                // TODO: add stage parameter to spawn method call
                ROLES[role].module.spawn(room.memory.stage);
                spawnRoleFound = true;
                // prioritizedRoles = helper.prioritizeRoles(ROLES);
            }
            index++;
        }
    }

    for(var name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        ROLES[role].module.run(creep);
    }
}