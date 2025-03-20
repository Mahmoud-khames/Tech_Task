import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthWrapper";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
   
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
      toast.error("Failed to login. Please check your credentials.");
      setError("Failed to login. Please check your credentials.");
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
            onSubmit={handleLogin}
            className="mt-6 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Sign in to your account
            </p>

            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="block w-full cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              {loading ? "Loading..." : "Login"}
            </button>
            {/* register */}

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account yet?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
