
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { getCurrentUser, login as dbLogin, logout as dbLogout, register as dbRegister, initializeDatabase } from '@/lib/db';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize the database with mock data
    initializeDatabase();
    
    // Check if there's a current user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = dbLogin(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    dbLogout();
    setUser(null);
    toast({
      title: "Logout Successful",
      description: "You have been logged out successfully.",
    });
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const newUser = dbRegister(name, email, password, role);
      if (newUser) {
        setUser(newUser);
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully.",
        });
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
