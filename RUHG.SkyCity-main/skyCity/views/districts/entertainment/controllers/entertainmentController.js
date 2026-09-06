// districts/entertainment/controllers/entertainmentController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/entertainment/index", {
    title: "Sky City – Entertainment District",
  });
};
