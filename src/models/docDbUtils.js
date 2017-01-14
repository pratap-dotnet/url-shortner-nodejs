var DocumentDbClient = require('documentdb').DocumentClient;

var DocDbUtils = {
    getOrCreateDatabase: function(client, databaseId, callback){
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.Id=@id',
            parameters:[{
                name:'@id',
                value: databaseId
            }]
        };

        client.queryDatabases(querySpec).toArray(function(err,results){
            if(err){
                callback(err);
            }else{
                if(results.length==0){
                    var databaseSpec = {
                        id:databaseId
                    };
                    client.createDatabase(databaseSpec,function(err,created){
                        callback(null,created);
                    });
                }else{
                    callback(null,results[0]);
                }
            }
        });
    },

    getOrCreateCollection:function(client,databaselink,collectionId,callback){
        var querySpec ={
            query: 'SELECT * FROM root r WHERE r.Id = @id',
            parameters:[{
                name:'@id',
                value: collectionId
            }]
        };

        client.queryCollections(databaselink,querySpec).toArray(function(err,results){
            if(err){
                callback(err);
            }else{
                if(results.length == 0){
                    var collectionSpec = {
                        id : collectionId
                    };
                    client.createCollection(databaselink,collectionSpec,function(err,created){
                        callback(null,created);
                    });
                }else{
                    callback(null,results[0]);
                }
            }
        });
    }
};

module.exports = DocDbUtils;