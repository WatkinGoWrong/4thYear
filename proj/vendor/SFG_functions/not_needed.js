/*
 * Loads data for trees, and takes a function as an argument
 * which is called on the generated trees
 * @param function callback
 * @return nil
 */
/*function loadDataForTrees(callback, _url) {

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
}*/


/*
 * Takes array of annotations and creates necessary tree
 * structure from them.
 * @param array dat_
 * @return array of nodes and ranges
 */
/*function generateTrees(dat_) {

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
}*/






/*
 * Function that takes data consisting of the tree structures in the document
 * and the ranges; which dictate whether they are root nodes or not.
 * It then generates the Treant tree svg and adds it to the document.
 * @param array of nodes and ranges
 * @return nil
 */
/*function addTreesToDocument(data) {

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
}*/

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
/*function addThemeDiagramsToDocument(data) {
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
}*/

/*
 * Takes an annotation object, and converts it to a node
 * that can be added to the nodeStructure
 * @param annotation obj
 * @return node obj
 */
/*function nodify(annotation) {
  node = new Object();
  node.text = {};
  node.text.name = annotation.text;
  node.text.title = annotation.quote;
  node.range = annotation.ranges[0].startOffset;
  return node;
}*/

/*
 * Takes array of a nodes children, and orders them according
 * to their ranges.
 * Then unset ranges to allow proper tree generation
 * @param children array
 * @return none
 */
/*function orderChildren(children) {
  var childRanges = new Array(children.length);
  for (var q = 0; q < children.length; q++) {
    childRanges[q] = children[q].range;
    delete children[q].range;
  }
  bubbleSortRanges(childRanges, children);
  return children;
}*/

/*
 * Traverses tree from given node, calling method to vertically order
 * nodes where more than one tag
 * @param node object
 * @return none
 */
/*function traverse(node) {

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
}*/

/*
 * Method to return maximum depth of tree
 * @param node object, int depth
 * @return int depth
 */
/*function getDepth(node, depth) {
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
}*/

/*
 * Method to draw triangles in lowest level of tree
 * @param node object, int depth, int totalDepth
 * @return node object
 */
/*function finalTraversal(node, depth, totalDepth) {
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
}*/

/*
 * Function to use bubble sort to arrange an array/list from smallest to largest
 * Sorts an array containing the ranges of the annotations
 * Every time a swap is made, the swap is mirrored in the second array passed
 * Parameter
 */
/*function bubbleSortRanges(a, dat) {
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