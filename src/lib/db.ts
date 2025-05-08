
import { ApplicationStatus, MeetingStatus, Project, ProjectStatus, User, UserRole, Application, Meeting } from "@/types";

// Mock data for projects
const projects: Project[] = [
  {
    id: "1",
    title: "AI-Based Image Recognition System",
    description: "Design and implement an AI system for image recognition using deep learning techniques.",
    requirements: "Knowledge of Python, TensorFlow/PyTorch, and basic understanding of CNN architectures.",
    facultyId: "faculty1",
    facultyName: "Dr. Sarah Johnson",
    status: ProjectStatus.OPEN,
    createdAt: new Date().toISOString(),
    deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    maxStudents: 5,
    minCGPA: 7.0
  },
  {
    id: "2",
    title: "Blockchain-based Voting System",
    description: "Develop a secure voting system using blockchain technology to ensure transparency and security.",
    requirements: "Understanding of blockchain concepts, smart contracts, and web development.",
    facultyId: "faculty1",
    facultyName: "Dr. Sarah Johnson",
    status: ProjectStatus.OPEN,
    createdAt: new Date().toISOString(),
    deadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    maxStudents: 7,
    minCGPA: 7.5
  },
  {
    id: "3",
    title: "Smart Home Automation System",
    description: "Create an IoT-based smart home system that can control various home appliances and monitor energy usage.",
    requirements: "Experience with IoT platforms, embedded systems, and mobile app development.",
    facultyId: "faculty2",
    facultyName: "Prof. Michael Chen",
    status: ProjectStatus.OPEN,
    createdAt: new Date().toISOString(),
    deadline: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    maxStudents: 6,
    minCGPA: 8.0
  },
];

// Mock data for users
const users: User[] = [
  {
    id: "student1",
    name: "Alex Taylor",
    email: "alex@university.edu",
    role: UserRole.STUDENT,
    createdAt: new Date().toISOString(),
    cgpa: 8.5
  },
  {
    id: "faculty1",
    name: "Dr. Sarah Johnson",
    email: "sarah@university.edu",
    role: UserRole.FACULTY,
    createdAt: new Date().toISOString()
  },
  {
    id: "faculty2",
    name: "Prof. Michael Chen",
    email: "michael@university.edu",
    role: UserRole.FACULTY,
    createdAt: new Date().toISOString()
  }
];

// Mock data for applications
const applications: Application[] = [
  {
    id: "app1",
    projectId: "1",
    studentId: "student1",
    studentName: "Alex Taylor",
    status: ApplicationStatus.PENDING,
    createdAt: new Date().toISOString(),
    note: "I'm very interested in AI and have completed several projects using TensorFlow.",
    cgpa: 8.5
  }
];

// Mock data for meetings
const meetings: Meeting[] = [];

// LocalStorage keys
const USERS_KEY = "university_project_users";
const PROJECTS_KEY = "university_project_projects";
const APPLICATIONS_KEY = "university_project_applications";
const MEETINGS_KEY = "university_project_meetings";
const CURRENT_USER_KEY = "university_project_current_user";

// Initialize database
export const initializeDatabase = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  
  if (!localStorage.getItem(PROJECTS_KEY)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }
  
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }
  
  if (!localStorage.getItem(MEETINGS_KEY)) {
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
  }
};

// User functions
export const getAllUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getAllUsers();
  return users.find(user => user.email === email);
};

