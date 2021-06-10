var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCleaner = require('role.cleaner');
var roleRepairer = require('role.repairer');
var _ = require('lodash');

const ROLES = {
    "harvester" : {"counts": 1, "module": roleHarvester},
    "upgrader" : {"counts": 2, "module": roleUpgrader},
    "builder" : {"counts": 0, "module": roleBuilder},
    "miner" : {"counts": 2, "module": roleMiner},
    "cleaner" : {"counts": 1, "module": roleCleaner},
    "repairer" : {"counts": 3, "module": roleRepairer}
};

module.exports.loop = function () {

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

    let spawn = Game.spawns["Spawn1"];
    // if not already spawning
    if (!spawn.spawning) {
        // Adds creeps that need to be spawned to a queue for the spawner
        if (spawn.memory.queue.length <= 0) {
            //get all creeps
            let creeps = Game.creeps;
            //count number of each role.
            for (let role in ROLES) {
                // console.log("role:" + role);
                let currentRoleCount  = _.filter(creeps, function(creep) {
                    return creep.memory.role == role;
                });
                //if count for role is too small
                let missingCreeps = ROLES[role].counts - currentRoleCount.length;
                for (let creepAdded = 0; creepAdded < missingCreeps; creepAdded++) {
                    spawn.memory.queue.push(role);
                }
            }
        } else if (spawn.memory.queue.length > 0) {
            let role = spawn.memory.queue.shift();
            ROLES[role].module.spawn();
        }
    }

    for(var name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        ROLES[role].module.run(creep);
    }
}