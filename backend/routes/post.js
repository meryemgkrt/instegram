const router = require('express').Router();
const Post = require('../models/Post');

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
   const newPost=await new Post(req.body);
   try{
       const savedPost = await newPost.save();
       res.status(200).json(savedPost);
   }catch(err){
       res.status(500).json(err);
   }
});


// Update post
router.put("/:id", async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete post
router.delete("/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;