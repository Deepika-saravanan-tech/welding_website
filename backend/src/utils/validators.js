const { body, param, query } = require("express-validator");

const emailRule = body("email").isEmail().withMessage("Please enter a valid email address.");
const passwordRule = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long.");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  emailRule,
  passwordRule,
  body("phone").optional().isString(),
  body("preferredLanguage").optional().isIn(["en", "ta"]),
  body("role").optional().isIn(["admin", "manager"]),
];

const loginValidator = [emailRule, passwordRule];

const updateProfileValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("email").optional().isEmail().withMessage("Please enter a valid email address."),
  body("phone").optional().isString(),
  body("preferredLanguage").optional().isIn(["en", "ta"]),
];

const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long."),
];

const createReviewValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  emailRule,
  body("message").trim().notEmpty().withMessage("Message is required."),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
];

const updateReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review id."),
  body("email").optional().isEmail().withMessage("Please provide a valid owner email."),
  body("name").optional().trim().notEmpty(),
  body("message").optional().trim().notEmpty(),
  body("rating").optional().isInt({ min: 1, max: 5 }),
];

const deleteReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review id."),
  body("email").optional().isEmail().withMessage("Please provide a valid owner email."),
  query("email").optional().isEmail().withMessage("Please provide a valid owner email."),
];

const toggleReviewLikeValidator = [
  param("id").isMongoId().withMessage("Invalid review id."),
  emailRule,
];

const createWorkerValidator = [
  body("workDate").isISO8601().withMessage("Work date must be in YYYY-MM-DD format."),
  body("workerNameEnglish").trim().notEmpty().withMessage("Worker English name is required."),
  body("workerNameTamil").optional().isString(),
  body("workTime")
    .isIn(["Full-day", "Half-day", "Leave"])
    .withMessage("Work time must be Full-day, Half-day, or Leave."),
  body("salary").optional().isFloat({ min: 0 }),
  body("overtime").optional().isFloat({ min: 0 }),
  body("prepaid").optional().isFloat({ min: 0 }),
  body("notes").optional().isString(),
];

const updateWorkerValidator = [
  param("id").isMongoId().withMessage("Invalid worker entry id."),
  body("workDate").optional().isISO8601().withMessage("Work date must be in YYYY-MM-DD format."),
  body("workerNameEnglish").optional().trim().notEmpty(),
  body("workerNameTamil").optional().isString(),
  body("workTime").optional().isIn(["Full-day", "Half-day", "Leave"]),
  body("salary").optional().isFloat({ min: 0 }),
  body("overtime").optional().isFloat({ min: 0 }),
  body("prepaid").optional().isFloat({ min: 0 }),
  body("notes").optional().isString(),
];

const rangeReportValidator = [
  query("fromDate").isISO8601().withMessage("fromDate must be in YYYY-MM-DD format."),
  query("toDate").isISO8601().withMessage("toDate must be in YYYY-MM-DD format."),
];

const monthlyReportValidator = [
  query("month").isInt({ min: 1, max: 12 }).withMessage("month must be between 1 and 12."),
  query("year").isInt({ min: 2000, max: 2100 }).withMessage("year is invalid."),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  toggleReviewLikeValidator,
  createWorkerValidator,
  updateWorkerValidator,
  rangeReportValidator,
  monthlyReportValidator,
};
