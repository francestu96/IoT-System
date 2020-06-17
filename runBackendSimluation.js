var Server = require("./BackEnd/server");
var BLEscanner = require("./BackEnd/BLEscanner");
var BLEemitter = require("./BackEnd/BLEemitter");

new Server();

new BLEscanner({
    clientId: 'scanner-1',
    topic: "entranceTopic",
    topicDesc: "Entrance at ground floor",
    people: 0,
    port: 1880
});
new BLEscanner({
    clientId: 'scanner-2',
    topic: "exitTopic",
    topicDesc: "Exit at ground floor",
    people: 0,
    port: 1881
});
new BLEscanner({
    clientId: 'scanner-3',
    topic: 'firstFloorOfficeTopic',
    topicDesc: "Office at first floor",
    people: 0,
    port: 1882
});
new BLEscanner({
    clientId: 'scanner-4',
    topic: 'firstFloorBathTopic',
    topicDesc: "Bathroom at first floor",
    people: 0,
    port: 1883
});

new BLEemitter({
    clientId: 'emitter-1',
});
new BLEemitter({
    clientId: 'emitter-2',
});
// new BLEemitter({
//     clientId: 'emitter-3',
// });
// new BLEemitter({
//     clientId: 'emitter-4',
// });
// new BLEemitter({
//     clientId: 'emitter-5',
// });
// new BLEemitter({
//     clientId: 'emitter-6',
// });
// new BLEemitter({
//     clientId: 'emitter-7',
// });
// new BLEemitter({
//     clientId: 'emitter-8',
// });
// new BLEemitter({
//     clientId: 'emitter-9',
// });
// new BLEemitter({
//     clientId: 'emitter-10',
// });