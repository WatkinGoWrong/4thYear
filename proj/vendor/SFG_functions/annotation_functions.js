var anno_array = [];
var text_array = [];
var sentence_array = [];
var sentence = "";
var WholeTree = {};
var new_obj;
var session;


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
      if ((a[j].anno_start) > (a[j + 1].anno_start)) {
        var temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }
  return a
}

bubbleSortNode_para = function(a) {
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < a.length - 1; j++) {
      if (parseInt((a[j].para_start).replace(/^\D+|\D+$/g, "")) > parseInt((a[j + 1].para_start).replace(/^\D+|\D+$/g, ""))) { //parseInt((annotation.ranges[0].start).replace(/^\D+|\D+$/g, ""))
        var temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }
  return a
}

//$("#genNew").click(function() {
window.onload = async function() {
  if (document.getElementById('tree-' + num) == null) {
    var div = document.createElement("div");
    div.setAttribute("id", "tree-" + num);
    document.getElementById("TreeArea").appendChild(div);
    initialise(num);
  }

  //
  new_obj = await getStudentSFL_db();
  obj = new Array();

  var ann2 = $("#content2").annotator();
  var ann = $("#content").annotator(); //Assign container to hold annotator content

  ann.annotator('addPlugin', 'fileStorage'); // Add Storage Plugin
  ann2.annotator('addPlugin', 'fileStorage');

  ann.annotator("addPlugin", "Touch");

  //ann.annotator('loadAnnotations', obj);
  //ann2.annotator('loadAnnotations', obj);

  //used to load last saved sessions annotations
  //currently only shows highlights - need to add to arrays
  if (new_obj.last_session[0] != '[]') {
    var data = JSON.parse(new_obj.last_session);
    console.log(data);
    console.log("test", data[0].quote == data[1].quote)
    if ((data[0].quote == data[1].quote) == true)
      data.shift();
    obj = data;
  } else {
    var data;
  }
  if (data == undefined) {

  } else {
    var data1 = new Array();
    var data2 = new Array();
    for (var i = 0; i < data.length; i++) {

      if ((((data[i].text).toUpperCase()).indexOf("[\"\",\"SENTENCE\"]") != -1 || ((data[i].text).toUpperCase()).indexOf("[\"\",\"CLAUSE\"]") != -1) || ((data[i].text).toUpperCase()).indexOf("[\"\",\"NGP\"]") != -1) {
        var list = document.getElementById('Tree_list');
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(data[i].quote));
        entry.className = "list-group-item list-group-item-action";
        entry.setAttribute("id", data[i].id);
        list.appendChild(entry);
        if (parseInt((data[i].ranges[0].start).replace(/^\D+|\D+$/g, "")) < parseInt((data[i].ranges[0].end).replace(/^\D+|\D+$/g, "")))
          data[i].ranges[0].endOffset = data[i].ranges[0].endOffset * parseInt((data[i].ranges[0].end).replace(/^\D+|\D+$/g, ""));
        var node = new node_obj(data[i].id, data[i].quote, data[i].text, data[i].ranges[0].startOffset, data[i].ranges[0].endOffset, data[i].ranges[0].start, data[i].ranges[0].end);
        node_sentence_array.push(node);
      } else {
        var node = new node_obj(data[i].id, data[i].quote, data[i].text, data[i].ranges[0].startOffset, data[i].ranges[0].endOffset, data[i].ranges[0].start, data[i].ranges[0].end);
        node_array.push(node);
      }
      if (node_array.length > 1) {
        node_array = bubbleSortNode(node_array);
        node_array = bubbleSortNode_para(node_array);
      }
      //console.log(data[i]);
      data[i].ranges = data[i].ranges;
      data[i].highlights = data[i].highlights;
      if (data[i].url == "1") {
        data1.push(data[i]);
      } else if (data[i].url == "1t") {
        data2.push(data[i]);
      }
    }
    //console.log(data1)
    ann.annotator('loadAnnotations', data1);
    ann2.annotator('loadAnnotations', data2);
  }
  $("#inputText").hide();

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
  WholeTree = {};


  for (var i = 0; i < node_array.length; i++) {

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
      console.log(node_sentence_array[TreeNum].anno_start, node_array[i].anno_start, node_sentence_array[TreeNum].anno_end, node_array[i].anno_end);
      console.log(node_array[i].quote, "- is not in the sentence -", node_sentence_array[TreeNum].quote);
    }
  }

  if ((node_sentence_array[TreeNum].text).toUpperCase().indexOf("SENTENCE") != -1)
    WholeTree["Sentence"] = WholeTree[""];
  else if ((node_sentence_array[TreeNum].text).toUpperCase().indexOf("CLAUSE") != -1)
    WholeTree["Clause"] = WholeTree[""];
  else if ((node_sentence_array[TreeNum].text).toUpperCase().indexOf("NGP") != -1)
    WholeTree["Ngp"] = WholeTree[""];
  delete WholeTree[""];
}


