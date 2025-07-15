import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  leaveType: String,
  reason: String,
  startDate: Date,
  endDate: Date,
  leaveStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected"]
  },
  employeeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
}, {
  timestamps: true
});

export const Leave = mongoose.model("Leave", LeaveSchema);
