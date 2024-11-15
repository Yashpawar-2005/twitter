import Notification from "../models/notification.model.js";
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from "cloudinary";

// export const getUserProfile=async(req,res)=>{
// // const name=req.params
// // console.log(name)

// // const user= await User.findOne({username:name.username})
// // if(!user){
// //     res.send("not okay")
// // }
// // console.log(user)

// // res.send("ok")
// const name=req.user
// console.log(name)
// res.send("ok")
// }

export const getUserProfile = async (req, res) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
	}
};


export const followUnfollowUser=async(req,res)=>{
    try {
        console.log("ow")
        const {idd}=req.params
        console.log(idd)
        const trimmedIdd = idd.trim();
        // const followeduser=await User.findOne({_id:idd})
        const followeduser= await User.findById(trimmedIdd)
        console.log("omg")
        const currentuser=await User.findById(req.user._id)
        if(trimmedIdd==req.user._id.toString()){
            return res.status(400).json({message:"you can't follow yourself"})
        }
        // console.log(followeduser)
        // console.log(currentuser)
        if(!followeduser || !currentuser){
            return res.status(400).json({message:"no such user found or you are not logged in "})
        }
        console.log("error here")
        const isfollowing=currentuser.following.includes(trimmedIdd);
        if(!isfollowing){
            await User.findByIdAndUpdate(trimmedIdd,{$push:{followers:req.user._id}});
           const pushed= await User.findByIdAndUpdate(req.user._id,{$push:{following:trimmedIdd}});
            // console.log(req.user.following)
            const notification=new Notification({
                type:"follow",
                from:req.user._id,
                to:followeduser,

            })
            await notification.save();
            res.status(200).json({message:"User followed sucessfully"});
        }        
        else{
            await User.findByIdAndUpdate(trimmedIdd,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:trimmedIdd}});
            res.status(200).json({message:"User unfollowed unsucessfully"});
        }
    } catch (error) {
        console.log("error in following "+error.message)
        res.status(400).json({error:error.meeage})
    }

}


export const getSuggestedUsers=async(req,res)=>{
    try {
		const userId = req.user._id;

		const usersFollowedByMe = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = undefined));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
}


export const updateUser = async (req, res) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
			//delete the user
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullname = fullName || user.fullname;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