Annotator.Plugin.fileStorage = function(element) {
  return {
    pluginInit: function() {
      this.annotator.subscribe("annotationCreated", function(annotation) { //current work area
          console.log("anno := ",
            annotation);

          console.log("test : ", parseInt((annotation.ranges[0].start).replace(/^\D+|\D+$/g, "")));

          if (annotation.quote.length > 0 && annotation.text.length > 0) {
            annotation.url = currentUrl;

            console.log("obj", obj);

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
          console.log("[\"\",\"SENTENCE\"]");
          if ((((annotation.text).toUpperCase()).indexOf("[\"\",\"SENTENCE\"]") != -1 || ((annotation.text).toUpperCase()).indexOf("[\"\",\"CLAUSE\"]") != -1) || ((annotation.text).toUpperCase()).indexOf("[\"\",\"NGP\"]") != -1) {
            var list = document.getElementById('Tree_list');
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(annotation.quote));
            entry.className = "list-group-item list-group-item-action";
            //cur_id = parseInt(annotation.id);
            entry.setAttribute("id", annotation.id);
            list.appendChild(entry);

            if (parseInt((annotation.ranges[0].start).replace(/^\D+|\D+$/g, "")) < parseInt((annotation.ranges[0].end).replace(/^\D+|\D+$/g, "")))
              annotation.ranges[0].endOffset = annotation.ranges[0].endOffset * parseInt((annotation.ranges[0].end).replace(/^\D+|\D+$/g, ""));
            var node = new node_obj(annotation.id, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset, annotation.ranges[0].start, annotation.ranges[0].end);
            node_sentence_array.push(node);
          } else {

            var node = new node_obj(annotation.id, annotation.quote, annotation.text, annotation.ranges[0].startOffset, annotation.ranges[0].endOffset, annotation.ranges[0].start, annotation.ranges[0].end);
            node_array.push(node);
          }
          if (node_array.length > 1) {
            node_array = bubbleSortNode(node_array);
            node_array = bubbleSortNode_para(node_array);
          }
          //anno_array = bubbleSortAnno(anno_array);
          console.log("nodes : ", node_array);
          console.log("Sentences : ", node_sentence_array);
          console.log("Annotations : ", obj);
        })
        .subscribe("annotationDeleted", function(annotation) {
          // Check if the annotation actually exists (workaround annotatorjs bug #258).
          if (annotation.id) {
            if ((((annotation.text).toUpperCase()).indexOf("[\"\",\"SENTENCE\"]") != -1 || ((annotation.text).toUpperCase()).indexOf("[\"\",\"CLAUSE\"]") != -1) || ((annotation.text).toUpperCase()).indexOf("[\"\",\"NGP\"]") != -1) {

              //changing functions to work for OO array instead of non OO array
              for (var i = 0; i < node_sentence_array.length; i++) {
                if (annotation.quote == node_sentence_array[i].quote) {
                  var elem = document.getElementById(node_sentence_array[i].id);
                  elem.parentNode.removeChild(elem);
                  node_sentence_array.splice(i, i + 1);
                }
              }

            } else {

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