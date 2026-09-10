// districts/cityCenter/controllers/cityCenterController.js
const cityCenterService = require("../services/cityCenterService");

// Home page
exports.getHomePage = (req, res) => {
  const data = cityCenterService.getHomeData();
  res.render("districts/city-center/index", data);
};

// Featured Businesses
exports.getFeaturedBusinesses = (req, res) => {
  const businesses = cityCenterService.getFeaturedBusinesses();
  res.json(businesses);
};

// Featured Entertainment
exports.getFeaturedEntertainment = (req, res) => {
  const entertainment = cityCenterService.getFeaturedEntertainment();
  res.json(entertainment);
};

// Announcements
exports.getAnnouncements = (req, res) => {
  const announcements = cityCenterService.getAnnouncements();
  res.json(announcements);
};
exports.addAnnouncement = (req, res) => {
  const { title, message } = req.body;

  const announcement = cityCenterService.addAnnouncement(title, message);

  res.status(201).json(announcement);
};



// Register Consumer
exports.registerConsumer = (req, res) => {
  const result = cityCenterService.registerConsumer(req.body);
  res.json(result);
};

// Register Business
exports.registerBusiness = (req, res) => {
  const result = cityCenterService.registerBusiness(req.body);
  res.json(result);
};


