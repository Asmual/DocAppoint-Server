const express = require("express");
const { ObjectId } = require("mongodb");
const verifyJWT = require("../middlewares/verifyJWT");

function bookingsRoutes(bookingsCollection) {

  const router = express.Router();

  // SEARCH BOOKINGS
  router.get("/search", verifyJWT, async (req, res) => {
    try {

      const doctorName = req.query.doctorName;

      if (!doctorName) {
        return res.status(400).send({
          success: false,
          message: "Doctor name is required",
        });
      }

      const query = {
        doctorName: {
          $regex: doctorName,
          $options: "i",
        },
      };

      const result = await bookingsCollection.find(query).toArray();

      res.send(result);

    } catch (error) {

      res.status(500).send({
        success: false,
        message: "Search failed",
      });
    }
  });

  // CREATE BOOKING
  router.post("/", verifyJWT, async (req, res) => {
    try {

      const newBooking = req.body;

      if (req.decoded.email !== newBooking.email) {
        return res.status(403).send({
          success: false,
          message: "Forbidden access",
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
          message: "Booking failed",
        });
      }

    } catch (error) {

      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // GET USER BOOKINGS
  router.get("/", verifyJWT, async (req, res) => {
    try {

      const email = req.query.email;

      if (!email) {
        return res.status(400).send({
          success: false,
          message: "Email is required",
        });
      }

      if (req.decoded.email !== email) {
        return res.status(403).send({
          success: false,
          message: "Forbidden access",
        });
      }

      const query = { email };

      const bookings = await bookingsCollection.find(query).toArray();

      res.send(bookings);

    } catch (error) {

      res.status(500).send({
        success: false,
        message: "Failed to fetch bookings",
      });
    }
  });

  // UPDATE BOOKING
  router.patch("/:id", verifyJWT, async (req, res) => {
    try {

      const id = req.params.id;

      const updatedBooking = req.body;

      const filter = {
        _id: new ObjectId(id),
      };

      const updateDoc = {
        $set: {
          patientName: updatedBooking.patientName,
          appointmentDate: updatedBooking.appointmentDate,
          appointmentTime: updatedBooking.appointmentTime,
          notes: updatedBooking.notes,
        },
      };

      const result = await bookingsCollection.updateOne(
        filter,
        updateDoc
      );

      res.send({
        success: true,
        result,
      });

    } catch (error) {

      res.status(500).send({
        success: false,
        message: "Update failed",
      });
    }
  });

  // DELETE BOOKING
  router.delete("/:id", verifyJWT, async (req, res) => {
    try {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await bookingsCollection.deleteOne(query);

      if (result.deletedCount === 1) {

        res.send({
          success: true,
          message: "Appointment deleted successfully!",
        });

      } else {

        res.status(404).send({
          success: false,
          message: "Booking not found",
        });
      }

    } catch (error) {

      res.status(500).send({
        success: false,
        message: "Delete failed",
      });
    }
  });

  return router;
}

module.exports = bookingsRoutes;