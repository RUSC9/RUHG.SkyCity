// districts/food-drink/routes/food-drink.routes.js
const router = require("express").Router();
const Food-drinkController = require("../controllers/food-drinkController");

router.get("/", Food-drinkController.getDistrictHome);

module.exports = router;
