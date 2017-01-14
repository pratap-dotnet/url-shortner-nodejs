var DocumentDbClient = require('documentdb').DocumentClient;
var docDbUtils = require('./docDbUtils');
var encoder = require('./Base58Encoder');

var UrlDataAccess = function(documentDbClient,databaseId, collectionId){
    var self = this;
    self.collectionId = collectionId;
    self.documentDbClient = documentDbClient;
    self.databaseId = databaseId;
    
    self.database = null;
    self.collection = null;

    self.init = function(callback){
        docDbUtils.getOrCreateDatabase(documentDbClient,databaseId,function(err,database){
            if(err){
                callback(err);
            }
            self.database = database;

            docDbUtils.getOrCreateCollection(documentDbClient,self.database.__self, collectionId,function(err,collection){
                if(err){
                    callback(err);
                }
                self.collection = collection;
            });
        });
    };

    self.save = function(url,callback){

    };

    return self;
}

module.exports = UrlDataAccess;