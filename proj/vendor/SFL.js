function tree (){

    var num;
    var svgWidth = 1000,
        svgHeight = svgWidth/2;

      var devide = 2,
        fontsize = svgWidth/90,
        linkSpace = fontsize-1,
        trainglepadding = fontsize-2
        stroke_width = fontsize/15

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


    comp = ["text","parent","depth","kids"];
    var diff_count = 0;

    //With x,y positions
    var example = '[{"id":"00","text":"Clause","x":600,"y":15,"parent":"none","isLeaf":false,"tWidth":0,"depth":0,"kids":[{"id":"id1.5","text":"Participant 1","x":480,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id2.5","text":"This Little Piggy","x":480,"y":135,"parent":"Participant 1","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id3.5","text":"Process","x":600,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id4.5","text":"Had","x":600,"y":135,"parent":"Process","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id5.5","text":"Participant 2","x":720,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id6.5","text":"None","x":720,"y":135,"parent":"Participant 2","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]}]}]';

    //{"id":"id2.5","text":"This Little Piggy","x":480,"y":135,"parent":"Participant 1","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}

    var example2 = '[{"id":"00","text":"Sentence","x":600,"y":15,"parent":"none","isLeaf":false,"tWidth":0,"depth":0,"kids":[{"id":"id1.5","text":"Participant 1 - test","x":480,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id2.5","text":"This Little Piggy","x":480,"y":135,"parent":"Participant 1","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id3.5","text":"Process","x":600,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id4.5","text":"Had","x":600,"y":135,"parent":"Process","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id5.5","text":"Participant 2","x":720,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id6.5","text":"None","x":720,"y":135,"parent":"Participant 2","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]}]}]';

    var JSONTree= '{"Placeholder Tag":{"T1":{"A1":{"A2":{"A3":{"The":{}},"A4":{"offline":{}}}},"B1":{"B2":{"B3":{"version can be run":{}}}},"C1":{"C2":{"C3":{"in a web browser":{}}}}},"T2":{"A1":{"A2":{"A3":{"Electron-q":{}}}},"B1":{"B2":{"B3":{"contains the Electron":{}}}}}}}';

    var body = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{},"None":{}},"Participant 2":{"None":{}}}}';

    var student = '[{"id":"00","text":"Sentence","x":500,"y":12.5,"isLeaf":false,"tWidth":58.71666717529297,"depth":0,"kids":[{"id":"id1.5","text":"A","x":400,"y":62.5,"parent":"Sentence","isLeaf":false,"tWidth":12.550000190734863,"depth":1,"kids":[{"id":"id2.5","text":"A1","x":400,"y":112.5,"parent":"A","isLeaf":false,"tWidth":20.549999237060547,"depth":2,"kids":[{"id":"id3.5","text":"A2","x":400,"y":162.5,"parent":"A1","isLeaf":false,"tWidth":20.549999237060547,"depth":3,"kids":[{"id":"id4.5","text":"One morning","x":400,"y":212.5,"parent":"A2","isLeaf":true,"tWidth":85.83333587646484,"depth":4,"kids":[]}]}]}]},{"id":"id5.5","text":"B","x":500,"y":62.5,"parent":"Sentence","isLeaf":false,"tWidth":11.666666984558105,"depth":1,"kids":[{"id":"id6.5","text":"B1","x":500,"y":112.5,"parent":"B","isLeaf":false,"tWidth":19.66666603088379,"depth":2,"kids":[{"id":"id7.5","text":"B2","x":500,"y":162.5,"parent":"B1","isLeaf":false,"tWidth":19.66666603088379,"depth":3,"kids":[{"id":"id8.5","text":"I shot","x":500,"y":212.5,"parent":"B2","isLeaf":true,"tWidth":37,"depth":4,"kids":[]}]}]}]},{"id":"id9.5","text":"C","x":600,"y":62.5,"parent":"Sentence","isLeaf":false,"tWidth":11.666666984558105,"depth":1,"kids":[{"id":"id10.5","text":"C1","x":600,"y":112.5,"parent":"C","isLeaf":false,"tWidth":19.66666603088379,"depth":2,"kids":[{"id":"id11.5","text":"C2","x":600,"y":162.5,"parent":"C1","isLeaf":false,"tWidth":19.66666603088379,"depth":3,"kids":[{"id":"id12.5","text":"an elephant","x":600,"y":212.5,"parent":"C2","isLeaf":true,"tWidth":74.30000305175781,"depth":4,"kids":[]}]}]}]}]}]'

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
  tree.addFromJSON = function (parent,child,pos,depth) {
    tree.size++;
          var node = parent;
        //console.log("parent- ",parent.text);
        //console.log("child- ",child);


          // /console.log(parent);
          function addLeaf(node) {
            var draw = true;
              if (node.id == parent.id) {
                if (node.kids!=null) {
                  //console.log('node : ', node , ' | kid :' , node.kids);
                  for(x in node.kids){
                    if(node.kids[x].text==child){
                      draw = false;
                    }
                  }
                }
                  if(draw){
                    node.kids.push({ id: 'id' + (tree.size - .5), text: child, x: node.x, y: node.y, parent:parent.text, isLeaf: true, tWidth: 0, depth:depth, kids: [] }); node.isLeaf = false;
                    refresh();
                    reposition(tree.nodes[0]);
                    redraw();
                    return;
                }
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
            .style({ 'stroke': 'black', 'stroke-width': stroke_width+'px' })
            /*.transition().duration(500)*/
            .attr('x2', function (link) { return link.toX; }).attr('y2', function (link) { return link.toY - linkSpace; });


        var triangles = d3.select('#triangles').selectAll('polygon').data(tree.getTriangles());

        triangles/*.transition().duration(500)*/
            .attr('points', function (triangle) { return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX-trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX+trainglepadding) + ',' + triangle.rightY) });

        triangles.enter().append('polygon')
            .attr('points', function (triangle) { return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX-trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX+trainglepadding) + ',' + triangle.rightY) })
            .style({ 'stroke': 'black', 'stroke-width': stroke_width+'px', 'fill': 'white' })
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
      reply  = sampleTree;//.slice(1,-1).replace(/\\/g, "");
      //console.log(example);
      tree.nodes = JSON.parse(reply);
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
        tree.nodes.push({ id: '00', text: 'Sentence', x: tree.cx, y: tree.cy, isLeaf: false, tWidth: 0, depth:0, kids: [] });
        //console.log(tree.nodes);
        refresh();
        reposition(tree.nodes[0]);
        redraw();
    }

    getJSON = function(json_tree,num){//testing how to return json value and parameter names
      if(document.getElementById('tree-'+num) == null){
        var div = document.createElement("div");
        div.setAttribute("id", "tree-"+num);
        document.getElementById("TreeArea").appendChild(div);
        initialise(num);
      }
      resetTree();
      var myObj = json_tree;
      var treeNames = Object.keys(myObj);
      var parent = tree.nodes[0];
      var depth = 0;
      for(name in treeNames){
        recursiveGetProperty(myObj, treeNames[name],function(obj) {
        },parent,depth);
      }
      TreeJSON();

      /*if(document.getElementById('CompareTree').style.display == "none"){
        document.getElementById('CompareTree').style.display = 'block';
      }
      */
    }

    function recursiveGetProperty(obj, lookup, callback, parent, depth) {
       depth++;
       for (property in obj) {
           if (property == lookup) {
             var obj2 = obj[property];
             var t = Object.keys(obj2);
             //console.log(t);
             for(name in t){
               parent2 = tree.addFromJSON(parent, t[name], name, depth);
               if(t[name]!=undefined){
                callback(t[name]);
              }

                recursiveGetProperty(obj2, t[name], callback, parent2, depth);
             }
           }
       }
       //console.log("<--->");
    }

    getStruc = function(teacher,student){//testing how to return json value and parameter names

      //console.log(teacher[0].kids[0]);
      diff_count=0;

      //teacher = JSON.stringify(teacher).slice(1,-1).replace(/\\/g, "");
      student = JSON.stringify(student).slice(1,-1).replace(/\\/g, "");

      //var tea = JSON.parse(teacher);
      var student = JSON.parse(student);


      console.log('Teacher : ' ,teacher[0]);
      console.log('Student : ' ,student[0]);

      scan(teacher[0],student[0]);

      console.log('Finished Comparing - Number of Differences :',diff_count);
    }

    scan = function(obj,obj2){
      //console.log("test - ", 1<undefined);
        var k;
        if(obj instanceof Object & obj2 instanceof Object){
            for(k in comp){
              if(obj.hasOwnProperty(comp[k]) & obj2.hasOwnProperty(comp[k])){
                if(comp[k]=='kids'){
                  //console.log('Teacher-kids : ',obj[comp[k]] ,obj[comp[k]].length);
                  //console.log('Student-kids : ',obj2[comp[k]] ,obj2[comp[k]].length);
                  var length = (obj[comp[k]].length>=obj2[comp[k]].length)? obj[comp[k]].length:obj2[comp[k]].length
                  console.log(length);
                  for(var i = 0;i<length;i++){
                    console.log('Teacher : ' ,(obj[comp[k]])[i]);
                    console.log('Student : ' ,(obj2[comp[k]])[i]);
                    scan((obj[comp[k]])[i],(obj2[comp[k]])[i]);
                  }
                }else{
                    scan( obj[comp[k]],obj2[comp[k]] );
                }
              }
              else{
                scan( obj[comp[k]],obj2[comp[k]]);
              }
            }
        }
        else{
          if(obj!=obj2){
            console.log('Difference found in values | ', 'Teacher : ',obj,' | Student : ',obj2)
            //console.log('Teacher : ',obj)
            //console.log('Student : ',obj2)
            //console.log('Lose marks - TBD')
            diff_count++;
          }
        };
    };

    TreeJSON = function(){
      //console.log(tree.nodes);
      JSONData = JSON.stringify(tree.nodes);
      console.log(JSONData);
      getStruc(tree.nodes,student);
    }

      $(document).ready(function() {
        $("#driver").click(function(event){
           $.post(
              "http://localhost:8000/treetest",
              {body},
              function(data) {
                console.log(data);
                reply  = JSON.stringify(data).slice(1,-1).replace(/\\/g, "");
                tree.nodes = JSON.parse(reply);
                reposition(tree.nodes[0]);
                redraw();
              }
           );
        });
     });

    //set up the page
    initialise = function (num) {

        //add the root node
        tree.nodes.push({ id: '00', text: 'Sentence', x: tree.cx, y: tree.cy, parent:'none',isLeaf: false, tWidth: 0, depth:0, kids: [] });

        //create the svg
        d3.select("#tree-"+num).style().append('svg').attr('width', svgWidth).attr('height', svgHeight).attr('id', 'svgTree-'+num)
            ;

        //create group of nodes
        d3.select('#svgTree-'+num).append('g').attr('id', 'nodes').selectAll('text').data(tree.getNodes())
            .enter().append('text').attr('id', function (node) { return node.id; })
            .attr('x', function (node) { return node.x; }).attr('y', function (node) { return node.y + 5; })
            .text(function (node) { return node.text; })
            .attr('tWidth', function (node) { var n = tree.getNode(node); n.tWidth = this.getBBox().width; return this.getBBox().width; /*return tree.getTextWidth(node);*/ })
            .style({ 'text-anchor': 'middle', 'cursor': 'pointer' })
            .on('click', function (node) { return tree.addLeaf(node.id); });

        //create group of links
        d3.select('#svgTree-'+num).append('g').attr('id', 'links').selectAll('line').data(tree.getLinks())
            .enter().append('line')
            .attr('x1', function (link) { return link.fromX; }).attr('y1', function (link) { return link.fromY; })
            .attr('x2', function (link) { return link.toX; }).attr('y2', function (link) { return link.toY; });

        //create group of triangles
        d3.select('#svgTree-'+num).append('g').attr('id', 'triangles').selectAll('polygon').data(tree.getTriangles())
            .enter().append('polygon')
            .attr('points', function (triangle) { return (triangle.topX + ',' + triangle.topY + ' ' + triangle.leftX + ',' + triangle.leftY + ' ' + triangle.rightX + ',' + triangle.rightY) });


        //Show the legend in top left corner
        var controlsInfo = [
            //{ id: 'c1', action: 'Add Leaf : ', buttons: ' Click on a Node', x: 5, y: 15 },
            //{ id: 'c2', action: 'Remove Leaf : ', buttons: ' Hold Ctrl & Click on a Leaf', x: 5, y: 30 },
            //{ id: 'c3', action: 'Change Node Text : ', buttons: ' Hold Shift & Click on a Node', x: 5, y: 45 }
        ];
        d3.select('#svgTree-'+num).append('g').attr('id', 'legend').selectAll('text').data(controlsInfo)
            .enter().append('text').attr('id', function (c) { return c.id; })
            .attr('x', function (c) { return c.x; }).attr('y', function (c) { return c.y; }).text(function (c) { return c.action; })
            .attr('style', 'font-size:6; fill:black;').append('tspan').attr('x', 100).attr('y', function (c) { return c.y; }).text(function (c) { return c.buttons; });
        redraw();
    }

    //initialise();


    return tree;
}
var tree = tree();
