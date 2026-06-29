const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");

const protect = require("./middleware/authMiddleware");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

app.get("/", (req, res) => {
    res.send("Interview Tracker API Running");
});

app.get("/api/test", protect, (req, res) => {
    res.json({
        success: true,
        message: "Protected Route",
        userId: req.user.id
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});