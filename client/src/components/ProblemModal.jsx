import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ProblemModal({
    isOpen,
    problem,
    onClose,
    onProblemAdded
}) {

    const [form, setForm] = useState({
        title: "",
        platform: "",
        difficulty: "Easy",
        topic: "",
        companyTags: "",
        timeTaken: 0,
        solvedDate: null,
        revisionDate: null,
        notes: "",
        favorite: false
    });


    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const payload = {
                ...form,
                timeTaken: Number(form.timeTaken) || 0
            };

            if (problem) {
                await api.put(`/problems/${problem.id}`, payload);
            } else {
                await api.post("/problems", payload);
            }

            onProblemAdded();
            toast.success(
                problem ? "Problem updated!" : "Problem added!"
            );
            onClose();

        } catch (err) {
            toast.error(err.response?.data?.message || "Couldn't save problem");
        }

    };

    useEffect(() => {
        if (problem) {
            setForm({
                title: problem.title,
                platform: problem.platform,
                difficulty: problem.difficulty,
                topic: problem.topic,
                companyTags: problem.company_tags || "",
                timeTaken: problem.time_taken || 0,
                solvedDate: problem.solved_date?.split("T")[0] || "",
                revisionDate: problem.revision_date?.split("T")[0] || "",
                notes: problem.notes || "",
                favorite: problem.favorite
            });
        } else {
            setForm({
                title: "",
                platform: "",
                difficulty: "Easy",
                topic: "",
                companyTags: "",
                timeTaken: 0,
                solvedDate: "",
                revisionDate: "",
                notes: "",
                favorite: false
            });
        }
    }, [problem]);

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

            <div className="bg-slate-900 p-8 rounded-xl w-full max-w-lg">

                <h2 className="text-2xl font-bold mb-6">
                    {problem ? "Edit Problem" : "Add Problem"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        className="w-full p-3 rounded bg-slate-800"
                        placeholder="Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <input
                        className="w-full p-3 rounded bg-slate-800"
                        placeholder="Platform"
                        name="platform"
                        value={form.platform}
                        onChange={handleChange}
                    />

                    <select
                        className="w-full p-3 rounded bg-slate-800"
                        name="difficulty"
                        value={form.difficulty}
                        onChange={handleChange}
                    >

                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>

                    </select>

                    <input
                        className="w-full p-3 rounded bg-slate-800"
                        placeholder="Topic"
                        name="topic"
                        value={form.topic}
                        onChange={handleChange}
                    />

                    <input
                        className="w-full p-3 rounded bg-slate-800"
                        placeholder="Company Tags (Google, Amazon)"
                        name="companyTags"
                        value={form.companyTags}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="timeTaken"
                        placeholder="Time Taken (minutes)"
                        value={form.timeTaken}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-slate-800"
                    />

                    <input
                        type="date"
                        name="solvedDate"
                        value={form.solvedDate || ""}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-slate-800"
                    />

                    <input
                        type="date"
                        name="revisionDate"
                        value={form.revisionDate || ""}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-slate-800"
                    />

                    <textarea
                        className="w-full p-3 rounded bg-slate-800"
                        placeholder="Notes"
                        name="notes"
                        rows="4"
                        value={form.notes}
                        onChange={handleChange}
                    />

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-700 px-5 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            className="bg-blue-600 px-5 py-2 rounded"
                        >
                            {problem ? "Update Problem" : "Save Problem"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}