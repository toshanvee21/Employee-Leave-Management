import mongoose from "mongoose";
let DB_URL = "mongodb://127.0.0.1:27017/Employees_Details"
async function connectToDatabase()
{
   try{
    let connection = await mongoose.connect(DB_URL)
    console.log("DataBase Is Connected...", connection.connection.name)
   } catch (error) {
    console.log(error)
   }
}
export { connectToDatabase}
