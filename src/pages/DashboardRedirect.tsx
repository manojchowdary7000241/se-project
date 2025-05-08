
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const DashboardRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (user?.role === UserRole.STUDENT) {
        navigate('/dashboard/student');
      } else if (user?.role === UserRole.FACULTY) {
        navigate('/dashboard/faculty');
      } else {
        navigate('/');
      }
    }
  }, [user, isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-university-primary mx-auto"></div>
        <h2 className="mt-4 text-lg font-medium text-gray-700">Redirecting to dashboard...</h2>
      </div>
    </div>
  );
};

export default DashboardRedirect;
