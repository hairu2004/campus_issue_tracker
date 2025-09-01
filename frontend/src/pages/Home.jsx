import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-xl mx-auto mt-20 text-center space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Welcome to Campus Tracker</h1>
      <p className="text-gray-600">Choose your role to continue:</p>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Student</h2>
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2">
            Login
          </Link>
          <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded shadow">
            Sign Up
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Admin</h2>
          <Link to="/login" className="bg-gray-700 text-white px-4 py-2 rounded shadow">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;