var express = require('express');
var path = require('path');
var UrlDataAccess = require('./models/urls');
var config = require('config');
var DocumentDbClient = require('documentdb').DocumentClient;

var docDbClient = new DocumentDbClient(config.get('DocumentDb.AccountUrl'),{
    masterKey : config.get('DocumentDb.AccountKey')
});
var urlDataAccess = new UrlDataAccess(docDbClient, 'UrlShortner','Urls');
urlDataAccess.init(function(err){
    if(err){
        console.log(err);   
    }else{
        console.log('Connected successfully');
    }
});
var app = express();

app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    //home page
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.post('/api/shorten',function(req,res){
    //shorten the url and return short form
});

app.get('/:encodedId',function(req,res){
    //redirect to the original url
});



app.listen(3000,function(){
    console.log('Server listening to port number 3000');
});