const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

module.exports = function(app, db) {

  app.post('/mydb/', (req, res) => {
    var key = req.body.key;
    var id = req.body.id;
    var value = req.body.value;
    var collection = req.body.collection; //student , teacher
    var connection_type = req.body.connection_type;
    var annotations = req.body.annotations;

    var myobj = [{
      _id: id,
      [key]: value
    }];

    if (collection == "student" || collection == "teacher") {

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        if (connection_type == "insert") {
          console.log("insert");
          dbo.collection(collection).insertMany(myobj, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            test++;
            db.close();
          });
        } else if (connection_type == "update") {
          console.log("update");

          var myquery = {
            _id: id
          };

          if (collection == "teacher") {
            var newvalues = {
              $set: {
                _id: id,
                [key]: value,
              }
            };
          } else {
            var newvalues = {
              $set: {
                _id: id,
                [key]: value,
                annotations: [annotations]
              }
            };
          }

          dbo.collection(collection).updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
          });
        }
      });
      res.send();
    } else {
      res.send("Error - collection doesn't exist")
    }
  });

  app.get('/mydb/', (req, res) => {
    var teacher;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("teacher").findOne({}, function(err, result) {
        if (err) throw err;
        var teacher = result;
        res.send(teacher);
        db.close();
      });
    });
  });

  app.get('/mydb_s/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("student").findOne({}, function(err, result) {
        if (err) throw err;
        var student = result;
        res.send(student);
        db.close();
      });
    });
  });
}