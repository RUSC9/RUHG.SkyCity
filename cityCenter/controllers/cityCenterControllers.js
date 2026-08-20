// districts/cityCenter/controllers/cityCenterController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/cityCenter/index", {
    title: "Sky City – CityCenter District",
  });
};

