var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var creepFunctions = require('creepFunctions');

module.exports.loop = function () {

    // deletes old creeps from memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    _.forEach(Game.rooms, function (room) {
        // let room = Game.rooms[roomName];
        if (room && room.controller && room.controller.my) {
            let harvesterTarget = _.get(room.memory, ['census', 'harvester'], 2);

            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            console.log('Harvesters: ' + harvesters.length);

            if (harvesters.length < harvesterTarget) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                    { memory: { role: 'harvester' } });
            }

            let upgraderTarget = _.get(room.memory, ['census', 'upgrader'], 2);

            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            console.log('Upgraders: ' + upgraders.length);

            if (upgraders.length < upgraderTarget) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                    { memory: { role: 'upgrader' } });
            }

            let builderTarget = _.get(room.memory, ['census', 'builder'], 2);

            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            console.log('Builders: ' + builders.length);
            var sites = room.find(FIND_CONSTRUCTION_SITES);
            if (sites.length > 0 && builders.length < builderTarget) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                    { memory: { role: 'builder' } });
            }
        }
    })


    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}