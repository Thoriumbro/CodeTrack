import { useEffect, useState } from "react";
import api from "../services/api";
import ProblemTable from "../components/ProblemTable";
import StatCard from "../components/StatCard";
import ProblemModal from "../components/ProblemModal";

export default function Dashboard() {
    const [problems, setProblems] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [search, setSearch] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await api.get("/problems");
            setProblems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const total = problems.length;

    const easy = problems.filter(
        p => p.difficulty === "Easy"
    ).length;

    const medium = problems.filter(
        p => p.difficulty === "Medium"
    ).length;

    const hard = problems.filter(
        p => p.difficulty === "Hard"
    ).length;

    const streak = calculateStreak(problems);

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesDifficulty =
            difficultyFilter === "All" ||
            problem.difficulty === difficultyFilter;

        return matchesSearch && matchesDifficulty;
    });

    const goal = 100;

    const progress = Math.min(
        (total / goal) * 100,
        100
    );

    function calculateStreak(problems) {
        const solvedDates = new Set(
            problems
                .filter(p => p.solved_date)
                .map(p => p.solved_date.split("T")[0]) // Works for DATE and DATETIME
        );

        let streak = 0;

        const current = new Date();
        current.setHours(0, 0, 0, 0);

        while (true) {
            const dateString = current.toISOString().split("T")[0];

            if (solvedDates.has(dateString)) {
                streak++;
                current.setDate(current.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    const today = new Date().toISOString().split("T")[0];

    const todayRevisions = problems.filter((problem) => {
        if (!problem.revision_date) return false;

        const revisionDate = problem.revision_date.split("T")[0];

        return revisionDate === today;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <header className="border-b border-slate-800">

                <div className="max-w-7xl mx-auto flex justify-between items-center p-6">

                    <h1 className="text-3xl font-bold">
                        Interview Prep Tracker
                    </h1>

                    <button
                        onClick={()=>{
                            localStorage.removeItem("token");
                            window.location="/";
                        }}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="max-w-7xl mx-auto p-6">

                <h2 className="text-2xl font-semibold mb-8">
                    Welcome Back 👋
                </h2>

                <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">

                    <div className="flex justify-between items-center mb-4">

                        <div>

                            <h3 className="text-xl font-semibold">
                                Progress
                            </h3>

                            <p className="text-slate-400">
                                {total} / {goal} Problems Solved
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                {Math.max(goal - total, 0)} problems remaining
                            </p>

                        </div>

                        <span className="text-2xl font-bold text-blue-400">
                            {progress.toFixed(0)}%
                        </span>

                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">

                        <div
                            className="bg-blue-500 h-4 transition-all duration-500"
                            style={{
                                width: `${progress}%`
                            }}
                        />

                    </div>

                </div>

                <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">

                <h2 className="text-xl font-semibold mb-5">
                    📅 Today's Revision Queue
                </h2>

                {todayRevisions.length === 0 ? (

                    <p className="text-slate-400">
                        🎉 No revisions due today!
                    </p>

                ) : (

                    <div className="space-y-3">

                        {todayRevisions.map(problem => (

                            <div
                                key={problem.id}
                                className="flex justify-between items-center bg-slate-800 rounded-lg p-4"
                            >

                                <div>

                                    <h3 className="font-semibold">
                                        {problem.title}
                                    </h3>

                                    <p className="text-sm text-slate-400">
                                        {problem.platform} • {problem.difficulty}
                                    </p>

                                </div>

                                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                                    Revise Today
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-4">
                    
                    <StatCard
                        title="Problems"
                        value={total}
                        color="text-blue-400"
                    />

                    <StatCard
                        title="Easy"
                        value={easy}
                        color="text-green-400"
                    />

                    <StatCard
                        title="Medium"
                        value={medium}
                        color="text-yellow-400"
                    />

                    <StatCard
                        title="Hard"
                        value={hard}
                        color="text-red-400"
                    />

                    <StatCard
                        title="🔥 Streak"
                        value={`${streak} Days`}
                        color="text-orange-400"
                    />

                </div>

                <div className="mt-8 mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="🔍 Search problems..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

                <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
                >
                    <option value="All">All</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

            </div>

                <div className="flex justify-end mt-8">

                <button
                    onClick={() => {
                        setSelectedProblem(null);
                        setOpenModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg"
                >
                    + Add Problem
                </button>

                </div>

                <ProblemTable
                    problems={filteredProblems}
                    fetchProblems={fetchProblems}
                    onEdit={(problem) => {
                        setSelectedProblem(problem);
                        setOpenModal(true);
                    }}
                />
                <ProblemModal
                    isOpen={openModal}
                    problem={selectedProblem}
                    onClose={() => {
                        setOpenModal(false);
                        setSelectedProblem(null);
                    }}
                    onProblemAdded={fetchProblems}
                />
            </main>

        </div>
    );
}