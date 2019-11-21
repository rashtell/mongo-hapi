var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017';

MongoClient.connect(url, function (err, client) {
  console.log('Connected to server');
  var db = client.db("tester");
  var collection = db.collection("tester")
  collection.find().toArray(function (err, dat) {
    console.log(dat);
    client.close()
  })


})