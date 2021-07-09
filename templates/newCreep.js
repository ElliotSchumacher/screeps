var role_____ = {

    spawn: function(stage) {
        let body = [WORK, CARRY, MOVE];
        let name = "_____-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "_____"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

	},

    /** @param {Room} room 
     *  @return {boolean} 
     **/
    spawnRequired: function(room) {
        
    }
};

module.exports = role_____;