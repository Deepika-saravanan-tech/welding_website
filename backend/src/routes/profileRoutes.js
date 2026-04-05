const express = require("express");
const { getProfile, updateProfile, changePassword } = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { updateProfileValidator, changePasswordValidator } = require("../utils/validators");

const router = express.Router();

router.use(protect);
router.get("/", getProfile);
router.put("/", updateProfileValidator, validateRequest, updateProfile);
router.put("/change-password", changePasswordValidator, validateRequest, changePassword);

module.exports = router;
