const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Blog Application Backend is Running!");
});

app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});