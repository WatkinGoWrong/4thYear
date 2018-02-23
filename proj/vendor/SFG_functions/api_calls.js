getGrade = function(body, sentence) {
  var grade;
  return new Promise(function(resolve, reject) {
    $.post(
      "http://localhost:8000/grading", {
        body,
        sentence
      },
      function(data_) {
        //if (data_ == null) return reject("error")
        resolve(data_);
        /*grade["GRADE"] = {
          "PERCENTAGE": data_[0],
          "TEACHER_SEG_SEN": data_[1],
          "STUDENT_SEG_SEN": data_[2],
          "LIKENESS": data_[3]
        }*/
        //console.log(data_);
      }
    );
  });
  //return grade;
}

getTree = function() {
  var nodes;
  var res;
  return new Promise(function(resolve, reject) {
    $.post(
      "http://localhost:8000/treetest", {
        body
      },
      function(data) {
        var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
        nodes = JSON.parse(res);
        resolve(nodes);
      }
    );
  });
}