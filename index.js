require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { client, connectDB } = require("./Config/db");

const doctorsRoutes = require("./routes/doctorsRoutes");
const bookingsRoutes = require("./routes/bookingsRoutes");

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://assignment-9-eight-drab.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

async function startServer() {
  try {
    await connectDB();

    const database = client.db("DocAppoint");

    const doctorsCollection = database.collection("doctors");

    const bookingsCollection = database.collection("bookings");

    app.post("/jwt", async (req, res) => {
      try {
        const user = req.body;

        const token = jwt.sign(
          user,
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        res.send({
          success: true,
          token,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Failed to generate token",
        });
      }
    });

    app.use(
      "/api/doctors",
      doctorsRoutes(doctorsCollection)
    );

    app.use(
      "/api/bookings",
      bookingsRoutes(bookingsCollection)
    );

    app.get("/", (req, res) => {
      res.send("DocAppoint Server Running...");
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.log("Server error:", error);
  }
}

startServer();