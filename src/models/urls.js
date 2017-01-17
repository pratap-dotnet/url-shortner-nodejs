var DocumentDbClient = require('documentdb').DocumentClient;
var docDbUtils = require('./docDbUtils');
var encoder = require('./Base58Encoder');

var UrlDataAccess = function(documentDbClient){
    var self = this;
    const collectionId = 'Urls',databaseId = 'UrlShortner',counterCollectionId = 'counter';
    var client = documentDbClient;
    
    self.currentCountDoc = null;
    self.database = null;
    self.urlcollection = null;
    self.counterCollection = null;

    self.init = function(callback){
        docDbUtils.getOrCreateDatabase(client, databaseId,function(err,database){
            if(err){
                callback(err);
            }
            self.database = database;

            docDbUtils.getOrCreateCollection(client,self.database._self, collectionId,function(err,collection){
                if(err){
                    callback(err);
                }
                self.urlcollection = collection;
            });

            docDbUtils.getOrCreateCollection(client, self.database._self, counterCollectionId, function(err,collection){
                if(err){
                    callback(err);
                }
                self.counterCollection = collection;
                initCounter(function(err){
                    if(err)
                        callback(err);
                });
            })
        });
    };

    self.save = function(url,callback){
        self.currentCountDoc.count  += 1;
        var urlItem = {
            url: url,
            id: encoder.encode(self.currentCountDoc.count),
            addedDate : new Date().toString()
        };
        
        client.createDocument(self.urlcollection._self,urlItem,function(err,doc){
            if(err){
                callback(err);
            }else{
                client.replaceDocument(self.currentCountDoc._self, self.currentCountDoc, function(err,countDoc){
                    self.currentCountDoc = countDoc;
                    callback(null,doc);
                });
            }
        });
    };

    self.find = function(id, callback){
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters : [{
                name: '@id',
                value: id
            }]
        };

        client.queryDocuments(self.urlcollection._self,querySpec).toArray(function(err,doc){
            if(err){
                callback(err);
            }else{
                if(doc.length > 0)
                    callback(null, doc[0].url);
                else 
                    callback(null,null);
            }
        });
    };

    self.findByUrl = function(url, callback){
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.url=@url',
            parameters : [{
                name: '@url',
                value: url
            }]
        };

        client.queryDocuments(self.urlcollection._self,querySpec).toArray(function(err,doc){
            if(err){
                callback(err);
            }else{
                callback(null, doc);
            }
        });
    };


    function initCounter(callback){
        //Load current count document if available
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters : [{
                name: '@id',
                value: '1'
            }]
        };
        client.queryDocuments(self.counterCollection._self,querySpec).toArray(function(err,results){
            if(err){
                callback(err);
            }else{
                if(results.length == 0){
                    //insert new value
                    client.createDocument(self.counterCollection._self,{id:'1',count:100000},function(err,doc){
                        if(err){
                            callback(err);
                        }
                        self.currentCountDoc = doc;
                    });
                }else{
                    //return old value
                    self.currentCountDoc = results[0];
                }
            }
        });
    };

    return self;
}

module.exports = UrlDataAccess;