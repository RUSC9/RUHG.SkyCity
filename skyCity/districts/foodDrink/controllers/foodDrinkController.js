// districts/food-drink/controllers/food-drinkController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/food-drink/index", {
    title: "Sky City – Food-drink District",
  });
};
