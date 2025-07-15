import { Leave } from "../models/LeaveSchema.js";

// Create Leave
export const createLeave = async (req, res) => {
  try {
    const result = await Leave.create(req.body);
    res.status(200).json({
      data: result,
      message: "Leave added successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add Leave",
      error: error.message
    });
  }
};

// Fetch All Leaves
export const fetchAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employeeid", "fullName email department designation");
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leave data", error: err.message });
  }
};

// Update Leave Status (e.g., Approved / Rejected)
export const updateLeaveStatus = async (req, res) => {
  const { leaveId } = req.params;
  const { leaveStatus } = req.body;

  const allowedStatuses = ["Pending", "Approved", "Rejected"];
  if (!leaveStatus || !allowedStatuses.includes(leaveStatus)) {
    return res.status(400).json({ message: `Status is required and must be one of: ${allowedStatuses.join(", ")}` });
  }

  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { leaveStatus },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.status(200).json({
      data: updatedLeave,
      message: "Leave status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status", error: error.message });
  }
};

// Get leaves by employeeId (employeeId in URL param)
export const getLeavesByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const leaves = await Leave.find({ employeeid: employeeId });
    res.status(200).json({ data: leaves });
  } catch (error) {
    res.status(500).json({ message: "Failed to get leaves", error: error.message });
  }
};

// export const getLeavesByEmployee = async (req, res) => {
//   const { employeeId } = req.params;
//   try {
//     const leaves = await Leave.find({ employeeid: employeeId }).populate(
//       "employeeid",
//       "fullName email department designation"
//     );
//     res.status(200).json({ data: leaves });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to get leaves", error: error.message });
//   }
// };