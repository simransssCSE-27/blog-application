require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();

const PORT = process.env.PORT || 5000;

// Allow your deployed frontend to access the backend
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Blog Application Backend is Running!");
});

app.use("/api", apiRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});