var d3 = require("d3");
var treeStruc = require("./treeStruc");
var grading = require("./grading");
var JSONTree = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';
var SFL_trees = require("./exampleTrees");

//var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {

  app.post('/treetest/', (req, res) => {
    const note = {
      text: req.body,
      title: req.body.title
    };

    var myJSON = JSON.stringify(req.body.body).slice(1, -1).replace(/\\/g, "");
    var doc_width = JSON.stringify(req.body.d_width);

    console.log("JSON Recieved - ", myJSON);
    console.log("JSON Recieved - ", doc_width);

    myJSON = JSON.stringify(treeStruc.tree(myJSON, doc_width));

    //var TreeArray = [myJSON];

    res.send(myJSON);
    res.send(doc_width);

    console.log("JSON Response - ", myJSON);
  });

  app.post('/grading/', (req, res) => {
    const note = {
      text: req.body,
      title: req.body.title
    };
    //var teacher = JSON.stringify(req.body.body_t).slice(1, -1).replace(/\\/g, "");
    console.log("body - ", JSON.stringify(req.body.body).slice(1, -1).replace(/\\/g, ""));
    var student = JSON.stringify(req.body.body).slice(1, -1).replace(/\\/g, "");
    //console.log("ttt ----", student);

    //var sentence = (req.body.sentence).split(' ').join('').toLowerCase();
    console.log("sentence - ", req.body.sentence);
    var teacher = SFL_trees.examples[(req.body.sentence).split(' ').join('').toLowerCase()];
    console.log(teacher)

    //console.log("teacher - ", teacher);
    //console.log("student - ", student);

    //var result =
    //var TreeArray = [myJSON];

    //res.send(teacher);
    //res.send(student);
    res.send(grading.genFromTable(JSON.parse(teacher), JSON.parse(student)));

  });

  app.get('/exampleTrees/', (req, res) => {
    var ex_Trees = ex.examples;
    res.send(ex_Trees);
  });
};