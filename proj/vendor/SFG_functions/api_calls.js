/**
 *Conatins all api call functions
 *Grading, Tree constructing, Teachers Tree retreval
 *Saving and retrieving from database
 *
 */

var port = "http://192.168.1.10:8000/"
var port2 = "http://localhost:8000/"

getGrade = function(body, sentence) {
  var grade;
  return new Promise(function(resolve, reject) {
    $.post(
      port2 + "grading", {
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
      port2 + "treetest", {
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
      port2 + "exampleTrees", {
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
      port2 + "mydb",
      function(data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}

getStudentSFL_db = function() {
  return new Promise(function(resolve, reject) {
    $.get(
      port2 + "mydb_s",
      function(data) {
        //var res = data;
        resolve(data);
      }
    );
  });
}

postSFL_db = function(object) {
  //console.log(object);

  return new Promise(function(resolve, reject) {
    $.post(
      port2 + "mydb", {
        key: object.key,
        id: object.id,
        value: object.value,
        collection: object.collection,
        connection_type: object.connection_type,
        annotations: object.annotations, //,
        last_session: object.last_session
      },

      function(data) {
        var res = data;
        resolve(res);
      }
    );
  });
}

save_session = function(object) {
  return new Promise(function(resolve, reject) {
    $.post(
      port2 + "mydb_save", {
        id: object.id,
        collection: object.collection,
        last_session: object.last_session
      },
      function(data) {
        resolve(data);
      }
    );
  });
}