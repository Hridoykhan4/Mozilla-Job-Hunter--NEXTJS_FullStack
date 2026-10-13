const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const companyCollection = db.collection("companies");
    const usersCollection = db.collection("user");

    app.get("/api/users", async (req, res) => {
      res.send(await usersCollection.find().toArray());
    });

    app.get("/api/jobs", async (req, res) => {
      let query = {};
      console.log(req.query);
      if (req.query.companyId) {
        query.companyId = req.query.companyId;
      }
      if (req.query.status) {
        query.status = req.query.status;
      }
      console.log(await jobsCollection.find(query).toArray());
      const result = await jobsCollection.find(query).toArray();
      return res.send(result);
    });

    app.get("/api/jobs/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      res.send(await jobsCollection.findOne(query));
    });

    // POST Route: নতুন Job তৈরি করার জন্য
    app.post("/api/jobs", async (req, res) => {
      try {
        const jobData = req.body;
        const result = await jobsCollection.insertOne({
          ...jobData,
          createdAt: new Date().toISOString(),
        });
        res.status(201).json({ success: true, result });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Company related APIs

    app.get("/api/companies", async (req, res) => {
      const companies = await companyCollection.find().toArray();
      for (const company of companies) {
        const filter = {
          companyId: company._id.toString(),
        };
        const jobCount = await jobsCollection.countDocuments(filter);
        company.jobCount = jobCount;
      }
      res.send(companies);
    });

    app.post("/api/companies", async (req, res) => {
      const company = req.body;
      const newCompany = {
        ...company,
        createdAt: new Date().toISOString(),
      };
      const result = await companyCollection.insertOne(newCompany);
      res.send(result);
    });

    app.get("/api/my/companies", async (req, res) => {
      let query = {};
      const { recruiterId } = req.query;
      if (recruiterId) {
        query.recruiterId = recruiterId;
      }

      const result = await companyCollection.findOne(query);

      if (!result) {
        return res.json({});
      }

      res.send(recruiterId ? result : {});
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
