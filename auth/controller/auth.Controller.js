// auth/controller/auth.Controller.js
  const bcrypt = require("bcrypt");
  const Consumer = require("../models/Consumer");
  const Business = require("../models/Business");
  const BusinessListing = require("../models/businessListing"); 


//get login page with business and consumer option
exports.getLoginPage = (req, res) => {
  res.render("login", {title: "Sky City Login", layout: false });
};


//get business registration page
exports.getBusinessRegisterPage = (req, res) => {
  res.render("register-business", { title: "Sky City | Business Registration", layout: false });
};
//handle business registration
exports.registerBusiness = async(req, res) => {
  try{ 

    const {
      businessName, 
      email, 
      contactPhone, 
      password, 
      confirmPassword 
    } = req.body;

    //Make sure required fields are present
  if (
    !businessName || 
    !email || 
    !contactPhone || 
    !password || 
    !confirmPassword
  ) {
    return res.status(400).send("Please complete all required fields.");
  }

  //Make sure passwords match
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  //Prevent duplicate business accounts using the same email
  const existingBusiness = await Business.findOne({ email });
  
  if (existingBusiness) {
    return res
        .status(400) 
        .send("A Business with this email already exists.");
  }

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Create the business account
  const newBusiness = new Business({
    businessName,
    email,
    contactPhone,
    password: hashedPassword
  });

  // Save business account to MongoDB
  await newBusiness.save();
  req.session.userId = newBusiness._id.toString();
  req.session.role = "business";

  //Send new businessto create its listing
  return res.redirect("/business-listings/create");
  
} catch (error){
  console.error("Business registration error:", error);

  return res
      .status(500)
      .send("unable to register business.");
  }
};

//get business Login Page
exports.getBusinessLoginPage = (req, res) => {
  res.render("login-business", { title: "Sky City | Business Login", layout: false });
};

//handle business login
exports.loginBusiness = async (req, res) => {
  try{
    const {email, password} =req.body;
    //Make sure both fields were entered
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    //Find the business by email
    const business = await Business.findOne({email});

    if (!business) {
      return res.status(401).send("Invalid email or password.");
    }

    // Compare entered password to hashed password in MongoDB
    const passwordMatches = await bcrypt.compare(
      password,
      business.password
    );

    if(!passwordMatches) {
      return res.status(401).send("Invalid email or password.");
    }
      //remember that the use is a business
      req.session.userId = business._id.toString();
      req.session.role = "business";
  //Check whether this business already owns a listing
  const existingListing = await BusinessListing.findOne({
      businessOwner: business._id
  });

  if (existingListing) {
    return res.redirect(`/business/${existingListing._id}`);
  }

  //No listing yet--send business user to the Business City Center
  return res.redirect("/city-center/business");

  }
    catch (error){
      console.error(error);
      return res.status(500).send("Server error.");
    }
  }




//get consumer registration page
exports.getConsumerRegisterPage = (req, res) => {
  res.render("register-consumer", { title: "Sky City | Consumer Registration", layout: false });
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

//get consumer Login Page
exports.getConsumerLoginPage = (req, res) => {
  res.render("login-consumer", { title: "Sky City – Consumer Login", layout: false});
};

//handle Consumer login page
exports.loginConsumer = async (req, res) => {
  try{
    const {email, password} =req.body;
    //Make sure both fields were entered
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    //Find the consumer by email
    const consumer = await Consumer.findOne({email});

    if (!consumer) {
      return res.status(401).send("Invalid email or password.");
    }

    // Compare entered password to hashed password in MongoDB
    const passwordMatches = await bcrypt.compare(
      password,
      consumer.password
    );

    if(!passwordMatches) {
      return res.status(401).send("Invalid email or password.");
    }
      //remember that the user is a consumer
      req.session.userId = consumer._id.toString();
      req.session.role = "consumer";

      return res.redirect("/city-center/consumer");
  }
    catch (error){
      console.error(error);
      return res.status(500).send("Server error.");
    }
  };