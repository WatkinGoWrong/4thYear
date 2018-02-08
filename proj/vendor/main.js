  var anno_array = [];
  var text_array = [];
  var sentence_array = [];
  var sentence = "";
  var WholeTree = {};

  var num = 0;
  var TreeNum = 0;

  //Setting number of notches on slide - number of SFLs
  setTreeNum = function() {
    TreeNum = ($("#CurrentTree").val()) * 4;
    return TreeNum;
  }

  bubbleSortAnno = function(a) {
    for (var i = 2; i < a.length - 1; i += 4) {
      if (a[i] > a[i + 4]) {
        var temp_1 = a[i - 2];
        var temp_2 = a[i - 1];
        var temp_3 = a[i];
        var temp_4 = a[i + 1];
        //-----
        a[i - 2] = a[i + 2];
        a[i - 1] = a[i + 3];
        a[i] = a[i + 4];
        a[i + 1] = a[i + 5];
        //-----
        a[i + 2] = temp_1;
        a[i + 3] = temp_2;
        a[i + 4] = temp_3;
        a[i + 5] = temp_4;
      }
    }
    return a
  }

  $("#inputText").change(function(e) {
    onTextChange(e);
  });

  function onTextChange(event) {
    var textReader = new FileReader();
    textReader.onload = onTextReaderLoad;
    textReader.readAsText(event.target.files[0]);
  }

  function onTextReaderLoad(event) {
    var textFromFileLoaded = event.target.result;

    $("#content").html(textFromFileLoaded);
    $("#content2").html(textFromFileLoaded);

    $("#textInputLabel").hide(0, function() {
      $("#AnalysisMode").show(0, function() {
        $("#content").show(0, function() {
          $("#genNew").show(0, function() {
            //$("#annotationInput").show(0);
          });
        });
      });
    });

  }



  $("#inputFile").change(function(e) {
    onChange(e);
  });

  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  var obj; // Holds Annotation Instance
  function onReaderLoad(event) {
    obj = JSON.parse(event.target.result);

    var ann2 = $("#content2").annotator();
    var ann = $("#content").annotator(); //Assign container to hold annotator content

    ann.annotator('addPlugin', 'fileStorage'); // Add Storage Plugin
    ann2.annotator('addPlugin', 'fileStorage');

    var data = obj;
    if (data == undefined) {

    } else {
      var data1 = new Array();
      var data2 = new Array();
      for (var i = 0; i < data.length; i++) {
        data[i].ranges = JSON.parse(data[i].ranges);
        data[i].highlights = JSON.parse(data[i].highlights);
        if (data[i].url == "1") {
          data1.push(data[i]);
        } else if (data[i].url == "1t") {
          data2.push(data[i]);
        }
      }
      ann.annotator('loadAnnotations', data1);
      ann2.annotator('loadAnnotations', data2);
    }

    $("#genNew").hide(0, function() {
      $("#annotationInput").hide(0, function() {
        $("#AnnoToTree").show(0, function() {
          $("#CompareTree").hide(0, function() {
            $("#CurrentTree").show(0);
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

    console.log("Successful Load");
  }

  $("#genNew").click(function() {

    obj = new Array();
    var ann2 = $("#content2").annotator();
    var ann = $("#content").annotator(); //Assign container to hold annotator content

    ann.annotator('addPlugin', 'fileStorage'); // Add Storage Plugin
    ann2.annotator('addPlugin', 'fileStorage');

    ann.annotator('loadAnnotations', obj);
    ann2.annotator('loadAnnotations', obj);

    $("#genNew").hide(0, function() {
      $("#annotationInput").hide(0, function() {
        $("#AnnoToTree").show(0, function() {
          $("#CompareTree").hide(0, function() {
            $("#CurrentTree").show(0);
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

  });

  $("#dwnJson").click(function() {

    if (obj != undefined) {
      var data = JSON.parse(JSON.stringify(obj));
    }

    for (var i = 0; i < data.length; i++) {
      data[i].ranges = JSON.stringify(data[i].ranges);
      data[i].highlights = JSON.stringify(data[i].highlights);
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("target", "_blank");

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes();
    var dateTime = '(' + date + ' ' + time + ')';

    dlAnchorElem.setAttribute("download", "annotationData" + dateTime + ".json");
    dlAnchorElem.click();

  });


  function enterThemeMode() {
    currentUrl = "1t";
    $('#AnalysisMode').fadeOut(0, function() {
      $(this).text('Theme Analysis Mode');
      $(this).fadeIn(0, function() {
        $('#content').hide(0, function() {
          $('#content2').show(0, function() {
            $('#themeAnalyse').hide(0, function() {
              $('#grammarAnalyse').show(0);
            });
          });
        });
      });
    });
  }


  function enterGrammarMode() {
    currentUrl = "1";
    $('#AnalysisMode').fadeOut(0, function() {
      $(this).text('Functional Grammar Analysis Mode');
      $(this).fadeIn(0, function() {
        $('#content2').hide(0, function() {
          $('#content').show(0, function() {
            $('#grammarAnalyse').hide(0, function() {
              $('#themeAnalyse').show(0);
            });
          });
        });
      });
    });
  }

  createWholeTree = function() {
    Treenum = setTreeNum();
    WholeTree = {};
    sentence = sentence_array[TreeNum].split(' ').join('').toLowerCase();


    //changing i from 1 to 0
    for (var i = 0; i < anno_array.length; i += 4) {

      //console.log(sentence_array[TreeNum+2], anno_array[i+2] , sentence_array[TreeNum+3] , anno_array[i+3]);

      //if(sentence_array[TreeNum].indexOf(anno_array[i-1])!=-1){
      if (sentence_array[TreeNum + 2] <= anno_array[i + 2] && sentence_array[TreeNum + 3] >= anno_array[i + 3]) {

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
              sentence_array.push(annotation.quote);
              sentence_array.push(annotation.text);
              sentence_array.push(annotation.ranges[0].startOffset);
              sentence_array.push(annotation.ranges[0].endOffset);
              document.getElementById("CurrentTree").setAttribute("max", ((sentence_array.length) / 4) - 1);
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
              //console.log(JSON.stringify(Tree));
              obj.push(annotation);

            }
          })
          .subscribe("annotationDeleted", function(annotation) {
            // Check if the annotation actually exists (workaround annotatorjs bug #258).
            if (annotation.id) {
              console.log(annotation);

              if (((annotation.text).toUpperCase()).indexOf("SENTENCE") != -1) {
                for (var i = 0; i < sentence_array.length; i = i + 4) {
                  if (annotation.quote == sentence_array[i]) {
                    sentence_array.splice(i, i + 4);
                  }
                }
                document.getElementById("CurrentTree").setAttribute("max", ((sentence_array.length) / 4) - 1);
              } else {
                for (var i = 0; i < anno_array.length; i = i + 4) {
                  if (annotation.quote == anno_array[i]) {
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

            for (var i = 2; i < anno_array.length; i = i + 4) {
              if (annotation.ranges[0].startOffset == anno_array[i]) {
                anno_array.splice(i - 2, i + 2, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset);
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

  /*
   * Loads data for trees, and takes a function as an argument
   * which is called on the generated trees
   * @param function callback
   * @return nil
   */
  function loadDataForTrees(callback, _url) {

    var data = new Array();

    for (var i = 0; i < obj.length; i++) {
      if (obj[i].url == _url) {
        data.push(JSON.parse(JSON.stringify(obj[i])));
      }
    }

    for (var i = 0; i < data.length; i++) {
      data[i].text = JSON.parse(data[i].text);
    }

    //alert(JSON.stringify(data));

    callback(generateTrees(data));
  }


  /*
   * Takes array of annotations and creates necessary tree
   * structure from them.
   * @param array dat_
   * @return array of nodes and ranges
   */
  function generateTrees(dat_) {

    var nodeStructure; //Will contain node structure of tree
    var rangeLengths = new Array(dat_.length); // List to hold lengths of ranges
    var ranges = new Array(dat_.length); // List to hold range positions
    var nodes = new Array(dat_.length);

    for (var k = 0; k < dat_.length; k++) {

      if (dat_[k].text.length <= 1) {
        dat_[k].text = dat_[k].text[0]; // Convert taggle object to text
      }
      rangeLengths[k] = (dat_[k].ranges[0].endOffset - dat_[k].ranges[0].startOffset); // Calculate length of annotation
    }
    bubbleSortRanges(rangeLengths, dat_);

    for (var k = 0; k < dat_.length; k++) {

      ranges[k] = new Object();
      ranges[k].start = dat_[k].ranges[0].startOffset;
      ranges[k].end = dat_[k].ranges[0].endOffset;
      ranges[k].done = false; //Something to show whether or not its been added
    }

    for (var k = 0; k < dat_.length; k++) { //Create nodes from annotations

      nodes[k] = nodify(dat_[k]);
    }

    // Build up tree here
    for (var i = 1; i < dat_.length; i++) {

      for (var j = 0; j < i; j++) {

        if ((ranges[j].start >= ranges[i].start) && (ranges[j].end <= ranges[i].end) && (!ranges[j].done)) {
          if (!nodes[i].children) {
            nodes[i].children = new Array();
          }
          nodes[i].children.push(nodes[j]);
          ranges[j].done = true;
        }
      }
      if (nodes[i].children) { // If this node now has children, order them
        nodes[i].children = orderChildren(nodes[i].children);
      }
    }
    return [nodes, ranges];
  }






  /*
   * Function that takes data consisting of the tree structures in the document
   * and the ranges; which dictate whether they are root nodes or not.
   * It then generates the Treant tree svg and adds it to the document.
   * @param array of nodes and ranges
   * @return nil
   */
  function addTreesToDocument(data) {

    var nodes = data[0];
    var ranges = data[1];

    $('#allTrees').empty();

    // Initiliase Treant tree object and display
    for (var k = 0; k < nodes.length; k++) {

      if (!nodes[k].children) {
        ranges[k].done = true;
      }

      if (!ranges[k].done) {
        delete nodes[k].range;
        nodes[k] = traverse(nodes[k]);
        var totalDepth = getDepth(nodes[k], 0);
        nodes[k] = finalTraversal(nodes[k], 0, totalDepth);
        var levelSep = 30;

        $("#allTrees").append('<div class="chart" id="basic-example' + k + '"></div>').show();

        var chart_config = { //Initailize tree object
          chart: {
            container: "#basic-example" + k + "",
            nodeAlign: 'BOTTOM',
            connectors: {
              type: 'straight'
            },
            node: {
              HTMLclass: 'nodeExample1'
            },
            animateOnInit: false,
            siblingSeparation: 10,
            levelSeparation: levelSep
          },
          nodeStructure: nodes[k]
        };
        new Treant(chart_config);
      }
    }
  }

  /*
   * Function that takes data consisting of the tree structures in the document
   * and the ranges; which dictate whether they are root nodes or not.
   * It then generates the box diagrams as tables and adds them to the document.
   * @param array of nodes and ranges
   * @return nil
   */
  function addBoxDiagramsToDocument(data) {
    var nodes = data[0];
    var ranges = data[1];

    $('#allBoxes').hide(500);
    $('#allBoxes').empty();

    for (var k = 0; k < nodes.length; k++) {

      if (!nodes[k].children) {
        ranges[k].done = true;
      }

      if (!ranges[k].done) {

        if (nodes[k].text.name == "Clause" | nodes[k].text.name == "clause") {
          var heading = "Box Diagram for Clause '" + nodes[k].text.title + "'";
          var row1 = "<tr>";
          var row2 = "<tr>";

          for (var t = 0; t < nodes[k].children.length; t++) {
            row1 += "<td><i>" + nodes[k].children[t].text.title + "</i></td>";

            if (Array.isArray(nodes[k].children[t].text.name)) {
              row2 += "<td>" + nodes[k].children[t].text.name[0] + "</td>";
            } else {
              row2 += "<td>" + nodes[k].children[t].text.name + "</td>";
            }
          }

          row1 += "</tr>";
          row2 += "</tr>";

          var table = '<table class="box-diagram" id="box-diagram-' + k + '" align="center" style="width:50%">' + row1 + row2 + '</table><br>';

          $("#allBoxes").append(table).show(1000);
        }
      }
    }
  }

  /*
   * Function that takes data consisting of the tree structures in the document
   * and the ranges; which dictate whether they are root nodes or not.
   * It then generates the theme diagrams as tables and adds them to the document.
   * @param array of nodes and ranges
   * @return nil
   */
  function addThemeDiagramsToDocument(data) {
    var nodes = data[0];
    var ranges = data[1];

    $('#allBoxes').hide(500);
    $('#allBoxes').empty();

    for (var k = 0; k < nodes.length; k++) {

      if (!nodes[k].children) {
        ranges[k].done = true;
      }

      if (!ranges[k].done) {

        if (nodes[k].text.name == "Clause" | nodes[k].text.name == "clause") {
          var heading = "Theme Diagram for Clause '" + nodes[k].text.title + "'";
          var row1 = "<tr><td>Textual Meaning<td/>";
          var row2 = '<tr><td rowspan="2">Interpersonal Meaning<td/>';
          var row3 = "<tr><td></td>";
          var row4 = "<tr><td>Experiential Meaning<td/>";

          for (var t = 0; t < nodes[k].children.length; t++) {

            if (nodes[k].children[t].text.name[0] == "Interpersonal Meaning") {

              for (var r = 0; r < nodes[k].children[t].children.length; r++) {

                if ((nodes[k].children[t].children[r].text.name[1] == "Interpersonal Meaning")) {
                  row1 += "<td></td>";
                  if (nodes[k].children[t].children[r].text.name[2] == "Experiential Meaning") {
                    row2 += "<td></td>";
                    if (nodes[k].children[t].children[r].text.name.length == 3) {
                      row4 += "<td></td>";
                    } else {
                      row4 += "<td>" + nodes[k].children[t].children[r].text.name[3] + "</td>";
                    }
                  } else {
                    row2 += "<td>" + nodes[k].children[t].children[r].text.name[2] + "</td>";
                    if (nodes[k].children[t].children[r].text.name.length == 4) {
                      row4 += "<td></td>";
                    } else {
                      row4 += "<td>" + nodes[k].children[t].children[r].text.name[4] + "</td>";
                    }
                  }
                } else {
                  row1 += "<td>" + nodes[k].children[t].children[r].text.name[1] + "</td>";
                  if (nodes[k].children[t].children[r].text.name[3] == "Experiential Meaning") {
                    row2 += "<td></td>";
                    if (nodes[k].children[t].children[r].text.name.length == 4) {
                      row4 += "<td></td>";
                    } else {
                      row4 += "<td>" + nodes[k].children[t].children[r].text.name[4] + "</td>";
                    }
                  } else {
                    row2 += "<td>" + nodes[k].children[t].children[r].text.name[3] + "</td>";
                    if (nodes[k].children[t].children[r].text.name.length == 5) {
                      row4 += "<td></td>";
                    } else {
                      row4 += "<td>" + nodes[k].children[t].children[r].text.name[5] + "</td>";
                    }
                  }
                }
              }
              row3 += '<td colspan="' + nodes[k].children[t].children.length + '">' + nodes[k].children[t].text.name[1] + '</td>';
            } else {
              row3 += "<td></td>";
              if ((nodes[k].children[t].text.name[1] == "Interpersonal Meaning")) {
                row1 += "<td></td>";
                if (nodes[k].children[t].text.name[2] == "Experiential Meaning") {
                  row2 += "<td></td>";
                  if (nodes[k].children[t].text.name.length == 3) {
                    row4 += "<td></td>";
                  } else {
                    row4 += "<td>" + nodes[k].children[t].text.name[3] + "</td>";
                  }
                } else {
                  row2 += "<td>" + nodes[k].children[t].text.name[2] + "</td>";
                  if (nodes[k].children[t].text.name.length == 4) {
                    row4 += "<td></td>";
                  } else {
                    row4 += "<td>" + nodes[k].children[t].text.name[4] + "</td>";
                  }
                }
              } else {
                row1 += "<td>" + nodes[k].children[t].text.name[1] + "</td>";
                if (nodes[k].children[t].text.name[3] == "Experiential Meaning") {
                  row2 += "<td></td>";
                  if (nodes[k].children[t].text.name.length == 4) {
                    row4 += "<td></td>";
                  } else {
                    row4 += "<td>" + nodes[k].children[t].text.name[4] + "</td>";
                  }
                } else {
                  row2 += "<td>" + nodes[k].children[t].text.name[3] + "</td>";
                  if (nodes[k].children[t].text.name.length == 5) {
                    row4 += "<td></td>";
                  } else {
                    row4 += "<td>" + nodes[k].children[t].text.name[5] + "</td>";
                  }
                }
              }
            }
          }

          row1 += "</tr>";
          row2 += "</tr>";
          row3 += "</tr>";
          row4 += "</tr>";

          var table = '<table class="box-diagram" id="box-diagram-' + k + '" align="center" style="width:50%">' + row4 + row2 + row3 + row1 + '</table><br>';

          $("#allBoxes").append(table).show(1000);
        }
      }
    }
  }

  /*
   * Takes an annotation object, and converts it to a node
   * that can be added to the nodeStructure
   * @param annotation obj
   * @return node obj
   */
  function nodify(annotation) {
    node = new Object();
    node.text = {};
    node.text.name = annotation.text;
    node.text.title = annotation.quote;
    node.range = annotation.ranges[0].startOffset;
    return node;
  }

  /*
   * Takes array of a nodes children, and orders them according
   * to their ranges.
   * Then unset ranges to allow proper tree generation
   * @param children array
   * @return none
   */
  function orderChildren(children) {
    var childRanges = new Array(children.length);
    for (var q = 0; q < children.length; q++) {
      childRanges[q] = children[q].range;
      delete children[q].range;
    }
    bubbleSortRanges(childRanges, children);
    return children;
  }

  /*
   * Traverses tree from given node, calling method to vertically order
   * nodes where more than one tag
   * @param node object
   * @return none
   */
  function traverse(node) {

    if ((node.text) && (node.text.name instanceof Array)) { // If array of tags: (more than one tag)
      //
      var depth = node.text.name.length;
      var place = new Array(depth);
      for (var r = 0; r < depth; r++) {
        place[r] = node.text.name[r];
      }
      var even = false;
      if (depth % 2 == 0) {
        even = true;
      } else {
        depth--;
      }

      var start = '<p><b> <span style="line-height: 12px;background: linear-gradient(0deg, black 1px, white 1px, transparent 1px);padding-bottom: 2px;background-position: 0 100%">';
      var middle = '</style></b></p><p><b>';
      var end = '</b></p>';

      if (even) { //If even number of tags

        nodeArr = new Array(depth / 2);
        for (var t = 0; t < depth - 1; t += 2) {
          nodeArr[t / 2] = new Object();
          nodeArr[t / 2].innerHTML = start + place[t] + middle + place[t + 1] + end;
        }

        if (node.children) {
          nodeArr[nodeArr.length - 1].children = new Array();
          nodeArr[nodeArr.length - 1].children = node.children;
        }

        for (var q = nodeArr.length - 2; q >= 0; q--) {
          nodeArr[q].children = new Array();
          nodeArr[q].children.push(nodeArr[q + 1]);
        }
        node = nodeArr[0];

        if (!node.children) { // No Children
          return node;
        } else { //If odd number of tags

          if (node.text) { //Delete annotation quote from all nodes except childless children
            delete node.text.title;
          }

          var numChild = node.children.length;
          for (var h = 0; h < numChild; h++) {
            node.children[h] = traverse(node.children[h]);
          }
          return node;
        }
      } else {

        var oddNode = new Object();
        oddNode.text = {};
        oddNode.text.name = place.pop();
        oddNode.text.title = node.text.title;

        nodeArr = new Array(depth / 2);
        for (var t = 0; t < depth - 1; t += 2) {
          nodeArr[t / 2] = new Object();
          nodeArr[t / 2].innerHTML = start + place[t] + middle + place[t + 1] + end;
        }

        if (node.children) {
          oddNode.children = new Array();
          oddNode.children = node.children;
        }
        nodeArr[nodeArr.length - 1].children = new Array();
        nodeArr[nodeArr.length - 1].children.push(oddNode);

        for (var q = nodeArr.length - 2; q >= 0; q--) {
          nodeArr[q].children = new Array();
          nodeArr[q].children.push(nodeArr[q + 1]);
        }
        node = nodeArr[0];

        if (!node.children) { // No Children
          return node;
        } else {

          if (node.text) { //Delete annotation quote from all nodes except childless children
            delete node.text.title;
          }
          var numChild = node.children.length;
          for (var h = 0; h < numChild; h++) {
            node.children[h] = traverse(node.children[h]);
          }
          return node;
        }
      }
    } else {

      if (!node.children) { // No Children
        return node;
      } else {
        if (node.text) { //Delete annotation quote from all nodes except childless children
          delete node.text.title;
        }
        var numChild = node.children.length;
        for (var h = 0; h < numChild; h++) {
          node.children[h] = traverse(node.children[h]);
        }
        return node;
      }
    }
  }

  /*
   * Method to return maximum depth of tree
   * @param node object, int depth
   * @return int depth
   */
  function getDepth(node, depth) {
    depth++;
    if (!node.children) { // No Children

      return depth;
    } else {
      var numChild = node.children.length;
      var maxDepth = depth;
      for (var h = 0; h < numChild; h++) {
        var nextDepth = getDepth(node.children[h], depth);
        if (maxDepth < nextDepth) {
          maxDepth = nextDepth;
        }
      }
      return maxDepth;
    }
  }

  /*
   * Method to draw triangles in lowest level of tree
   * @param node object, int depth, int totalDepth
   * @return node object
   */
  function finalTraversal(node, depth, totalDepth) {
    depth++;
    if (!node.children) { // If no Children
      //alert(JSON.stringify(node));
      var p = $(document.createElement('p'));
      p.css("display", "inline-block");
      p.css("font-size", "12px");
      p.text(node.text.title);
      p.attr("id", "p1");
      $("body").append(p);
      var width = $('#p1').width();
      $('#p1').remove();

      //height = 50*(1+(totalDepth-depth));
      height = 30;
      width = Math.ceil(width); //Ceiling of width in pixels
      width += 10; //Min width
      if (width % 2 != 0) {
        width++;
      }
      var a = '<p><b>' + node.text.name + '</b></p><svg width="';
      var b = '" height="' + height + '"><polygon points="';
      var c = ',1 0,' + height + ' ';
      var d = ',' + height + ' "style="fill:white;stroke:black;stroke-width:1;fill-rule:evenodd;" />SVG Not supported.</svg><p>' + node.text.title + '</p>';
      var total = a + String(width) + b + String(width / 2) + c + String(width) + d; //Generate triangle and text below
      delete node.text;
      node.innerHTML = total;
      node.HTMLclass = 'nodeExample2';
      return node;
    } else {
      var numChild = node.children.length;
      for (var h = 0; h < numChild; h++) {
        node.children[h] = finalTraversal(node.children[h], depth, totalDepth);
      }
      return node;
    }
  }


  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  /*
   * Function to use bubble sort to arrange an array/list from smallest to largest
   * Sorts an array containing the ranges of the annotations
   * Every time a swap is made, the swap is mirrored in the second array passed
   * Parameter
   */
  function bubbleSortRanges(a, dat) {
    var swapped;
    do {
      swapped = false;
      for (var i = 0; i < a.length - 1; i++) {
        if (a[i] > a[i + 1]) {
          var temp = a[i];
          var temp2 = dat[i];
          a[i] = a[i + 1];
          dat[i] = dat[i + 1];
          a[i + 1] = temp;
          dat[i + 1] = temp2;
          swapped = true;
        }
      }
    } while (swapped);
  }

  //--- SFL.js

  function tree() {

    var node_length = 3;
    var node_count = 0;
    var previous_x = 0;

    var svgWidth = document.getElementById('TreeArea').offsetWidth,
      svgHeight = svgWidth / 2;

    var devide = 2,
      fontsize = svgWidth / 90,
      linkSpace = fontsize - 1,
      trainglepadding = fontsize - 2,
      stroke_width = fontsize / 15

    var tree = {
      cx: svgWidth / 2,
      cy: svgHeight / 40,
      w: svgHeight / 7,
      h: svgHeight / 10,
      size: 1,
      leafDepth: Infinity,
      nodes: []
    };

    console.log(svgWidth);
    console.log(tree.cx);

    var uniformDepth = true;
    var addNode = false;
    var removeNode = false;
    var changeText = false;
    var svgNodes;
    var JSONData;


    var comp = ["text", "parent", "depth", "kids"];
    var diff_count = 0;

    //With x,y positions
    var example = '[{"id":"00","text":"Clause","x":600,"y":15,"parent":"none","isLeaf":false,"tWidth":0,"depth":0,"kids":[{"id":"id1.5","text":"Participant 1","x":480,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id2.5","text":"This Little Piggy","x":480,"y":135,"parent":"Participant 1","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id3.5","text":"Process","x":600,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id4.5","text":"Had","x":600,"y":135,"parent":"Process","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id5.5","text":"Participant 2","x":720,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id6.5","text":"None","x":720,"y":135,"parent":"Participant 2","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]}]}]';

    //{"id":"id2.5","text":"This Little Piggy","x":480,"y":135,"parent":"Participant 1","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}

    var example2 = '[{"id":"00","text":"Clause","x":600,"y":15,"parent":"none","isLeaf":false,"tWidth":0,"depth":0,"kids":[{"id":"id1.5","text":"Participant 1 - test","x":480,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id2.5","text":"This Little Piggy","x":480,"y":135,"parent":"Participant 1","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id3.5","text":"Process","x":600,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id4.5","text":"Had","x":600,"y":135,"parent":"Process","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]},{"id":"id5.5","text":"Participant 2","x":720,"y":75,"parent":"Clause","isLeaf":false,"tWidth":0,"depth":1,"kids":[{"id":"id6.5","text":"None","x":720,"y":135,"parent":"Participant 2","isLeaf":true,"tWidth":0,"depth":2,"kids":[]}]}]}]';

    var JSONTree = '{"Placeholder Tag":{"T1":{"A1":{"A2":{"A3":{"The":{}},"A4":{"offline":{}}}},"B1":{"B2":{"B3":{"version can be run":{}}}},"C1":{"C2":{"C3":{"in a web browser":{}}}}},"T2":{"A1":{"A2":{"A3":{"Electron-q":{}}}},"B1":{"B2":{"B3":{"contains the Electron":{}}}}}}}';

    var body = '{"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{},"None":{}},"Participant 2":{"None":{}}}}';

    var student = '[{"id":"00","text":"Clause","x":500,"y":12.5,"isLeaf":false,"tWidth":58.71666717529297,"depth":0,"kids":[{"id":"id1.5","text":"A","x":400,"y":62.5,"parent":"Clause","isLeaf":false,"tWidth":12.550000190734863,"depth":1,"kids":[{"id":"id2.5","text":"A1","x":400,"y":112.5,"parent":"A","isLeaf":false,"tWidth":20.549999237060547,"depth":2,"kids":[{"id":"id3.5","text":"A2","x":400,"y":162.5,"parent":"A1","isLeaf":false,"tWidth":20.549999237060547,"depth":3,"kids":[{"id":"id4.5","text":"One morning","x":400,"y":212.5,"parent":"A2","isLeaf":true,"tWidth":85.83333587646484,"depth":4,"kids":[]}]}]}]},{"id":"id5.5","text":"B","x":500,"y":62.5,"parent":"Clause","isLeaf":false,"tWidth":11.666666984558105,"depth":1,"kids":[{"id":"id6.5","text":"B1","x":500,"y":112.5,"parent":"B","isLeaf":false,"tWidth":19.66666603088379,"depth":2,"kids":[{"id":"id7.5","text":"B2","x":500,"y":162.5,"parent":"B1","isLeaf":false,"tWidth":19.66666603088379,"depth":3,"kids":[{"id":"id8.5","text":"I shot","x":500,"y":212.5,"parent":"B2","isLeaf":true,"tWidth":37,"depth":4,"kids":[]}]}]}]},{"id":"id9.5","text":"C","x":600,"y":62.5,"parent":"Clause","isLeaf":false,"tWidth":11.666666984558105,"depth":1,"kids":[{"id":"id10.5","text":"C1","x":600,"y":112.5,"parent":"C","isLeaf":false,"tWidth":19.66666603088379,"depth":2,"kids":[{"id":"id11.5","text":"C2","x":600,"y":162.5,"parent":"C1","isLeaf":false,"tWidth":19.66666603088379,"depth":3,"kids":[{"id":"id12.5","text":"an elephant","x":600,"y":212.5,"parent":"C2","isLeaf":true,"tWidth":74.30000305175781,"depth":4,"kids":[]}]}]}]}]}]'

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
      //console.log('thisNode');
      //console.log(thisNode);
      function getNode(node) {
        if (node.id == thisNode.id) {
          n = node;
        }
        node.kids.forEach(getNode);
      }
      getNode(tree.nodes[0]);
      //console.log('n');
      //console.log(n);
      return n;
    }

    //add a new leaf - have to look into refactoring this code
    tree.addLeaf = function(parent) {
      tree.size++;
      //console.log(parent);
      function addLeaf(node) {
        //console.log(parent);
        //console.log(node);
        if (node.id == parent) {
          //console.log("addLeaf");
          console.log('id' + (tree.size - 1));
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
      //console.log("parent- ",parent.text);
      //console.log("child- ",child);


      // /console.log(parent);
      function addLeaf(node) {
        var draw = true;
        if (node.id == parent.id) {
          if (node.kids != null) {
            //console.log('node : ', node , ' | kid :' , node.kids);
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

      nodes.enter().append('text').attr('id', function(node) { /*console.log('id = ' + node.id);*/
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
          'stroke-dasharray': 5,
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
      //console.log(node.text, " - - " ,node.kids)
      node.kids.forEach(function(kid) {

        if ((kid.kids).length == 0) {
          var cur = (kid.text).split(' ').join('');
          //console.log(cur);

          if (cur.toLowerCase() == sentence.substring(0, cur.length)) {
            node_count++;
            sentence = sentence.substring(cur.length, sentence.length);
            var w = tree.w * getLeafCount(kid);
            left += w;
            kid.x = left - (w + tree.w) / 2;
            kid.y = node.y + tree.h;
            previous_x = left - (w + tree.w) / 2;
            reposition(kid);
            redraw();
          } else {
            var w = tree.w * getLeafCount(kid);
            left += w;
            kid.x = left - (w + tree.w) / 2; //(left - (w + tree.w) / 2) + (((left - (w + tree.w) / 2) - previous_x)*(node_length-node_count+1));
            kid.y = node.y + tree.h;
            previous_x = left - (w + tree.w) / 2;
            reposition(kid);
            redraw();
          }
        } else if (((kid.kids[0]).kids).length == 0) {
          var cur = (kid.kids[0].text).split(' ').join('');
          //console.log(cur);

          if (cur.toLowerCase() == sentence.substring(0, cur.length)) {
            //console.log("hi");
            node_count++;
            sentence = sentence.substring(cur.length, sentence.length);
            var w = tree.w * getLeafCount(kid);
            left += w;
            kid.x = left - (w + tree.w) / 2;
            if (previous_x == kid.x)
              kid.x -= 100;
            kid.y = node.y + tree.h;
            previous_x = left - (w + tree.w) / 2;
            reposition(kid);
            redraw();
          } else {
            var w = tree.w * getLeafCount(kid);
            left += w;
            var cur_x = (left - (w + tree.w) / 2);
            previous_x = (((left - (w + tree.w) / 2) - previous_x) * (node_length - node_count - 1));
            kid.x = cur_x + previous_x;
            kid.y = node.y + tree.h;
            reposition(kid);
            redraw();
          }
        } else {
          var w = tree.w * getLeafCount(kid);
          left += w;
          console.log(left, " -- ", w)
          kid.x = left - (w + tree.w) / 2;
          //if(previous_x == kid.x)
          //kid.x-=100;
          kid.y = node.y + tree.h;
          reposition(kid);
          redraw();
        }
      });

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
      console.log(tree.nodes);
      JSONData = JSON.stringify(tree.nodes);
      console.log(JSONData);
    }

    exampleTree = function() {
      reply = sampleTree; //.slice(1,-1).replace(/\\/g, "");
      //console.log(example);
      tree.nodes = JSON.parse(reply);
      reposition(tree.nodes[0]);
      redraw();
    }

    //save the tree structure as JSON
    loadTree = function() {
      tree.nodes = JSON.parse(JSONData);
      console.log(tree.nodes);
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

    getJSON = function(json_tree, num) { //testing how to return json value and parameter names
      console.log("hi", JSON.stringify(json_tree));

      body = JSON.stringify(json_tree)
      var d_width = JSON.stringify(document.getElementById('TreeArea').offsetWidth);
      console.log(d_width);
      $.ajax({
        url: "http://localhost:8000/treetest",
        type: "POST",
        data: {
          body
        },
        contentType: "application/json",
        sucess: console.log("success"),
        complete: function(data) {
          console.log(data);
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
    }

    function recursiveGetProperty(obj, lookup, callback, parent, depth) {
      depth++;
      for (property in obj) {
        if (property == lookup) {
          var obj2 = obj[property];
          var t = Object.keys(obj2);
          //console.log(t);
          for (name in t) {
            parent2 = tree.addFromJSON(parent, t[name], name, depth);
            if (t[name] != undefined) {
              callback(t[name]);
            }

            recursiveGetProperty(obj2, t[name], callback, parent2, depth);
          }
        }
      }
      //console.log("<--->");
    }

    TreeJSON = function() {
      //console.log(tree.nodes);
      JSONData = JSON.stringify(tree.nodes);
      console.log(JSONData);
      //getStruc(tree.nodes,student);
    }

    $(document).ready(function() {
      $("#AnnoToTree").click(function(event) {

        createWholeTree();

        if (document.getElementById('tree-' + num) == null) {
          var div = document.createElement("div");
          div.setAttribute("id", "tree-" + num);
          document.getElementById("TreeArea").appendChild(div);
          initialise(num);
        }

        body = JSON.stringify(WholeTree)

        $.post(
          "http://localhost:8000/treetest", {
            body
          },
          function(data) {
            console.log(sentence);
            node_length = 0;
            node_count = 0;
            previous_x = 0;
            var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
            tree.nodes = JSON.parse(res);
            getNodeLength(tree.nodes[0]);
            reposition(tree.nodes[0]);
            console.log(sentence);
            redraw();
          }
        );
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