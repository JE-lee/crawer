let MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
let url = 'mongodb://localhost:27017/crawer'
let documentName = 'jobs'
let jobdb = null

// Use connect method to connect to the server
MongoClient.connect(url,{ useNewUrlParser: true}, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  jobdb = db
})

function insertJobs(jobs){
  if(!jobdb || !(jobs instanceof Array)) return Promise.reject()
  return new Promise((resolve, reject) => {
    let collection = jobdb.collection(documentName)
    collection.insertMany(jobs, (err, r) => {
      if(err) reject()
      console.log(`insert count: ${r.insertedCount}`)
      resolve()
    })
  }) 
}

function close(){
  jobdb && jobdb.close()
}

module.exports = {
  close,
  insertJobs
}
