const { formatDateOnly } = require("../utils/date");

const buildRangeTotals = (entries) => {
  const workers = {};
  let grandTotal = 0;

  entries.forEach((entry) => {
    const key = entry.workerNameEnglish;

    if (!workers[key]) {
      workers[key] = {
        workerNameEnglish: entry.workerNameEnglish,
        workerNameTamil: entry.workerNameTamil,
        totalAmount: 0,
        totalDays: 0,
      };
    }

    workers[key].totalAmount += entry.total;
    workers[key].totalDays += 1;
    grandTotal += entry.total;
  });

  return {
    workers: Object.values(workers).sort((a, b) => b.totalAmount - a.totalAmount),
    grandTotal,
  };
};

const buildMonthlyMatrix = (entries) => {
  const groupedByDate = {};
  const workers = {};

  // This shape is friendly for table rendering in your current workers dashboard.
  entries.forEach((entry) => {
    const date = formatDateOnly(entry.workDate);

    if (!groupedByDate[date]) {
      groupedByDate[date] = {};
    }

    groupedByDate[date][entry.workerNameEnglish] = entry.total;
    workers[entry.workerNameEnglish] = {
      workerNameEnglish: entry.workerNameEnglish,
      workerNameTamil: entry.workerNameTamil,
    };
  });

  return {
    workers: Object.values(workers),
    dates: Object.keys(groupedByDate).sort(),
    rows: Object.entries(groupedByDate)
      .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
      .map(([date, values]) => ({
        date,
        values,
      })),
  };
};

module.exports = {
  buildRangeTotals,
  buildMonthlyMatrix,
};
