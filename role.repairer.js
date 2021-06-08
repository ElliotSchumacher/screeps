var roleRepairer = {

	spawn: function() {
        let body = [WORK, CARRY, MOVE];
        let name = "repairer-" + Game.time;
        Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: "repairer"}});
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.store(RESOURCE_ENERGY) < 5) {
            //find closest container or source[0]
            // go to it
            // fill up on energy
        } else if (something needs repair){

        }
	}
};

module.exports = roleBuilder;