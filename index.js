require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    

    await client.db("admin").command({ ping: 1 });
    console.log(" Successfully connected to MongoDB!");

  } catch (error) {
    console.error("MongoDB Connection error:", error);
  } finally {

    await client.close();
  }
}


run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});