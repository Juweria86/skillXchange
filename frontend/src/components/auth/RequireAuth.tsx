// src/components/auth/RequireAuth.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useTypedHooks";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}
