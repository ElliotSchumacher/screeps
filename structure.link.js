var structureLink = {

    /** @param {Link} link **/
    run: function(link) {
        let isSenderLink = Game.getObjectById(link.room.memory.links[link.id]) != undefined;
        if (isSenderLink) {
            let targetLink = Game.getObjectById(link.room.memory.links[link.id].targetLink);
            let currentStore = link.store.getUsedCapacity(RESOURCE_ENERGY);
            if (currentStore > 0) {
                link.transferEnergy(targetLink);
            }
        }
	}
};

module.exports = structureLink;