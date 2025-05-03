import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useTypedHooks";
import { setToken, setUser } from "../../features/auth/authSlice";

import { auth, googleProvider } from "../../lib/firebase"; // ✅ Use shared config
import { signInWithPopup } from "firebase/auth";

export default function SocialAuth({ showDivider = true }: { showDivider?: boolean }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        dispatch(setToken(data.token));
        dispatch(setUser(data.user));
        toast.success("Logged in with Google");
        navigate("/home-dashboard");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="mt-6">
      {showDivider && (
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#FBEAA0] text-gray-500">Or</span>
          </div>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <img src="/google.png" alt="Google" className="h-5 w-5 mr-2" />
        Continue with Google
      </button>
    </div>
  );
}
