// districts/infrastructure/controllers/infrastructureController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/infrastructure/index", {
    title: "Sky City – Infrastructure District",
  });
};
