const express = require("express");
const { ObjectId } = require("mongodb");

function bookingsRoutes(bookingsCollection) {
  const router = express.Router();

  // 1. CREATE/POST NEW BOOKING
  router.post("/", async (req, res) => {
    try {
      const newBooking = req.body;
      const result = await bookingsCollection.insertOne(newBooking);
      
      if (result.insertedId) {
        res.status(201).send({ success: true, message: "Booking successful!", insertedId: result.insertedId });
      } else {
        res.status(400).send({ success: false, message: "Failed to create booking" });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: "Internal server error", error: error.message });
    }
  });

  // 2. GET BOOKINGS (Fix: Supports both 'email' and 'userEmail' fields)
  router.get("/", async (req, res) => {
    try {
      const email = req.query.email;
      let query = {};
      
      if (email) {

        query = {
          $or: [
            { email: email },
            { userEmail: email }
          ]
        };
      }
      
      const result = await bookingsCollection.find(query).toArray();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch bookings", error: error.message });
    }
  });

  // 3. UPDATE BOOKING DETAILS (PATCH)
  router.patch("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          patientName: updatedData.patientName,
          appointmentDate: updatedData.appointmentDate,
          appointmentTime: updatedData.appointmentTime,
          notes: updatedData.notes
        },
      };

      const result = await bookingsCollection.updateOne(filter, updateDoc);
      
      if (result.modifiedCount > 0 || result.matchedCount > 0) {
        res.status(200).send({ success: true, message: "Booking updated successfully" });
      } else {
        res.status(404).send({ success: false, message: "Booking not found or no changes made" });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: "Internal server error", error: error.message });
    }
  });

  // 4. DELETE/CANCEL BOOKING (DELETE)
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      
      const result = await bookingsCollection.deleteOne(query);
      
      if (result.deletedCount > 0) {
        res.status(200).send({ success: true, message: "Booking deleted successfully" });
      } else {
        res.status(404).send({ success: false, message: "Booking not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: "Internal server error", error: error.message });
    }
  });

  return router;
}

module.exports = bookingsRoutes;