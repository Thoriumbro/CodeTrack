const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getProblems,
    addProblem,
    updateProblem,
    deleteProblem
} = require("../controllers/problemController");

router.get("/", protect, getProblems);
router.post("/", protect, addProblem);
router.put("/:id", protect, updateProblem);
router.delete("/:id", protect, deleteProblem);

module.exports = router;