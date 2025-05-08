export type ProjectStatus = "Open" | "In Progress" | "Completed" | "Cancelled";
export type TeamStatus = "Pending" | "Approved" | "Rejected";

export interface Milestone {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  weightage: number;
  team_submission?: {
    id: number;
    submitted_at: string;
    grade: number | null;
    feedback: string | null;
    documents: {
      id: number;
      filename: string;
      file_path: string;
      uploaded_at: string;
    }[];
  };
}

export interface TeamMember {
  id: number;
  student_id: number;
  student: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
}

export interface ProjectTeam {
  id: number;
  name: string;
  leader_id: number;
  is_locked: boolean;
  status: TeamStatus;
  members: TeamMember[];
}

export interface ProjectResource {
  id: number;
  filename: string;
  file_path: string;
  uploaded_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  year: string;
  tags: string[];
  status: ProjectStatus;
  professor_id: number;
  created_at: string;
  team: ProjectTeam | null;
  milestones: Milestone[];
  resources: ProjectResource[];
}
