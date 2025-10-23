import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAllowed }) => {
  const location = useLocation();

  if (!isAllowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
