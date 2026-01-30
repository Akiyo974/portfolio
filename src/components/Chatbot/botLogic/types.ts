export interface BotKnowledge {
  name: string;
  role: string;
  company: string;
  skills: string[];
  contact: {
    email: string;
    linkedin?: string;
    github?: string;
  };
  languages: string[];
  projects: Array<{
    name: string;
    description: string;
    url: string;
  }>;
  interests: string[];
  education: Array<{
    title: string;
    school: string;
    period: string;
  }>;
}

export interface Intent {
  patterns: RegExp[];
  responses: string[];
}

export interface IntentCategory {
  [key: string]: Intent;
}