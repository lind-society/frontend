import { Navigate, Outlet } from "react-router-dom";

import { authentication, useGetApiWithAuth } from "../hooks";

export const ProtectedRoute = () => {
  const isAuthenticated = authentication.isAuthenticated();

  const identifier = authentication.getUser();

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const { isLoading, isError } = useGetApiWithAuth({ key: ["profile"], url: "/admins/profile" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader size-24 after:size-24"></div>
      </div>
    );
  }

  if (isError && identifier !== "") {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/admin/login" />;
  }

  return <Outlet />;
};
