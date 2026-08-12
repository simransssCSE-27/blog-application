const express = require("express");

const router = express.Router();


// ============================
// REGISTER API
// ============================

router.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    res.status(201).json({
        message: "Registration successful!",
        user: {
            name: name,
            email: email
        }
    });

});


// ============================
// LOGIN API
// ============================

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    res.status(200).json({
        message: "Login successful!",
        user: {
            email: email
        }
    });

});


// ============================
// CREATE BLOG API
// ============================

router.post("/create-blog", (req, res) => {

    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({
            message: "Title, content and author are required"
        });
    }

    res.status(201).json({
        message: "Blog created successfully!",
        blog: {
            title: title,
            content: content,
            author: author
        }
    });

});


module.exports = router;