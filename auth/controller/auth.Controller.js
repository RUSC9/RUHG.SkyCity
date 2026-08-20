// auth/controllers/authController.js
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Sky City – Login" });
};

exports.getBusinessRegisterPage = (req, res) => {
  res.render("auth/register-business", { title: "Sky City – Business Registration" });
};

exports.getConsumerRegisterPage = (req, res) => {
  res.render("auth/register-consumer", { title: "Sky City – Consumer Registration" });
};
