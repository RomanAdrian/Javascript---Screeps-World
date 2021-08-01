function findEnergySources(creep) {
    let sources = creep.room.find(FIND_SOURCES);
    if (sources.length) {
        creep.memory.source = sources[0].id;
        return sources[0];
    }
}

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        if (creep.memory.working) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            let source = Game.getObjectById(creep.memory.source) || creep.findEnergySources();
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleUpgrader;