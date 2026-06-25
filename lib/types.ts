export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[]; // Bullet points
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string; // e.g. GPA, Honors, coursework
}

export interface Project {
  id: string;
  name: string;
  technologies: string; // e.g. "React, Node.js, Python"
  link: string;
  description: string[]; // Bullet points
}

export interface SkillCategory {
  id: string;
  category: string; // e.g. "Languages", "Tools"
  skills: string; // e.g. "JavaScript, TypeScript, Python"
}

export interface ResumeState {
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
}

export interface AppSettings {
  githubToken: string;
  linkedinApiKey: string;
  aiApiKey: string;
  aiProvider: 'openai' | 'gemini';
}

export interface ResumeVersion {
  id: string;
  name: string;
  data: ResumeState;
  createdAt: number;
  updatedAt: number;
}


