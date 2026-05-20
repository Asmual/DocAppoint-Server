const fs = require("fs");
const path = require("path");

/**
 * Seeds initial doctors data from a JSON file into MongoDB
 * @param {Object} db - MongoDB database instance
 */
async function seedDoctors(db) {
  try {
    const doctorsCollection = db.collection("doctors");

    // Check if data already exists to prevent duplicate seeding
    const count = await doctorsCollection.countDocuments();
    if (count > 0) {
      console.log("Doctors data already exists in MongoDB. Skipping seeding.");
      return;
    }

    // Read and parse JSON file data
    const filePath = path.join(__dirname, "../data/doctors.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    const doctors = JSON.parse(fileData);

    // Insert batch data into collection
    const result = await doctorsCollection.insertMany(doctors);
    console.log(`${result.insertedCount} Doctors successfully inserted into MongoDB!`);
  } catch (error) {
    console.error("Error seeding doctors data:", error);
  }
}

module.exports = seedDoctors;