export const createUser = (user: Omit<User, "id" | "createdAt">): User => {
  const users = getAllUsers();
  const newUser: User = {
    ...user,
    id: `user${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return updatedUser;
  }
  
  return undefined;
};

// Project functions
export const getAllProjects = (): Project[] => {
  const data = localStorage.getItem(PROJECTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getAllProjects();
  return projects.find(project => project.id === id);
};

export const getProjectsByFacultyId = (facultyId: string): Project[] => {
  const projects = getAllProjects();
  return projects.filter(project => project.facultyId === facultyId);
};

export const createProject = (project: Omit<Project, "id" | "createdAt">): Project => {
  const projects = getAllProjects();
  const newProject: Project = {
    ...project,
    id: `project${Date.now()}`,
    createdAt: new Date().toISOString(),
    maxStudents: Math.min(project.maxStudents, 7) // Ensure max team size is 7
  };
  localStorage.setItem(PROJECTS_KEY, JSON.stringify([...projects, newProject]));
  return newProject;
};

export const updateProject = (id: string, updates: Partial<Project>): Project | undefined => {
  const projects = getAllProjects();
  const index = projects.findIndex(project => project.id === id);
  
  if (index !== -1) {
    // If maxStudents is being updated, ensure it doesn't exceed 7
    if (updates.maxStudents) {
      updates.maxStudents = Math.min(updates.maxStudents, 7);
    }
    
    const updatedProject = { ...projects[index], ...updates };
    projects[index] = updatedProject;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return updatedProject;
  }
  
  return undefined;
};

// Application functions
export const getAllApplications = (): Application[] => {
  const data = localStorage.getItem(APPLICATIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getApplicationById = (id: string): Application | undefined => {
  const applications = getAllApplications();
  return applications.find(application => application.id === id);
};

export const getApplicationsByProjectId = (projectId: string): Application[] => {
  const applications = getAllApplications();
  return applications.filter(application => application.projectId === projectId);
};

export const getApplicationsByStudentId = (studentId: string): Application[] => {
  const applications = getAllApplications();
  return applications.filter(application => application.studentId === studentId);
};

export const createApplication = (application: Omit<Application, "id" | "createdAt">): Application | null => {
  const applications = getAllApplications();
  const project = getProjectById(application.projectId);
  const user = getUserById(application.studentId);
  
  // Check if project exists and has minimum CGPA requirement
  if (!project || !user) {
    return null;
  }
  
  // Check if the student meets the minimum CGPA requirement
  if (project.minCGPA && user.cgpa && user.cgpa < project.minCGPA) {
    return null;
  }
  
  // Check if the project already has maximum number of accepted applications
  const acceptedApplications = getApplicationsByProjectId(application.projectId)
    .filter(app => app.status === ApplicationStatus.ACCEPTED);
    
  if (acceptedApplications.length >= project.maxStudents) {
    return null;
  }
  
  const newApplication: Application = {
    ...application,
    id: `application${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([...applications, newApplication]));
  return newApplication;
};

export const updateApplication = (id: string, updates: Partial<Application>): Application | undefined => {
  const applications = getAllApplications();
  const index = applications.findIndex(application => application.id === id);
  
  if (index !== -1) {
    const updatedApplication = { ...applications[index], ...updates };
    applications[index] = updatedApplication;
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    
    // If application is being accepted, check if project exceeds max students
    if (updates.status === ApplicationStatus.ACCEPTED) {
      const application = applications[index];
      const project = getProjectById(application.projectId);
      
      if (project) {
        const acceptedCount = getApplicationsByProjectId(project.id)
          .filter(app => app.status === ApplicationStatus.ACCEPTED)
          .length;
        
        if (acceptedCount >= project.maxStudents) {
          // Update project status to ASSIGNED if max students reached
          updateProject(project.id, { status: ProjectStatus.ASSIGNED });
        }
      }
    }
    
    return updatedApplication;
  }
  
  return undefined;
};

// Meeting functions
export const getAllMeetings = (): Meeting[] => {
  const data = localStorage.getItem(MEETINGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getMeetingById = (id: string): Meeting | undefined => {
  const meetings = getAllMeetings();
  return meetings.find(meeting => meeting.id === id);
};

export const getMeetingsByProjectId = (projectId: string): Meeting[] => {
  const meetings = getAllMeetings();
  return meetings.filter(meeting => meeting.projectId === projectId);
};

export const getMeetingsByFacultyId = (facultyId: string): Meeting[] => {
  const meetings = getAllMeetings();
  return meetings.filter(meeting => meeting.facultyId === facultyId);
};

export const getMeetingsByStudentId = (studentId: string): Meeting[] => {
  const meetings = getAllMeetings();
  return meetings.filter(meeting => meeting.studentId === studentId);
};

export const createMeeting = (meeting: Omit<Meeting, "id">): Meeting => {
  const meetings = getAllMeetings();
  const newMeeting: Meeting = {
    ...meeting,
    id: `meeting${Date.now()}`
  };
  localStorage.setItem(MEETINGS_KEY, JSON.stringify([...meetings, newMeeting]));
  return newMeeting;
};

export const updateMeeting = (id: string, updates: Partial<Meeting>): Meeting | undefined => {
  const meetings = getAllMeetings();
  const index = meetings.findIndex(meeting => meeting.id === id);
  
  if (index !== -1) {
    const updatedMeeting = { ...meetings[index], ...updates };
    meetings[index] = updatedMeeting;
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
    return updatedMeeting;
  }
  
  return undefined;
};

// Authentication functions
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const login = (email: string, password: string): User | null => {
  // In a real app, you'd hash passwords and do proper auth
  // For this demo, we're just checking if the user exists
  const user = getUserByEmail(email);
  
  if (user) {
    setCurrentUser(user);
    return user;
  }
  
  return null;
};

export const logout = () => {
  setCurrentUser(null);
};

export const register = (name: string, email: string, password: string, role: UserRole, cgpa?: number): User | null => {
  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return null;
  }
  
  // Create new user
  const newUser = createUser({ name, email, role, cgpa });
  setCurrentUser(newUser);
  return newUser;
};
