
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getProjectsByFacultyId, getApplicationsByProjectId, getMeetingsByFacultyId } from '@/lib/db';
import { Project, Application, ApplicationStatus, Meeting, MeetingStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch faculty projects
        const facultyProjects = getProjectsByFacultyId(user.id);
        setProjects(facultyProjects);
        
        // Fetch applications for all projects
        let allApplications: Application[] = [];
        facultyProjects.forEach(project => {
          const projectApplications = getApplicationsByProjectId(project.id);
          allApplications = [...allApplications, ...projectApplications];
        });
        setApplications(allApplications);
        
        // Fetch faculty meetings
        const facultyMeetings = getMeetingsByFacultyId(user.id);
        setMeetings(facultyMeetings);
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [user]);

  // Filter for pending applications
  const pendingApplications = applications.filter(app => app.status === ApplicationStatus.PENDING);
  
  // Filter for upcoming meetings
  const upcomingMeetings = meetings.filter(meeting => {
    return meeting.status === MeetingStatus.SCHEDULED && 
           new Date(meeting.scheduledAt) > new Date();
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Faculty Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-university-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Faculty Dashboard">
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{projects.length}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {projects.filter(p => p.status === 'open').length} projects open for applications
              </p>
              <Button className="w-full mt-4" asChild>
                <Link to="/dashboard/faculty/projects">Manage Projects</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingApplications.length}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Applications waiting for review
              </p>
              <Button className="w-full mt-4" asChild variant="outline">
                <Link to="/dashboard/faculty/projects">Review Applications</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{upcomingMeetings.length}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Scheduled meetings with students
              </p>
              <Button className="w-full mt-4" asChild variant="outline">
                <Link to="/dashboard/faculty/meetings">View Meetings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="pt-6">
              {applications.length === 0 && meetings.length === 0 ? (
                <p className="text-muted-foreground">No recent activity to display.</p>
              ) : (
                <div className="space-y-4">
                  {pendingApplications.slice(0, 3).map(app => (
                    <div key={app.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{app.studentName}</p>
                        <p className="text-sm text-muted-foreground">Applied for a project</p>
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/dashboard/faculty/projects`}>Review</Link>
                      </Button>
                    </div>
                  ))}
                  
                  {upcomingMeetings.slice(0, 3).map(meeting => (
                    <div key={meeting.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Meeting scheduled for {new Date(meeting.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/dashboard/faculty/meetings">View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardContent className="pt-6">
                <Link to="/dashboard/faculty/projects/new" className="block">
                  <h3 className="text-lg font-semibold">Create New Project</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a new project for final year students
                  </p>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardContent className="pt-6">
                <Link to="/dashboard/faculty/meetings/new" className="block">
                  <h3 className="text-lg font-semibold">Schedule a Meeting</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Schedule meetings with students
                  </p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
