const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');


// Update user

router.put("/:id", async (req, res) => {
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
                // Password is now hashed and ready to be updated in the database

            }catch(err){
                return res.status(500).json({ message: err.message });
            }
        }
        try{
          const updatedUser = await User.findByIdAndUpdate(
  req.params.id,
  { $set: req.body },
  { new: true }
);
const { password, ...userData } = updatedUser._doc;
return res.status(200).json(userData);
        }catch(err){
            return res.status(500).send({ message: err.message });
        }

    }else{
        return res.status(403).json({ message: "You can update only your account!" });
    }
 
});


// delete
router.delete("/:id", async (req, res) => {
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try{
          await User.findByIdAndDelete(req.params.id);
          return res.status(200).json({ message: "User has been deleted." });
        }catch(err){
            return res.status(500).send({ message: err.message });
        }

    }else{
        return res.status(403).json({ message: "You can delete only your account!" });
    }
 
});


// Get a User
router.get("/", async (req, res) => {
  const { userId, userName } = req.query;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userData } = user._doc;
    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get User all

router.get("/list", async (req, res) => {
  try {
   const users= await User.find({})
   return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


// Follow a User

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json({ message: "User has been followed." });
      } else {
        return res.status(403).json({ message: "You already follow this user." });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(403).send({ message: "You cannot follow yourself." });
  }
});

// Unfollow a User
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                return res.status(200).json({ message: "User has been unfollowed." });
            } else {
                return res.status(403).json({ message: "You do not follow this user." });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).send({ message: "You cannot unfollow yourself." });
    }

})

module.exports = router;