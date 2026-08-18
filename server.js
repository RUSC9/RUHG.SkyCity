const express = require("express");
const app = express();
const cityCenterRoutes = require("./districts/city-center/routes/home");

app.use(express.json());
app.use("/", cityCenterRoutes); // City Center as root

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sky City running on port ${PORT}`);
});
