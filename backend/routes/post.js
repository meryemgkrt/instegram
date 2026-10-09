const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all posts
router.post('/', async (req, res) => {
    const newPost = await new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});


// Update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (post.userId.toString() !== req.body.userId) {
      return res.status(403).json("You can only update your own post");
    }
    await post.updateOne({ $set: req.body });
    return res.status(200).json("Post has been updated");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//Post deletion
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (post.userId.toString() !== req.body.userId) {
      return res.status(403).json("You can only delete your own post");
    }
    await post.deleteOne();
    return res.status(200).json("Post has been deleted");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get timeline posts
router.get("/timeline/:userId", async(req, res)=>{
 try{
  const currentUser=await User.findById(req.params.userId);
  const userPost=  await Post.find({ userId: currentUser._id });
  const friendPosts= await Promise.all(
    currentUser.followings.map((friendId)=>{
      return Post.find({ userId: friendId });
    })
  )
  res.status(200).json(userPost.concat(...friendPosts));

 }catch(err){
     res.status(500).json(err);
 }
});


// get user all posts
router.get("/user/:username", async (req, res) => {
    try {
        const user= await User.findOne({username:req.params.username});
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;