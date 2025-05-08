
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { createMeeting, getApplicationById, getProjectById } from '@/lib/db';
import { MeetingStatus, Application, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

const NewMeeting = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [application, setApplication] = useState<Application | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  
  useEffect(() => {
    const loadData = () => {
      if (applicationId) {
        const applicationData = getApplicationById(applicationId);
        
        if (applicationData) {
          setApplication(applicationData);
          
          // Get the project details
          const projectData = getProjectById(applicationData.projectId);
          if (projectData) {
            setProject(projectData);
            setTitle(`Meeting for ${projectData.title}`);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [applicationId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !application || !project) return;
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time for scheduledAt field
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      
      createMeeting({
        projectId: project.id,
        facultyId: user.id,
        studentId: application.studentId,
        scheduledAt,
        status: MeetingStatus.SCHEDULED,
        title,
        description,
        location: location || undefined,
        meetingLink: meetingLink || undefined
      });
      
      toast({
        title: "Meeting Scheduled",
        description: "The meeting has been scheduled successfully."
      });
      
      navigate('/dashboard/faculty/meetings');
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Scheduling Failed",
        description: "Failed to schedule the meeting.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout title="Schedule Meeting">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-university-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!application || !project) {
    return (
      <DashboardLayout title="Schedule Meeting">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Application Not Found</CardTitle>
            <CardDescription>The specified application could not be found.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/dashboard/faculty/projects')}>Back to Projects</Button>
          </CardFooter>
        </Card>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Schedule Meeting">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Schedule a Meeting</CardTitle>
          <CardDescription>
            Schedule a meeting with {application.studentName} for the project "{project.title}"
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project Discussion"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Time</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Meeting agenda and details..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Room 101, Building A"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
              <Input
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/123456789"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold text-blue-800">Student Information</h3>
              <p className="text-blue-700">Name: {application.studentName}</p>
              <p className="text-blue-700">CGPA: {application.cgpa}</p>
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
              {isSubmitting ? 'Scheduling Meeting...' : 'Schedule Meeting'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default NewMeeting;
