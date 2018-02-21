  var anno_array = [];
  var text_array = [];
  var sentence_array = [];
  var sentence = "";
  var WholeTree = {};

  var num = 0;
  var TreeNum = 0;
  var cur_id = 0;

  //Setting number of notches on slide - number of SFLs
  setTreeNum = function() {
    TreeNum = ($("#CurrentTree").val()) * 4;
    return TreeNum;
  }

  bubbleSortAnno = function(a) {
    for (var i = 0; i < a.length; i += 1) {
      for (var j = 2; j < a.length - i; j += 4) {
        if (a[j] > a[j + 4]) {
          var temp_1 = a[j - 2];
          var temp_2 = a[j - 1];
          var temp_3 = a[j];
          var temp_4 = a[j + 1];
          //-----
          a[j - 2] = a[j + 2];
          a[j - 1] = a[j + 3];
          a[j] = a[j + 4];
          a[j + 1] = a[j + 5];
          //-----
          a[j + 2] = temp_1;
          a[j + 3] = temp_2;
          a[j + 4] = temp_3;
          a[j + 5] = temp_4;
        }
      }
    }
    console.log(a);
    return a
  }

  //$("#genNew").click(function() {
  window.onload = function() {
    if (document.getElementById('tree-' + num) == null) {
      var div = document.createElement("div");
      div.setAttribute("id", "tree-" + num);
      document.getElementById("TreeArea").appendChild(div);
      initialise(num);
    }

    obj = new Array();
    var ann2 = $("#content2").annotator();
    var ann = $("#content").annotator(); //Assign container to hold annotator content

    ann.annotator('addPlugin', 'fileStorage'); // Add Storage Plugin
    ann2.annotator('addPlugin', 'fileStorage');

    ann.annotator('loadAnnotations', obj);
    ann2.annotator('loadAnnotations', obj);

    $("#genNew").hide(0, function() {
      $("#annotationInput").hide(0, function() {
        $("#AnnoToTree").hide(0, function() {
          $("#CompareTree").hide(0, function() {
            $("#CurrentTree").hide(0);
          });
        });
        //$("#generateTrees").show(250, function(){
        //$("#generateBoxes").show(250, function(){
        //$("#generateTheme").show(250, function(){
        //$("#dwnJson").show(250, function(){
        //$("#themeAnalyse").show(250);
        //});
        //});
        //});
        //});
      });
    });

  };


  createWholeTree = function() {
    //Treenum = setTreeNum();
    WholeTree = {};
    sentence = sentence_array[TreeNum].split(' ').join('').toLowerCase();


    //changing i from 1 to 0
    for (var i = 0; i < anno_array.length; i += 4) {

      //console.log(sentence_array[TreeNum + 2], anno_array[i + 2], sentence_array[TreeNum + 3], anno_array[i + 3]);

      //if(sentence_array[TreeNum].indexOf(anno_array[i-1])!=-1){
      if ((sentence_array[TreeNum + 2] <= anno_array[i + 2] && sentence_array[TreeNum + 3] >= anno_array[i + 3]) && (sentence_array[TreeNum].indexOf(anno_array[i]) > -1)) {

        var Tree = {
          [anno_array[i]]: {}
        };

        texts = ((anno_array[i + 1]).replace("[", "").replace("]", "")).split(",");

        for (var pos = texts.length - 1; pos >= 0; pos--) {
          var curNode = {
            [(texts[pos].replace("\"", "")).slice(0, -1)]: Tree
          };
          Tree = curNode;
        }
        _.merge(WholeTree, Tree);
      } else {
        console.log(anno_array[i], "- is not in the sentence -", sentence_array[TreeNum]);
      }
    }
  }

  Annotator.Plugin.fileStorage = function(element) {
    return {
      pluginInit: function() {
        this.annotator.subscribe("annotationCreated", function(annotation) {
            //current work area

            //Checks for sentence tag - which will add it to sentence array for cehcking against words
            if (((annotation.text).toUpperCase()).indexOf("SENTENCE") != -1) {
              var list = document.getElementById('Tree_list');
              var entry = document.createElement('li');
              entry.appendChild(document.createTextNode(annotation.quote));
              entry.className = "list-group-item";
              entry.setAttribute("id", cur_id);
              cur_id++;
              list.appendChild(entry);

              sentence_array.push(annotation.quote);
              sentence_array.push(annotation.text);
              sentence_array.push(annotation.ranges[0].startOffset);
              sentence_array.push(annotation.ranges[0].endOffset);
              //document.getElementById("CurrentTree").setAttribute("max", ((sentence_array.length) / 4) - 1);
            } else {
              anno_array.push(annotation.quote);
              anno_array.push(annotation.text);
              anno_array.push(annotation.ranges[0].startOffset);
              anno_array.push(annotation.ranges[0].endOffset);
            }
            anno_array = bubbleSortAnno(anno_array);

            if (annotation.quote.length > 0 && annotation.text.length > 0) {
              annotation.url = currentUrl;

              var data = obj;
              if (data == undefined) {
                data = new Array();
                annotation.id = 1;
                data.push(annotation);
              } else {
                if (data.length == 0) {
                  annotation.id = 1;
                  data.push(annotation);
                } else {
                  lastId = 0;
                  for (var i = 0; i < data.length; i++) {
                    if (data[i].id > lastId) {
                      lastId = data[i].id;
                    }
                  }
                  lastId++;
                  annotation.id = lastId;
                }
              }

              $(annotation.highlights).attr("data-annotation-id", annotation.id);
              $(annotation.highlights).attr("id", "annotation_" + annotation.id);
              $(annotation.highlights).addClass("annotation_" + annotation.id);
              //////console.log.log(JSON.stringify(Tree));
              obj.push(annotation);

            }
          })
          .subscribe("annotationDeleted", function(annotation) {
            // Check if the annotation actually exists (workaround annotatorjs bug #258).
            if (annotation.id) {
              ////console.log.log(annotation);

              if (((annotation.text).toUpperCase()).indexOf("SENTENCE") != -1) {
                for (var i = 0; i < sentence_array.length; i = i + 4) {
                  if (annotation.quote == sentence_array[i]) {
                    sentence_array.splice(i, i + 4, null, null, null, null);
                    console.log((document.getElementById(i / 4)).innerHTML);
                    var elem = document.getElementById(i / 4);
                    elem.parentNode.removeChild(elem);
                  }
                }

                //document.getElementById("CurrentTree").setAttribute("max", ((sentence_array.length) / 4) - 1);
              } else {
                for (var i = 0; i < anno_array.length; i = i + 4) {
                  if (annotation.quote == anno_array[i]) {
                    //console.log(annotation.quote);
                    anno_array.splice(i, i + 4);
                  }
                }
              }

              for (var i = 0; i < obj.length; i++) {
                if (annotation.id == obj[i].id) {
                  obj.splice(i, 1);
                }
              }

            } else {
              // Event was called when user clicked cancel. Do nothing.
            }
          })
          .subscribe("annotationUpdated", function(annotation) {

            for (var i = 0; i < anno_array.length; i = i + 4) {
              if (annotation.quote == anno_array[i]) {
                anno_array.splice(i, i + 4, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset);
              }
            }

            for (var i = 0; i < obj.length; i++) {
              if (annotation.id == obj[i].length) {
                obj[i].text = annotation.text;
              }
            }
          })
      }
    };
  };

  var example1; //Taggle instance to be saved here

  var currentUrl = "1"; // Default mode is grammar analysis

  var firstOrder = ["--",
    "Carrier",
    "Actor/Subject/Theme",
    "Extent/Adjunct",
    "Pr:Material",
    "Scope/Complement",
    "Cause/Adjunct",
    "Carrier/Subject/Theme",
    "Pr:Relational",
    "Attribute(Location)/Complement",
    "Textual Theme",
    "Sensor/Subject/Theme",
    "Goal", "Pr:Mental",
    "Phenomenon/Complement",
    "Circ:Manner",
    "Circ:Cause",
    "&",
    "Circumstance",
    "Participant",
    "Process",
    "Contingency",
    "Contingency/Subject",
    "Goal/Subject",
    "Actor",
    "Actor/Subject",
    "Senser/Subject",
    "Pr:Material/Theme",
    "A",
    "Particpant/Ngp",
    "q/PP",
    "cv/Ngp",
    "Sentence"
  ];

  var secondOrder = ["Ngp",
    "PP",
    "Pgp",
    "Clause",
    "Adjgp",
    "Qtgp",
    "GP",
    "Vgp"
  ];

  var thirdOrder = ["pd", "v",
    "qd", "dd",
    "m", "th",
    "q", "P",
    "cv", "t",
    "a", "sc",
    "f", "ad",
    "am", "po",
    "g", "F/Aux",
    "Aux", "E",
    "N", "F"
  ];

  //--- SFL.js

  function tree() {

    var node_length = 0;
    var node_count = 0;
    var previous_x = 0;

    var svgWidth = (document.getElementById('TreeArea').offsetWidth) * .985,
      svgHeight = svgWidth / 2;

    var devide = 2,
      fontsize = svgWidth / 90,
      linkSpace = fontsize - 1,
      trainglepadding = fontsize - 2,
      stroke_width = fontsize / 15

    var tree = {
      cx: svgWidth / 2,
      cy: svgHeight / 40,
      w: svgHeight / 4,
      h: svgHeight / 10,
      size: 1,
      leafDepth: Infinity,
      nodes: []
    };

    //////console.log.log(svgWidth);
    //////console.log.log(tree.cx);

    var uniformDepth = true;
    var addNode = false;
    var removeNode = false;
    var changeText = false;
    var svgNodes;
    var JSONData;

    //get the nodes
    tree.getNodes = function() {
      var n = [];

      function getNodes(node) {
        n.push({
          id: node.id,
          text: node.text,
          x: node.x,
          y: node.y,
          kids: node.kids,
          isLeaf: node.isLeaf,
          tWidth: node.tWidth
        });
        node.kids.forEach(function(kid) {
          return getNodes(kid);
        });
      }
      getNodes(tree.nodes[0]);
      return n.sort(function(a, b) {
        return a.id - b.id;
      });
    }

    //get the links
    tree.getLinks = function() {
      var l = [];

      function getLinks(node) {
        node.kids.forEach(function(kid) {
          if (!kid.isLeaf) {
            l.push({
              fromId: node.id,
              fromX: node.x,
              fromY: node.y,
              toId: kid.id,
              toX: kid.x,
              toY: kid.y
            });
          }
        });
        node.kids.forEach(getLinks);
      }
      getLinks(tree.nodes[0]);
      return l.sort(function(a, b) {
        return a.toId - b.toId
      });
    }

    //get the triangles -- size of the trees
    tree.getTriangles = function() {
      var t = [];

      function getTriangles(node) {
        node.kids.forEach(function(kid) {
          if (kid.isLeaf) {
            t.push({
              fromId: node.id,
              toId: kid.id,
              topX: node.x,
              topY: (node.y + 10),
              leftX: (kid.x - (kid.tWidth / 3)),
              leftY: (kid.y - 10),
              rightX: (kid.x + (kid.tWidth / 3)),
              rightY: (kid.y - 10)
            });
          }
        }); //10
        node.kids.forEach(getTriangles);
      }
      getTriangles(tree.nodes[0]);
      return t.sort(function(a, b) {
        return a.toId - b.toId
      });
    }

    //returns node object from nodes array
    tree.getNode = function(thisNode) {
      var n;
      //////console.log.log('thisNode');
      //////console.log.log(thisNode);
      function getNode(node) {
        if (node.id == thisNode.id) {
          n = node;
        }
        node.kids.forEach(getNode);
      }
      getNode(tree.nodes[0]);
      //////console.log.log('n');
      //////console.log.log(n);
      return n;
    }

    //add a new leaf - have to look into refactoring this code
    tree.addLeaf = function(parent) {
      tree.size++;
      //////console.log.log(parent);
      function addLeaf(node) {
        //////console.log.log(parent);
        //////console.log.log(node);
        if (node.id == parent) {
          //////console.log.log("addLeaf");
          ////console.log.log('id' + (tree.size - 1));
          node.kids.push({
            id: 'id' + (tree.size),
            text: 'Node' + (tree.size),
            x: node.x,
            y: node.y,
            kids: [],
            isLeaf: true,
            tWidth: 0
          });
          node.isLeaf = false;
          refresh();
          reposition(tree.nodes[0]);
          redraw();
          return;
        }
        node.kids.forEach(addLeaf);
      }
      addLeaf(tree.nodes[0]);
      //                reposition(tree.nodes[0]);
      //                redraw();
    }

    //add a new leaf - have to look into refactoring this code
    tree.addFromJSON = function(parent, child, pos, depth) {
      tree.size++;
      var node = parent;
      //////console.log.log("parent- ",parent.text);
      //////console.log.log("child- ",child);


      // /////console.log.log(parent);
      function addLeaf(node) {
        var draw = true;
        if (node.id == parent.id) {
          if (node.kids != null) {
            //////console.log.log('node : ', node , ' | kid :' , node.kids);
            for (x in node.kids) {
              if (node.kids[x].text == child) {
                draw = false;
              }
            }
          }
          if (draw) {
            node.kids.push({
              id: 'id' + (tree.size - .5),
              text: child,
              x: node.x,
              y: node.y,
              parent: parent.text,
              isLeaf: true,
              tWidth: 0,
              depth: depth,
              kids: []
            });
            node.isLeaf = false;
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
    //sets leafs depth to deepest leaf
    tree.nodeDepth = function() {
      var leafs = [];
      var depth = 0;

      //check if nodes are leafs
      function nodeDepth(n) {
        n.kids.forEach(function(kid) {
          if (kid.isLeaf) {
            leafs.push({
              id: kid.id
            });
            if (kid.y > depth) {
              depth = kid.y;
            }
          }
        });
        n.kids.forEach(nodeDepth);
      }
      nodeDepth(tree.nodes[0]);

      function changeDepth(n) {
        n.kids.forEach(function(kid) {
          leafs.forEach(function(leaf) {
            if (kid.id == leaf.id) {
              kid.y = depth;
            }
          })

        });
        n.kids.forEach(changeDepth);
      }
      changeDepth(tree.nodes[0]);
      tree.leafDepth = depth;
    }

    //update/refresh svg
    refresh = function() {
      d3.select('#nodes').selectAll('text').data(tree.getNodes()).remove();
      d3.select('#links').selectAll('line').data(tree.getLinks()).remove();
      d3.select('#triangles').selectAll('polygon').data(tree.getTriangles()).remove();
    }

    //redraw the tree
    redraw = function() {
      d3.select('#nodes').selectAll('text').data(tree.getNodes()).exit().remove();
      d3.select('#links').selectAll('line').data(tree.getLinks()).exit().remove();
      d3.select('#triangles').selectAll('polygon').data(tree.getTriangles()).exit().remove();

      var nodes = d3.select('#nodes').selectAll('text').data(tree.getNodes());

      nodes.text(function(node) {
          return node.text
        }) /*.transition().duration(500)*/
        .attr('x', function(node) {
          return node.x;
        }).attr('y', function(node) {
          return node.y + 5;
        }) //5
        .attr('fill', function(node) {
          if (node.isLeaf) {
            return 'black';
          } else {
            return 'black';
          }
        }); //red|blue

      nodes.enter().append('text').attr('id', function(node) { /*////console.log.log('id = ' + node.id);*/
          return node.id;
        })
        .attr('x', function(node) {
          return node.x;
        }).attr('y', function(node) {
          return node.y + 5;
        })
        .text(function(node) {
          return node.text;
        })
        .attr('tWidth', function(node) {
          var n = tree.getNode(node);
          n.tWidth = this.getBBox().width;
          return this.getBBox().width;
        })
        //Change font below
        .style({
          'text-anchor': 'middle',
          'cursor': 'pointer',
          'font-size': fontsize
        })
        //.on('click', function (node) { if (d3.event.shiftKey) { return tree.changeText(node); } else if (d3.event.ctrlKey) { return tree.removeLeaf(node); } else { return tree.addLeaf(node.id); } })
        /*.transition().duration(500)*/
        .attr('x', function(node) {
          return node.x;
        }).attr('y', function(node) {
          return node.y + 5;
        });


      var links = d3.select('#links').selectAll('line').data(tree.getLinks());

      links /*.transition().duration(500)*/
        .attr('x1', function(link) {
          return link.fromX;
        }).attr('y1', function(link) {
          return link.fromY + linkSpace;
        }) //10
        .attr('x2', function(link) {
          return link.toX;
        }).attr('y2', function(link) {
          return link.toY - linkSpace;
        });

      links.enter().append('line')
        .attr('x1', function(link) {
          return link.fromX;
        }).attr('y1', function(link) {
          return link.fromY + linkSpace;
        })
        .attr('x2', function(link) {
          return link.toX;
        }).attr('y2', function(link) {
          return link.toY - linkSpace;
        })

        .style({
          'stroke': 'black',
          'stroke-width': stroke_width + 'px'
        }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
        /*.transition().duration(500)*/
        .attr('x2', function(link) {
          return link.toX;
        }).attr('y2', function(link) {
          return link.toY - linkSpace;
        });


      var triangles = d3.select('#triangles').selectAll('polygon').data(tree.getTriangles());

      triangles /*.transition().duration(500)*/
        .attr('points', function(triangle) {
          return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX - trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX + trainglepadding) + ',' + triangle.rightY)
        });

      triangles.enter().append('polygon')
        .attr('points', function(triangle) {
          return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX - trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX + trainglepadding) + ',' + triangle.rightY)
        })
        .style({
          'stroke': 'black',
          'stroke-dasharray': 0,
          'stroke-width': stroke_width + 'px',
          'fill': 'white'
        }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
        /*.transition().duration(500)*/
        .attr('points', function(triangle) {
          return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX - trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX + trainglepadding) + ',' + triangle.rightY)
        });
    }

    //get leaf count for node
    getLeafCount = function(node) {
      if (node.kids.length == 0) {
        return 1;
      } else {
        return node.kids.map(getLeafCount).reduce(function(a, b) {
          return a + b;
        });
      }
    }

    //update node positions
    /*reposition = function (node) {

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

    }*/

    reposition = function(node) {

      if (uniformDepth) {
        tree.nodeDepth();
      }

      var leafCount = getLeafCount(node),
        left = node.x - tree.w * (leafCount - 1) / 2;
      node.kids.forEach(function(kid) {
        var alter = 0;
        var w = tree.w * getLeafCount(kid);
        left += w;

        if ((kid.kids[0]) != undefined && ((kid.kids[0]).kids).length == 0) {

          var cur = (kid.kids[0].text).split(' ').join('');
          if (cur.toLowerCase() == sentence.substring(0, cur.length)) {
            sentence = sentence.substring(cur.length, sentence.length);
            for (x in SFL_node_pos) {
              var pos_test = Math.abs(SFL_node_pos[x] - (left - (w + tree.w) / 2))
              console.log(pos_test);
              if (pos_test >= 0 && pos_test <= (tree.w) / 2)
                alter = -(tree.w);
            }
            kid.x = left - (w + tree.w) / 2 + alter;
            SFL_node_pos.push(kid.x);
          } else {
            alter = tree.w;
            for (x in SFL_node_pos) {
              var pos_test = Math.abs(SFL_node_pos[x] - (left - (w + tree.w) / 2))
              if (pos_test >= 0 && pos_test <= (tree.w) / 2)
                alter += tree.w;
            }
            kid.x = left - (w + tree.w) / 2 + alter;
            SFL_node_pos.push(kid.x);
          }
        } else {
          kid.x = left - (w + tree.w) / 2;
        }
        //kid.x = left - (w + tree.w) / 2 + alter;
        kid.y = node.y + tree.h;
        //SFL_node_pos.push(kid.x);
        reposition(kid);
        //redraw();
      });
      console.log(tree.w);
    }
    getNodeLength = function(node) {
      node.kids.forEach(function(kid) {
        getNodeLength(kid);
        if ((kid.kids).length == 0) {
          node_length++;
        }
      });

    }

    //save the tree structure as JSON
    saveTree = function() {
      ////console.log.log(tree.nodes);
      JSONData = JSON.stringify(tree.nodes);
      ////console.log.log(JSONData);
    }

    exampleTree = function() {
      reply = sampleTree; //.slice(1,-1).replace(/\\/g, "");
      //////console.log.log(example);
      tree.nodes = JSON.parse(reply);
      reposition(tree.nodes[0]);
      redraw();
    }

    //save the tree structure as JSON
    loadTree = function() {
      tree.nodes = JSON.parse(JSONData);
      ////console.log.log(tree.nodes);
      refresh();
      reposition(tree.nodes[0]);
      redraw();
    }

    resetTree = function() {
      tree.nodes = [];
      tree.nodes.push({
        id: '00',
        text: 'Clause',
        x: tree.cx,
        y: tree.cy,
        isLeaf: false,
        tWidth: 0,
        depth: 0,
        kids: []
      });
      refresh();
      reposition(tree.nodes[0]);
      redraw();
    }

    /*getJSON = function(json_tree, num) { //testing how to return json value and parameter names
      ////console.log.log("hi", JSON.stringify(json_tree));

      body = JSON.stringify(json_tree)
      var d_width = JSON.stringify(document.getElementById('TreeArea').offsetWidth);
      ////console.log.log(d_width);
      $.ajax({
        url: "http://localhost:8000/treetest",
        type: "POST",
        data: {
          body
        },
        contentType: "application/json",
        sucess: console.log.log("success"),
        complete: function(data) {
          ////console.log.log(data);
        }
      });

      if (document.getElementById('tree-' + num) == null) {
        var div = document.createElement("div");
        div.setAttribute("id", "tree-" + num);
        document.getElementById("TreeArea").appendChild(div);
        initialise(num);
      }
      resetTree();

      //api call ---


      var myObj = json_tree;
      var treeNames = Object.keys(myObj);
      var parent = tree.nodes[0];
      var depth = 0;
      for (name in treeNames) {
        recursiveGetProperty(myObj, treeNames[name], function(obj) {}, parent, depth);
      }


      TreeJSON();
    }*/

    function recursiveGetProperty(obj, lookup, callback, parent, depth) {
      depth++;
      for (property in obj) {
        if (property == lookup) {
          var obj2 = obj[property];
          var t = Object.keys(obj2);
          //////console.log.log(t);
          for (name in t) {
            parent2 = tree.addFromJSON(parent, t[name], name, depth);
            if (t[name] != undefined) {
              callback(t[name]);
            }

            recursiveGetProperty(obj2, t[name], callback, parent2, depth);
          }
        }
      }
      //////console.log.log("<--->");
    }

    TreeJSON = function() {
      //////console.log.log(tree.nodes);
      JSONData = JSON.stringify(tree.nodes);
      ////console.log.log(JSONData);
      //getStruc(tree.nodes,student);
    }

    var percentage = ['%']
    var diff_array = [];
    var SFL_node_pos = [];


    //API CALLS
    $(document).ready(function() {
      //$("#AnnoToTree").click(function(event) {
      $("#Tree_list").click(function(e) {

        if (e.target && e.target.nodeName == "LI") {
          ////console.log.log(e.target.innerHTML);
          ////console.log.log(e.target.id);
          TreeNum = e.target.id * 4;
        }
        ////console.log.log(TreeNum);

        diff_array = [];
        percentage = ['%'];
        var count = 0;
        teacher_segmented_sentence = [];
        student_segmented_sentence = [];

        createWholeTree();

        if (document.getElementById('tree-' + num) == null) {
          var div = document.createElement("div");
          div.setAttribute("id", "tree-" + num);
          document.getElementById("TreeArea").appendChild(div);
          initialise(num);
        }

        body = JSON.stringify(WholeTree)

        node_length = 0;
        node_count = 0;
        previous_x = 0;
        SFL_node_pos = [];
        var assignment_content = {};

        $.post(
          "http://localhost:8000/treetest", {
            body
          },
          function(data) {
            ////console.log.log(sentence);
            var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
            tree.nodes = JSON.parse(res);

            body_s = JSON.stringify(tree.nodes);
            console.log(body_s);
            //body_t = JSON.stringify(tree.nodes);

            $.post(
              "http://localhost:8000/grading", {
                body_s,
                sentence
              },
              function(data_) {
                student_content["Grading"] = data_;
                //console.log(data_);
              }
            );

            sentence = sentence_array[TreeNum].split(' ').join('').toLowerCase();
            getNodeLength(tree.nodes[0]);
            reposition(tree.nodes[0]);
            ////console.log.log(sentence);
            redraw();
            node_length = 0;
            node_count = 0;
            previous_x = 0;
          }
        );

        //  console.log(tree.nodes);

        assignment_content["sentence"] = sentence;
        assignment_content["SFG Tree"] = tree.nodes;

        var student_content = {
          Assignment_1: assignment_content
        };
        console.log(student_content);

      });
    });


    //set up the page
    initialise = function(num) {

      //add the root node
      tree.nodes.push({
        id: '00',
        text: 'Clause',
        x: tree.cx,
        y: tree.cy,
        parent: 'none',
        isLeaf: false,
        tWidth: 0,
        depth: 0,
        kids: []
      });

      //create the svg
      d3.select("#tree-" + num).style().append('svg').attr('width', svgWidth).attr('height', svgHeight).attr('id', 'svgTree-' + num);

      //create group of nodes
      d3.select('#svgTree-' + num).append('g').attr('id', 'nodes').selectAll('text').data(tree.getNodes())
        .enter().append('text').attr('id', function(node) {
          return node.id;
        })
        .attr('x', function(node) {
          return node.x;
        }).attr('y', function(node) {
          return node.y + 5;
        })
        .text(function(node) {
          return node.text;
        })
        .attr('tWidth', function(node) {
          var n = tree.getNode(node);
          n.tWidth = this.getBBox().width;
          return this.getBBox().width; /*return tree.getTextWidth(node);*/
        })
        .style({
          'text-anchor': 'middle',
          'cursor': 'pointer'
        })
      //.on('click', function (node) { return tree.addLeaf(node.id); });

      //create group of links
      d3.select('#svgTree-' + num).append('g').attr('id', 'links').selectAll('line').data(tree.getLinks())
        .enter().append('line')
        .attr('x1', function(link) {
          return link.fromX;
        }).attr('y1', function(link) {
          return link.fromY;
        })
        .attr('x2', function(link) {
          return link.toX;
        }).attr('y2', function(link) {
          return link.toY;
        });

      //create group of triangles
      d3.select('#svgTree-' + num).append('g').attr('id', 'triangles').selectAll('polygon').data(tree.getTriangles())
        .enter().append('polygon')
        .attr('points', function(triangle) {
          return (triangle.topX + ',' + triangle.topY + ' ' + triangle.leftX + ',' + triangle.leftY + ' ' + triangle.rightX + ',' + triangle.rightY)
        });


      //Show the legend in top left corner
      var controlsInfo = [
        //{ id: 'c1', action: 'Add Leaf : ', buttons: ' Click on a Node', x: 5, y: 15 },
        //{ id: 'c2', action: 'Remove Leaf : ', buttons: ' Hold Ctrl & Click on a Leaf', x: 5, y: 30 },
        //{ id: 'c3', action: 'Change Node Text : ', buttons: ' Hold Shift & Click on a Node', x: 5, y: 45 }
      ];
      d3.select('#svgTree-' + num).append('g').attr('id', 'legend').selectAll('text').data(controlsInfo)
        .enter().append('text').attr('id', function(c) {
          return c.id;
        })
        .attr('x', function(c) {
          return c.x;
        }).attr('y', function(c) {
          return c.y;
        }).text(function(c) {
          return c.action;
        })
        .attr('style', 'font-size:6; fill:black;').append('tspan').attr('x', 100).attr('y', function(c) {
          return c.y;
        }).text(function(c) {
          return c.buttons;
        });
      redraw();
    }

    //initialise();
    return tree;
  }

  var tree = tree();