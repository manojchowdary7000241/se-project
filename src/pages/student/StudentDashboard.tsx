
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Project, ProjectStatus, Application, ApplicationStatus } from '@/types';
import { getAllProjects, getApplicationsByStudentId, createApplication, getAllApplications } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const StudentDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [applicationNote, setApplicationNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  // Load projects and student's applications
  useEffect(() => {
    const loadProjects = async () => {
      const allProjects = getAllProjects();
      setProjects(allProjects);
      
      if (user) {
        const studentApplications = getApplicationsByStudentId(user.id);
        setApplications(studentApplications);
      }
    };
    
    loadProjects();
  }, [user]);
  
  // Function to handle project application
  const handleApply = async () => {
    if (!selectedProject || !user) return;
    
    try {
      // Check if already applied to this project
      const existingApplication = applications.find(app => app.projectId === selectedProject.id);
      
      if (existingApplication) {
        toast({
          title: "Already Applied",
          description: "You have already applied for this project.",
          variant: "destructive"
        });
        return;
      }
      
      // Create the application with CGPA included
      const newApplication = createApplication({
        projectId: selectedProject.id,
        studentId: user.id,
        studentName: user.name,
        status: ApplicationStatus.PENDING,
        note: applicationNote,
        cgpa: user.cgpa || 0 // Include the student's CGPA, default to 0 if not available
      });
      
      if (newApplication) {
        // Update local state
        setApplications([...applications, newApplication]);
        
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully."
        });
        
        // Reset form
        setApplicationNote('');
        setSelectedProject(null);
      } else {
        toast({
          title: "Application Failed",
          description: "You may not meet the minimum CGPA requirement for this project.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Application error:', error);
      toast({
        title: "Application Failed",
        description: "An error occurred while submitting your application.",
        variant: "destructive"
      });
    }
  };
  
  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.facultyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Check if user has already applied to a project
  const hasApplied = (projectId: string) => {
    return applications.some(app => app.projectId === projectId);
  };

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="whitespace-nowrap">Filter by Status:</Label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Projects</option>
              <option value={ProjectStatus.OPEN}>Open</option>
              <option value={ProjectStatus.ASSIGNED}>Assigned</option>
              <option value={ProjectStatus.CLOSED}>Closed</option>
            </select>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold">Available Projects</h2>
        
        {filteredProjects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No projects match your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
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
                
                <p className="text-sm text-gray-600 mb-2">Faculty: {project.facultyName}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                
                {project.minCGPA && (
                  <p className="text-xs text-amber-700 mb-2">Minimum CGPA: {project.minCGPA}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                    
                    {project.status === ProjectStatus.OPEN ? (
                      hasApplied(project.id) ? (
                        <Badge variant="secondary">Applied</Badge>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedProject(project)}
                            >
                              Apply
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Apply for Project</DialogTitle>
                              <DialogDescription>
                                Submit your application for "{project.title}"
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="application-note">Why are you interested in this project?</Label>
                                <Textarea
                                  id="application-note"
                                  value={applicationNote}
                                  onChange={(e) => setApplicationNote(e.target.value)}
                                  placeholder="Describe your interest, relevant skills and experience..."
                                  className="min-h-[100px]"
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={handleApply}>Submit Application</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        {project.status === ProjectStatus.ASSIGNED ? 'Assigned' : 'Closed'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
