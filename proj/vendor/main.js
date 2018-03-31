  //--- SFL.js

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
  var past_sentences = [];
  var sentence_adjust = "";

  function tree() {

    var node_count = 0;
    var previous_x = 0;

    var tree = {
      cx: (svgWidth / 2) / devide,
      cy: (svgHeight / 40) / devide,
      w: (svgHeight / 4) / devide,
      h: (svgHeight / 10) / devide,
      size: 1,
      leafDepth: Infinity,
      nodes: []
    };

    //get the nodes

    $(document).ready(function() {
      //$("#AnnoToTree").click(function(event) {
      $("#Tree_list").on('click', async function(e) {
        //console.log("sentence : ", sentence);

        if (e.target && e.target.nodeName == "LI") {

          //need to ensure no element created by d3 exists when reinitalising the tree div
          //should only happen is tree.nodes exists
          if (diff_array != []) {
            resetTree();
            refresh();
            refresh_grade();
            redraw();
            redraw_grade();
          } else {
            resetTree();
            refresh();
            redraw();
          }

          document.getElementById("progress-bar").innerHTML = 0 + '%';
          document.getElementById("progress-bar").style.width = 0 + '%';

          for (x in node_sentence_array) {
            ////console.log(node_sentence_array[x].quote, " = ", x);
            if (node_sentence_array[x].quote == e.target.innerHTML) {
              TreeNum = x;
              sentence_adjust = node_sentence_array[x].quote
              sentence = (node_sentence_array[x].quote).split(' ').join('').split("\n").join('').toLowerCase();
              //console.log("sentence :", sentence);
              createWholeTree();
              break;
            }
          }

        }

        percentage = ['%'];
        teacher_segmented_sentence = [];
        student_segmented_sentence = [];

        //if (document.getElementById('tree-' + num) == null) {

        // issue with d3 and deleting elements - redraw, delete div and re-create div
        document.getElementById("tree-" + num).remove();
        var div = document.createElement("div");
        div.setAttribute("id", "tree-" + num);
        document.getElementById("TreeArea").appendChild(div);
        initialise(num);

        //}

        body = JSON.stringify(WholeTree)
        SFL_node_pos = [];

        if (!teacher) {
          assignment_content = {};

          if (!grading) {
            var current_session = {
              id: 1,
              collection: "student",
              connection_type: "update",
              last_session: JSON.stringify(obj)
            }
            save_session(current_session);
            tree.nodes = await getTree(body);
          } else {
            //past_sentences.push(sentence);
            //console.log("adding", sentence);
            tree.nodes = await getTree(body);

            grade = await getGrade(JSON.stringify(tree.nodes), sentence);

            diff_array = grade[3];

            var percent = parseFloat(Math.round(grade[0][1] * 100) / 100).toFixed(2)
            document.getElementById("progress-bar").innerHTML = percent + '%';
            document.getElementById("progress-bar").style.width = percent + '%';

            var GRADE = {
              "PERCENTAGE": grade[0],
              "TEACHER_SEG_SEN": grade[1],
              "STUDENT_SEG_SEN": grade[2],
              "LIKENESS": grade[3],
              "MISSING": grade[4]
            }
            ////console.log(grade);
            assignment_content = {
              "GRADE": GRADE,
              "SFL": tree.nodes[0],
            }

            //session = obj;
            //console.log(obj);

            var total_SFL = {
              id: 1,
              key: sentence,
              value: assignment_content,
              collection: "student",
              connection_type: "update",
              annotations: node_array,
              last_session: JSON.stringify(obj)
            }
            await postSFL_db(total_SFL);
          }

          if (adjust) {
            student_segmented_sentence = [];
            getBottomNodes(tree.nodes[0]);
            student_segmented_sentence = student_segmented_sentence.join(" ");
            var a1 = (sentence_adjust.toLowerCase()).split(" ");
            var a2 = (student_segmented_sentence.toLowerCase()).split(" ");
            var diff = $(a1).not(a2).get();
            a1 = $(a1).not(diff).get();
            sentence = a1.join("");
            reposition_adjust(tree.nodes[0], SFL_node_pos);
          } else
            reposition(tree.nodes[0]);

          if (grading)
            redraw_grade();
          else
            redraw();
        } else {

          var result = await getTeacherSFL_db();
          tree.nodes = JSON.parse((result[sentence]).replace("\'s", "\\'s"));

          if (adjust) {
            reposition_adjust(tree.nodes[0], SFL_node_pos);
          } else
            reposition(tree.nodes[0]);

          redraw();
        }
      });
    });
    return tree;
  }
  var tree = tree();