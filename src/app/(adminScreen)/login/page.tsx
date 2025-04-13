"use client";

import { useLoginMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "react-hot-toast";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("nash@stallioninformatics.com");
  const [password, setPassword] = useState("One2345$!X");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ username: email, password }).unwrap();

      // Save token in cookies
      Cookies.set("accessToken", result.result.accessToken);

      // Dispatch user data to Redux store
      dispatch(
        setUser({
          user: result.result.userInfo,
          token: result.result.accessToken,
          accessToken: result.result.accessToken,
        })
      );

      // Check user role and redirect accordingly
      const role = result?.result?.userInfo?.role;
      if (role === "ADMIN") {
        toast.success("Admin login successfully");
        router.push("/");
      } else if (role === "SUPER_ADMIN") {
        toast.success("SUPER ADMIN login successfully");
        router.push("/");
      } else {
        toast.error(
          "Access denied! You are not authorized to visit the homepage."
        );
      }
    } catch (err: unknown) {
      console.error("Login failed:", err);
      toast.error(
        "Login failed! Only admin and super_admin are allowed to log in."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C111D] text-white">
      <div className="w-full max-w-md px-8 py-12">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">Hello Again!</h1>
        <p className="text-center text-gray-400 mb-8">
          Welcome back, you’ve been missed!
        </p>
        <p className="text-center text-gray-400 mb-8">
          Click on login to visite this site!
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              disabled
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#23262E] text-white text-sm px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              disabled
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Sakjsu@!2324"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#23262E] text-white text-sm px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-[43px] right-4 text-gray-400 hover:text-yellow-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            <div className="mt-1 text-right">
              <a href="#" className="text-sm text-yellow-400 hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black text-sm font-medium py-3 rounded-md hover:bg-yellow-500 transition flex justify-center items-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
