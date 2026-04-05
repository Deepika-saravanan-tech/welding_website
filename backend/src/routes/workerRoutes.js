const express = require("express");
const {
  createWorkerEntry,
  getWorkerEntries,
  getWorkerEntryById,
  updateWorkerEntry,
  deleteWorkerEntry,
  getRangeReport,
  getMonthlyReport,
} = require("../controllers/workerController");
const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createWorkerValidator,
  updateWorkerValidator,
  rangeReportValidator,
  monthlyReportValidator,
} = require("../utils/validators");

const router = express.Router();

router.use(protect);
router.get("/", getWorkerEntries);
router.get("/reports/range", rangeReportValidator, validateRequest, getRangeReport);
router.get("/reports/monthly", monthlyReportValidator, validateRequest, getMonthlyReport);
router.post("/", createWorkerValidator, validateRequest, createWorkerEntry);
router.get("/:id", getWorkerEntryById);
router.put("/:id", updateWorkerValidator, validateRequest, updateWorkerEntry);
router.delete("/:id", deleteWorkerEntry);

module.exports = router;
