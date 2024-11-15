import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js';
import { likeUnlikePost as likepost } from '../controllers/post.controller.js';
import { createPost,deletePost,commentOnPost,getPosts,getlikedPosts,getFollowingPosts,getUserPosts } from '../controllers/post.controller.js';
const Route=express.Router()
Route.get('/all',protectRoute, getPosts)
Route.get('/likes/:id',protectRoute,getlikedPosts)
Route.get('/following',protectRoute,getFollowingPosts)
Route.get('/user/:username',protectRoute,getUserPosts)
Route.post('/create',protectRoute, createPost)
Route.delete('/delete/:id',protectRoute, deletePost)
Route.post('/like/:id',protectRoute, likepost)
Route.post('/comment/:id',protectRoute,commentOnPost)
export default Route;