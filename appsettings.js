const entranceTopic = "groundFloor/entrance";
const exitTopic = "groundFloor/exit";
const firstFloorOfficeTopic = "firstFloor/office";
const firstFloorBathTopic = "firstFloor/bath";
const secondFloorOfficeTopic = "secondFloor/office";
const secondFloorBathTopic = "secondFloor/bath";
const mobileTopic = "mobile";

const dbEmittersCollection = 'emitters';
const dbDataCollection = 'data';
const emitterValues = [
  {
    clientId: 'emitter-1',
  },
  {
    clientId: 'emitter-2',
  },
  {
    clientId: 'emitter-3',
  },
  {
    clientId: 'emitter-4',
  },
  {
    clientId: 'emitter-5',
  },
  {
    clientId: 'emitter-6',
  },
  {
    clientId: 'emitter-7',
  }
]
const scannerValues = [
  {
    clientId: 'scanner-1',
    topic: entranceTopic,
    topicDesc: "Entrance at ground floor",
    people: 0,
    port: 1880
  },
  {
    clientId: 'scanner-2',
    topic: exitTopic,
    topicDesc: "Exit at ground floor",
    people: 0,
    port: 1881
  },
  {
    clientId: 'scanner-3',
    topic: firstFloorOfficeTopic,
    topicDesc: "Office at first floor",
    people: 0,
    port: 1882
  },
  {
    clientId: 'scanner-4',
    topic: firstFloorBathTopic,
    topicDesc: "Bathroom at first floor",
    people: 0,
    port: 1883
  },
  {
    clientId: 'scanner-5',
    topic: secondFloorOfficeTopic,
    topicDesc: "Office at second floor",
    people: 0,
    port: 1884
  },
  {
    clientId: 'scanner-6',
    topic: secondFloorBathTopic,
    topicDesc: "Bathroom at second floor",
    people: 0,
    port: 1885
  }
]

module.exports = {
  dbEmittersCollection: dbEmittersCollection,
  dbDataCollection: dbDataCollection,
  emitterValues: emitterValues,
  scannerValues: scannerValues,

  webUrl: 'ws://127.0.0.1:8080/',
  mqttUrl: 'mqtt://127.0.0.1/',
  mqttBrokerUrl: 'mqtt://test.mosquitto.org',
  dbUrl: 'mongodb://localhost:27017/',
  dbName: 'IoT-DB',
  datasetSize: 10,
  peopleLimit: 2,
  personRefreshMs: 10000,
  dataRefreshMs: 5000,
  entranceTopic: entranceTopic,
  exitTopic: exitTopic,
  firstFloorOfficeTopic: firstFloorOfficeTopic,
  firstFloorBathTopic: firstFloorBathTopic,
  secondFloorOfficeTopic: secondFloorOfficeTopic,
  secondFloorBathTopic: secondFloorBathTopic,
  rooms: [mobileTopic, entranceTopic, exitTopic, firstFloorBathTopic, firstFloorOfficeTopic, secondFloorBathTopic, secondFloorOfficeTopic],

  serverSettings: {
    port: 1900
  },   
  scannerController: 'scanner',
  dataController: 'data',
  clientSettings: {}
}