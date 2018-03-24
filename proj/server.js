// server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const app = express();

//const MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017"; //mongodb://localhost:27017/";


var assert = require('assert');

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
require('./app/routes')(app);
app.listen(port, '0.0.0.0', () => {
  console.log('We are live on ' + port);
});

app.get('/SFL', function(req, res) {
  var date = new Date();
  console.log('Date:', date.getDay() + '/' + date.getMonth() + '/' + date.getYear(), 'Time:', date.getHours() + ':' + date.getMinutes());
  res.sendFile(__dirname + "/" + "SFL_Anno.html"); //SFL_Anno
});