
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createProject } from '@/lib/db';
import { ProjectStatus } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxStudents, setMaxStudents] = useState(2);
  const [minCGPA, setMinCGPA] = useState<number>(7.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Format deadline to ISO string
      const deadlineDate = deadline ? new Date(deadline).toISOString() : '';
      
      // Ensure maxStudents doesn't exceed 7
      const teamSize = Math.min(maxStudents, 7);
      
      const newProject = createProject({
        title,
        description,
        requirements,
        facultyId: user.id,
        facultyName: user.name,
        status: ProjectStatus.OPEN,
        deadline: deadlineDate,
        maxStudents: teamSize,
        minCGPA
      });
      
      toast({
        title: "Project Created",
        description: "Your project has been created successfully."
      });
      
      navigate('/dashboard/faculty/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create the project.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout title="Create New Project">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Project</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your project"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project in detail..."
                className="min-h-[150px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="List the skills, knowledge, or experience required..."
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Maximum Team Size</Label>
                <div className="flex items-center">
                  <Input
                    id="maxStudents"
                    type="number"
                    min={1}
                    max={7}
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(parseInt(e.target.value))}
                    required
                  />
                  {maxStudents > 7 && (
                    <p className="text-xs text-red-500 ml-2">
                      Maximum team size is 7
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minCGPA">Minimum CGPA Required</Label>
                <Input
                  id="minCGPA"
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={minCGPA}
                  onChange={(e) => setMinCGPA(parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/faculty/projects')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default NewProject;
