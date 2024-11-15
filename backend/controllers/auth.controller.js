import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../lib/utils/generatewt.js";
export const signup=async(req,res)=>{
    const{username,fullname,password,email}=req.body;
    if(!username || !password || !email )return res.status(400).json({message:"thiss is a message"});
    const exist= await User.findOne({username})
    if(exist) return res.status(400).json({message:"user alredy exist",status:400});
    const existe= await User.findOne({email})
    if(existe) return res.status(400).json({message:"user alredy exist",status:400});
//hashing password
const hashedpassword= await bcrypt.hash(password,10);

const newUser = new User({
    fullname,
    username,
    email,
    password: hashedpassword,
});
if (newUser) {
    generateToken(newUser._id, res);
    await newUser.save();
    console.log(newUser)
    res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
    });
}
else {
    res.status(400).json({ error: "Invalid user data" });
}
// const user = await User.create({
//     fullname,
//     email, 
//     password:hashedpassword,
//     username
// })
// if (!user){
//     return res.send.json("user is not bein created")
// }

// const createdUser = await User.findById(user._id).select(
//     "-password "
// )


}
export const login=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const user = await User.findOne({
            $or: [{username}, {email}],
          });
          
          if(!user){
            return res.status(400).json({message:"there is no such user"})
          }
          const isPasswordvalid=bcrypt.compareSync(password,user.password ||"")
          if(!isPasswordvalid){
            return res.status(400).json({message:"invalid password"})
          }
          
        generateToken(user._id,res);
          res.status(201).json({
            _id: user._id,
            fullName: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });

    } catch (error) {
        console.log(error)
       return res.status(200).json({message:"error in loging in"}) 
    }
}
export const logout=async(req,res)=>{
   try {
    // const token=req.cookies.jwt
    res.cookie("jwt","",{maxAge:0})
    res.status(201).json({message:"logging out successfull"})
   } catch (error) {
    console.log(error)
    return res.status(400).json({message:"error in logging out"})
   }
}
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};