import { hashPassword } from "better-auth/crypto";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  throw new Error("MONGODB_URI and DB_NAME must be set in client/.env");
}

const DEMO_PASSWORD = "123456aA@";
const SEED_PREFIX = "demo-v1";

const users = [
  { email: "user4@gmail.com", name: "Nusrat Jahan", role: "seeker" },
  { email: "user5@gmail.com", name: "Farhan Ahmed", role: "recruiter" },
  { email: "user6@gmail.com", name: "Sadia Islam", role: "seeker" },
  { email: "user7@gmail.com", name: "Tanvir Hasan", role: "recruiter" },
  { email: "user8@gmail.com", name: "Mehedi Rahman", role: "seeker" },
  { email: "user9@gmail.com", name: "Raisa Karim", role: "recruiter" },
  { email: "user10@gmail.com", name: "Afiya Noor", role: "seeker" },
  { email: "user11@gmail.com", name: "Shafin Chowdhury", role: "recruiter" },
];

const companyDefinitions = [
  {
    recruiterEmail: "user5@gmail.com",
    key: "vercel",
    name: "Vercel",
    websiteUrl: "https://vercel.com",
    industry: "technology",
    location: "San Francisco, USA",
    employeeCount: "201+",
    description:
      "Vercel provides the developer tools and cloud infrastructure used to build, scale, and secure modern web applications.",
    logo: "https://cdn.simpleicons.org/vercel/white",
    jobs: [
      {
        jobTitle: "Senior Frontend Engineer",
        jobCategory: "technology",
        jobType: "full-time",
        minSalary: "120000",
        maxSalary: "175000",
        currency: "USD",
        location: "",
        isRemote: true,
        deadline: "2026-12-15",
        responsibilities:
          "Build polished product experiences, improve frontend architecture, and collaborate with design and platform teams.",
        requirements:
          "5+ years of frontend experience, strong React and TypeScript skills, and experience shipping production web applications.",
        benefits:
          "Remote-friendly work, learning budget, health coverage, and flexible paid time off.",
      },
      {
        jobTitle: "Developer Experience Engineer",
        jobCategory: "technology",
        jobType: "full-time",
        minSalary: "105000",
        maxSalary: "155000",
        currency: "USD",
        location: "",
        isRemote: true,
        deadline: "2026-12-22",
        responsibilities:
          "Improve SDKs, examples, documentation, and workflows used by developers deploying web applications.",
        requirements:
          "Strong JavaScript knowledge, clear technical writing, and experience with APIs, CI/CD, and cloud platforms.",
        benefits:
          "Home-office allowance, flexible schedule, wellness support, and professional development budget.",
      },
      {
        jobTitle: "Product Designer",
        jobCategory: "design",
        jobType: "full-time",
        minSalary: "95000",
        maxSalary: "145000",
        currency: "USD",
        location: "New York, USA",
        isRemote: false,
        deadline: "2027-01-05",
        responsibilities:
          "Design end-to-end product flows, maintain design-system quality, and validate solutions through user research.",
        requirements:
          "A strong product design portfolio, systems thinking, prototyping skills, and experience working with engineering teams.",
        benefits:
          "Health coverage, flexible PTO, commuter support, and annual learning stipend.",
      },
    ],
  },
  {
    recruiterEmail: "user7@gmail.com",
    key: "gitlab",
    name: "GitLab",
    websiteUrl: "https://about.gitlab.com",
    industry: "technology",
    location: "Remote Worldwide",
    employeeCount: "201+",
    description:
      "GitLab is a DevSecOps platform that helps teams plan, build, secure, and deploy software in one application.",
    logo: "https://cdn.simpleicons.org/gitlab",
    jobs: [
      {
        jobTitle: "Backend Engineer, Platform",
        jobCategory: "technology",
        jobType: "full-time",
        minSalary: "110000",
        maxSalary: "165000",
        currency: "USD",
        location: "",
        isRemote: true,
        deadline: "2026-12-18",
        responsibilities:
          "Develop reliable platform services, improve observability, and review scalable backend architecture.",
        requirements:
          "Strong backend fundamentals, SQL experience, distributed-systems knowledge, and clear asynchronous communication.",
        benefits:
          "All-remote work, flexible PTO, home-office budget, and parental leave.",
      },
      {
        jobTitle: "Site Reliability Engineer",
        jobCategory: "technology",
        jobType: "full-time",
        minSalary: "115000",
        maxSalary: "170000",
        currency: "USD",
        location: "",
        isRemote: true,
        deadline: "2027-01-08",
        responsibilities:
          "Operate production systems, automate repetitive work, and improve service availability and incident response.",
        requirements:
          "Experience with Kubernetes, Linux, infrastructure as code, monitoring, and production incident management.",
        benefits:
          "Remote setup support, equity, wellness benefits, and flexible working hours.",
      },
      {
        jobTitle: "Technical Content Marketer",
        jobCategory: "marketing",
        jobType: "contract",
        minSalary: "65000",
        maxSalary: "90000",
        currency: "USD",
        location: "",
        isRemote: true,
        deadline: "2026-11-30",
        responsibilities:
          "Create developer-focused campaigns, technical articles, and launch content for DevSecOps audiences.",
        requirements:
          "Technical marketing experience, excellent writing skills, SEO knowledge, and familiarity with software delivery.",
        benefits:
          "Remote contract, flexible schedule, and access to learning resources.",
      },
    ],
  },
  {
    recruiterEmail: "user9@gmail.com",
    key: "shopify",
    name: "Shopify",
    websiteUrl: "https://www.shopify.com",
    industry: "technology",
    location: "Ottawa, Canada",
    employeeCount: "201+",
    description:
      "Shopify provides commerce tools that help businesses start, grow, market, and manage retail operations.",
    logo: "https://cdn.simpleicons.org/shopify",
    jobs: [
      {
        jobTitle: "Full Stack Developer",
        jobCategory: "technology",
        jobType: "full-time",
        minSalary: "105000",
        maxSalary: "155000",
        currency: "USD",
        location: "",
        isRemote: true,
        deadline: "2026-12-20",
        responsibilities:
          "Build merchant-facing features, improve APIs, and deliver accessible, high-performance commerce experiences.",
        requirements:
          "Experience with React, backend services, relational databases, testing, and iterative product development.",
        benefits:
          "Remote work, health benefits, equipment budget, and employee stock program.",
      },
      {
        jobTitle: "Data Analyst, Merchant Success",
        jobCategory: "technology",
        jobType: "full-time",
        minSalary: "80000",
        maxSalary: "120000",
        currency: "USD",
        location: "Toronto, Canada",
        isRemote: false,
        deadline: "2027-01-12",
        responsibilities:
          "Analyze merchant behavior, build dashboards, define metrics, and communicate actionable product insights.",
        requirements:
          "Advanced SQL, dashboarding experience, statistical reasoning, and strong stakeholder communication.",
        benefits:
          "Health coverage, learning budget, paid leave, and employee discounts.",
      },
      {
        jobTitle: "UX Researcher",
        jobCategory: "design",
        jobType: "contract",
        minSalary: "75000",
        maxSalary: "110000",
        currency: "USD",
        location: "",
        isRemote: true,
        deadline: "2026-12-28",
        responsibilities:
          "Plan mixed-method research, synthesize findings, and help product teams make merchant-centered decisions.",
        requirements:
          "Research portfolio, interview and usability-testing experience, and excellent synthesis and presentation skills.",
        benefits:
          "Flexible remote contract, research-tool budget, and collaborative product environment.",
      },
    ],
  },
  {
    recruiterEmail: "user11@gmail.com",
    key: "stripe",
    name: "Stripe",
    websiteUrl: "https://stripe.com",
    industry: "finance",
    location: "Dublin, Ireland",
    employeeCount: "201+",
    description:
      "Stripe builds economic infrastructure and programmable financial tools for internet businesses around the world.",
    logo: "https://cdn.simpleicons.org/stripe",
    jobs: [
      {
        jobTitle: "Software Engineer, Payments",
        jobCategory: "technology",
        jobType: "full-time",
        minSalary: "125000",
        maxSalary: "185000",
        currency: "USD",
        location: "Dublin, Ireland",
        isRemote: false,
        deadline: "2027-01-15",
        responsibilities:
          "Design dependable payment services, improve API reliability, and collaborate on secure financial infrastructure.",
        requirements:
          "Strong programming fundamentals, API design experience, database knowledge, and a focus on correctness.",
        benefits:
          "Competitive compensation, equity, health coverage, meals, and learning support.",
      },
      {
        jobTitle: "Risk Operations Specialist",
        jobCategory: "finance",
        jobType: "full-time",
        minSalary: "70000",
        maxSalary: "100000",
        currency: "USD",
        location: "Dublin, Ireland",
        isRemote: false,
        deadline: "2026-12-10",
        responsibilities:
          "Review account risk, investigate payment patterns, and improve operational controls and customer outcomes.",
        requirements:
          "Analytical judgment, operations experience, spreadsheet proficiency, and clear written communication.",
        benefits:
          "Health insurance, retirement support, paid leave, and commuter benefits.",
      },
      {
        jobTitle: "Sales Development Representative",
        jobCategory: "sales",
        jobType: "full-time",
        minSalary: "60000",
        maxSalary: "85000",
        currency: "USD",
        location: "London, UK",
        isRemote: false,
        deadline: "2027-01-03",
        responsibilities:
          "Research prospective customers, qualify opportunities, and partner with account executives on outreach programs.",
        requirements:
          "Customer-facing experience, concise communication, curiosity about payments, and comfort working toward targets.",
        benefits:
          "Commission plan, wellness allowance, paid leave, and career development support.",
      },
    ],
  },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const userCollection = db.collection("user");
  const accountCollection = db.collection("account");
  const companyCollection = db.collection("companies");
  const jobsCollection = db.collection("jobs");
  const now = new Date();
  const nowIso = now.toISOString();
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const userIdsByEmail = new Map();
  let usersCreated = 0;
  let usersMigrated = 0;
  let accountsCreated = 0;

  for (const user of users) {
    let existingUser = await userCollection.findOne({ email: user.email });

    // Better Auth expects Mongo document IDs and account.userId to be ObjectIds.
    if (existingUser && !(existingUser._id instanceof ObjectId)) {
      const legacyUserId = existingUser._id;
      const normalizedUserId = ObjectId.isValid(legacyUserId)
        ? new ObjectId(legacyUserId)
        : new ObjectId();
      const normalizedUser = {
        ...existingUser,
        _id: normalizedUserId,
        createdAt: new Date(existingUser.createdAt),
        updatedAt: now,
      };

      await accountCollection.deleteMany({ userId: legacyUserId });
      await userCollection.deleteOne({ _id: legacyUserId });
      await userCollection.insertOne(normalizedUser);
      existingUser = normalizedUser;
      usersMigrated += 1;
    }

    let userId = existingUser?._id;

    if (!existingUser) {
      userId = new ObjectId();
      await userCollection.insertOne({
        _id: userId,
        name: user.name,
        email: user.email,
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
        role: user.role,
        plan: user.role === "recruiter" ? "recruiter_free" : "seeker_free",
      });
      usersCreated += 1;
    }

    userIdsByEmail.set(user.email, userId.toString());

    const existingCredential = await accountCollection.findOne({
      userId,
      providerId: "credential",
    });

    if (!existingCredential) {
      await accountCollection.insertOne({
        _id: new ObjectId(),
        accountId: userId.toString(),
        providerId: "credential",
        userId,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      });
      accountsCreated += 1;
    } else {
      await accountCollection.updateOne(
        { _id: existingCredential._id },
        {
          $set: {
            password: passwordHash,
            updatedAt: now,
          },
        },
      );
    }
  }

  let companiesCreated = 0;
  let companiesUpdated = 0;
  let jobsCreated = 0;
  let jobsUpdated = 0;

  for (const definition of companyDefinitions) {
    const recruiterId = userIdsByEmail.get(definition.recruiterEmail);
    const companySeedKey = `${SEED_PREFIX}:company:${definition.key}`;
    const companyResult = await companyCollection.updateOne(
      { seedKey: companySeedKey },
      {
        $set: {
          name: definition.name,
          websiteUrl: definition.websiteUrl,
          industry: definition.industry,
          location: definition.location,
          employeeCount: definition.employeeCount,
          description: definition.description,
          logo: definition.logo,
          status: "Approved",
          recruiterId,
          updatedAt: nowIso,
        },
        $setOnInsert: { seedKey: companySeedKey, createdAt: nowIso },
      },
      { upsert: true },
    );

    companiesCreated += companyResult.upsertedCount;
    companiesUpdated += companyResult.matchedCount;

    const company = await companyCollection.findOne({ seedKey: companySeedKey });

    for (const [index, job] of definition.jobs.entries()) {
      const jobSeedKey = `${SEED_PREFIX}:job:${definition.key}:${index + 1}`;
      const jobResult = await jobsCollection.updateOne(
        { seedKey: jobSeedKey },
        {
          $set: {
            ...job,
            companyId: company._id.toString(),
            companyName: company.name,
            companyLogo: company.logo,
            status: "active",
            isPubliclyVisible: true,
            updatedAt: nowIso,
          },
          $setOnInsert: { seedKey: jobSeedKey, createdAt: nowIso },
        },
        { upsert: true },
      );

      jobsCreated += jobResult.upsertedCount;
      jobsUpdated += jobResult.matchedCount;
    }
  }

  console.log(
    JSON.stringify(
      {
        database: dbName,
        users: { created: usersCreated, migrated: usersMigrated, totalSeeded: users.length },
        accounts: { created: accountsCreated },
        companies: { created: companiesCreated, updated: companiesUpdated },
        jobs: { created: jobsCreated, updated: jobsUpdated },
        login: { emails: "user4@gmail.com through user11@gmail.com", password: DEMO_PASSWORD },
      },
      null,
      2,
    ),
  );
} finally {
  await client.close();
}
