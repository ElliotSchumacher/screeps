var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCleaner = require('role.cleaner');
var roleRepairer = require('role.repairer');
var roleCourier = require('role.courier');
var roleZerg = require('role.zerg');
var roleRetriever = require('role.retriever');
var roleExtractor = require('role.extractor');
var structureTower = require('structure.tower');
var structureLink = require('structure.link');
var structureTerminal = require('structure.terminal');
var _ = require('lodash');
var helper = require("helper");

// Possible good room "W8S41"
const ROOM = "E54N9";
Memory.homeRoom = ROOM;
const ROLES = {
    "harvester": {"counts": 0, "priority": 0, "module": roleHarvester},
    "upgrader": {"counts": 2, "priority": 5, "module": roleUpgrader},
    "builder": {"counts": 1, "priority": 4, "module": roleBuilder},
    "miner": {"counts": 2, "priority": 2, "module": roleMiner},
    "cleaner": {"counts": 0, "priority": 6, "module": roleCleaner},
    "repairer": {"counts": 1, "priority": 2, "module": roleRepairer},
    "courier": {"counts": 1, "priority": 3, "module": roleCourier},
    "zerg": {"counts": 5, "priority": 1, "module": roleZerg},
    "retriever": {"counts": 1, "priority": 7, "module": roleRetriever},
    "extractor": {"counts": 1, "priority": 6, "module": roleExtractor}
};
const STRUCTURES = {
    "tower" : {"module" : structureTower},
    "link" : {"module" : structureLink},
    "terminal" : {"module" : structureTerminal}
};

let prioritizedRoles;

module.exports.loop = function () {
    // Perform setup commands
    if (!prioritizedRoles) {
        prioritizedRoles = helper.prioritizeRoles(ROLES);
    }
    // Print amount in cpu bucket
    if (Game.time % 60 == 0) {
        console.log("CPU bucket: " + Game.cpu.bucket);
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

    let enemies = Game.rooms[ROOM].find(FIND_HOSTILE_CREEPS);
    let structures = Game.rooms[ROOM].find(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return (structure.structureType == STRUCTURE_TOWER ||
                    structure.structureType == STRUCTURE_LINK ||
                    structure.structureType == STRUCTURE_TERMINAL) &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 10;
        }
    });
    for (let index = 0; index < structures.length; index++) {
        STRUCTURES[structures[index].structureType].module.run(structures[index], enemies);
    };

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
                ROLES[role].module.spawn(room.memory.stage, room);
                spawnRoleFound = true;
                // prioritizedRoles = helper.prioritizeRoles(ROLES);
            }
            index++;
        }
    }

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        ROLES[role].module.run(creep);
    }
}