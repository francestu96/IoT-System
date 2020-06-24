var mqtt = require('mqtt');
var mosca = require('mosca');
var settings = require('../appsettings')

module.exports = class BLEscanner{
  constructor(scannerDevice){
    this.people = 0;
    this.clientId = scannerDevice.clientId;
    this.topic = scannerDevice.topic;
    this.topicDesc = scannerDevice.topicDesc;
    this.clientSettings = {
      port: scannerDevice.port
    }
    this.startScanner();
  }

  startScanner(){
    var self = this;
    var scanner = new mosca.Server(this.clientSettings);
    var mqttClient = mqtt.connect(settings.mqttBrokerUrl, { clientId: this.clientId });
    mqttClient.publish(self.topic, JSON.stringify({ clientId: self.clientId, topic: self.topic, topicDesc: self.topicDesc, people: 0, date: Date.now(), port: self.clientSettings.port }));

    scanner.on('ready', function() {
      console.log(Date() + ' ' + self.clientId + ': ' + self.topic + ' is running...');
    });
    scanner.on('clientDisconnected', function() {
      mqttClient.publish(self.topic, JSON.stringify({ clientId: self.clientId, topic: self.topic, topicDesc: self.topicDesc, people: (self.people ? --self.people : 0), date: Date.now() }));
    });
    scanner.on('clientConnected', function() {
      mqttClient.publish(self.topic, JSON.stringify({ clientId: self.clientId, topic: self.topic, topicDesc: self.topicDesc, people: (++self.people), date: Date.now() }));
    });
  }
}