
export type QuizData = Omit<QuizTerm, 'correctCount' | 'isMastered'>;

export interface QuizTerm {
  id: string;
  era: string;
  term: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  correctCount: number;
  isMastered: boolean;
}

export interface QuizStats {
  totalAnswers: number;
  correctAnswers: number;
  timeTaken: number;
  mistakes: number;
  completionDate: string;
}

export enum AppState {
  ERA_SELECTION,
  MEMORIZATION,
  QUIZ,
  RESULTS,
  HISTORY,
}

export interface QuizHistoryEntry {
  id: string;
  era: string;
  stats: QuizStats;
  date: number; // Timestamp
}

// Maps an era name to its mastery data
export type AllErasMastery = {
  [era: string]: EraMastery;
};

// Represents the mastery progress for a single era
export interface EraMastery {
  masteredIds: string[]; // List of mastered term IDs
  totalTerms: number;    // Total number of terms available for the era
}