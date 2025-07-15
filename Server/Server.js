import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { connectToDatabase } from "./src/DB/dbConnection.js"
import { userRouter } from "./src/routes/UserRoute.js"
import { projectRouter } from "./src/routes/ProjectRoute.js"
import { leaveRouter } from "./src/routes/LeaveRoute.js"
import { employeeRouter } from "./src/routes/EmployeeRoute.js"

//create server variable

let Server = express()

Server.use(bodyParser.json())

Server.use(cors());

Server.use("/Uploadimages",express.static("Uploadimages"))
//connect to db
connectToDatabase()

//http methods GET PUT POST DELETE PATCH
Server.get("/",(req, res)=>{
    res.send("Hello guys.........")
})

Server.get('/allusers', (req, res)=>
    {
    

res.status(200).json(users)
})



//connect router with server

Server.use('/api', userRouter)

Server.use('/api', projectRouter)

Server.use('/api',leaveRouter)

Server.use('/api', employeeRouter)


//start server
Server.listen(5000, ()=>{
    console.log("Server Started");
})