
import { format } from "date-fns";

// Enhanced mock data for student assignments
export const mockAssignments = [
  {
    id: 1,
    title: "Assignment 1: Introduction to Variables",
    course: "CS101: Programming Fundamentals",
    department: "Computer Science",
    dueDate: new Date("2023-10-25T23:59:59"),
    maxGrade: 100,
    status: "Submitted" as const,
    submittedOn: new Date("2023-10-20T14:30:00"),
    grade: null, // Not graded yet
    files: ["assignment1_instructions.pdf"],
    hasUnreadNotifications: true,
    notificationCount: 1
  },
  {
    id: 2,
    title: "Assignment 2: Control Flow",
    course: "CS101: Programming Fundamentals",
    department: "Computer Science",
    dueDate: new Date("2023-11-05T23:59:59"),
    maxGrade: 100,
    status: "Pending" as const,
    submittedOn: null,
    grade: null,
    files: ["assignment2_instructions.pdf", "starter_code.zip"],
    hasUnreadNotifications: false, 
    notificationCount: 0
  },
  {
    id: 3,
    title: "Midterm Project Proposal",
    course: "CS201: Data Structures",
    department: "Computer Science",
    dueDate: new Date("2023-10-15T23:59:59"),
    maxGrade: 50,
    status: "Graded" as const,
    submittedOn: new Date("2023-10-14T18:45:00"),
    grade: 47,
    feedback: "Excellent proposal with well-defined objectives and methodology.",
    files: ["project_proposal_guidelines.pdf"],
    hasUnreadNotifications: true,
    notificationCount: 2
  },
  {
    id: 4,
    title: "Assignment 3: Functions and Modules",
    course: "CS101: Programming Fundamentals",
    department: "Computer Science",
    dueDate: new Date("2023-11-15T23:59:59"),
    maxGrade: 100,
    status: "Pending" as const,
    submittedOn: null,
    grade: null,
    files: ["assignment3_instructions.pdf"],
    hasUnreadNotifications: false,
    notificationCount: 0
  },
  {
    id: 5,
    title: "Lab Report: Circuit Design",
    course: "EE202: Electronics",
    department: "Electrical Engineering",
    dueDate: new Date("2023-10-10T23:59:59"),
    maxGrade: 50,
    status: "Graded" as const,
    submittedOn: new Date("2023-10-09T21:15:00"),
    grade: 42,
    feedback: "Good work overall. Some improvements needed in the analysis section.",
    files: ["lab_report_template.docx"],
    hasUnreadNotifications: false,
    notificationCount: 0
  }
];
