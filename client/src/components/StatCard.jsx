export default function StatCard({ title, value, color }) {
    return (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <h3 className="text-slate-400 text-sm">
                {title}
            </h3>

            <p className={`text-4xl font-bold mt-3 ${color}`}>
                {value}
            </p>
        </div>
    );
}