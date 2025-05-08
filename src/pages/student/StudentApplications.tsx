
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getApplicationsByStudentId, getProjectById } from '@/lib/db';
import { Application, ApplicationStatus, Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ApplicationWithProject = Application & {
  project?: Project;
};

const StudentApplications = () => {
  const [applications, setApplications] = useState<ApplicationWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchApplications = () => {
      if (user) {
        // Fetch all applications for this student
        const studentApplications = getApplicationsByStudentId(user.id);
        
        // Fetch project details for each application
        const applicationsWithProjects = studentApplications.map(app => {
          const project = getProjectById(app.projectId);
          return { ...app, project };
        });
        
        setApplications(applicationsWithProjects);
      }
      setIsLoading(false);
    };
    
    fetchApplications();
  }, [user]);
  
  const getStatusBadgeColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout title="My Applications">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-university-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="My Applications">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Project Applications</h2>
        
        {applications.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">You haven't applied to any projects yet.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/dashboard/student'}>
              Browse Projects
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{application.project?.title || 'Unknown Project'}</h3>
                    <p className="text-sm text-gray-600">Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <Badge className={getStatusBadgeColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Your Note:</h4>
                  <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                    {application.note || 'No additional note provided.'}
                  </p>
                </div>
                
                {application.project && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Project Details:</h4>
                    <p className="mt-1 text-sm text-gray-600">{application.project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-gray-500">Faculty: {application.project.facultyName}</span>
                      <span className="text-xs text-gray-500">Deadline: {new Date(application.project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentApplications;
