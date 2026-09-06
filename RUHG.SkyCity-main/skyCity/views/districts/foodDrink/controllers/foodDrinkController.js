// districts/foodDrink/controllers/foodDrinkController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/foodDrink/index", {
    title: "Sky City – FoodDrink District",
  });
};
