

"use client";

import { useState } from "react";
import axios from "@/app/lib/axios";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/auth/forgot-password", { email });
      setMessage("🔐 A token has been sent to your email.");
      setEmail("");
      router.push("/verify-token");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setMessage(err.response?.data?.message || "❌ Something went wrong.");
      } else {
        setMessage("❌ Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-blue-100 to-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-600">Forgot Password</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-transparent shadow p-6 rounded-xl border-2 border-white space-y-4 max-w-md w-full"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded text-gray-500"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Send Token
        </button>
        {message && <p className="text-center text-sm text-gray-700">{message}</p>}
        <p className="mt-4 text-center text-sm text-gray-400">
          Remembered your password?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
