const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ============================
// REGISTER API
// ============================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ============================
// LOGIN API WITH JWT
// ============================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ============================
// CREATE BLOG API
// ============================

router.post("/create-blog", authMiddleware, async (req, res) => {

    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const newBlog = new Blog({
            title,
            content,
            author: user.name,
            userId: user._id
        });

        await newBlog.save();

        res.status(201).json({
            message: "Blog created successfully!",
            blog: newBlog
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ============================
// GET ALL BLOGS
// PUBLIC
// ============================

router.get("/blogs", async (req, res) => {

    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.json({
            blogs
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch blogs"
        });

    }

});


// ============================
// GET MY BLOGS
// PROTECTED
// ============================

router.get("/my-blogs", authMiddleware, async (req, res) => {

    try {

        const blogs = await Blog.find({
            userId: req.user.userId
        }).sort({
            createdAt: -1
        });

        res.json({
            blogs
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch your blogs"
        });

    }

});


// ============================
// GET SINGLE BLOG
// ============================

router.get("/blogs/:id", async (req, res) => {

    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            blog
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch blog"
        });

    }

});


// ============================
// UPDATE MY BLOG
// ============================

router.put("/blogs/:id", authMiddleware, async (req, res) => {

    try {

        const { title, content } = req.body;

        const blog = await Blog.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or you are not the owner"
            });
        }

        blog.title = title;
        blog.content = content;

        await blog.save();

        res.json({
            message: "Blog updated successfully!",
            blog
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to update blog"
        });

    }

});


// ============================
// DELETE MY BLOG
// ============================

router.delete("/blogs/:id", authMiddleware, async (req, res) => {

    try {

        const deletedBlog = await Blog.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!deletedBlog) {
            return res.status(404).json({
                message: "Blog not found or you are not the owner"
            });
        }

        res.json({
            message: "Blog deleted successfully!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to delete blog"
        });

    }

});


module.exports = router;