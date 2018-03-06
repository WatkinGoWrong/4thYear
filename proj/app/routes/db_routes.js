var test = 0;
module.exports = function(app, db) {
    app.post('/db_test/', (req, res) => {

        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          var myobj = [{
            name: 'Hannah',
            address: 'Mountain 21'
          }];
          dbo.collection("customers").insertMany(myobj, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            test++;
            db.close();
          });
        });
        res.send(test);
      };
    };