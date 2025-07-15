import { User } from "../models/UserSchema.js";

// Add user
let createUser = async (req, res) => {
    let reqData = req.body;
    console.log("userData", reqData);
    try {
        let result = await User.create(reqData);
        res.status(200).json({
            data: result,
            message: "User added successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add user",
            error: error.message
        });
    }
};

// Get all users
let fetchAllUsers = async (req, res) => {
    try {
        let result = await User.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
};
// delete user data
let deleteUser = async (req, res) => {
    try {
        let { userId } = req.body
        let result = await User.findByIdAndDelete({ _id:userId })
        res.status(200).json({
        message: "User Deleted"
        })
    }
    catch (error) {
        res.status(500).json(error)
        console.log("error".reqData)

    }
}

//update users
let updateUser = async (req, res) => {
    try{ 
        let {userId, userAge } = req.body
        let result = await User.findByIdAndUpdate({_id: userId }, {
            userAge: userAge
        }, { new: true })
        res.status(200).json({
            data: result,
            message: "User Age Updated"
        })
    } catch (error){
        res.status(500).json(error)
    }

}
export { createUser, fetchAllUsers , deleteUser, updateUser };