// districts/social/controllers/socialController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/social/index", {
    title: "Sky City – Social District",
  });
};
