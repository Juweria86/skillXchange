const express = require("express");
const { register, 
  login, 
  verifyEmail, 
  resendVerification, 
  forgotPassword, 
  resetPassword, 
  googleLogin,
createAdmin,
 promoteToAdmin,
} = require("../controllers/authController");
const { body } = require("express-validator");
const { check } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google-login", googleLogin);


// Create admin user
router.post(
  "/create-admin",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("adminSecretKey", "Admin secret key is required").not().isEmpty(),
  ],
  createAdmin,
)

// Promote user to admin
router.post(
  "/promote-to-admin",
  protect,
  [
    check("userId", "User ID is required").not().isEmpty(),
    check("adminSecretKey", "Admin secret key is required").not().isEmpty(),
  ],
  promoteToAdmin,
)





module.exports = router;
