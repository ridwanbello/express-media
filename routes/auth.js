const express = require("express");
const router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Register User
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        }
        //  Save user and respond
        const user = await User.create(userData)
        // const user = await userData.save()
        return res.status(200).json({
            msg: "User registered",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
})
// Login User
router.post("/login", async (req, res) => {
    try {
        console.log("first")
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                "msg": "User not found"
            })
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(404).json({
                "msg": "Password not correct"
            })
        }
        return res.status(200).json({
            msg: "Login successful",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
})

module.exports = router