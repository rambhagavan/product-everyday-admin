import { Navigate, useLocation } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";

export const AdminAuthGuard = ({ children }) => {

  let location = useLocation();
  let token = localStorage.getItem('Token')
  token = JSON.parse(token || '{}')
  const decodedToken = decodeToken(token);
  const isTokenExpired = isExpired(token);
  console.log("decodedToken", decodedToken)
  console.log(isTokenExpired)
  if (isTokenExpired) {
    return <Navigate replace to="/session/signin" state={{ from: location }} />;
  }
  let user = localStorage.getItem('User');
  user = JSON.parse(user || '{}');
  console.log(user)
  console.log(!isTokenExpired && (user.is_admin || user.is_executive))

  if ((user.role === "ADMIN" || user.role === "STAFF")) {
    // return <Navigate to="/dashboard" state={{ from: location }} replace />;
    return children
  }
  else {
    return <Navigate to="/session/403" state={{ from: location }} replace />;
  }
};


