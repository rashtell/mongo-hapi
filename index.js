var MongoClient = require('mongodb').MongoClient,
  Hapi = require('hapi');

var url = 'mongodb://localhost:27017'
var result;


var server = new Hapi.server({
  port: 8080
});

server.route([
  //Get all data
  {
    method: 'GET',
    path: '/api/data',
    config: { json: { space: 2 } },
    handler: (req, h) => {
      let returnValue = "data fetched"
      result.find().toArray(async (err, data) => {
        if (err) {
          console.log(`index: server.route: GET /api/data: err=> ${err}`);
          return Promise.reject(`index: server.route: GET /api/data: err=> ${err}`)
        }
        console.log(data);
        returnValue = await data
        // return Promise.resolve(data);
        return h.response(returnValue);
      })

      // console.log(`index: server.route: GET /api/data:=> ${h.response("from response")}`)
      return h.response(returnValue);
    }
  },

  //Get single data
  {
    method: 'GET',
    path: '/api/data/{name}',
    config: { json: { space: 2 } },
    handler: function (req, reply) {
      result.findOne({ "number": req.params.name }, function (err, data) {
        return (data)
      })
      
    }
  },

  //Add data
  {
    method: 'POST',
    path: '/api/collection',
    handler: function (req, reply) {
      result.insertOne(req.payload, function (err, data) {
        return (req.payload)
      })
      return 'inserted successfully'
    }
  },

  //Update data
  {
    method: 'PUT',
    path: '/api/collection/{name}',
    handler: function (req, reply) {
      if (req.params.replace == "true") {
        req.payload.name = req.params.name
        result.replaceOne({ "first": req.params.name }, req.payload, function (err, data) {
          result.findOne({ "first": req.params.name }, function (err, data) {
            return (data)
          })
        })
      } else {
        result.updateOne({ name: req.params.name }, { $set: req.payload }, function (err, data) {
          result.findOne({ name: req.params.name }, function (err, data) {
            return (data)
          })
        })
      }

      return `successfully updated first:${req.params.name}`
    }
  },

  //Delete data
  {
    method: 'DELETE',
    path: '/api/collection/{name}',
    handler: function (req, reply) {
      result.deleteOne({ "name": req.params.name }, function (err, data) {
        return ("Data deleted").code(204)
      })
    }
  },

  //Homepage
  {
    method: 'GET',
    path: '/',
    handler: function (req, reply) {
      return ("Welcome to the homepage for mongo-hapi testing")
    }
  }

])

MongoClient.connect(url, async function (err, client) {
  if (err) {
    console.log(err)
  } else {

    console.log('MongoDB connected correctly to server');
    var db = client.db("tester");
    result = db.collection('tester');

    try {
      await server.start()
      //assert.equal(null, err);
      console.log('Hapi is listening to http://localhost:8080')
    } catch (err) {
      console.error(err);
    }
  }

})
