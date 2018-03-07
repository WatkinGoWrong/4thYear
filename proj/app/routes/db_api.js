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

module.exports = function(app, db) {
  getTeacherSFL_db
}