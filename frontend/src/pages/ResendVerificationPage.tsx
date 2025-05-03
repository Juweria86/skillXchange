import { useState } from "react";
import toast from "react-hot-toast";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) toast.success(data.message);
    else toast.error(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleResend} className="max-w-md w-full bg-white p-6 shadow rounded-xl space-y-4">
        <h2 className="text-xl font-semibold text-center">Resend Verification Email</h2>
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-[#4a3630] text-white rounded py-2 hover:bg-[#3a2a24] transition"
        >
          Resend
        </button>
      </form>
    </div>
  );
}
