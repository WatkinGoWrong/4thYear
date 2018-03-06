// server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const app = express();

var assert = require('assert');
const d3 = require("d3");


const port = 8000;
const port2 = 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname));

//MongoClient.connect(db.url, (err, database) => {
//if (err) return console.log(err)
require('./app/routes')(app);

//require('./app/vendor')(app);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
//})

app.get('/SFL', function(req, res) {
  var date = new Date();
  console.log('Date:', date.getDay() + '/' + date.getMonth() + '/' + date.getYear(), 'Time:', date.getHours() + ':' + date.getMinutes());
  res.sendFile(__dirname + "/" + "SFL_Anno.html"); //SFL_Anno
})



/*var http = require('http'),
    fs = require('fs');


fs.readFile('./syntax_tree.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(3000);
});*/