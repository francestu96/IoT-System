var settings = require('../appsettings');
const MongoClient = require('mongodb').MongoClient;
const EventEmitter = require('events');

module.exports = class DbManager {
  constructor(){
    this.dbInitilisedEmitter = new EventEmitter();
    var self = this; 
    MongoClient.connect(settings.dbUrl, { useUnifiedTopology: true }, function(err, client) {
      if(err) throw err;
    
      self.db = client.db(settings.dbName);
      const fillDatabasePromises = [];
      const adminDb = client.db(settings.dbName).admin();
      adminDb.listDatabases(function(err, dbs) {
        if(err) throw err;
    
        if(!dbs.databases.map(x => x.name).includes(settings.dbName)){
          console.log(settings.dbName + " not exists");
          self.initDB(fillDatabasePromises);

          Promise.all(fillDatabasePromises)
          .then(() => { 
            console.log(settings.dbName + " succesfully created");
            self.dbInitilisedEmitter.emit('initilised');
          })
          .catch((err) => { throw err });
        }
        else{
          console.log(settings.dbName + " already exists");
          self.dbInitilisedEmitter.emit('initilised');
        }        
      });
    });
  }

  initDB(promises) {
    promises.push(new Promise((resolve, reject) => {
      this.db.createCollection(settings.dbEmittersCollection, function(err, res) {
        if (err) reject(err);
        console.log("  " + settings.dbEmittersCollection + " collection created!");
    
        res.insertMany(settings.emitterValues, function(err, values) {
          if (err) reject(err);
          console.log("  Number of emitters inserted: " + values.insertedCount);
          resolve();
        });
      });
    }));
  
    promises.push(new Promise((resolve, reject) => {
      this.db.createCollection(settings.dbDataCollection, function(err, res) {
        if (err) reject(err);
        console.log("  " + settings.dbDataCollection + " collection created!");
        resolve();
      });
    }));
  }

  getData(){
    var promises = [];
    return this.db.collection(settings.dbDataCollection).distinct("clientId").then(res => {
      for(var clientId of res){
          promises.push(this.db.collection(settings.dbDataCollection).findOne({ clientId: clientId }, { sort: { date: -1 }}));
      }
      return promises;
    });
  }

  insertData(data){
    this.db.collection(settings.dbDataCollection).insertOne(data, function(err) {
      if (err) throw err;
    });
    
  }

  removeData(scannerId){
    this.db.collection(settings.dbScannersCollection).deleteMany({ clientId: scannerId}, function(err) {
      if (err) throw err;
    });
  }
}