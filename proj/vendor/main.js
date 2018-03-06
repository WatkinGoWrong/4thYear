  var anno_array = [];
  var text_array = [];
  var sentence_array = [];
  var sentence = "";
  var WholeTree = {};

  var num = 0;
  var TreeNum = 0;
  var cur_id = 0;
  var node_array = [];
  var node_sentence_array = [];
  var assignment_content = {};


  //Setting number of notches on slide - number of SFLs
  setTreeNum = function() {
    TreeNum = ($("#CurrentTree").val()) * 4;
    console.log(TreeNum);
    return TreeNum;
  }


  bubbleSortNode = function(a) {
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < a.length - 1; j++) {
        if (a[j].anno_start > a[j + 1].anno_start) {
          var temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
        }
      }
    }
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

    $("#inputText").css('display', 'none');

  };


  function node_obj(id, quote, text, anno_start, anno_end, para_start, para_end) {
    this.id = id;
    this.quote = quote;
    this.text = text;
    this.anno_start = anno_start;
    this.anno_end = anno_end;
    this.para_start = para_start;
    this.para_end = para_end;
  }

  createWholeTree = function() {
    //Treenum = setTreeNum();
    WholeTree = {};
    //sentence = (node_sentence_array[TreeNum].quote).split(' ').join('').toLowerCase();
    /*for (x in node_sentence_array) {
      if (node_sentence_array[x].id = TreeNum) {
        sentence = (node_sentence_array[x].quote).split(' ').join('').toLowerCase();
        //TreeNum = x;
      }
    }*/


    for (var i = 0; i < node_array.length; i++) {

      //console.log(sentence_array[TreeNum + 2], anno_array[i + 2], sentence_array[TreeNum + 3], anno_array[i + 3]);

      //if(sentence_array[TreeNum].indexOf(anno_array[i-1])!=-1){
      if ((node_sentence_array[TreeNum].anno_start <= node_array[i].anno_start && node_sentence_array[TreeNum].anno_end >= node_array[i].anno_end) && ((node_sentence_array[TreeNum].quote).indexOf(node_array[i].quote) > -1)) {

        var Tree = {
          [node_array[i].quote]: {}
        };

        texts = ((node_array[i].text).replace("[", "").replace("]", "")).split(",");

        for (var pos = texts.length - 1; pos >= 0; pos--) {
          var curNode = {
            [(texts[pos].replace("\"", "")).slice(0, -1)]: Tree
          };
          Tree = curNode;
        }
        _.merge(WholeTree, Tree);
      } else {
        console.log(node_array[i].quote, "- is not in the sentence -", node_sentence_array[TreeNum].quote);
      }
    }

    if ((node_sentence_array[TreeNum].text).toUpperCase().indexOf("SENTENCE") != -1)
      WholeTree["Sentence"] = WholeTree[""];
    else
      WholeTree["Clause"] = WholeTree[""];
    delete WholeTree[""];
  }


  Annotator.Plugin.fileStorage = function(element) {
    return {
      pluginInit: function() {
        this.annotator.subscribe("annotationCreated", function(annotation) { //current work area
            console.log("anno := ",
              annotation);


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
            //Checks for sentence tag - which will add it to sentence array for cehcking against words
            if (((annotation.text).toUpperCase()).indexOf("SENTENCE") != -1 || ((annotation.text).toUpperCase()).indexOf("CLAUSE") != -1) {
              var list = document.getElementById('Tree_list');
              var entry = document.createElement('li');
              entry.appendChild(document.createTextNode(annotation.quote));
              entry.className = "list-group-item list-group-item-action";
              //cur_id = parseInt(annotation.id);
              entry.setAttribute("id", annotation.id);
              list.appendChild(entry);

              /*used for sentence_array before OO
              sentence_array.push(annotation.quote);
              sentence_array.push(annotation.text);
              sentence_array.push(annotation.ranges[0].startOffset);
              sentence_array.push(annotation.ranges[0].endOffset);*/

              var node = new node_obj(annotation.id, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset, annotation.ranges[0].start, annotation.ranges[0].end);
              node_sentence_array.push(node);
              //cur_id++;
            } else {
              /*used for anno_array before OO
              anno_array.push(annotation.quote);
              anno_array.push(annotation.text);
              anno_array.push(annotation.ranges[0].startOffset);
              anno_array.push(annotation.ranges[0].endOffset);*/

              var node = new node_obj(annotation.id, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset, annotation.ranges[0].start, annotation.ranges[0].end);
              node_array.push(node);
            }
            if (node_array.length > 1) {
              node_array = bubbleSortNode(node_array);
            }
            //anno_array = bubbleSortAnno(anno_array);
            console.log("nodes : ", node_array);
            console.log("Sentences : ", node_sentence_array);
          })
          .subscribe("annotationDeleted", function(annotation) {
            // Check if the annotation actually exists (workaround annotatorjs bug #258).
            if (annotation.id) {
              ////console.log.log(annotation);

              if (((annotation.text).toUpperCase()).indexOf("SENTENCE") != -1 || ((annotation.text).toUpperCase()).indexOf("CLAUSE") != -1) {

                /*sentence anno deletion before OO
                for (var i = 0; i < sentence_array.length; i = i + 4) {
                  if (annotation.quote == sentence_array[i]) {
                    sentence_array.splice(i, i + 4, null, null, null, null);
                    //console.log((document.getElementById(i / 4)).innerHTML);
                    //var elem = document.getElementById(i / 4);
                    //elem.parentNode.removeChild(elem);
                  }
                }*/

                //changing functions to work for OO array instead of non OO array
                for (var i = 0; i < node_sentence_array.length; i++) {
                  if (annotation.quote == node_sentence_array[i].quote) {
                    var elem = document.getElementById(node_sentence_array[i].id);
                    elem.parentNode.removeChild(elem);
                    node_sentence_array.splice(i, i + 1);
                  }
                }

                //document.getElementById("CurrentTree").setAttribute("max", ((sentence_array.length) / 4) - 1);
              } else {

                /*anno deletion before OO
                for (var i = 0; i < anno_array.length; i = i + 4) {
                  if (annotation.quote == anno_array[i]) {
                    //console.log(annotation.quote);
                    anno_array.splice(i, i + 4);
                  }
                }*/

                //changing functions to work for OO array instead of non OO array
                for (var i = 0; i < node_array.length; i++) {
                  if (annotation.quote == node_array[i].quote) {
                    //console.log(annotation.quote);
                    node_array.splice(i, i + 1);
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

            /*updating before OO struc
            for (var i = 0; i < anno_array.length; i = i + 4) {
              if (annotation.quote == anno_array[i]) {
                anno_array.splice(i, i + 4, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset);
              }
            }*/

            //updating for OO struc
            for (var i = 0; i < node_array.length; i++) {
              if (annotation.id == node_array[i].id) {
                var node = new node_obj(annotation.id, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset);
                node_array.splice(i, i + 1, node);
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

    var node_count = 0;
    var previous_x = 0;

    /*var svgWidth = 1440, //(document.getElementById('TreeArea').offsetWidth) * .90,
      svgHeight = svgWidth / 2;

    var devide = 2,
      fontsize = svgWidth / 90,
      linkSpace = fontsize - 1,
      trainglepadding = fontsize - 2,
      stroke_width = fontsize / 15*/

    var tree = {
      cx: svgWidth / 2,
      cy: svgHeight / 40,
      w: svgHeight / 4,
      h: svgHeight / 10,
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
    var percentage = ['%']
    var diff_array = [];
    var SFL_node_pos = [];
    var c_diff_array = [];
    var in_diff_array = [];

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

    tree.getcorrectNodes = function() {
      var n = [];
      c_diff_array = diff_array.slice(0);

      function getcorrectNodes(node) {
        //node.kids.forEach(function(kid) {
        if (c_diff_array[0]) {
          n.push({
            id: node.id,
            text: node.text,
            x: node.x,
            y: node.y,
            kids: node.kids,
            isLeaf: node.isLeaf,
            tWidth: node.tWidth
          });
        }
        node.kids.forEach(function(kid) {
          c_diff_array = c_diff_array.slice(1);
          return getcorrectNodes(kid);
        });
        //console.log("kid >> ", kid);
        //c_diff_array = c_diff_array.slice(1);
        //getNodes(kid);
        //});
      }
      getcorrectNodes(tree.nodes[0]);
      return n.sort(function(a, b) {
        return a.id - b.id;
      });
    }

    tree.getincorrectNodes = function() {
      var n = [];
      in_diff_array = diff_array.slice(0);

      function getincorrectNodes(node) {
        if (!in_diff_array[0]) {
          n.push({
            id: node.id,
            text: ('-' + node.text + '-'),
            x: node.x,
            y: node.y,
            kids: node.kids,
            isLeaf: node.isLeaf,
            tWidth: node.tWidth
          });
        }
        node.kids.forEach(function(kid) {
          in_diff_array = in_diff_array.slice(1);
          return getincorrectNodes(kid);
        });

      }
      getincorrectNodes(tree.nodes[0]);
      return n.sort(function(a, b) {
        return a.id - b.id;
      });
    }

    //get the links
    tree.getcorrectLinks = function() {
      var l = [];
      c_diff_array = diff_array.slice(1);
      //console.log("l_diff > ", c_diff_array)
      getcorrectLinks(tree.nodes[0], l);
      //console.log("link >> ", l);
      return l.sort(function(a, b) {
        return a.toId - b.toId
      });
    }

    function getcorrectLinks(node, l) {
      node.kids.forEach(function(kid) {
        if (!kid.isLeaf) {
          if (c_diff_array[0]) {
            l.push({
              fromId: node.id,
              fromX: node.x,
              fromY: node.y,
              toId: kid.id,
              toX: kid.x,
              toY: kid.y,
            });
          }
        }
        c_diff_array = c_diff_array.slice(1);
        //console.log(">> ", c_diff_array)
        getcorrectLinks(kid, l);
      });
    }

    tree.getincorrectLinks = function() {
      var l_in = [];
      in_diff_array = diff_array.slice(1);
      //console.log("l-I_diff > ", in_diff_array)
      function getincorrectLinks(node) {
        node.kids.forEach(function(kid) {
          if (!kid.isLeaf) {
            if (!in_diff_array[0]) {
              l_in.push({
                fromId: node.id,
                fromX: node.x,
                fromY: node.y,
                toId: kid.id,
                toX: kid.x,
                toY: kid.y,
              });
            }
          }
          in_diff_array = in_diff_array.slice(1);
          getincorrectLinks(kid);
        });
      }
      getincorrectLinks(tree.nodes[0]);
      //console.log("link_in >> ", l_in);
      return l_in.sort(function(a, b) {
        return a.toId - b.toId
      });
    }



    //get the triangles -- size of the trees
    tree.getcorrectTriangles = function() {
      var t = [];
      c_diff_array = diff_array.slice(1);

      function getcorrectTriangles(node) {
        node.kids.forEach(function(kid) {
          if (kid.isLeaf) {
            if (c_diff_array[0]) {
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
          }
          c_diff_array = c_diff_array.slice(1);
          getcorrectTriangles(kid);
        }); //10
        //node.kids.forEach(getTriangles);
      }
      getcorrectTriangles(tree.nodes[0]);
      return t.sort(function(a, b) {
        return a.toId - b.toId
      });
    }

    tree.getincorrectTriangles = function() {
      var t = [];
      in_diff_array = diff_array.slice(1);

      function getincorrectTriangles(node) {
        node.kids.forEach(function(kid) {
          if (!in_diff_array[0]) {
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
          }
          in_diff_array = in_diff_array.slice(1);
          getincorrectTriangles(kid);
        }); //10
        //node.kids.forEach(getTriangles);
      }
      getincorrectTriangles(tree.nodes[0]);
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

    //sets leafs depth to deepest leaf


    //update/refresh svg
    /*refresh = function() {
      d3.select('#nodes').selectAll('text').data(tree.getNodes()).remove();
      d3.select('#links').selectAll('line').data(tree.getLinks()).remove();
      d3.select('#triangles').selectAll('polygon').data(tree.getTriangles()).remove();
    }*/
    //get leaf count for node

    //API CALLS

    $(document).ready(function() {
      //$("#AnnoToTree").click(function(event) {
      $("#Tree_list").click(async function(e) {

        if (e.target && e.target.nodeName == "LI") {
          ////console.log.log(e.target.innerHTML);
          ////console.log.log(e.target.id);
          //TreeNum = e.target.id;
          //console.log(TreeNum);

          for (x in node_sentence_array) {
            //console.log(node_sentence_array[x].quote, " = ", x);
            if (node_sentence_array[x].quote == e.target.innerHTML) {
              TreeNum = x;
              sentence = (node_sentence_array[x].quote).split(' ').join('').toLowerCase();
              console.log("sentence :", sentence);
              createWholeTree();
              break;
            }
          }
        }

        var grade = await getGrade(JSON.stringify(tree.nodes), sentence);

        diff_array = grade[3];

        resetTree();
        refresh();
        refresh_grade();

        percentage = ['%'];
        teacher_segmented_sentence = [];
        student_segmented_sentence = [];

        if (document.getElementById('tree-' + num) == null) {
          var div = document.createElement("div");
          div.setAttribute("id", "tree-" + num);
          document.getElementById("TreeArea").appendChild(div);
          initialise(num);
        }

        body = JSON.stringify(WholeTree)
        SFL_node_pos = [];

        if (!teacher) {
          assignment_content = {};

          refresh();
          refresh_grade();

          tree.nodes = await getTree(body);
          console.log(node_sentence_array);

          var grade = await getGrade(JSON.stringify(tree.nodes), sentence);

          diff_array = grade[3];
          var percent = parseFloat(Math.round(grade[0][1] * 100) / 100).toFixed(2)
          document.getElementById("progress-bar").innerHTML = percent + '%';
          document.getElementById("progress-bar").style.width = percent + '%';

          if (adjust)
            reposition_adjust(tree.nodes[0], SFL_node_pos);
          else
            reposition(tree.nodes[0]);

          if (grading)
            redraw_grade();
          else
            redraw();

          console.log("SEN:", sentence);
          var GRADE = {
            "PERCENTAGE": grade[0],
            "TEACHER_SEG_SEN": grade[1],
            "STUDENT_SEG_SEN": grade[2],
            "LIKENESS": grade[3],
            "MISSING": grade[4]
          }
          //console.log(grade);
          assignment_content[sentence] = {
            "GRADE": GRADE,
            "SFG": tree.nodes[0]
          }
          console.log(assignment_content);

        } else {

          refresh();
          refresh_grade();

          document.getElementById("progress-bar").innerHTML = 0 + '%';
          document.getElementById("progress-bar").style.width = 0 + '%';
          tree.nodes = JSON.parse(await getTeacherSFL(sentence));

          if (adjust)
            reposition_adjust(tree.nodes[0], SFL_node_pos);
          else
            reposition(tree.nodes[0]);

          redraw();
        }
      });
    });
    //initialise();
    return tree;
  }

  $(function() {
    $("#genSFG").click(async function() {
      resetTree();
      createWholeTree();
      body = JSON.stringify(WholeTree)
      tree.nodes = await getTree(body);
      reposition(tree.nodes[0]);
      console.log(JSON.stringify(tree.nodes));
    });
  });


  storeSFL = function(student_SFL_struc) {
    var body = student_SFL_struc;
    return new Promise(function(resolve, reject) {
      $.post(
        "http://localhost:8000/mydb/", {
          body
        },
        function(data) {
          var res = data
          //nodes = JSON.parse(res);
          resolve(res);
        }
      );
    });
  }


  var tree = tree();