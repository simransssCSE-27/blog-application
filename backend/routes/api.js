const express = require("express");

const User = require("../models/User");
const Blog = require("../models/Blog");

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
// LOGIN API
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

        res.json({
            message: "Login successful!",
            user: {
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

router.post("/create-blog", async (req, res) => {

    try {

        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({
                message: "Title, content and author are required"
            });
        }

        const newBlog = new Blog({
            title: title,
            content: content,
            author: author
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
// GET ALL BLOGS API
// ============================

router.get("/blogs", async (req, res) => {

    try {

        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.json({
            blogs: blogs
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch blogs"
        });

    }

});
// ============================
// GET SINGLE BLOG API
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
            blog: blog
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch blog"
        });

    }

});
module.exports = router;