"use client";

import { useState } from "react";
import api from "../lib/axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function SigninPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { 
        email, 
        password 
      });
      const { token, user } = response.data;

      // ✅ Update Zustand store
      setUser(user);
      setToken(token);

      // ✅ Persist to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));

      // ✅ Redirect on success
      router.push("/home");
    } catch (err: unknown) {
      type AxiosError = {
        response?: {
          data?: {
            error?: string;
          };
        };
      };

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as AxiosError).response === "object"
      ) {
        setError((err as AxiosError).response?.data?.error || "Invalid credentials or server error.");
      } else {
        setError("Invalid credentials or server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen items-center justify-center p-8  bg-gradient-to-r from-white via-blue-100 to-white">

    <div className="max-w-md mx-auto mt-64  items-center border-4 text-gray-600 border-white bg-transparent p-8 rounded-xl shadow-lg">
      
      <h1 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mx-auto text-gray-600">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don&#39;t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>  
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          <a href="/forgot-password" className="text-blue-600 hover:underline ">
            Reset Password
          </a>
        </p>
      </form>
    </div>
    </div>
  );
}
