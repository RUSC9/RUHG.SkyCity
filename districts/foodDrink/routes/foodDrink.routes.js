// districts/foodDrink/routes/foodDrink.routes.js
const router = require("express").Router();
const FoodDrinkController = require("../controllers/foodDrinkController");

router.get("/", FoodDrinkController.getDistrictHome);

module.exports = router;
