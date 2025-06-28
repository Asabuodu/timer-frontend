// "use client";

// import { useState } from "react";
// import axios from "@/app/lib/axios";
// import { useRouter } from "next/navigation";

// export default function ResetPasswordPage() {
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [message, setMessage] = useState("");
//   const router = useRouter();

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = localStorage.getItem("resetToken");
//     if (!token) {
//       setMessage("❌ Reset token missing. Please verify again.");
//       return;
//     }

//     if (password !== confirm) {
//       setMessage("❌ Passwords do not match.");
//       return;
//     }

//     try {
//       await axios.post("/auth/reset-password", { password, token });
//       setMessage("✅ Password reset successfully. Redirecting to login...");
//       localStorage.removeItem("resetToken");
//       setTimeout(() => router.push("/signin"), 3000);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err) && err.response?.data?.message) {
//         setMessage(err.response.data.message);
//       } else {
//         setMessage("❌ Failed to reset password.");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-blue-100 to-white p-4">
//       <h1 className="text-2xl font-bold mb-4 text-gray-500">Reset Password</h1>
//       <form onSubmit={handleReset} className="bg-transparent shadow p-6 rounded-xl border-2 border-white text-gray-500 space-y-4 max-w-md w-full">
//         <input
//           type="password"
//           placeholder="New password"
//           className="w-full border p-2 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Confirm password"
//           className="w-full border p-2 rounded"
//           required
//           autoComplete="new-password"
//           value={confirm}
//           onChange={(e) => setConfirm(e.target.value)}
//         />
//         <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 hover:shadow-xl text-white py-2 rounded">
//           Reset Password
//         </button>
//         {message && <p className="text-center text-sm text-gray-700">{message}</p>}
//         <p className="mt-4 text-center text-sm text-gray-400">
//           Remembered your password? <a href="/signin" className="text-blue-600 hover:underline">Login</a>
//         </p>
//       </form>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import axiosInstance from "@/app/lib/axios"; // ✅ your custom instance
import { isAxiosError } from "axios";        // ✅ imported from axios
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("resetToken");
    if (!token) {
      setMessage("❌ Reset token missing. Please verify again.");
      return;
    }

    if (password !== confirm) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post("/auth/reset-password", { password, token });
      setMessage("✅ Password reset successfully. Redirecting to login...");
      localStorage.removeItem("resetToken");
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("❌ Failed to reset password.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-blue-100 to-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-500">Reset Password</h1>
      <form onSubmit={handleReset} className="bg-transparent shadow p-6 rounded-xl border-2 border-white text-gray-500 space-y-4 max-w-md w-full">
        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-2 rounded"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 hover:shadow-xl text-white py-2 rounded">
          Reset Password
        </button>
        {message && <p className="text-center text-sm text-gray-700">{message}</p>}
        <p className="mt-4 text-center text-sm text-gray-400">
          Remembered your password? <a href="/signin" className="text-blue-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
