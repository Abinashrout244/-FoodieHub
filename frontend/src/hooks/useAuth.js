import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const { user, login, signup, logout } = useAppContext();
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const requireAuth = (redirectTo = '/login') => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  return { user, isAuthenticated, isAdmin, login, signup, logout, requireAuth };
};

export default useAuth;
