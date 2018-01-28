
var d3 = require("d3");
var treeStruc = require("./treeStruc");
var JSONTree = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';
var ex = require("./exampleTrees");

//var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {

	app.post('/treetest/', (req, res) => {
    const note = { text: req.body, title: req.body.title };

		var myJSON = JSON.stringify(req.body.body).slice(1,-1).replace(/\\/g, "");

		console.log("JSON Recieved - ",myJSON);

		myJSON = JSON.stringify(treeStruc.tree(myJSON));

		//var TreeArray = [myJSON];

		res.send(myJSON);

		console.log("JSON Response - ",myJSON);
	});

	app.get('/exampleTrees/',(req,res) =>{
		var ex_Trees = ex.examples;
		res.send(ex_Trees);
	});
};
