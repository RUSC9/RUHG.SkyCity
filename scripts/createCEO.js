require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const Admin = require("../auth/models/Admin");

async function createCEO() {
const rl = readline.createInterface({
input: stdin,
output: stdout
});

try {
const {DB_URL} = require("../core/config/appConfig");
const mongoUri = DB_URL;
process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
throw new Error("MongoDB connection URI is missing.");
}

await mongoose.connect(mongoUri);

const existingCEO = await Admin.findOne({
role: "ceo"
});

if (existingCEO) {
console.log("A CEO account already exists.");
return;
}

const email = (await rl.question(
"CEO email: "
)).trim().toLowerCase();

if (!email) {
throw new Error("Email is required.");
}

const existingEmail = await Admin.findOne({
email
});

if (existingEmail) {
throw new Error("Email already registered.");
}

// Password is read without displaying it.
rl.close();

const password = await new Promise((resolve, reject) => {
const { spawnSync } = require("node:child_process");
const result = spawnSync("python3", [
"-c",
"import getpass; print(getpass.getpass('CEO password: '))"
], {
stdio: ["inherit", "pipe", "inherit"],
encoding: "utf8"
});

if (result.status !== 0) {
reject(new Error("Password entry failed."));
} else {
resolve(result.stdout.trimEnd());
}
});

if (password.length < 12) {
throw new Error(
"Password must be at least 12 characters."
);
}

const hashedPassword = await bcrypt.hash(
password, 12
);

await Admin.create({
email,
password: hashedPassword,
role: "ceo",
division: "executive",
managerId: null,
staffCount: 0,
permissions: [],
isActive: true
});

console.log("CEO account created successfully.");
} catch (error) {
console.error("Setup failed:", error.message);
process.exitCode = 1;
} finally {
rl.close();
await mongoose.disconnect();
}
}

createCEO();
