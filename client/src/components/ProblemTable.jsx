import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../services/api";

function getRevisionStatus(revisionDate) {

    if (!revisionDate) {
        return {
            text: "No Date",
            color: "bg-gray-500/20 text-gray-400"
        };
    }

    const today = new Date();
    const revision = new Date(revisionDate);

    today.setHours(0, 0, 0, 0);
    revision.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
        (revision - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
        return {
            text: "Overdue",
            color: "bg-red-500/20 text-red-400"
        };
    }

    if (diffDays === 0) {
        return {
            text: "Today",
            color: "bg-green-500/20 text-green-400"
        };
    }

    if (diffDays === 1) {
        return {
            text: "Tomorrow",
            color: "bg-yellow-500/20 text-yellow-400"
        };
    }

    return {
        text: `${diffDays} days`,
        color: "bg-blue-500/20 text-blue-400"
    };
}

export default function ProblemTable({
    problems,
    fetchProblems,
    onEdit
})  {
    const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this problem?"
    );

    if (!confirmDelete) return;

    try {

        await api.delete(`/problems/${id}`);

        fetchProblems();

    } catch (err) {

        console.error(err);
        alert("Delete failed");

    }};

    return (
        <div className="mt-10 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                <thead className="bg-slate-800">

                    <tr>

                        <th className="p-4 text-left">Title</th>

                        <th className="p-4 text-left">Platform</th>

                        <th className="p-4 text-left">Difficulty</th>

                        <th className="p-4 text-left">Revision</th>

                        <th className="p-4 text-left">Topic</th>

                        <th className="p-4 text-left">Companies</th>

                        <th className="p-4 text-center">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {problems.map((problem) => (

                        <tr
                            key={problem.id}
                            className="border-t border-slate-800 hover:bg-slate-800 transition"
                        >

                            <td className="p-4">{problem.title}</td>

                            <td className="p-4">{problem.platform}</td>

                            <td className="p-4">

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold
                                    ${
                                        problem.difficulty === "Easy"
                                            ? "bg-green-500/20 text-green-400"
                                            : problem.difficulty === "Medium"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-red-500/20 text-red-400"
                                    }`}
                                >
                                    {problem.difficulty}
                                </span>

                            </td>

                            <td className="p-4">
                                {(() => {
                                    const status = getRevisionStatus(problem.revision_date);

                                    return (
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}
                                        >
                                            {status.text}
                                        </span>
                                    );
                                })()}
                            </td>

                            <td className="p-4">{problem.topic}</td>

                            <td className="p-4">
                                <div className="flex flex-wrap gap-2">

                                    {(problem.company_tags || "")
                                        .split(",")
                                        .filter(Boolean)
                                        .map((company) => (

                                            <span
                                                key={company}
                                                className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs"
                                            >
                                                {company.trim()}
                                            </span>

                                        ))}

                                </div>
                            </td>

                            <td className="p-4">

                                <div className="flex justify-center gap-5">

                                    <button
                                        onClick={() => onEdit(problem)}
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(problem.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            </div>

        </div>
    );
}