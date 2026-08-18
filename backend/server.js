require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api");

const app = express();

const PORT = process.env.PORT || 5000;


// ============================
// MIDDLEWARE
// ============================

app.use(cors());

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

        console.log(
            "MongoDB connected successfully!"
        );

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

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});