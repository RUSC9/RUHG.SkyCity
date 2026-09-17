// auth/controller/auth.Controller.js
  const bcrypt = require("bcrypt");
  const Consumer = require("../models/Consumer");
   
// get login page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Sky City – Login" });
};

//get business registration page
exports.getBusinessRegisterPage = (req, res) => {
  res.render("auth/register-business", { title: "Sky City – Business Registration" });
};

//get consumer registration page
exports.getConsumerRegisterPage = (req, res) => {
  res.render("register-consumer", { title: "Sky City – Consumer Registration" });
};

//handle consumer registration
exports.registerConsumer = async (req,res) => {
  try{

  const {firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send("All fields are required.");
  }
const existingConsumer = await Consumer.findOne({ email });
  if (existingConsumer) {
    return res.status(400) .send("A consumer with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newConsumer = new Consumer({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });
  await newConsumer.save();
  return res.status(201) .send("Consumer registered successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500) .send("Server error.");
  }
};