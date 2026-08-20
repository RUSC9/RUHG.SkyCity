// districts/business/controllers/businessController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/business/index", {
    title: "Sky City – Business District",
  });
};
