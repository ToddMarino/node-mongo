const MongoClient = require("mongodb").MongoClient;
const assert = require("assert").strict;

const url = "mongodb://localhost:27017";
const dbname = "nucampsite";

// series of 3 nested callbacks used because of async operation
// typically, nested callbacks is not the preferred method
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  // same as using if(err === null) then quit. otherwise continue. More abrupt way of error handling
  assert.strictEqual(err, null); // if err !== null, quit the application
  console.log("Connected correctly to server");

  const db = client.db(dbname);

  // delete all documents in campsite collection.
  // this is only for testing purpose.
  db.dropCollection("campsites", (err, result) => {
    assert.strictEqual(err, null);
    console.log("Dropped Collection", result);

    // create new document into the campsites collection
    const collection = db.collection("campsites");

    collection.insertOne(
      { name: "Breadcrumb Trail Campground", description: "Test" },
      (err, result) => {
        assert.strictEqual(err, null);
        console.log("Insert Document", result.ops);

        // using .find() will return all records
        // .toArray() returns results as an array so it can be used in console.log
        collection.find().toArray((err, docs) => {
          assert.strictEqual(err, null);
          console.log("Found Documents:", docs);

          client.close();
        });
      }
    );
  });
});
