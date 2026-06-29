const pool = require("../config/db");

const getProblems = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM problems
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.status(200).json(rows);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const addProblem = async (req, res) => {
    try {
        const {
            title,
            platform,
            difficulty,
            topic,
            companyTags,
            timeTaken,
            solvedDate,
            revisionDate,
            notes,
            favorite
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO problems
            (user_id, title, platform, difficulty, topic, company_tags,
             time_taken, solved_date, revision_date, notes, favorite)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                title,
                platform,
                difficulty,
                topic,
                companyTags,
                timeTaken,
                solvedDate,
                revisionDate,
                notes,
                favorite
            ]
        );

        res.status(201).json({
            message: "Problem added",
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProblem = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            title,
            platform,
            difficulty,
            topic,
            companyTags,
            timeTaken,
            solvedDate,
            revisionDate,
            notes,
            favorite
        } = req.body;

        const [result] = await pool.query(
            `UPDATE problems
             SET title=?, platform=?, difficulty=?, topic=?, company_tags=?,
                 time_taken=?, solved_date=?, revision_date=?, notes=?, favorite=?
             WHERE id=? AND user_id=?`,
            [
                title,
                platform,
                difficulty,
                topic,
                companyTags,
                timeTaken,
                solvedDate,
                revisionDate,
                notes,
                favorite,
                id,
                req.user.id
            ]
        );

        res.json({
            message: "Problem updated"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const deleteProblem = async (req, res) => {
    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM problems WHERE id=? AND user_id=?",
            [id, req.user.id]
        );

        res.json({
            message: "Problem deleted"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    getProblems,
    addProblem,
    updateProblem,
    deleteProblem
};