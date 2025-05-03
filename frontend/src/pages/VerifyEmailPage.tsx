import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/verify/${token}`)
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message || "Email verified!");
        navigate("/login");
      })
      .catch(() => toast.error("Invalid or expired token"));
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-bold">Verifying your email...</h1>
    </div>
  );
}
