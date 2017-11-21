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

const dom = new JSDOM(`<DOCTYPE>

<html lang="en">
  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes">
    <script src="http://d3js.org/d3.v3.min.js"></script>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <style>
        #c1, c2, c3 {
            fill:black;
        }

        #left {
		    text-align: center;
		    text-decoration: none;
		    display: inline-block;

		}

		#right {

		    text-align: center;
		    text-decoration: none;
		    display: inline-block;

		}

		#svgTree,#svgTree-two{
			border:1px solid black;
		}
    </style>

</head>


<body>

<!--<div class="col-sm-6"/>-->

<div class="container-fluid">
<div class="row">

	<div id = "tree-one" class="col-lg-6">
	    <script class ="js-tree-one">

	        function tree (){

	            var svgWidth = 1200,
	                svgHeight = svgWidth/2;

                var devide = 2,
                  fontsize = svgWidth/80,
                  linkSpace = fontsize-2,
                  trainglepadding = 25

	            var tree = {
	                cx: svgHeight,
	                cy: svgHeight/40,
	                w: svgHeight/5,
	                h: svgHeight/10,
	                size: 1,
	                leafDepth: Infinity,
	                nodes: []
	            };

	            var uniformDepth = true;
	            var addNode = false;
	            var removeNode = false;
	            var changeText = false;
	            var svgNodes;
              var JSONData;


	            //With x,y positions
	           var example = '[{"id":"00","text":"Clause","x":600,"y":15,"kids":[{"id":"id1.5","text":"1","x":480,"y":75,"kids":[{"id":"id2.5","text":"1.1","x":480,"y":135,"kids":[{"id":"id3.5","text":"1.2","x":480,"y":195,"kids":[],"isLeaf":true,"tWidth":0}],"isLeaf":false,"tWidth":0}],"isLeaf":false,"tWidth":0},{"id":"id4.5","text":"2","x":600,"y":75,"kids":[{"id":"id5.5","text":"2.1","x":600,"y":195,"kids":[],"isLeaf":true,"tWidth":0}],"isLeaf":false,"tWidth":0},{"id":"id6.5","text":"3","x":720,"y":75,"kids":[{"id":"id7.5","text":"3.1","x":720,"y":195,"kids":[],"isLeaf":true,"tWidth":0}],"isLeaf":false,"tWidth":0}],"isLeaf":false,"tWidth":0}]';

              /*var JSONTree = '{'+
                '"tree1":{'+
                  '"Clause":['+
                    '"left":[],'+
                    '"middle":[],'+
                    '"right":[]'+
                ']}'+
              '}';*/

              var JSONTree = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';
              var JSONTree2 = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{},"None":{}},"Participant 2":{"None":{}}}}';

              //var JSONTree = '{"tree1":{"Participant 1":{"This Little Piggy":{"InnerPiggy_Left":{},"InnerPiggy_Right":{}}},"Process":{"Had":{"InnerHad":{}}},"Participant 2":{"None":{"InnerNone":{}}}}}';
              //-- Add to inner piggy to demo : "T":{"I":{"Th":{"In":{}}}}

	            //get the nodes
	            tree.getNodes = function () {
	                var n = [];
	                function getNodes(node) {
	                    n.push({ id: node.id, text: node.text, x: node.x, y: node.y, kids: node.kids, isLeaf: node.isLeaf, tWidth: node.tWidth });
	                    node.kids.forEach(function (kid) { return getNodes(kid); });
	                }
	                getNodes(tree.nodes[0]);
	                return n.sort(function (a, b) { return a.id - b.id; });
	            }

	            //get the links
	            tree.getLinks = function () {
	                var l = [];
	                function getLinks(node) {
	                    node.kids.forEach(function (kid) { if (!kid.isLeaf) { l.push({ fromId: node.id, fromX: node.x, fromY: node.y, toId: kid.id, toX: kid.x, toY: kid.y }); } });
	                    node.kids.forEach(getLinks);
	                }
	                getLinks(tree.nodes[0]);
	                return l.sort(function (a, b) { return a.toId - b.toId });
	            }

	            //get the triangles -- size of the trees
	            tree.getTriangles = function () {
	                var t = [];
	                function getTriangles(node) {
	                    node.kids.forEach(function (kid) { if (kid.isLeaf) { t.push({ fromId: node.id, toId: kid.id, topX: node.x, topY: (node.y + 10), leftX: (kid.x - (kid.tWidth / 3)), leftY: (kid.y - 10), rightX: (kid.x + (kid.tWidth / 3)), rightY: (kid.y - 10) }); } });//10
	                    node.kids.forEach(getTriangles);
	                }
	                getTriangles(tree.nodes[0]);
	                return t.sort(function (a, b) { return a.toId - b.toId });
	            }

	            //returns node object from nodes array
	            tree.getNode = function (thisNode) {
	                var n;
	                //console.log('thisNode');
	                //console.log(thisNode);
	                function getNode(node) {
	                    if (node.id == thisNode.id) { n = node; }
	                    node.kids.forEach(getNode);
	                }
	                getNode(tree.nodes[0]);
	                //console.log('n');
	                //console.log(n);
	                return n;
	            }

	            //get text width of node
	/*            tree.getTextWidth = function (node) {
	                var n = tree.getNode(node);
	                var nodes = d3.select('text#' + n.id);
	                n.tWidth = nodes.node().getBBox().width;
	                return nodes.node().getBBox().width;
	            }
	*/
	            //add a new leaf - have to look into refactoring this code
	            tree.addLeaf = function (parent) {
	                tree.size++;
                  //console.log(parent);
	                function addLeaf(node) {
                    //console.log(parent);
                    //console.log(node);
	                    if (node.id == parent) {
                        //console.log("addLeaf");
	                        //console.log('id' + (tree.size - 1));
                          node.kids.push({ id: 'id' + (tree.size), text: 'Node' + (tree.size), x: node.x, y: node.y, kids: [], isLeaf: true, tWidth: 0 }); node.isLeaf = false;
	                        refresh();
	                        reposition(tree.nodes[0]);
	                        redraw(); return;
	                    }
	                    node.kids.forEach(addLeaf);
	                }
	                addLeaf(tree.nodes[0]);
	//                reposition(tree.nodes[0]);
	//                redraw();
	            }

            //add a new leaf - have to look into refactoring this code
            tree.addFromJSON = function (parent,child,pos) {
              tree.size++;
                    var node = parent;
                    //console.log(parent);
                    function addLeaf(node) {
                        if (node.id == parent.id) {
                            node.kids.push({ id: 'id' + (tree.size - .5), text: child, x: node.x, y: node.y, kids: [], isLeaf: true, tWidth: 0 }); node.isLeaf = false;
                            refresh();
                            reposition(tree.nodes[0]);
                            redraw(); return;
                        }
                        node.kids.forEach(addLeaf);
                    }
                    addLeaf(node);
                    return node.kids[pos];
           }

	            //remove leaf
	            tree.removeLeaf = function (nodeClicked) {
	                var parent = tree.nodes[0];
	                var visited = [];
	                function removeLeaf(p) {
	                    function arrangeKids(index, numOfKids) {
	                        parent.kids.splice(index, 1);
	                        if (parent.kids.length == 0) { parent.isLeaf = true; }

	                        //console.log(parent.kids);

	                    }
	                    if (p.id == parent.id) {
	                        for (var i = 0; i < parent.kids.length; i++) {
	                            if (parent.kids[i].id == nodeClicked.id) {
	                                arrangeKids(i, parent.kids.length);
	                                reposition(tree.nodes[0]);
	                                redraw();
	                                return;
	                            }
	                        }
	                    }
	                    p.kids.forEach(removeLeaf);
	                }
	                function findParent(node) { //finds the parent object of the leaf clicked and saves it to parent variable
	                    visited.push(node);
	                    if (node.id == nodeClicked.id) { visited.pop(); parent = visited[visited.length - 1]; removeLeaf(tree.nodes[0]); }
	                    else {
	                        node.kids.forEach(findParent);
	                        visited.pop(); //remove nodes down visited paths
	                    }

	                    //console.log(visited);
	                }

	                if (nodeClicked.isLeaf) {
	                    findParent(tree.nodes[0]);
	                }
	                refresh();
	                reposition(tree.nodes[0]);
	                redraw();
	            }

	            //change node text - CHANGE SIZE OF TEXT BOX HERE
	            tree.changeText = function (node) {
	                var newText = '';
	                var num = 0;
	                var textBox = d3.select("#nodes").append("foreignObject").attr("x", node.x + 50).attr("y", node.y)
	                                .attr("width", 150).attr("height", 25).append("xhtml:form")
	                                .append("input").attr("value", function () { this.focus(); return node.text })
	                                .on("blur", function () {
	                                    newText = textBox.node().value;
	                                    function changeText(n) {
	                                        if (n.id == node.id) {
	                                            n.text = newText;
	                                            /*var nodes = d3.select('text#' + n.id);
	                                            nodes.text(newText);
	                                            //tree.getTextWidth(n);
	                                            nodes.attr('tWidth', tree.getTextWidth(n));
	                                            reposition(tree.nodes[0]);
	                                            */
	                                            refresh();
	                                            redraw();
	                                           return;
	                                        }
	                                        n.kids.forEach(changeText);
	                                    }
	                                    changeText(tree.nodes[0]);
	                                    redraw();
	                                    d3.select("foreignObject").remove();

	                                })
	                                .on("keypress", function () {
	                                    if (d3.event.keyCode == 13) {
	                                        var e = d3.event;
	                                        //prevents the entire tree from deleting when enter is pressed
	                                        if (e.stopPropagation) { e.stopPropagation(); }
	                                        e.preventDefault();

	                                        newText = textBox.node().value;
	                                        function changeText(n) {
	                                            if (n.id == node.id) {
	                                                n.text = newText;
	                                                /*var nodes = d3.select('text#' + n.id);
	                                                nodes.text(newText);
	                                                //tree.getTextWidth(n);
	                                                nodes.attr('tWidth', tree.getTextWidth(n));
	                                                reposition(tree.nodes[0]);
	                                                */
	                                                refresh();
	                                                redraw();
	                                                return;
	                                            }
	                                            n.kids.forEach(changeText);
	                                        }
	                                        changeText(tree.nodes[0]);
	                                        redraw();
	                                        d3.select("foreignObject").remove();
	                                    }
	                                });
	                //tree.getTextWidth(node);
	            }

	            //sets leafs depth to deepest leaf
	            tree.nodeDepth = function () {
	                var leafs = [];
	                var depth = 0;

	                //check if nodes are leafs
	                function nodeDepth(n) {
	                    n.kids.forEach(function (kid) {
	                        if (kid.isLeaf) { leafs.push({ id: kid.id });
	                            if (kid.y > depth) { depth = kid.y; }
	                        }
	                    });
	                    n.kids.forEach(nodeDepth);
	                }
	                nodeDepth(tree.nodes[0]);
	                function changeDepth(n) {
	                    n.kids.forEach(function (kid) {
	                        leafs.forEach(function (leaf) { if (kid.id == leaf.id) { kid.y = depth; } })

	                    });
	                    n.kids.forEach(changeDepth);
	                }
	                changeDepth(tree.nodes[0]);
	                tree.leafDepth = depth;
	            }

	            //update/refresh svg
	            refresh = function () {
	                d3.select('#nodes').selectAll('text').data(tree.getNodes()).remove();
	                d3.select('#links').selectAll('line').data(tree.getLinks()).remove();
	                d3.select('#triangles').selectAll('polygon').data(tree.getTriangles()).remove();
	            }

	            //redraw the tree
	            redraw = function () {
	                d3.select('#nodes').selectAll('text').data(tree.getNodes()).exit().remove();
	                d3.select('#links').selectAll('line').data(tree.getLinks()).exit().remove();
	                d3.select('#triangles').selectAll('polygon').data(tree.getTriangles()).exit().remove();

	                var nodes = d3.select('#nodes').selectAll('text').data(tree.getNodes());

	                nodes.text(function (node) { return node.text })/*.transition().duration(500)*/
	                    .attr('x', function (node) { return node.x; }).attr('y', function (node) { return node.y + 5; })//5
	                    .attr('fill', function (node) { if (node.isLeaf) { return 'red'; } else { return 'blue'; } });

	                nodes.enter().append('text').attr('id', function (node) { /*console.log('id = ' + node.id);*/ return node.id; })
	                    .attr('x', function (node) { return node.x; }).attr('y', function (node) { return node.y + 5; })
	                    .text(function (node) { return node.text; })
	                    .attr('tWidth', function (node) {
	                        var n = tree.getNode(node); n.tWidth = this.getBBox().width; return this.getBBox().width;
	                    })
	                    //Change font below
	                    .style({ 'text-anchor': 'middle', 'cursor': 'pointer','font-size':fontsize })
	                    .on('click', function (node) { if (d3.event.shiftKey) { return tree.changeText(node); } else if (d3.event.ctrlKey) { return tree.removeLeaf(node); } else { return tree.addLeaf(node.id); } })
	                    /*.transition().duration(500)*/
	                    .attr('x', function (node) { return node.x; }).attr('y', function (node) { return node.y + 5; });


	                var links = d3.select('#links').selectAll('line').data(tree.getLinks());

	                links/*.transition().duration(500)*/
	                    .attr('x1', function (link) { return link.fromX; }).attr('y1', function (link) { return link.fromY + linkSpace; })//10
	                    .attr('x2', function (link) { return link.toX; }).attr('y2', function (link) { return link.toY - linkSpace; });

	                links.enter().append('line')
	                    .attr('x1', function (link) { return link.fromX; }).attr('y1', function (link) { return link.fromY + linkSpace; })
	                    .attr('x2', function (link) { return link.toX; }).attr('y2', function (link) { return link.toY - linkSpace; })
	                    .style({ 'stroke': 'black', 'stroke-width': '1px' })
	                    /*.transition().duration(500)*/
	                    .attr('x2', function (link) { return link.toX; }).attr('y2', function (link) { return link.toY - linkSpace; });


	                var triangles = d3.select('#triangles').selectAll('polygon').data(tree.getTriangles());

	                triangles/*.transition().duration(500)*/
	                    .attr('points', function (triangle) { return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX-trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX+trainglepadding) + ',' + triangle.rightY) });

	                triangles.enter().append('polygon')
	                    .attr('points', function (triangle) { return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX-trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX+trainglepadding) + ',' + triangle.rightY) })
	                    .style({ 'stroke': 'black', 'stroke-width': '1px', 'fill': 'white' })
	                    /*.transition().duration(500)*/
	                    .attr('points', function (triangle) { return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX-trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX+trainglepadding) + ',' + triangle.rightY) });
	            }

	            //get leaf count for node
	            getLeafCount = function (node) {
	                if (node.kids.length == 0) { return 1; }
	                else { return node.kids.map(getLeafCount).reduce(function (a, b) { return a + b; }); }
	            }

	            //update node positions
	            reposition = function (node) {

	                if (uniformDepth) {
	                    tree.nodeDepth();
	                }

	                var leafCount = getLeafCount(node),
	                    left = node.x - tree.w * (leafCount - 1) / 2;
	                node.kids.forEach(function (kid) {
	                    var w = tree.w * getLeafCount(kid);
	                    left += w;
	                    kid.x = left - (w + tree.w) / 2;
	                    kid.y = node.y + tree.h;
	                    reposition(kid);
	                    redraw();
	                });

	            }

	            //save the tree structure as JSON
	            saveTree = function () {
	                console.log(tree.nodes);
	                JSONData = JSON.stringify(tree.nodes);
	                console.log(JSONData);
	            }

	            exampleTree = function () {
	            	tree.nodes = JSON.parse(example);
	            	reposition(tree.nodes[0]);
	            	redraw();
	            }

	            //save the tree structure as JSON
	            loadTree = function () {
	                tree.nodes = JSON.parse(JSONData);
	                console.log(tree.nodes);
	                refresh();
	                reposition(tree.nodes[0]);
	                redraw();
	            }

	            resetTree = function () {
	                tree.nodes = [];
	                tree.nodes.push({ id: '00', text: 'Clause', x: tree.cx, y: tree.cy, kids: [], isLeaf: false, tWidth: 0 });
	                console.log(tree.nodes);
	                refresh();
	                reposition(tree.nodes[0]);
	                redraw();
	            }

              getJSON = function(){//testing how to return json value and parameter names
                resetTree();
                var myObj = JSON.parse(JSONTree);
                console.log(JSON.parse(JSONTree));
                var treeNames = Object.keys(myObj);
                var parent = tree.nodes[0];
                for(name in treeNames){
                  recursiveGetProperty(myObj, treeNames[name],function(obj) {
                    console.debug(obj);

                  },parent);
                }

                TreeJSON();
              }

              function recursiveGetProperty(obj, lookup, callback, parent) {
                 for (property in obj) {
                     if (property == lookup) {
                       var obj2 = obj[property];
                       var t = Object.keys(obj2);
                       for(name in t){
                         parent2 = tree.addFromJSON(parent,t[name],name);
                         //console.log(parent2);
                         if(t[name]!=undefined){
                          callback(t[name]);
                        }
                          recursiveGetProperty(obj2, t[name], callback,parent2);
                       }


                     }
                     else if (obj[property] instanceof Object) {
                         recursiveGetProperty(obj[property], lookup, callback,parent2);
                     }

                     //if(obj.property!=null)
                      //recursiveGetProperty(obj.property, lookup, callback);
                 }
                 //console.log("<--->");
              }

              compareJSON = function() {
                var equals = (JSONTree==JSONTree2) ? 'true' : 'false';
                console.log(equals);
              }

              TreeJSON = function(){
                console.log(tree.nodes);
                JSONData = JSON.stringify(tree.nodes);
                console.log(JSONData);
              }

                $(document).ready(function(){
                  $("#get").click(function(){
                      $.get("http://localhost:3000/Students?id=4", function(data, status){
                          alert("Data: " + JSON.stringify(data).replace("[","").replace("]","").replace(/-/g,"") + "\nStatus: " + status  + "\n"+typeof data);
                          getJSON(JSON.stringify(data).replace("[","").replace("]",""));
                          JSONData = JSON.stringify(tree.nodes);
                          console.log(JSONData);
                      });
                  });
                });

	            //set up the page
	            initialise = function () {

	                //add the root node
	                tree.nodes.push({ id: '00', text: 'Clause', x: tree.cx, y: tree.cy, kids: [], isLeaf: false, tWidth: 0 });

	                //create the svg
	                d3.select("#tree-one").style().append('svg').attr('width', svgWidth).attr('height', svgHeight).attr('id', 'svgTree')
	                    ;

	                //create group of nodes
	                d3.select('#svgTree').append('g').attr('id', 'nodes').selectAll('text').data(tree.getNodes())
	                    .enter().append('text').attr('id', function (node) { return node.id; })
	                    .attr('x', function (node) { return node.x; }).attr('y', function (node) { return node.y + 5; })
	                    .text(function (node) { return node.text; })
	                    .attr('tWidth', function (node) { var n = tree.getNode(node); n.tWidth = this.getBBox().width; return this.getBBox().width; /*return tree.getTextWidth(node);*/ })
	                    .style({ 'text-anchor': 'middle', 'cursor': 'pointer' })
	                    .on('click', function (node) { return tree.addLeaf(node.id); });

	                //create group of links
	                d3.select('#svgTree').append('g').attr('id', 'links').selectAll('line').data(tree.getLinks())
	                    .enter().append('line')
	                    .attr('x1', function (link) { return link.fromX; }).attr('y1', function (link) { return link.fromY; })
	                    .attr('x2', function (link) { return link.toX; }).attr('y2', function (link) { return link.toY; });

	                //create group of triangles
	                d3.select('#svgTree').append('g').attr('id', 'triangles').selectAll('polygon').data(tree.getTriangles())
	                    .enter().append('polygon')
	                    .attr('points', function (triangle) { return (triangle.topX + ',' + triangle.topY + ' ' + triangle.leftX + ',' + triangle.leftY + ' ' + triangle.rightX + ',' + triangle.rightY) });


	                //Show the legend in top left corner
	                var controlsInfo = [
	                    //{ id: 'c1', action: 'Add Leaf : ', buttons: ' Click on a Node', x: 5, y: 15 },
	                    //{ id: 'c2', action: 'Remove Leaf : ', buttons: ' Hold Ctrl & Click on a Leaf', x: 5, y: 30 },
	                    //{ id: 'c3', action: 'Change Node Text : ', buttons: ' Hold Shift & Click on a Node', x: 5, y: 45 }
	                ];
	                d3.select('#svgTree').append('g').attr('id', 'legend').selectAll('text').data(controlsInfo)
	                    .enter().append('text').attr('id', function (c) { return c.id; })
	                    .attr('x', function (c) { return c.x; }).attr('y', function (c) { return c.y; }).text(function (c) { return c.action; })
	                    .attr('style', 'font-size:6; fill:black;').append('tspan').attr('x', 100).attr('y', function (c) { return c.y; }).text(function (c) { return c.buttons; });
	                redraw();
	            }

	            initialise();
	            getJSON();

	            return tree;
	        }
	        var tree = tree();

	    </script>

	    /*<input id="left" class="btn btn-success" type="button" value="SaveTree-left" onclick="saveTree();" />
		<input id="left" class="btn btn-success" type="button" value="LoadTree-left" onclick="loadTree();" />
		<input id="left" class="btn btn-success" type="button" value="ResetTree-left" onclick="resetTree();" />
		<input id="left" class="btn btn-success" type="button" value="ExampleTree-left" onclick="exampleTree()"/>
    <input id="left" class="btn btn-success" type="button" value="Get JSON" onclick="getJSON();" />
    <input id="left" class="btn btn-success" type="button" value="Compare JSON" onclick="compareJSON();" />
    <button id="get" class="btn btn-success" type="button" value="api"/>*/
      </div>
	    </div>
	    <br>

</body>


</html>`, { virtualConsole , runScripts: "dangerously" });



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

		var myJSON2 = JSON.stringify(req.body.body1).slice(1,-1).replace(/\\/g, "");
		myJSON2 = JSON.stringify(treeStruc.tree(myJSON2));

		var TreeArray = [myJSON,myJSON2];


		res.send(TreeArray)

		//current returns treeStruc + added extra bit to start
		//res.send(JSON.stringify(treeStruc.tree(myJSON)));
		//res.send(treeStruc.tree(req.body.body));
  });

	app.get('/jsdom/',(req,res)=> {

		res.send(dom.window.document.querySelector("#svgTree").textContent); // "Hello world"
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
