import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        minlength: [4, "Username must be at least 4 characters"],
        maxlength: [15, "Username must be less than 15 characters"],
        trim: true
    },
    userEmail: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"
        ],
        unique: true
    },
    userGender: {
        type: String,
        required: [true, "Gender is required"],
        enum: {
            values: ["Male", "Female", "Other"],
            message: "Gender must be 'Male', 'Female' or 'Other'"
        }
    },
    userAge: {
        type: Number,
        min: [15, "Age must be greater than 15"]
    },
    userRegistrationDate: {
        type: Date,
        default: () => new Date()
    },
    userPhoto: {
        type: String,
        default: "https://example.com/default-avatar.png"
    },
    userBio: {
        type: String,
        trim: true,
        maxlength: [180, "Bio must be less than 180 characters"]
    },
    userRole: {
        type: String,
        enum: {
            values: ["admin", "user", "moderator"],
            message: "Role must be 'admin', 'user', or 'moderator'"
        },
        default: "user"
    }
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);
