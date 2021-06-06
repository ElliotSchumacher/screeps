var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var _ = require('lodash');

const HARVESTER_COUNT = 2;
const UPGRADER_COUNT = 1;
const BUILDER_COUNT = 1;
const ROLES = ["harvester", "upgrader", "builder"];
const ROLE_COUNTS = {
    "harvester" : 2,
    "upgrader" : 3,
    "builder" : 2,
    "miner" : 2
};

module.exports.loop = function () {

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
            for (let index = 0; index < ROLES.length; index++) {
                let role = ROLES[index];
                let currentRoleCount  = _.filter(creeps, function(creep) {
                    return creep.memory.role == role;
                });
                //if count for role is too small
                let missingCreeps = ROLE_COUNTS[role] - currentRoleCount.length;
                for (let creepAdded = 0; creepAdded < missingCreeps; creepAdded++) {
                    spawn.memory.queue.push(role);
                }
            }
        } else {
            let role = spawn.memory.queue.shift();
            switch (role) {
                case "harvester":
                    roleHarvester.spawn();
                    break;
                case "upgrader":
                    roleUpgrader.spawn();
                    break;
                case "builder":
                    roleBuilder.spawn();
                    break;
                case "miner":
                    roleMiner.spawn();
                    break;
                default:
                    console.log("An invalid role has been chosen");
            }
        }
    }



    for(var name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        switch (role) {
            case "harvester":
                roleHarvester.run(creep);
                break;
            case "upgrader":
                roleUpgrader.run(creep);
                break;
            case "builder":
                roleBuilder.run(creep);
                break;
            case "miner":
                roleMiner.run(creep);
                break;
            default:
                console.log("An invalid role has been chosen");
        }
    }
}