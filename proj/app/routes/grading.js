var diff_array = [];
var not_present_array = [];
var percentage = ['%'];
var count = 0;
var teacher_segmented_sentence = [];
var student_segmented_sentence = [];

compareJSON = function(node, node_two, diff_array, not_present_array) {

  var teacher = [];
  var student = [];

  if (node != undefined) {
    node.kids.forEach(function(kid) {
      if ((kid.kids).length == 0)
        teacher_segmented_sentence.push((kid.text).toLowerCase());
      teacher.push(kid);
    });
  }

  if (node_two != undefined) {
    node_two.kids.forEach(function(kid) {
      if ((kid.kids).length == 0)
        student_segmented_sentence.push((kid.text).toLowerCase());
      student.push(kid);
    });
  }

  ////console.log("teacher << ", node);
  ////console.log("student << ", node_two);


  if (node == undefined && node_two != undefined) {
    ////console.log("Teacher doesn't contain this node\nStudent node text :", (node_two.text).toLowerCase(), "\nStudent node parent :", node_two.parent);
    diff_array.push(false);
  } else if (node != undefined && node_two == undefined) {
    ////console.log("Student doesn't contain this node\nTeacher node text :", (node.text).toLowerCase(), "\nTeacher node parent :", node.parent);
    not_present_array.push(false);
  } else if ((node.text).toLowerCase() != (node_two.text).toLowerCase()) { // && node.parent != node_two.parent) {
    ////console.log("Parents Differ\nTeacher :", node.parent, "\nStudent : ", node_two.parent, "\nTexts Differ\nTeacher :", (node.text).toLowerCase(), "\nStudent :", (node_two.text).toLowerCase());
    diff_array.push(false);
  } else if ((node.text).toLowerCase() == (node_two.text).toLowerCase()) { //}&& node.parent != node_two.parent) {
    ////console.log("Both texts Equal :", (node.text).toLowerCase(), "\nParents Differ\nTeacher :", node.parent, "\nStudent : ", node_two.parent);
    diff_array.push(true);
  }
  /*\ else if ((node.text).toLowerCase() != (node_two.text).toLowerCase() && node.parent == node_two.parent) {
      ////console.log("Both Parents Equal :", node.parent, "\nTexts Differ\nTeacher :", (node.text).toLowerCase(), "\nStudent :", (node_two.text).toLowerCase());
      diff_array.push(false);
    } else if ((node.text).toLowerCase() == (node_two.text).toLowerCase() && node.parent == node_two.parent) {
      ////console.log("Both Texts Equal :", (node.text).toLowerCase(), "\nBoth Parents Equal :", node.parent)
      diff_array.push(true);
    }*/


  var pos = (teacher.length >= student.length) ?
    teacher :
    student;

  for (i in pos) {
    ////console.log("< - >");
    compareJSON(teacher[i], student[i], diff_array, not_present_array);
  }
}

genFromTable = function(teacher, student) {
  diff_array = [];
  not_present_array = [];
  percentage = ['%'];
  count = 0;
  teacher_segmented_sentence = [];
  student_segmented_sentence = [];
  ////console.log(node_length);
  compareJSON(teacher[0], student[0], diff_array, not_present_array);

  for (i in diff_array) {
    if (diff_array[i] == true) {
      count++;
    }
  }
  var tree_diff = (count / (diff_array.length + not_present_array.length)) * 100;



  var sentence_like = 0;
  var len = (teacher_segmented_sentence.length >= student_segmented_sentence.length) ?
    teacher_segmented_sentence.length :
    student_segmented_sentence.length;
  var i = j = 0;
  while (i < len) {

    if ((teacher_segmented_sentence[i]) == (student_segmented_sentence[i]))
      sentence_like++;
    if ((teacher_segmented_sentence[teacher_segmented_sentence.length - 1 - i]) == (student_segmented_sentence[student_segmented_sentence.length - 1 - i]))
      sentence_like++;
    i++;

  }
  if (sentence_like > len)
    sentence_like = sentence_like / 2;
  sentence_like = ((sentence_like) / len) * 100;
  ////console.log(student_segmented_sentence);
  percentage.push(((tree_diff + sentence_like) / 200) * 100);
  //percentage.push(tree_diff);
  var result = [percentage, teacher_segmented_sentence, student_segmented_sentence, diff_array, not_present_array]
  ////console.log("teacher >> ", teacher_segmented_sentence);
  ////console.log("student >> ", student_segmented_sentence);
  return result;
}

module.exports = {
  genFromTable,
  compareJSON
};