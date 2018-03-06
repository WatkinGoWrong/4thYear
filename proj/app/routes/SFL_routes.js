var d3 = require("d3");
var treeStruc = require("./treeStruc");
var grading = require("./grading");
var JSONTree = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';
var SFL_trees = require("./exampleTrees");
var test = 0;
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



//var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {

  app.post('/treetest/', (req, res) => {
    console.log("SFL Generating!");
    const note = {
      text: req.body,
      title: req.body.title
    };

    var myJSON = JSON.stringify(req.body.body).slice(1, -1).replace(/\\/g, "");
    var doc_width = JSON.stringify(req.body.d_width);
    myJSON = JSON.stringify(treeStruc.tree(myJSON, doc_width));
    console.log("SFL Generated!");
    res.send(myJSON);
    res.send(doc_width);
  });

  app.post('/grading/', (req, res) => {
    console.log("SFL Grading!");
    const note = {
      text: req.body,
      title: req.body.title
    };
    var student = JSON.stringify(req.body.body).slice(1, -1).replace(/\\/g, "");
    var teacher = SFL_trees.examples[(req.body.sentence).split(' ').join('').toLowerCase()];
    console.log("SFL Graded!");
    if (teacher == undefined)
      res.send(["", "", "", "", ""])
    else
      res.send(grading.genFromTable(JSON.parse(teacher), JSON.parse(student)));

  });

  app.post('/exampleTrees/', (req, res) => {
    console.log(req.body.sfl);
    var SFLs = SFL_trees.examples[req.body.sfl];
    if (SFLs == undefined) {
      SFLs = "Does not exist"
    }
    console.log(SFLs);
    res.send(SFLs);
  });


  app.post('/mydb/', (req, res) => {
    var test = req.body.body;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = [{
        test
      }];
      dbo.collection("SFL_trees").insertMany(myobj, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        test++;
        db.close();
      });
    });
    res.send(req.body.body);
  });

};