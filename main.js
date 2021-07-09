var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCleaner = require('role.cleaner');
var roleRepairer = require('role.repairer');
var roleCourier = require('role.courier');
var roleZerg = require('role.zerg');
var structureTower = require('structure.tower');
var structureLink = require('structure.link');
var _ = require('lodash');
var helper = require("helper");

const ROOM = "W29N5";
const ROLES = {
const STRUCTURES = {
    "tower" : {"module" : structureTower},
    "link" : {"module" : structureLink}
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

    let enemies = Game.rooms[ROOM].find(FIND_HOSTILE_CREEPS);
    let structures = Game.rooms[ROOM].find(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return (structure.structureType == STRUCTURE_TOWER ||
                    structure.structureType == STRUCTURE_LINK) &&
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