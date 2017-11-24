    var d3 = require("d3"); 

    function tree (){

        var svgWidth = 1200,
            svgHeight = svgWidth/2;

        var devide = 2,
            fontsize = svgWidth/80,
            linkSpace = fontsize-2,
            trainglepadding = fontsize

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

        //With x,y positions
        var example = '[{"id":"00","text":"Left Tree","x":300,"y":15,"kids":[{"id":"id1.5","text":"Node 1.5","x":300,"y":55,"kids":[{"id":"id2.5","text":"Node 2.5","x":150,"y":95,"kids":[{"id":"id9.5","text":"Node 9.5","x":100,"y":135,"kids":[{"id":"id10.5","text":"Node 10.5","x":50,"y":255,"kids":[],"isLeaf":true,"tWidth":76.80000305175781},{"id":"id11.5","text":"Node 11.5","x":150,"y":175,"kids":[{"id":"id12.5","text":"Node 12.5","x":150,"y":215,"kids":[{"id":"id13.5","text":"Node 13.5","x":150,"y":255,"kids":[],"isLeaf":true,"tWidth":76.83333587646484}],"isLeaf":false,"tWidth":76.76667022705078}],"isLeaf":false,"tWidth":74.41666412353516}],"isLeaf":false,"tWidth":69.46666717529297},{"id":"id16.5","text":"Node 16.5","x":250,"y":135,"kids":[{"id":"id17.5","text":"Node 17.5","x":250,"y":175,"kids":[{"id":"id18.5","text":"Node 18.5","x":250,"y":255,"kids":[],"isLeaf":true,"tWidth":77.01667022705078}],"isLeaf":false,"tWidth":74.5}],"isLeaf":false,"tWidth":76.98332977294922}],"isLeaf":false,"tWidth":69.31666564941406},{"id":"id3.5","text":"Node 3.5","x":400,"y":95,"kids":[{"id":"id4.5","text":"Node 4.5","x":350,"y":135,"kids":[{"id":"id14.5","text":"Node 14.5","x":350,"y":175,"kids":[{"id":"id15.5","text":"Node 15.5","x":350,"y":255,"kids":[],"isLeaf":true,"tWidth":76.69999694824219}],"isLeaf":false,"tWidth":77.0999984741211}],"isLeaf":false,"tWidth":69.6500015258789},{"id":"id5.5","text":"Node 5.5","x":450,"y":135,"kids":[{"id":"id6.5","text":"Node 6.5","x":450,"y":255,"kids":[],"isLeaf":true,"tWidth":69.53333282470703}],"isLeaf":false,"tWidth":69.25}],"isLeaf":false,"tWidth":69.38333129882812},{"id":"id7.5","text":"Node 7.5","x":550,"y":95,"kids":[{"id":"id8.5","text":"Node 8.5","x":550,"y":135,"kids":[{"id":"id19.5","text":"Node 19.5","x":550,"y":175,"kids":[{"id":"id20.5","text":"Node 20.5","x":550,"y":255,"kids":[],"isLeaf":true,"tWidth":79}],"isLeaf":false,"tWidth":76.91666412353516}],"isLeaf":false,"tWidth":69.56666564941406}],"isLeaf":false,"tWidth":67.05000305175781}],"isLeaf":false,"tWidth":66.96666717529297}],"isLeaf":false,"tWidth":68.30000305175781}]';

        var JSONData;

        var JSONTree = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';
        var JSONTree2 = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';

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

        getJSON = function(j_tree){//testing how to return json value and parameter names
          resetTree();
          var myObj = JSON.parse(j_tree);
          var treeNames = Object.keys(myObj);
          var parent = tree.nodes[0];
          for(name in treeNames){
            recursiveGetProperty(myObj, treeNames[name],function(obj) {
              console.debug(obj);

            },parent);
          }
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

        apitest = function(json){
          getJSON(json);
          JSONData = JSON.stringify(tree.nodes);
          console.log(JSONData);
          return JSONData;
        }

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

   module.exports = {
       tree
    };