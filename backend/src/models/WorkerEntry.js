const mongoose = require("mongoose");

const workerEntrySchema = new mongoose.Schema(
  {
    workDate: {
      type: Date,
      required: true,
    },
    workerNameEnglish: {
      type: String,
      required: true,
      trim: true,
    },
    workerNameTamil: {
      type: String,
      trim: true,
      default: "",
    },
    workTime: {
      type: String,
      enum: ["Full-day", "Half-day", "Leave"],
      required: true,
    },
    salary: {
      type: Number,
      default: 0,
      min: 0,
    },
    overtime: {
      type: Number,
      default: 0,
      min: 0,
    },
    prepaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    remaining: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

workerEntrySchema.pre("validate", function calculateAmounts(next) {
  const salary = Number(this.salary) || 0;
  const overtime = Number(this.overtime) || 0;
  const prepaid = Number(this.prepaid) || 0;

  this.total = salary + overtime;
  this.remaining = this.total - prepaid;
  next();
});

module.exports = mongoose.model("WorkerEntry", workerEntrySchema);
