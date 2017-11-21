function tree (JSONTree){
        //var d3 = require("d3");

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

        var example = '[{"id":"00","text":"Left Tree","x":300,"y":15,"kids":[{"id":"id1.5","text":"Node 1.5","x":300,"y":55,"kids":[{"id":"id2.5","text":"Node 2.5","x":150,"y":95,"kids":[{"id":"id9.5","text":"Node 9.5","x":100,"y":135,"kids":[{"id":"id10.5","text":"Node 10.5","x":50,"y":255,"kids":[],"isLeaf":true,"tWidth":76.80000305175781},{"id":"id11.5","text":"Node 11.5","x":150,"y":175,"kids":[{"id":"id12.5","text":"Node 12.5","x":150,"y":215,"kids":[{"id":"id13.5","text":"Node 13.5","x":150,"y":255,"kids":[],"isLeaf":true,"tWidth":76.83333587646484}],"isLeaf":false,"tWidth":76.76667022705078}],"isLeaf":false,"tWidth":74.41666412353516}],"isLeaf":false,"tWidth":69.46666717529297},{"id":"id16.5","text":"Node 16.5","x":250,"y":135,"kids":[{"id":"id17.5","text":"Node 17.5","x":250,"y":175,"kids":[{"id":"id18.5","text":"Node 18.5","x":250,"y":255,"kids":[],"isLeaf":true,"tWidth":77.01667022705078}],"isLeaf":false,"tWidth":74.5}],"isLeaf":false,"tWidth":76.98332977294922}],"isLeaf":false,"tWidth":69.31666564941406},{"id":"id3.5","text":"Node 3.5","x":400,"y":95,"kids":[{"id":"id4.5","text":"Node 4.5","x":350,"y":135,"kids":[{"id":"id14.5","text":"Node 14.5","x":350,"y":175,"kids":[{"id":"id15.5","text":"Node 15.5","x":350,"y":255,"kids":[],"isLeaf":true,"tWidth":76.69999694824219}],"isLeaf":false,"tWidth":77.0999984741211}],"isLeaf":false,"tWidth":69.6500015258789},{"id":"id5.5","text":"Node 5.5","x":450,"y":135,"kids":[{"id":"id6.5","text":"Node 6.5","x":450,"y":255,"kids":[],"isLeaf":true,"tWidth":69.53333282470703}],"isLeaf":false,"tWidth":69.25}],"isLeaf":false,"tWidth":69.38333129882812},{"id":"id7.5","text":"Node 7.5","x":550,"y":95,"kids":[{"id":"id8.5","text":"Node 8.5","x":550,"y":135,"kids":[{"id":"id19.5","text":"Node 19.5","x":550,"y":175,"kids":[{"id":"id20.5","text":"Node 20.5","x":550,"y":255,"kids":[],"isLeaf":true,"tWidth":79}],"isLeaf":false,"tWidth":76.91666412353516}],"isLeaf":false,"tWidth":69.56666564941406}],"isLeaf":false,"tWidth":67.05000305175781}],"isLeaf":false,"tWidth":66.96666717529297}],"isLeaf":false,"tWidth":68.30000305175781}]';

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
      tree.addFromJSON = function (parent,child,pos) {
        tree.size++;
              var node = parent;
              //console.log(parent);
              function addLeaf(node) {
                  if (node.id == parent.id) {
                      node.kids.push({ id: 'id' + (tree.size - .5), text: child, x: node.x, y: node.y, kids: [], isLeaf: true, tWidth: 0 }); node.isLeaf = false;
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
          for(name in treeNames){
            recursiveGetProperty(myObj, treeNames[name],function(obj) {
              console.debug(obj);

            },parent);
          }

          tree.getTriangles();
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
            tree.nodes.push({ id: '00', text: 'Clause', x: tree.cx, y: tree.cy, kids: [], isLeaf: false, tWidth: 0 });
        }

        initialise();
        getJSON(JSONTree)

        return tree.nodes;
    }

    module.exports = {
       tree
    };
