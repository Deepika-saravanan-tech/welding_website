const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendSuccess = require("../utils/apiResponse");
const { emitSocketEvent } = require("../utils/socketEvents");

const listReviews = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ isApproved: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments({ isApproved: true }),
  ]);

  return sendSuccess(res, 200, "Reviews fetched successfully.", {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    rating: req.body.rating,
  });

  emitSocketEvent("reviews:created", review);

  return sendSuccess(res, 201, "Review submitted successfully.", {
    review,
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  const isAdmin = Boolean(req.user);
  const sameEmail = req.body.email && req.body.email.toLowerCase() === review.email;
  if (!isAdmin && !sameEmail) {
    throw new AppError("Only the review owner or admin can update this review.", 403);
  }

  ["name", "message", "rating"].forEach((field) => {
    if (req.body[field] !== undefined) {
      review[field] = req.body[field];
    }
  });

  await review.save();
  emitSocketEvent("reviews:updated", review);

  return sendSuccess(res, 200, "Review updated successfully.", {
    review,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  const email = (req.body.email || req.query.email || "").toLowerCase();
  const isAdmin = Boolean(req.user);
  if (!isAdmin && email !== review.email) {
    throw new AppError("Only the review owner or admin can delete this review.", 403);
  }

  await review.deleteOne();
  emitSocketEvent("reviews:deleted", { id: req.params.id });

  return sendSuccess(res, 200, "Review deleted successfully.");
});

const toggleReviewLike = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  // We keep a small email list so the same visitor cannot like repeatedly.
  const email = req.body.email.toLowerCase();
  const alreadyLiked = review.likedBy.includes(email);

  if (alreadyLiked) {
    review.likedBy = review.likedBy.filter((item) => item !== email);
    review.likesCount = Math.max(review.likesCount - 1, 0);
  } else {
    review.likedBy.push(email);
    review.likesCount += 1;
  }

  await review.save();
  emitSocketEvent("reviews:liked", review);

  return sendSuccess(res, 200, "Review like status updated.", {
    review,
    liked: !alreadyLiked,
  });
});

module.exports = {
  listReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewLike,
};
