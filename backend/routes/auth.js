const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post("/register", async (req, res) => {
    try {
        const { fullName, userName, email, password, bio, profilePicture } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName, userName, email,
            password: hashedPassword,
            bio, profilePicture
        });

        const user = await newUser.save();
        const { password: _, ...userData } = user._doc;
        res.status(201).json(userData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { password: _, ...userData } = user._doc;
    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;