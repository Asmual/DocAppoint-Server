require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("node:dns");
const { MongoClient, ServerApiVersion } = require("mongodb");

const doctorsRoutes = require("./routes/doctorsRoutes");
const bookingsRoutes = require("./routes/bookingsRoutes");
const seedDoctors = require("./utils/seedDoctors");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    const db = client.db("doctorDB");
    
    await seedDoctors(db);

    const doctorsCollection = db.collection("doctors");
    const bookingsCollection = db.collection("bookings");

    app.use("/api/doctors", doctorsRoutes(doctorsCollection));
    app.use("/api/bookings", bookingsRoutes(bookingsCollection));

    app.get("/", (req, res) => {
      res.send("Doctor Appointment Server Running");
    });

  } catch (error) {
    console.error("MongoDB Connection error:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});