var structureLink = {

    /** @param {Link} link **/
    run: function(link) {
        let targetLink = link.memory.targetLink;
        if (link.memory.targetLink) {
            let currentStore = link.store.getUsedCapacity(RESOURCE_ENERGY);
            if (!link.memory.lastFillTick) {
                link.memory.lastFillTick = Game.time;
            } else if (Game.time - link.memory.lastFillTick > 15 && currentStore > 0) {
                if (link.transferEnergy(targetLink) != ERR_TIRED) {
                    link.memory.lastFillTick = Game.time;
                }
            }
        }
	}
};

module.exports = structureLink;

// Out of date
// link.room.memory = {
//     links : {
//         objectId: ObjectIdOfReceiver
//     }
// };