getGrade = function(body, sentence) {
  var grade;
  return new Promise(function(resolve, reject) {
    $.post(
      "http://localhost:8000/grading", {
        body,
        sentence
      },
      function(data_) {
        resolve(data_);
      }
    );
  });
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

getTeacherSFL = function(sentence) {
  var sfl = sentence;
  return new Promise(function(resolve, reject) {
    $.post(
      "http://localhost:8000/exampleTrees", {
        sfl
      },
      function(data) {
        var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
        //nodes = JSON.parse(res);
        resolve(res);
      }
    );
  });
}

getTeacherSFL_db = function() {
  return new Promise(function(resolve, reject) {
    $.get(
      "http://localhost:8000/mydb",
      function(data) {
        var res = data;
        resolve(res);
      }
    );
  });
}

postSFL_db = function(obj) {
  console.log(obj);

  return new Promise(function(resolve, reject) {
    $.post(
      "http://localhost:8000/mydb/", {
        key: obj.key,
        id: obj.id,
        value: obj.value,
        collection: obj.collection,
        connection_type: obj.connection_type,
        annotations: obj.annotations
      },

      function(data) {
        var res = data;
        resolve(res);
      }
    );
  });
}