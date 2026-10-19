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
    const applicationCollection = db.collection("applications");

    // app.get("/api/users", async (req, res) => {
    //   res.send(await usersCollection.find().toArray());
    // });

    app.get("/api/jobs", async (req, res) => {
      let query = {};
      const {
        search,
        jobType,
        jobTitle,
        companyName,
        isRemote,
        companyId,
        status,
      } = req.query;


      if (search) {
        query.$or = [
          { jobTitle: { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
        ];
      }

      if (jobType) {
        query.jobType = jobType;
      }

      if (isRemote) {
        query.isRemote = Boolean(isRemote);
      }

      if (companyId) {
        query.companyId = companyId;
      }
      if (status) {
        query.status = status;
      }
      const result = await jobsCollection.find(query).toArray();
      const total = await jobsCollection.countDocuments(query);
      return res.send({ jobs: result, total });
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

    // Application related APIs

    app.get('/api/applications', async(req, res) => {
      const query = {};
      const {applicantId, jobId} = req.query;
      // console.log(req.user);
      // if(applicantId) {
      //   query.applicantId = applicantId
      //   console.log(query, req?.user);
      // }
      if(jobId) {
        query.jobId = jobId
      }

      res.send(await applicationCollection.find(query).toArray())
    })

    app.post("/api/applications", async (req, res) => {
      const application = req.body;
      const newApplication = {
        ...application,
        createdAt: new Date(),
      };
      const result = await applicationCollection.insertOne(newApplication);
      res.send(result);
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
