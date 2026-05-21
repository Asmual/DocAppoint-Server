const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const verifyJWT = require("../middlewares/verifyJWT");

module.exports = function (bookingsCollection) {

 
  router.get("/search", verifyJWT, async (req, res) => {
    try {
      const doctorName = req.query.doctorName;
      if (!doctorName) {
        return res.status(400).send({ message: "Doctor name is required for search" });
      }

      const query = { doctorName: { $regex: doctorName, $options: "i" } };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send({ success: false, message: "Search failed" });
    }
  });

 
  router.post("/", verifyJWT, async (req, res) => {
    try {
      const newBooking = req.body;

       
      if (req.decoded && req.decoded.email && req.decoded.email !== newBooking.email) {
        return res.status(403).send({
          success: false,
          message: "Forbidden access: Email mismatch",
        });
      }

      const result = await bookingsCollection.insertOne(newBooking);

      if (result.insertedId) {
        res.status(201).send({
          success: true,
          message: "Appointment booked successfully!",
          insertedId: result.insertedId,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Failed to create booking",
        });
      }

    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

 
  router.get("/", verifyJWT, async (req, res) => {
    try {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ success: false, message: "Email query parameter is required" });
      }

      if (req.decoded && req.decoded.email && req.decoded.email !== email) {
        return res.status(403).send({ success: false, message: "Forbidden access" });
      }

      const query = { email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    } catch (error) {
      res.status(500).send({ success: false, message: "Server error" });
    }
  });

 
  router.patch("/:id", verifyJWT, async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid ID format" });
      }
      
      const filter = { _id: new ObjectId(id) };
      const updatedBooking = req.body;
      const updateDoc = {
        $set: {
          patientName: updatedBooking.patientName,
          appointmentDate: updatedBooking.appointmentDate,
          appointmentTime: updatedBooking.appointmentTime,
          notes: updatedBooking.notes,
        },
      };
      const result = await bookingsCollection.updateOne(filter, updateDoc);
      res.send({ success: true, result });
    } catch (error) {
      res.status(500).send({ success: false, message: "Update failed" });
    }
  });

 
  router.delete("/:id", verifyJWT, async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid ID format" });
      }

      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send({ success: true, message: "Booking canceled successfully" });
      } else {
        res.status(404).send({ success: false, message: "Booking not found" }); 
      }
    } catch (error) {
      res.status(500).send({ success: false, message: "Delete failed" });
    }
  });

  return router;
};