var treeStruc = require("./treeStruc");
var grading = require("./grading");
var SFL_trees = require("./exampleTrees");
var data = require("./db_api");

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
    //console.log(req.body.teacher);

    var student = JSON.stringify(req.body.body).slice(1, -1).replace(/\\/g, "");
    var teacher = SFL_trees.examples[(req.body.sentence).split(' ').join('').toLowerCase()]; //JSON.stringify(req.body.teacher).slice(1, -1).replace(/\\/g, "");
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
};