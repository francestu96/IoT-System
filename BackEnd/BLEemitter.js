var mqtt = require('mqtt');
var settings = require('../appsettings')

module.exports = class BLEemitter {
  constructor(emitterDevice){
    this.scannerPortToConnectTo = -1;
    this.scannerConnectedTo = null;
    this.emitterId = emitterDevice.clientId;
    setInterval(this.startEmitter, settings.personRefreshMs, this);    
  }

  startEmitter(self){
    var auxScannerPort = Math.floor(Math.random() * (1885 - 1880) + 1880);
    if(auxScannerPort !== self.scannerPortToConnectTo){
      if(self.scannerConnectedTo){
        self.scannerConnectedTo.end();
      }

      self.scannerPortToConnectTo = auxScannerPort;
      this.clientSettings = {
        port: self.scannerPortToConnectTo,
        clientId: self.emitterId
      }

      self.scannerConnectedTo = mqtt.connect(settings.msqttUrl, this.clientSettings);
    }   
  }
}