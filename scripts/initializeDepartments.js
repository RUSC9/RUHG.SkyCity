const mongoose = require("mongoose");
const { DB_URL } = require("../core/config/appConfig");
const Department = require("../auth/models/Department");

const DEPARTMENTS = [
  "accounting",
  "payment_processing",
  "payroll",
  "marketing_sales",
  "corporate_administration",
  "human_resources",
  "technology",
  "cybersecurity"
];

async function initializeDepartments() {
  try {
    if (!DB_URL) {
      throw new Error("MongoDB connection URI is missing.");
    }

    await mongoose.connect(DB_URL);

    for (const code of DEPARTMENTS) {
      const result = await Department.updateOne(
        { code },
        {
          $setOnInsert: {
            code,
            staffLimit: 20,
            isActive: true
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`Created department: ${code}`);
      } else {
        console.log(`Department already exists: ${code}`);
      }
    }

    console.log("Department initialization complete.");
  } catch (error) {
    console.error("Department initialization failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

initializeDepartments();