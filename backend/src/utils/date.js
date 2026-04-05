const normalizeDate = (value) => {
  const inputDate = new Date(value);
  return new Date(
    Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate())
  );
};

const getDateRangeQuery = (fromDate, toDate) => ({
  $gte: normalizeDate(fromDate),
  $lte: new Date(`${toDate}T23:59:59.999Z`),
});

const formatDateOnly = (value) => new Date(value).toISOString().split("T")[0];

const formatEntryForClient = (entry) => ({
  id: entry._id,
  workDate: formatDateOnly(entry.workDate),
  workerNameEnglish: entry.workerNameEnglish,
  workerNameTamil: entry.workerNameTamil,
  workTime: entry.workTime,
  salary: entry.salary,
  overtime: entry.overtime,
  prepaid: entry.prepaid,
  total: entry.total,
  remaining: entry.remaining,
  notes: entry.notes,
  createdBy: entry.createdBy,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
});

module.exports = {
  normalizeDate,
  getDateRangeQuery,
  formatDateOnly,
  formatEntryForClient,
};
