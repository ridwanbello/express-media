const router = require("express").Router
const User = require("../models/User")
const Post = require("../models/Post")

// Create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json("Post saved successfully")
    } catch (err) {
        return res.status(500).json("Error occured")
    }
})
// Update a post
router.put("/:id", async (req, res) => {
    try {
        const post = Post.findById(req.params.id)
        if (post.userId == req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post updated successfully")
        } else {
            return res.status(403).json("You can only update on your post")
        }
    } catch (err) {
        return res.status(500).json("Error occured")
    }
})
// Delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = Post.findById(req.params.id)
        if (post.userId == req.body.userId) {
            await post.deleteOne()
            res.status(200).json("Post deleted successfully")
        } else {
            return res.status(403).json("You can only delete your post")
        }
    } catch (err) {
        return res.status(500).json("Error occured")
    }
})
// Like / Dislike a post
router.get("/:id/like", async (req, res) => {
    try {
        const post = Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("The post has been liked successfully")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("The post has been disliked successfully")

        }
    } catch (err) {
        return res.status(500).json("Error occured")
    }
})
// Get a post
router.get("/:id", async (req, res) => {
    try {
        const post = Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// Get timeline posts
router.get("timeline/all", async (req, res) => {
    try {
        let postArray = []
        let post = Post.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        return res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router
