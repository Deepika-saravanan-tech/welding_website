const WorkerEntry = require("../models/WorkerEntry");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendSuccess = require("../utils/apiResponse");
const { normalizeDate, getDateRangeQuery, formatEntryForClient } = require("../utils/date");
const { buildRangeTotals, buildMonthlyMatrix } = require("../services/workerService");

const createWorkerEntry = asyncHandler(async (req, res) => {
  const entry = await WorkerEntry.create({
    workDate: normalizeDate(req.body.workDate),
    workerNameEnglish: req.body.workerNameEnglish,
    workerNameTamil: req.body.workerNameTamil,
    workTime: req.body.workTime,
    salary: req.body.salary,
    overtime: req.body.overtime,
    prepaid: req.body.prepaid,
    notes: req.body.notes,
    createdBy: req.user._id,
  });

  return sendSuccess(res, 201, "Worker entry created successfully.", {
    entry: formatEntryForClient(entry),
  });
});

const getWorkerEntries = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.fromDate && req.query.toDate) {
    filter.workDate = getDateRangeQuery(req.query.fromDate, req.query.toDate);
  } else if (req.query.date) {
    filter.workDate = getDateRangeQuery(req.query.date, req.query.date);
  }

  if (req.query.workerName) {
    filter.workerNameEnglish = new RegExp(req.query.workerName, "i");
  }

  const entries = await WorkerEntry.find(filter).sort({ workDate: -1, createdAt: -1 });

  return sendSuccess(res, 200, "Worker entries fetched successfully.", {
    entries: entries.map(formatEntryForClient),
  });
});

const getWorkerEntryById = asyncHandler(async (req, res) => {
  const entry = await WorkerEntry.findById(req.params.id);
  if (!entry) {
    throw new AppError("Worker entry not found.", 404);
  }

  return sendSuccess(res, 200, "Worker entry fetched successfully.", {
    entry: formatEntryForClient(entry),
  });
});

const updateWorkerEntry = asyncHandler(async (req, res) => {
  const entry = await WorkerEntry.findById(req.params.id);
  if (!entry) {
    throw new AppError("Worker entry not found.", 404);
  }

  ["workerNameEnglish", "workerNameTamil", "workTime", "salary", "overtime", "prepaid", "notes"].forEach((field) => {
    if (req.body[field] !== undefined) {
      entry[field] = req.body[field];
    }
  });

  if (req.body.workDate) {
    entry.workDate = normalizeDate(req.body.workDate);
  }

  await entry.save();

  return sendSuccess(res, 200, "Worker entry updated successfully.", {
    entry: formatEntryForClient(entry),
  });
});

const deleteWorkerEntry = asyncHandler(async (req, res) => {
  const entry = await WorkerEntry.findById(req.params.id);
  if (!entry) {
    throw new AppError("Worker entry not found.", 404);
  }

  await entry.deleteOne();

  return sendSuccess(res, 200, "Worker entry deleted successfully.");
});

const getRangeReport = asyncHandler(async (req, res) => {
  const entries = await WorkerEntry.find({
    workDate: getDateRangeQuery(req.query.fromDate, req.query.toDate),
  }).sort({ workDate: 1 });

  return sendSuccess(res, 200, "Worker range report generated successfully.", {
    summary: buildRangeTotals(entries),
  });
});

const getMonthlyReport = asyncHandler(async (req, res) => {
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  if (!year || !month || month < 1 || month > 12) {
    throw new AppError("Please provide a valid month and year.", 400);
  }

  const fromDate = new Date(Date.UTC(year, month - 1, 1));
  const toDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const entries = await WorkerEntry.find({
    workDate: {
      $gte: fromDate,
      $lte: toDate,
    },
  }).sort({ workDate: 1 });

  return sendSuccess(res, 200, "Monthly report generated successfully.", {
    report: buildMonthlyMatrix(entries),
  });
});

module.exports = {
  createWorkerEntry,
  getWorkerEntries,
  getWorkerEntryById,
  updateWorkerEntry,
  deleteWorkerEntry,
  getRangeReport,
  getMonthlyReport,
};
