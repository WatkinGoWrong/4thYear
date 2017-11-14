// server.js
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();


const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});

/*var app = require('http');
var fs = require('fs');

const PORT=8080; 

//fs.readFile('./syntax_tree.html', function (err, html) {
fs.readFile('./syntax_tree.html', function (err, html) {

    if (err) throw err;    

    app.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        	response.end();  
    }).listen(PORT);

});*/

