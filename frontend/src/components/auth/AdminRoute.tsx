import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/useTypedHooks";

const AdminRoute = () => {
  const { user, token, isHydrated } = useAppSelector((state) => state.auth);

  const userId = user?._id || user?.id;
  const isAdmin = user?.role === "admin";

  if (!isHydrated) return null; // ⏳ wait for Redux hydration

  if (!token || !userId || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
