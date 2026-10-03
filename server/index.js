const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_DB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect(() => {
  console.log("Connecting to the DB");
});

async function run() {
  try {
    console.log("Successfully connected to MongoDB!");

    const db = client.db(process.env.DB_NAME);
    const jobsCollection = db.collection("jobs");


    // POST Route: নতুন Job তৈরি করার জন্য
    app.post("/api/jobs", async (req, res) => {
      try {
        const jobData = req.body;
        const result = await jobsCollection.insertOne(jobData);
        res.status(201).json({ success: true, result });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

