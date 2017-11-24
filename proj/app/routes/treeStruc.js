function tree (JSONTree){
        //var d3 = require("d3");

        var svgWidth = 1200,
            svgHeight = svgWidth/2;

        var devide = 2,
            fontsize = svgWidth/80,
            linkSpace = fontsize-1,
            trainglepadding = fontsize
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

        var example = '[{"id":"00","text":"Clause","x":600,"y":15,"kids":[{"id":"id1.5","text":"Participant 1","x":480,"y":75,"parent":"Clause","kids":[{"id":"id2.5","text":"This Little Piggy","x":480,"y":135,"parent":"Participant 1","kids":[],"isLeaf":true,"tWidth":117.5,"depth":2}],"isLeaf":false,"tWidth":90.9000015258789,"depth":1},{"id":"id3.5","text":"Process","x":600,"y":75,"parent":"Clause","kids":[{"id":"id4.5","text":"Had","x":600,"y":135,"parent":"Process","kids":[],"isLeaf":true,"tWidth":30.600000381469727,"depth":2}],"isLeaf":false,"tWidth":59.016666412353516,"depth":1},{"id":"id5.5","text":"Participant 2","x":720,"y":75,"parent":"Clause","kids":[{"id":"id6.5","text":"None","x":720,"y":135,"parent":"Participant 2","kids":[],"isLeaf":true,"tWidth":39.58333206176758,"depth":2}],"isLeaf":false,"tWidth":93.0999984741211,"depth":1}],"isLeaf":false,"tWidth":50.31666564941406}]';

        var JSONData;

        var JSONTree2 = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{}},"Participant 2":{"None":{}}}}';

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
                    reposition(tree.nodes[0]);
                    return;
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
              //console.log(parent);
              function addLeaf(node) {
                  if (node.id == parent.id) {
                      node.kids.push({ id: 'id' + (tree.size - .5), text: child, x: node.x, y: node.y, parent:parent.text, isLeaf: true, tWidth: 0, depth:depth,  kids: [] }); node.isLeaf = false;
                      reposition(tree.nodes[0]);
                      return;
                  }
                  node.kids.forEach(addLeaf);
              }
              addLeaf(node);
              return node.kids[pos];
     }

        //get leaf count for node
        getLeafCount = function (node) {
            if (node.kids.length == 0) { return 1; }
            else { return node.kids.map(getLeafCount).reduce(function (a, b) { return a + b; }); }
        }

        function getJSON(j_tree){//testing how to return json value and parameter names
          var myObj = JSON.parse(j_tree);
          var treeNames = Object.keys(myObj);
          var parent = tree.nodes[0];
          var depth = 0;
          for(name in treeNames){
            recursiveGetProperty(myObj, treeNames[name],function(obj) {
              console.debug(obj);

            },parent,depth);
          }
          tree.getTriangles();
        }

        function recursiveGetProperty(obj, lookup, callback, parent, depth) {
           depth++;
           for (property in obj) {
               if (property == lookup) {
                 var obj2 = obj[property];
                 var t = Object.keys(obj2);
                 for(name in t){
                   parent2 = tree.addFromJSON(parent,t[name],name,depth);
                   //console.log(parent2);
                   if(t[name]!=undefined){
                    callback(t[name]);
                  }
                    recursiveGetProperty(obj2, t[name], callback,parent2,depth);
                 }


               }
               else if (obj[property] instanceof Object) {
                   recursiveGetProperty(obj[property], lookup, callback,parent2,depth);
               }

               //if(obj.property!=null)
                //recursiveGetProperty(obj.property, lookup, callback);
           }
           //console.log("<--->");
        }

        function getStruc(j_tree){//testing how to return json value and parameter names
          var myObj = JSON.parse(j_tree);
          var treeNames = Object.keys(myObj);
          for(name in treeNames){
            recursiveGetProperty(myObj, treeNames[name],function(obj) {
              console.debug(obj);

            });
          }
        }

        function recursiveGetProperty2(obj, lookup, callback) {
           for (property in obj) {
               if (property == lookup) {
                 var obj2 = obj[property];
                 var t = Object.keys(obj2);
                 for(name in t){
                   parent2 = tree.addFromJSON(parent,t[name],name);
                   if(t[name]!=undefined){
                    callback(t[name]);
                  }
                    recursiveGetProperty(obj2, t[name], callback);
                 }
               }
               else if (obj[property] instanceof Object) {
                   recursiveGetProperty(obj[property], lookup, callback);
               }
             }
        }
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
            });

        }

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
        TreeJSON = function(){
          console.log(tree.nodes);
          JSONData = JSON.stringify(tree.nodes);
          console.log(JSONData);
        }

        //set up the page
        initialise = function () {
            //add the root node
            tree.nodes.push({ id: '00', text: 'Clause', x: tree.cx, y: tree.cy, isLeaf: false, tWidth: 0, depth:0, kids: [] });
        }

        initialise();
        getJSON(JSONTree)

        return tree.nodes;
    }

    module.exports = {
       tree
    };
