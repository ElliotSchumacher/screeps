
// Spawn harvester creep
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "harvester-" + Game.time, {memory: {role: "harvester"}});
// Spawn upgrader creep
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "upgrader-" + Game.time, {memory: {role: "upgrader"}});
// Spawn builder creep
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "builder-" + Game.time, {memory: {role: "builder"}});