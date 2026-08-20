// districts/services/controllers/servicesController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/services/index", {
    title: "Sky City – Services District",
  });
};
