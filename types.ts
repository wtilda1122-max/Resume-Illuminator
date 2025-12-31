export interface AnalysisResult {
  extractedSkills: {
    core: string[];
    soft: string[];
  };
  workStyle: string;
  suggestions: {
    positioning: string;
    improvements: string[];
  };
  greeting: string; // New field for HR outreach message
}

export interface MarketTrend {
  trend: string;
  source: string;
}

export interface UserInput {
  experience: string;
  jobDescription: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  SEARCHING = 'SEARCHING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}