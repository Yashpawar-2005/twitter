import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

    
    
const connectDB= async () => {
    try {
        // console.log(mongourl)
      const connection=  await mongoose.connect(`${process.env.mongourl}/${process.env.DB_NAME}`)
      console.log("database connected omg")
    } catch (error) {
        console.log("Mongoose Connection error",error)
        process.exit(1)
    }
}
export default connectDB

//todo make the variable environment variables