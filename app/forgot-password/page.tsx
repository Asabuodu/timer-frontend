"use client";
import { useState } from "react";
import axios from "../lib/axios";
import Navbar from "../components/navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    try {
      await axios.post("/auth/forgot-password", { email });
      setStatus("✅ Reset link sent! Check your email.");
    } catch {
      setStatus("❌ Email not found or error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <Navbar />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Send Reset Link
        </button>
        {status && <p className="mt-4 text-center text-sm">{status}</p>}
      </form>
    </div>
  );
}
