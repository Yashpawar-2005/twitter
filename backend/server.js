import cookieParser from "cookie-parser";
import express, { json } from "express";
const app=express();
import authroutes from './routes/authroutes.route.js'
import userRoutes from './routes/users.routes.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'
import connectDB from "./db/connect.db.js";
import {v2 as cloudinary} from 'cloudinary'
import dotev from 'dotenv'
// app.use(cookieParser)
app.use(json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
dotev.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

connectDB();

app.use("/api/auth",authroutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoute)
app.use('/api/notifications',notificationRoute)
app.get('/', (req, res) => {
    res.send("server is ready")
})

const port =process.env.PORT || 4000;
console.log(port)
app.listen(port);