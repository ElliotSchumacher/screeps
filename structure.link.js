var structureLink = {

    /** @param {Link} link **/
    run: function(link) {
        let linkData = link.room.memory.links[link.id];
        let isSenderLink = linkData != undefined;
        // console.log("linkId: " + link.id);
        // console.log("linkData: " + linkData);
        // console.log("isSenderLink: " + isSenderLink);
        if (isSenderLink) {
            let targetLink = Game.getObjectById(linkData.targetLink);
            let currentStore = link.store.getUsedCapacity(RESOURCE_ENERGY);
            if (currentStore > 0) {
                // console.log(link.transferEnergy(targetLink));
                link.transferEnergy(targetLink)
            }
        }
	}
};

module.exports = structureLink;