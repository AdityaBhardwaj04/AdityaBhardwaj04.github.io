export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  description: string;
  category: 'core' | 'tool' | 'language';
  details: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  tags: string[];
  architecture: string[];
  repository?: string;
  highlights?: {
    title: string;
    description: string;
  }[];
  demoScenario?: {
    title: string;
    prompt: string;
    inputs: string[];
    correctInput: string;
    successOutput: string;
  };
}

export interface CtfChallenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description: string;
  hint: string;
  solved: boolean;
  type: 'sqli' | 'crypto' | 'reverse' | 'cookie';
  flag: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  idCode: string;
  badgeUrl: string;
  description: string;
  skillsVerified: string[];
}

export interface CtfWriteup {
  id: string;
  title: string;
  platform: string;
  machine?: string;
  summary: string;
  topics: string[];
  url: string;
}

export interface PlatformActivity {
  id: string;
  platform: string;
  username: string;
  stats: string;
  profileUrl: string;
  machines?: string[];
}
