const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  forgotPasswordController,
} = require("../controllers/authController");
const { requireLogin, isAdmin } = require("../middlewares/authMiddleware");

//signup route
router.post("/register", registerController);

//login route
router.post("/login", loginController);

//forgot password || POST
router.post("/forgot-password", forgotPasswordController);

//protected user route auth
router.get("/user-auth", requireLogin, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = router;
