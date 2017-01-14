var express = require('express');
var app = express();

app.get('/',function(req,res){
    //home page
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