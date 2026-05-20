const express = require("express");

/**
 * Initializes and configuration for doctor routes
 * @param {Object} doctorsCollection - MongoDB collection instance
 * @returns {Object} express router
 */
function doctorsRoutes(doctorsCollection) {
  const router = express.Router();

  // GET ALL DOCTORS
  router.get("/", async (req, res) => {
    try {
      const result = await doctorsCollection.find().toArray();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch doctors", error: error.message });
    }
  });

  // GET SINGLE DOCTOR BY ID
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const result = await doctorsCollection.findOne({ id: id });
      
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