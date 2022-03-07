const router = require("express").Router
const User = require("../models/User")
const bcrypt = require("bcrypt")
// Register User
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const userData = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        //  Save user and respond
        const user = await userData.save()
        return res.status(200).json({
            msg: "User registered",
            user
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error occured"
        })
    }
})
// Login User
router.post("login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(404).json({
                "msg": "User not found"
            })
        }
        const validPassword = await bcrypt.compare(hashedPassword, req, body.password)
        if (!validPassword) {
            res.status(404).json({
                "msg": "Password not correct"
            })
        }
        return res.status(200).json({
            msg: "Login successful",
            user
        })
    } catch (error) {

    }
})

module.exports = router