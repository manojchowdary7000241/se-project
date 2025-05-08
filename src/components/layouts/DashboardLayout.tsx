
import { ReactNode, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-university-primary ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-university-primary">
            <h1 className={`text-white font-bold ${sidebarOpen ? 'text-xl' : 'text-sm'} transition-all duration-300`}>
              {sidebarOpen ? 'ProjectPal' : 'PP'}
            </h1>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto p-2 rounded-full text-white hover:bg-university-dark"
            >
              <ChevronDown className={`transform ${sidebarOpen ? '' : 'rotate-180'} transition-transform`} size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4">
            <ul className="space-y-2">
              {/* Dashboard Link */}
              {user?.role === UserRole.STUDENT ? (
                <>
                  <li>
                    <Link
                      to="/dashboard/student"
                      className={`flex items-center p-3 text-white rounded-md transition-colors ${
                        isActive('/dashboard/student') ? 'bg-university-accent' : 'hover:bg-university-dark'
                      }`}
                    >
                      <LayoutDashboard size={20} />
                      {sidebarOpen && <span className="ml-3">Dashboard</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/student/applications"
                      className={`flex items-center p-3 text-white rounded-md transition-colors ${
                        isActive('/dashboard/student/applications') ? 'bg-university-accent' : 'hover:bg-university-dark'
                      }`}
                    >
                      <Users size={20} />
                      {sidebarOpen && <span className="ml-3">My Applications</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/student/meetings"
                      className={`flex items-center p-3 text-white rounded-md transition-colors ${
                        isActive('/dashboard/student/meetings') ? 'bg-university-accent' : 'hover:bg-university-dark'
                      }`}
                    >
                      <Users size={20} />
                      {sidebarOpen && <span className="ml-3">My Meetings</span>}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/dashboard/faculty"
                      className={`flex items-center p-3 text-white rounded-md transition-colors ${
                        isActive('/dashboard/faculty') ? 'bg-university-accent' : 'hover:bg-university-dark'
                      }`}
                    >
                      <LayoutDashboard size={20} />
                      {sidebarOpen && <span className="ml-3">Dashboard</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/faculty/projects"
                      className={`flex items-center p-3 text-white rounded-md transition-colors ${
                        isActive('/dashboard/faculty/projects') ? 'bg-university-accent' : 'hover:bg-university-dark'
                      }`}
                    >
                      <Users size={20} />
                      {sidebarOpen && <span className="ml-3">My Projects</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/faculty/meetings"
                      className={`flex items-center p-3 text-white rounded-md transition-colors ${
                        isActive('/dashboard/faculty/meetings') ? 'bg-university-accent' : 'hover:bg-university-dark'
                      }`}
                    >
                      <Users size={20} />
                      {sidebarOpen && <span className="ml-3">My Meetings</span>}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-university-dark">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-university-secondary text-university-primary">
                <User size={20} />
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-300">{user?.email}</p>
                </div>
              )}
              {sidebarOpen && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-auto p-0 h-8 w-8">
                      <ChevronDown className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-university-primary">{title}</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={handleLogout} className="text-university-primary">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
