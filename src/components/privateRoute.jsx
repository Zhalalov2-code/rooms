import { Navigate } from "react-router-dom";
import { useAuth } from "../components/authoContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
