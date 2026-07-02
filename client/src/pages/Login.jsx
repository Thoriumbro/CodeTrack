import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await api.post("/auth/login", form);

            localStorage.setItem("token", res.data.token);

            navigate("/dashboard");

        } catch (err) {
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">

            <div className="w-full max-w-lg bg-[#161B22] rounded-2xl p-8 shadow-2xl">

                <h1 className="text-3xl font-bold text-white text-center">
                    Interview Prep Tracker
                </h1>

                <p className="text-slate-400 text-center mt-2">
                    Login to continue
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-lg bg-[#21262D] border border-slate-700 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-blue-500"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-lg bg-[#21262D] border border-slate-700 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-blue-500"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button
                        className="w-full bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.02] transition-all duration-200 text-white p-3 rounded-lg"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-slate-400 text-center mt-6">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-400 ml-2"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}