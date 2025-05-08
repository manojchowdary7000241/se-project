
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getProjectsByFacultyId, 
  getApplicationsByProjectId,
  updateProject,
  updateApplication
} from '@/lib/db';
import { Project, ProjectStatus, Application, ApplicationStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';

interface ProjectWithApplications extends Project {
  applications: Application[];
}

const FacultyProjects = () => {
  const [projects, setProjects] = useState<ProjectWithApplications[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        // Fetch faculty projects
        const facultyProjects = getProjectsByFacultyId(user.id);
        
        // Fetch applications for each project
        const projectsWithApplications = facultyProjects.map(project => {
          const applications = getApplicationsByProjectId(project.id);
          return { ...project, applications };
        });
        
        setProjects(projectsWithApplications);
      }
      setIsLoading(false);
    };
    
    fetchProjects();
  }, [user]);
  
  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    try {
      const updatedProject = updateProject(projectId, { status: newStatus });
      
      if (updatedProject) {
        // Update the projects list
        setProjects(projects.map(project => 
          project.id === projectId 
            ? { ...project, status: newStatus } 
            : project
        ));
        
        toast({
          title: "Project Updated",
          description: `Project status changed to ${newStatus}.`
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update project status.",
        variant: "destructive"
      });
    }
  };
  
  const handleApplicationUpdate = (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const updatedApplication = updateApplication(applicationId, { status: newStatus });
      
      if (updatedApplication) {
        // Update the applications in the projects list
        setProjects(projects.map(project => {
          const updatedApplications = project.applications.map(app => 
            app.id === applicationId ? { ...app, status: newStatus } : app
          );
          return { ...project, applications: updatedApplications };
        }));
        
        toast({
          title: "Application Updated",
          description: `Application status changed to ${newStatus}.`
        });
        
        // If the application was accepted, you might want to update the project status
        if (newStatus === ApplicationStatus.ACCEPTED) {
          // This is a simplified approach - in a real app you might have more complex logic
          const application = projects
            .flatMap(p => p.applications)
            .find(a => a.id === applicationId);
          
          if (application) {
            const project = projects.find(p => p.id === application.projectId);
            if (project) {
              // Count accepted applications
              const acceptedApplications = project.applications.filter(
                a => a.status === ApplicationStatus.ACCEPTED || 
                   (a.id === applicationId && newStatus === ApplicationStatus.ACCEPTED)
              );
              
              // If we've reached the maximum students, set the project to ASSIGNED
              if (acceptedApplications.length >= project.maxStudents) {
                handleStatusChange(project.id, ProjectStatus.ASSIGNED);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update application status.",
        variant: "destructive"
      });
    }
  };
  
  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  if (isLoading) {
    return (
      <DashboardLayout title="My Projects">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-university-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="My Projects">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link to="/dashboard/faculty/projects/new">Create New Project</Link>
            </Button>
          </div>
          
          <div className="w-full md:w-1/2 flex gap-2">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value={ProjectStatus.OPEN}>Open</option>
              <option value={ProjectStatus.ASSIGNED}>Assigned</option>
              <option value={ProjectStatus.CLOSED}>Closed</option>
            </select>
          </div>
        </div>
        
        {filteredProjects.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">No projects found.</p>
            <Button className="mt-4" asChild>
              <Link to="/dashboard/faculty/projects/new">Create New Project</Link>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="open">Open Projects</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <Accordion type="single" collapsible key={project.id}>
                    <AccordionItem value={project.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center text-left gap-2">
                          <div>
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <p className="text-sm text-gray-500">
                              Created: {new Date(project.createdAt).toLocaleDateString()} • 
                              Applications: {project.applications.length}
                            </p>
                          </div>
                          <Badge 
                            className={`
                              ${project.status === ProjectStatus.OPEN ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                project.status === ProjectStatus.ASSIGNED ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                            `}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700">Description</h4>
                            <p className="mt-1 text-gray-600">{project.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700">Requirements</h4>
                            <p className="mt-1 text-gray-600">{project.requirements}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Deadline: {new Date(project.deadline).toLocaleDateString()}
                            </div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Max Students: {project.maxStudents}
                            </div>
                            {project.minCGPA && (
                              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Min CGPA: {project.minCGPA.toFixed(1)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {project.status === ProjectStatus.OPEN && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleStatusChange(project.id, ProjectStatus.CLOSED)}
                                >
                                  Close Project
                                </Button>
                                <Link to={`/dashboard/faculty/projects/edit/${project.id}`}>
                                  <Button size="sm" variant="outline">Edit Project</Button>
                                </Link>
                              </>
                            )}
                            {project.status === ProjectStatus.ASSIGNED && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleStatusChange(project.id, ProjectStatus.CLOSED)}
                              >
                                Close Project
                              </Button>
                            )}
                            {project.status === ProjectStatus.CLOSED && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleStatusChange(project.id, ProjectStatus.OPEN)}
                              >
                                Reopen Project
                              </Button>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="open" className="mt-6">
              <div className="space-y-6">
                {filteredProjects.filter(p => p.status === ProjectStatus.OPEN).map((project) => (
                  <Accordion type="single" collapsible key={project.id}>
                    <AccordionItem value={project.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center text-left gap-2">
                          <div>
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <p className="text-sm text-gray-500">
                              Created: {new Date(project.createdAt).toLocaleDateString()} • 
                              Applications: {project.applications.length}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {project.status}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700">Description</h4>
                            <p className="mt-1 text-gray-600">{project.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700">Requirements</h4>
                            <p className="mt-1 text-gray-600">{project.requirements}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Deadline: {new Date(project.deadline).toLocaleDateString()}
                            </div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Max Students: {project.maxStudents}
                            </div>
                            {project.minCGPA && (
                              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Min CGPA: {project.minCGPA.toFixed(1)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleStatusChange(project.id, ProjectStatus.CLOSED)}
                            >
                              Close Project
                            </Button>
                            <Link to={`/dashboard/faculty/projects/edit/${project.id}`}>
                              <Button size="sm" variant="outline">Edit Project</Button>
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}

                {filteredProjects.filter(p => p.status === ProjectStatus.OPEN).length === 0 && (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">No open projects found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-6">
              {filteredProjects
                .filter(project => project.applications.length > 0)
                .map(project => (
                <div key={project.id} className="mb-8">
                  <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                    <span>{project.title}</span>
                    <Badge 
                      className={`
                        ${project.status === ProjectStatus.OPEN ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          project.status === ProjectStatus.ASSIGNED ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                      `}
                    >
                      {project.status}
                    </Badge>
                  </h3>
                  
                  <div className="space-y-4 mt-4">
                    {project.applications.map(application => (
                      <div 
                        key={application.id} 
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{application.studentName}</p>
                              <Badge variant="outline" className="font-normal">
                                CGPA: {application.cgpa.toFixed(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Applied: {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            className={`
                              ${application.status === ApplicationStatus.PENDING ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                application.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                'bg-red-100 text-red-800 hover:bg-red-200'}
                            `}
                          >
                            {application.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-700">Student's Note:</h4>
                          <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                            {application.note || 'No additional note provided.'}
                          </p>
                        </div>
                        
                        {application.status === ApplicationStatus.PENDING && (
                          <div className="mt-4 flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApplicationUpdate(application.id, ApplicationStatus.ACCEPTED)}
                            >
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApplicationUpdate(application.id, ApplicationStatus.REJECTED)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {application.status === ApplicationStatus.ACCEPTED && (
                          <div className="mt-4">
                            <Button 
                              size="sm"
                              asChild
                            >
                              <Link to={`/dashboard/faculty/meetings/new/${application.id}`}>
                                Schedule Meeting
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredProjects.every(project => project.applications.length === 0) && (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-500">No applications found for any of your projects.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyProjects;
