
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getMeetingsByStudentId, getProjectById, updateMeeting } from '@/lib/db';
import { Meeting, MeetingStatus, Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type MeetingWithProject = Meeting & {
  project?: Project;
};

const StudentMeetings = () => {
  const [meetings, setMeetings] = useState<MeetingWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchMeetings = () => {
      if (user) {
        // Fetch all meetings for this student
        const studentMeetings = getMeetingsByStudentId(user.id);
        
        // Fetch project details for each meeting
        const meetingsWithProjects = studentMeetings.map(meeting => {
          const project = getProjectById(meeting.projectId);
          return { ...meeting, project };
        });
        
        setMeetings(meetingsWithProjects);
      }
      setIsLoading(false);
    };
    
    fetchMeetings();
  }, [user]);
  
  const handleStatusChange = (meetingId: string, newStatus: MeetingStatus) => {
    try {
      const updatedMeeting = updateMeeting(meetingId, { status: newStatus });
      
      if (updatedMeeting) {
        // Update the meetings list
        setMeetings(meetings.map(meeting => 
          meeting.id === meetingId ? { ...meeting, status: newStatus } : meeting
        ));
        
        toast({
          title: "Meeting Updated",
          description: `Meeting status changed to ${newStatus}.`,
        });
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update meeting status.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadgeColor = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case MeetingStatus.COMPLETED:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case MeetingStatus.CANCELLED:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout title="My Meetings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-university-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="My Meetings">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Scheduled Meetings</h2>
        
        {meetings.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">You don't have any scheduled meetings yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Faculty members will schedule meetings with you after reviewing your applications.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{meeting.title}</CardTitle>
                      <CardDescription>
                        {meeting.project?.title || 'Project Discussion'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusBadgeColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Date & Time:</span> {new Date(meeting.scheduledAt).toLocaleString()}
                  </p>
                  
                  {meeting.location && (
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {meeting.location}
                    </p>
                  )}
                  
                  {meeting.meetingLink && (
                    <p className="text-sm">
                      <span className="font-medium">Meeting Link:</span>{' '}
                      <a href={meeting.meetingLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a>
                    </p>
                  )}
                  
                  <p className="text-sm">
                    <span className="font-medium">Faculty:</span> {meeting.project?.facultyName || 'Unknown Faculty'}
                  </p>
                  
                  {meeting.description && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Description:</p>
                      <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {meeting.status === MeetingStatus.SCHEDULED && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(meeting.id, MeetingStatus.CANCELLED)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(meeting.id, MeetingStatus.COMPLETED)}
                      >
                        Mark as Completed
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentMeetings;
