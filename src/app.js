var express = require('express');
var path = require('path');
var UrlDataAccess = require('./models/urls');
var config = require('config');
var DocumentDbClient = require('documentdb').DocumentClient;
var bodyParser = require('body-parser');


var docDbClient = new DocumentDbClient(config.get('DocumentDb.AccountUrl'),{
    masterKey : config.get('DocumentDb.AccountKey')
});

var urlDataAccess = new UrlDataAccess(docDbClient);
urlDataAccess.init(function(err){
    if(err){
        console.log(err);   
    }else{
        console.log('Connected successfully');
    }
});


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    //home page
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.post('/api/shorten',function(req,res){
    //shorten the url and return short form
    var longUrl = req.body.url;
    var shortUrl = '';

    urlDataAccess.findByUrl(longUrl,function(err,doc){
        if(doc.length == 1){
            res.send({shortUrl:doc[0].id});
        }else{
            urlDataAccess.save(longUrl,function(err,doc){
                res.send({shortUrl:doc.id});
            });
        }
    });
});

app.get('/:encodedId',function(req,res){
    
    urlDataAccess.find(req.params.encodedId,function(err,doc){
        if(doc)
            res.redirect(doc);
    });
});



app.listen(3000,function(){
    console.log('Server listening to port number 3000');
});