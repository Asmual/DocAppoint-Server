const express = require("express");
const { ObjectId } = require("mongodb");
const verifyJWT = require("../middlewares/verifyJWT"); 

function doctorsRoutes(doctorsCollection) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const result = await doctorsCollection.find().toArray();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch doctors", error: error.message });
    }
  });

  router.get("/:id", verifyJWT, async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid Doctor ID format" });
      }

      const result = await doctorsCollection.findOne({ _id: new ObjectId(id) });
      
      if (!result) {
        return res.status(404).send({ message: "Doctor profile not found" });
      }
      
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch doctor profile", error: error.message });
    }
  });

  return router;
}

module.exports = doctorsRoutes;