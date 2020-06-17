var DbManager = require("./dbManager")
var mosca = require('mosca');
var WebSocketServer = require('websocket').server;
var http = require('http');
var settings = require('../appsettings');

module.exports = class Server{
  constructor(){
    this.dbManager = new DbManager();
    this.scanners = [];
    this.server = new mosca.Server(settings.serverSettings);
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
    this.server.on('ready', function() {
      console.log(Date() + ' Server is running...');
    });
    
    this.server.on('clientConnected', function(client) {
      console.log(Date() + ' ' + client.id + ' connected');
    });
    
    this.server.on('clientDisconnected', function(client) {
      console.log(Date() + ' ' + client.id + ' disconnected');
    });

    this.server.on('published', function(packet, client) {
      if(client && packet.topic){
        self.dbManager.insertData(JSON.parse(packet.payload));
      }    
    });
    
    this.webServer.listen(8080, function() {
      console.log((new Date()) + ' Web Server is listening on port 8080');
    });

    this.socketServer.on('request', function(request) {
      var connection = request.accept();
      console.log((new Date()) + ' Connection accepted.');

      setInterval(function() {
        self.dbManager.getData().then(function(promises) {        
          Promise.all(promises).then(function(res) {
            connection.send(JSON.stringify(res.map(x => { return { clientId: x.clientId, people: x.people, topicDesc: x.topicDesc, date: x.date}})));
          });
        });
      }, settings.dataRefreshMs);

      connection.on('close', function() {
          console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
      });
    });
  }
}