var structureTerminal = {
    RESOURCES: [
        {"name": RESOURCE_OXYGEN, "minimumPrice": 0.41},
        {"name": RESOURCE_SILICON, "minimumPrice": 60.0},
        {"name": RESOURCE_ENERGY, "minimumPrice": 0.602}
    ],

    /** @param {Terminal} terminal **/
    run: function(terminal) {
        let energy = terminal.store.getUsedCapacity(RESOURCE_ENERGY);
        if (energy > 10000 && terminal.cooldown == 0) {
            for (let index = 0; index < this.RESOURCES.length; index++) {
                let resource = this.RESOURCES[index].name;
                console.log(resource + " " + terminal.store.getUsedCapacity(resource));
            }
            // console.log(minerals);
        }
	}
};

module.exports = structureTerminal;