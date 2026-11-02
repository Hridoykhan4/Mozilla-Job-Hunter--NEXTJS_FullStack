const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());
// const logger = (req, res, next) => {
//   console.log("Logged middleware Logged", req.params);
//   next();
// };

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
    const planCollection = db.collection("plans");
    const subscriptionCollection = db.collection("subscriptions");
    const sessionCollection = db.collection("session");
    // app.get("/api/users", async (req, res) => {
    //   res.send(await usersCollection.find().toArray());
    // });

    app.get("/", (req, res) => {
      res.send("We are there");
    });

    const verifyToken = async (req, res, next) => {
      const authHeader = req?.headers?.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authHeader?.split(" ")[1];
      if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const query = { token: token };
      const session = await sessionCollection.findOne(query);
      if (!session)
        return res.status(401).send({ message: "Unauthorized Access" });

      const userId = session?.userId;

      const userQuery = {
        _id: userId,
      };

      const user = await usersCollection.findOne(userQuery);
      // console.log(user);

      if (!user)
        return res.status(401).send({ message: "unauthorized access" });

      req.user = user;
      next();
    };

    const verifySeeker = async (req, res, next) => {
      if (req?.user?.role !== "seeker")
        return res.status(403).send({ message: "Forbidden Access" });
      next();
    };

    const verifyRecruiter = async (req, res, next) => {
      if (req.user?.role !== "recruiter") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    const   dmin = async (req, res, next) => {
      if (req.user.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

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

      if (isRemote !== undefined) {
        query.isRemote = isRemote === "true" || isRemote === true;
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

    app.get(
      "/api/applications",
      verifyToken,
      verifySeeker,
      async (req, res) => {
        const query = {};
        const { applicantId, jobId } = req.query;

        if (jobId) {
          query.jobId = jobId;
        }

        if (applicantId) {
          query.applicantId = applicantId;
          if (req.user._id.toString() !== applicantId)
            return res.status(403).send({ message: "Forbidden Access" });
        }

        res.send(await applicationCollection.find(query).toArray());
      },
    );

    app.post("/api/applications", async (req, res) => {
      const application = req.body;
      const newApplication = {
        ...application,
        createdAt: new Date(),
      };
      const isExist = await applicationCollection.findOne({
        jobId: req.body.jobId,
        applicantId: req.body.applicantId,
      });
      if (isExist)
        return res
          .status(409)
          .send({ message: "Already Applied for this post" });

      const result = await applicationCollection.insertOne(newApplication);
      res.send(result);
    });

    // Company related APIs

    app.get("/api/companies", verifyToken, async (req, res) => {
      const companies = await companyCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();
      for (const company of companies) {
        const filter = {
          companyId: company._id.toString(),
        };
        const jobCount = await jobsCollection.countDocuments(filter);
        company.jobCount = jobCount;
      }
      res.send(companies);
    });

    // app.get('/api/companies2', async (req, res) => {
    //   const pipeline = [
    //     {
    //       $skip: 1
    //     },
    //     // {
    //     //   $limit: 2
    //     // }
    //   ]

    //   res.send(await companyCollection.aggregate(pipeline).toArray())

    // })
    app.get("/api/stats", async (req, res) => {
      const pipeline = [
        {
          $group: {
            _id: "$jobType",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            jobType: "$_id",
            _id: 0,
            count: 1,
          },
        },
        {
          $sort: { count: 1 },
        },
      ];

      const cursor = jobsCollection.aggregate(pipeline);
      const result = await cursor.toArray();
      res.send(result);
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

    app.patch(
      "/api/companies/:id",
      // logger,
      verifyToken,
      // verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const updatedCompany = req.body;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            status: updatedCompany.status,
          },
        };
        const result = await companyCollection.updateOne(filter, updatedDoc);
        res.send(result);
      },
    );

    app.get("/api/plans", async (req, res) => {
      const query = {};
      const { plan_id } = req.query;
      if (plan_id) {
        query.id = plan_id;
      }
      const plan = await planCollection.findOne(query);
      res.send(plan);
    });

    // Subscription
    app.post("/api/subscriptions", async (req, res) => {
      const data = req.body;
      const subInfo = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const result = await subscriptionCollection.insertOne(subInfo);

      const filter = { email: data.email };
      const updateDocument = {
        $set: {
          plan: data.planId,
        },
      };

      const updateResult = await usersCollection.updateOne(
        filter,
        updateDocument,
      );
      res.send(updateResult);
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
