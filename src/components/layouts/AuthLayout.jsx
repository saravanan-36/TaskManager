import { Link } from "react-router-dom";
import { Briefcase, CheckCircle, Users, Bell } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* Left Section (Form Area) */}
      <div className="flex-1 min-w-[50%] px-6 md:px-12 pt-8 pb-12 overflow-y-hidden">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Task Manager</h2>
        {children}
      </div>

      {/* Right Section (Enterprise Greeting) */}
<div className="hidden md:flex w-[50%] h-full items-center justify-center bg-white p-10 border-l">
  <div className="text-left space-y-6 max-w-md">
    <h1 className="text-2xl font-bold text-gray-800">
      Welcome to Your Enterprise Task Suite
    </h1>
    <p className="text-sm text-gray-700">
      Streamline workflows, optimize productivity, and enable seamless collaboration across teams.
    </p>

    <ul className="space-y-4 text-gray-700 text-sm">
      <li className="flex items-start gap-2">
        <Briefcase size={18} className="text-gray-600" />
        Enterprise-grade task assignment and tracking
      </li>
      <li className="flex items-start gap-2">
        <Users size={18} className="text-gray-600" />
        Team-based roles and real-time collaboration
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle size={18} className="text-gray-600" />
        Progress dashboards and performance metrics
      </li>
      <li className="flex items-start gap-2">
        <Bell size={18} className="text-gray-600" />
        Automated reminders and smart notifications
      </li>
    </ul>

    <div className="mt-6">
      <p className="text-sm text-gray-800 font-semibold mb-2">Don’t have an account?</p>
      <Link to="/signup">
        <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md text-sm transition-all cursor-pointer">
          Register Your Team
        </button>
      </Link>
    </div>

    <p className="text-xs text-gray-600 italic mt-8">
      “Efficiency is doing better what is already being done.” – Peter Drucker
    </p>
  </div>
</div>

    </div>
  );
};

export default AuthLayout;
