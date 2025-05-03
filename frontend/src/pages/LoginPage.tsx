import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks";
import { loginUser } from "../features/auth/authSlice";
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SocialAuth from "../components/auth/SocialAuth";
import toast from "react-hot-toast";


export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const result = await dispatch(loginUser(form));
  
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Logged in successfully");
        navigate("/home-dashboard");
      } else {
        const errorMsg = result.error?.message;
  
        // Check for verification-related message from backend
        if (errorMsg?.includes("verify your email")) {
          toast.error("Please verify your email first.");
          navigate("/resend-verification");
        } else {
          toast.error(errorMsg || "Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    }
  };
  

  return (
    <AuthLayout>
      <AuthCard title="Log in to SkillXchange">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange}
            label="Email" placeholder="Enter your email" variant="yellow" required />

          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange}
            label="Password" placeholder="Enter your password" variant="yellow" required />
            
          <div className="text-sm text-right">
            <a href="/forgot-password" className="text-[#4a3630] hover:underline">
            Forgot your password?
            </a>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="font-medium text-[#4a3630] hover:text-[#3a2a24]">
            Sign up
          </a>
        </p>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </AuthCard>
    </AuthLayout>
  );
}
