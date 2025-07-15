import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  assignDate: { type: Date, required: true },
  companyName: {
    type: String,
    required: [true, "Company Name is required"]
  },
  projectTitle: {
    type: String,
    required: [true, "Project title is required"]
  },
  projectDescription: {
    type: String,
    required: [true, "Project description is required"]
  },
  projectType: {
    type: String,
    enum: ["Front-End", "Back-End", "Full-Stack", "Mobile Development", "Data Science"],
    required: [true, "Project type is required"]
  },
  status: {
    type: String,
    enum: ["In-Progress", "Completed", "Pending"],
    required: [true, "Project status is required"],
    default: "Pending"
  },
  employeeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Employee is required"]
  },
}, {
  timestamps: true
});

export const Project = mongoose.model("Project", ProjectSchema);
