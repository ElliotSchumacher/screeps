var roleZerg = {

	spawn: function(stage) {
        let body;
        switch (stage) {
            case 0:
                body = [TOUGH, MOVE, ATTACK];
                break;
            case 1:
                body = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK];
                break;
            case 2:
                body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK];
                break;
            case 3:
                body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK];
                break;
            case 4: case 5: case 6:
                body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK];
                break;
            default:
                body = [TOUGH, MOVE, ATTACK];
                break;
        }
        let name = "zerg-" + stage + "-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "zerg"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (enemy) {
            if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy);
            }
        } else {
            let idleFlags = creep.room.find(FIND_FLAGS, {
                filter: function(flag) {
                    return flag.name == "idle";
                }
            });
            if(idleFlags.length > 0) {
                creep.moveTo(idleFlags[0]);
            }
        }
	},

    /** @param {Room} room 
     *  @return {boolean} true if construction site exists and builders are less
     *                    than 1. false otherwise
     **/
    spawnRequired: function(room) {
        let creeps = _.filter(Game.creeps, function(creep) {
            return creep.room == room && creep.memory.role == "zerg"; 
        });
        let hostiles = room.find(FIND_HOSTILE_CREEPS);
        return (hostiles.length > 0) && (creeps.length < 5);
    }
};

module.exports = roleZerg;