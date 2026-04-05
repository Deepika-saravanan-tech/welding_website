const express = require("express");
const {
  listReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewLike,
} = require("../controllers/reviewController");
const protectOptional = require("../middleware/optionalAuthMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  toggleReviewLikeValidator,
} = require("../utils/validators");

const router = express.Router();

router.get("/", listReviews);
router.post("/", createReviewValidator, validateRequest, createReview);
router.put("/:id", protectOptional, updateReviewValidator, validateRequest, updateReview);
router.delete("/:id", protectOptional, deleteReviewValidator, validateRequest, deleteReview);
router.patch("/:id/like", toggleReviewLikeValidator, validateRequest, toggleReviewLike);

module.exports = router;
