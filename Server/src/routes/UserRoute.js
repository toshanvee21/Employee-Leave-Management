import express from "express"
import { createUser, deleteUser, fetchAllUsers, updateUser } from "../controllers/UserController.js"

let userRouter= express.Router()

userRouter.get('/fetchallusers', fetchAllUsers)
userRouter.post("/createusers", createUser )
userRouter.delete("/deleteUser", deleteUser )
userRouter.put("/updateUser", updateUser )


export { userRouter }