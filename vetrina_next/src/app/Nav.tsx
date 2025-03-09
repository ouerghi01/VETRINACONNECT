"use server";
import Link from "next/link";
import { verifySession } from "./lib/dal";
import { LogIn, UserPlus, LogOut, User, Home } from "lucide-react"; // Import icons

export default async function Nav() {
  const session = await verifySession();

  return (
    <nav className="flex justify-between items-center p-4 w-full bg-gray-900 shadow-md rounded-b-md">
      {/* Left Side - Brand Logo */}
      <Link href="/" className="flex items-center space-x-2 text-2xl font-semibold text-teal-400 hover:text-teal-300 transition">
        <Home className="w-6 h-6" /> {/* Home Icon */}
        <span>MyApp</span>
      </Link>

      {/* Right Side - Navigation */}
      <div className="flex items-center space-x-6">
        {session == null ? (
          <>
            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center space-x-2 px-4 py-2 text-lg rounded-md text-teal-400 hover:text-white hover:bg-teal-600 transition"
            >
              <LogIn className="w-5 h-5" /> <span>Login</span>
            </Link>

            {/* Register Button */}
            <Link
              href="/signup"
              className="flex items-center space-x-2 px-4 py-2 text-lg rounded-md text-teal-400 hover:text-white hover:bg-teal-600 transition"
            >
              <UserPlus className="w-5 h-5" /> <span>Register</span>
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Profile Avatar */}
            <div className="relative flex items-center space-x-2 bg-teal-600 text-white px-3 py-2 rounded-full shadow-lg">
              <User className="w-5 h-5" />
              <span>{session.email ? session.email.split("@")[0] : "User"}</span>
            </div>

            {/* User Role */}
            <span className="text-gray-300">{session.role}</span>

            {/* Logout Button */}
            <Link
              href="/api/rmsession"
              className="flex items-center space-x-2 px-4 py-2 text-lg rounded-md text-white bg-red-500 hover:bg-red-600 transition"
            >
              <LogOut className="w-5 h-5" /> <span>Logout</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
