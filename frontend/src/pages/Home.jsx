import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-zinc-100 to-slate-200 px-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-10 text-center space-y-10">
        <h1 className="text-4xl font-bold text-neutral-700 tracking-wide">
          Welcome to Campus Tracker
        </h1>
        <p className="text-slate-600 text-lg">
          A smarter way to report, track, and resolve campus issues.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Student Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-violet-600 mb-4">Student</h2>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white font-medium py-2 rounded-full transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-lime-500 to-green-400 hover:from-lime-600 hover:to-green-500 text-white font-medium py-2 rounded-full transition"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Admin</h2>
            <Link
              to="/login"
              className="bg-gradient-to-r from-neutral-600 to-slate-700 hover:from-neutral-700 hover:to-slate-800 text-white font-medium py-2 rounded-full transition block"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;