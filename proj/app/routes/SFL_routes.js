// routes/note_routes.js
var d3 = require("d3");
var treeStruc = require("./treeStruc");
var JSONTree = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';
const phantom = require('phantom');
var _ph, _page, _outObj;
var screenshot = require('url-to-image');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();

//var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {
	app.get('/treeGen/', (req, res) => {
		res.send();
		res.send(treeStruc.tree(JSONTree));
		/*(async function() {
		    const instance = await phantom.create();
		    const page = await instance.createPage();
		    await page.on("onResourceRequested", function(requestData) {
		        console.info('Requesting', requestData.url)
		    });

		    const status = await page.open('/Users/niktaw/Documents/Fun_Stuffs/proj/syntax_tree.html');
		    console.log(status);

		    //const content = await page.property('content');
		    //console.log(content);

		    const JSONData = await page.property('content').JSONTree2;
		    console.log(JSONData);

		    await instance.exit();
		}());*/

		//treeGen.getJSON(JSONTree);
	});

	app.post('/treetest/', (req, res) => {
    const note = { text: req.body, title: req.body.title };
		/*var JSONArray = [req.body.body,req.body.body1];
		var TreeArray;
		//var myJSON = req.body.body1;
		for(x in JSONArray){
			var myJSON = JSON.stringify(JSONArray[x]).slice(1,-1).replace(/\\/g, "");
			TreeArray[x] = JSON.stringify(treeStruc.tree(myJSON));
		}*/


		var myJSON = JSON.stringify(req.body.body).slice(1,-1).replace(/\\/g, "");
		myJSON = JSON.stringify(treeStruc.tree(myJSON));

		//var myJSON2 = JSON.stringify(req.body.body1).slice(1,-1).replace(/\\/g, "");
		//myJSON2 = JSON.stringify(treeStruc.tree(myJSON2));

		var TreeArray = [myJSON];


		res.send(myJSON);
  });

	app.get('/jsdom/',(req,res)=> {

		res.send(); // "Hello world"
	});

  /*app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  app.get('/notes/', (req, res) => {
    db.collection('notes').find({}).toArray(function(err, result) {
	    if (err) throw err;
	    console.log(result);
	    db.close();
	  });
  });

app.post('/notes', (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').insert(note, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + id + ' deleted!');
      }
    });
  });

 app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').update(details, note, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(note);
      }
    });
  });*/
};
