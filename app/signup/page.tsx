"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios"; // ✅ import your configured axios

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post("/auth/signup", { username, email, password });
      setSuccess("Account created successfully!");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "error" in err.response.data) {
        setError((err as { response: { data: { error?: string } } }).response.data.error || "Signup failed");
      } else {
        setError("Signup failed");
      }
    }
  };

  return (

    <div className="min-h-screen items-center justify-center p-8  bg-gradient-to-r from-white via-blue-100 to-white">

    <div className="max-w-md mx-auto mt-64  items-center border-4 text-gray-600 border-white bg-transparent p-8 rounded-xl shadow-lg">

      <h1 className="text-2xl font-bold mb-6 text-center">Create an account</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
        <input
          type="text"
          placeholder="Username"
          required
          className="w-full px-4 py-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          required
          minLength={6}
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded">
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>  
        </p>
      </form>
    </div>
    </div>
  );
}
