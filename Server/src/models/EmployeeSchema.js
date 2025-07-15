import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  fullName: String,
  gender:{
    type:String,
    enum:["Male","Female","Other"]
  },
  email: String,
  phone: String,
  department: String,
  designation: String,
  joiningDate: Date,
  address: String,
  employeeStatus: {
    type: String,
    default: "Active",
    enum: ["Active", "Inactive", "Terminated"]
  },
  empimage:{
            type:String
        },
  password: String
}, {
  timestamps: true
});

export const Employee = mongoose.model("Employee", EmployeeSchema);