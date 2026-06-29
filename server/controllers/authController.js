const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields required"
            });
        }

        const [existing] = await pool.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users(name,email,password) VALUES(?,?,?)",
            [name, email, hashedPassword]
        );

        res.status(201).json({
            id: result.insertId,
            token: generateToken(result.insertId)
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (rows.length === 0) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }

        const user = rows[0];

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }

        res.json({

            id: user.id,

            name: user.name,

            token: generateToken(user.id)

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = {
    registerUser,
    loginUser
};