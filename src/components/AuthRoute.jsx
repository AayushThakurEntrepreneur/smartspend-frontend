import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('smartspend-token');
  return token ? children : <Navigate to="/login" replace />;
};

export default AuthRoute;
