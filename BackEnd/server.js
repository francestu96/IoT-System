var DbManager = require("./dbManager")
var mqtt = require('mqtt');
var WebSocketServer = require('websocket').server;
var http = require('http');
var settings = require('../appsettings');

module.exports = class Server{
  constructor(){
    this.refreshTimeSeconds = 2;
    this.dbManager = new DbManager();
    this.scanners = [];
    this.mqttClient = mqtt.connect(settings.mqttBrokerUrl);
    this.webServer = http.createServer(function(request, response) {
      console.log((new Date()) + 'Web server received request for ' + request.url);
      response.writeHead(200, {'Content-Type':'text/plain'});
      response.end();
    });
    this.socketServer = new WebSocketServer({
      httpServer: this.webServer,
      autoAcceptConnections: false
    });
    var self = this;
    this.dbManager.dbInitilisedEmitter.on('initilised', function() {
      self.startServer();
    });
  }

  startServer(){    
    var self = this;
    this.mqttClient.on('connect', function() {
      console.log(Date() + ' Server connected to mqtt broker');

      self.mqttClient.subscribe(settings.rooms, function(err){
        if (!err) {
          self.mqttClient.on('message', function (topic, message){
            self.dbManager.insertData(JSON.parse(message.toString()));
          });
        }
      });      
    });
    
    this.webServer.listen(8080, function() {
      console.log((new Date()) + ' Web Server is listening on port 8080');
    });

    this.socketServer.on('request', function(request) {
      var connection = request.accept();
      console.log((new Date()) + ' Client connection accepted.');

      var timer = setInterval(function(){ self.sendData(self.dbManager, connection) }, 5000);

      connection.on('message', function(message) {
        if (message.type === 'utf8') {
            clearInterval(timer); 
            timer = setInterval(function(){ self.sendData(self.dbManager, connection) }, parseInt(JSON.parse(message.utf8Data)[0].people) * 1000);
          }
      });

      connection.on('close', function() {
          console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
      });
    });
  }

  sendData(dbManager, connection) {
    dbManager.getData().then(function(promises) {          
      Promise.all(promises).then(function(res) {
        connection.send(JSON.stringify(res.map(x => { return { clientId: x.clientId, people: x.people, topicDesc: x.topicDesc, date: x.date}})));
      });
    });  
  }
}