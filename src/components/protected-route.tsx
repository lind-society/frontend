import { Navigate, Outlet } from "react-router-dom";

import { authentication, useGetApiWithAuth } from "../hooks";

import { Payload, User } from "../types";

export const ProtectedRoute = () => {
  const isAuthenticated = authentication.isAuthenticated();

  const identifier = authentication.getUser();

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const { data, isLoading } = useGetApiWithAuth<Payload<User>>({ key: ["profile"], url: `admins/profile` });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader size-24 after:size-24"></div>
      </div>
    );
  }

  const identifierMatcher = data?.data.email === identifier || data?.data.name === identifier || data?.data.username === identifier;

  if (identifierMatcher) {
    return <Outlet />;
  } else {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/admin/login" />;
  }
};
