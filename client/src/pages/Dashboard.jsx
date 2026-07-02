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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);

            const res = await api.get("/problems");

            setProblems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D1117] text-white">

            <header className="border-b border-[#30363D]">

                <div className="max-w-7xl mx-auto flex justify-between items-center p-6">

                    <h1 className="text-3xl font-bold text-blue-400">
                        CodeTrack
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

                <div className="mb-8">
                    <h2 className="text-3xl font-bold">
                        Master Your Coding Interviews 🚀
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Track your progress, revise smarter, and stay interview-ready.
                    </p>
                </div>

                <div className="mt-8 bg-[#161B22] border border-[#30363D] rounded-xl p-6">

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
                            className="bg-emerald-500 h-4 transition-all duration-500"
                            style={{
                                width: `${progress}%`
                            }}
                        />

                    </div>

                </div>

                <div className="mt-8 bg-[#161B22] border border-[#30363D] rounded-xl p-6">

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

                <div className="mt-8 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">

                    <div className="flex flex-col md:flex-row gap-4 w-full">

                        <input
                            type="text"
                            placeholder="🔍 Search problems..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-[#161B22] border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
                        />

                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="bg-[#161B22] border border-slate-700 rounded-lg px-4 py-3"
                        >
                            <option value="All">All</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>

                    </div>

                    <button
                        onClick={() => {
                            setSelectedProblem(null);
                            setOpenModal(true);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-lg whitespace-nowrap"
                    >
                        + Add Problem
                    </button>

                </div>

                {filteredProblems.length === 0 ? (
                    <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-xl p-10 text-center">

                        <h2 className="text-2xl font-semibold mb-2">
                            📚 No Problems Found
                        </h2>

                        <p className="text-slate-400 mb-6">
                            Start tracking your interview preparation by adding your first problem.
                        </p>

                        <button
                            onClick={() => {
                                setSelectedProblem(null);
                                setOpenModal(true);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg"
                        >
                            + Add Your First Problem
                        </button>

                    </div>
                ) : (
                    <ProblemTable
                        problems={filteredProblems}
                        fetchProblems={fetchProblems}
                        onEdit={(problem) => {
                            setSelectedProblem(problem);
                            setOpenModal(true);
                        }}
                    />
                )}
                <ProblemModal
                    isOpen={openModal}
                    problem={selectedProblem}
                    onClose={() => {
                        setOpenModal(false);
                        setSelectedProblem(null);
                    }}
                    onProblemAdded={fetchProblems}
                />
                <footer className="text-center text-slate-500 text-sm mt-12 pb-6">
                    Built with React, Express, MySQL & Tailwind CSS
                </footer>
            </main>

        </div>
    );
}