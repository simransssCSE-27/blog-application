require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiRoutes = require("./routes/api");

const app = express();

const PORT = process.env.PORT || 5000;

// ============================
// CORS
// ============================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

// ============================
// MIDDLEWARE
// ============================

app.use(express.json());

// ============================
// HOME ROUTE
// ============================

app.get("/", (req, res) => {
    res.send("Blog Application Backend is Running!");
});

// ============================
// API ROUTES
// ============================

app.use("/api", apiRoutes);

// ============================
// MONGODB CONNECTION
// ============================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log(
            "MongoDB connection failed:",
            error.message
        );
    });

// ============================
// START SERVER
// ============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});