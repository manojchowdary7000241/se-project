
export enum UserRole {
  STUDENT = 'student',
  FACULTY = 'faculty',
}

export enum ProjectStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  CLOSED = 'closed',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  cgpa?: number; // Added CGPA field for students
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requirements: string;
  facultyId: string;
  facultyName: string;
  status: ProjectStatus;
  createdAt: string;
  deadline: string;
  maxStudents: number; // This will now have a maximum of 7
  minCGPA?: number; // Added minimum CGPA requirement
}

export interface Application {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  status: ApplicationStatus;
  createdAt: string;
  note: string;
  cgpa: number; // Added student's CGPA
}

export interface Meeting {
  id: string;
  projectId: string;
  facultyId: string;
  studentId: string;
  scheduledAt: string;
  status: MeetingStatus;
  title: string;
  description: string;
  location?: string;
  meetingLink?: string;
}
