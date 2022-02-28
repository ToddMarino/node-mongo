const MongoClient = require("mongodb").MongoClient;
const assert = require("assert").strict;
const dboper = require("./operations");

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

    dboper.insertDocument(
      db,
      { name: "Breadcrumb Trail Campground", description: "Test" },
      "campsites",
      (result) => {
        console.log("Insert Document", result.ops);

        dboper.findDocuments(db, "campsites", (docs) => {
          console.log("Found Documents:", docs);

          dboper.updateDocument(
            db,
            { name: "Breadcrumb Trail Campground" },
            { description: "Updated Test Description" },
            "campsites",
            (result) => {
              console.log("Updated Document Count:", result.result.nModified);

              dboper.findDocuments(db, "campsites", (docs) => {
                console.log("Found Documents:", docs);

                dboper.removeDocument(
                  db,
                  { name: "Breadcrumb Trail Campground" },
                  "campsites",
                  (result) => {
                    console.log("Deleted Document Count:", result.deletedCount);
                    client.close();
                  }
                );
              });
            }
          );
        });
      }
    );
  });
});
