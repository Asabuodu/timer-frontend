"use client";

import { useState } from "react";
import axios from "@/app/lib/axios";
import { useRouter } from "next/navigation";

export default function VerifyTokenPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/verify-token", { email, token });
      localStorage.setItem("resetToken", res.data.token); // Save token temporarily
      router.push("/reset-password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "❌ Invalid token.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-blue-100 to-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-500">Verify Token</h1>
      <form onSubmit={handleSubmit} className="bg-transparent border-2 border-white  text-gray-500 shadow p-6 rounded-xl space-y-4 max-w-md w-full">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter token"
          className="w-full border p-2 rounded"
          value={token}
          required
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Verify
        </button>
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
        <p className="mt-4 text-center text-sm text-gray-400">
          Didn&#39;t receive a token? <a href="/forgot-password" className="text-blue-600 hover:underline">Request a new one</a>    
        </p>
      </form>
    </div>
  );
}
