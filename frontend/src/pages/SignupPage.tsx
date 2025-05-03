import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedHooks";
import { registerUser } from "../features/auth/authSlice";
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SocialAuth from "../components/auth/SocialAuth";
import toast from "react-hot-toast";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert("Passwords do not match");
  
    try {
      const result = await dispatch(
        registerUser({ name: form.name, email: form.email, password: form.password })
      );
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Account created! Please check your email to verify.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <AuthLayout>
      <AuthCard title="Create your account">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input id="name" name="name" type="text" value={form.name} onChange={handleChange} 
            label="Full Name" placeholder="Enter your full name" variant="yellow" required />

          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange}
            label="Email" placeholder="Enter your email" variant="yellow" required />

          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange}
            label="Password" placeholder="Create a password" variant="yellow" required />

          <Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
            label="Confirm Password" placeholder="Confirm your password" variant="yellow" required />

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-[#4a3630] hover:text-[#3a2a24]">
            Log in
          </a>
        </p>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </AuthCard>
    </AuthLayout>
  );
}
