import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
// import { login } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthWrapper";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: setUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await register(username, email, password, role);
      console.log("register response:", response);
      
      const userData = {
        _id: response._id,
        username: response.username,
        email: response.email,
        role: response.role,
        token: response.token,
      };
      setUser(userData);
      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Failed to register. Please check your credentials.");
      setError("Failed to register. Please check your credentials.");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
            Get started today
          </h1>

          <form
            onSubmit={handleRegister}
            className="mt-6 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Sign in to your account
            </p>

            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}

            <div>
              <label htmlFor="username" className="sr-only">
                userName
              </label>
              <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                placeholder="Enter user name"
                required
              />
            </div>



            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  type={open ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                  placeholder="Enter password"
                  required
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  {open ? (
                    <IoEyeOff
                      onClick={() => setOpen(!open)}
                      className="text-gray-500 cursor-pointer"
                    />
                  ) : (
                    <IoEye
                      onClick={() => setOpen(!open)}
                      className="text-gray-500 cursor-pointer"
                    />
                  )}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
              >
                <option value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
        

            <button
              type="submit"
              disabled={loading}
              className="block w-full cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              {loading ? "Loading..." : "Register"}
            </button>
            {/* LOGIN */}

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
