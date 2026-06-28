export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  friends: string[];
  createdAt: string;
}

export interface BibleVerse {
  reference: string;
  text: string;
  context: string;
}

export interface MainPoint {
  title: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DailyDevotion {
  day: number;
  title: string;
  reflection: string;
  challenge: string;
  verse: BibleVerse;
  prayer: string;
}

export interface SermonAnalysis {
  title: string;
  summary: string;
  mainPoints: MainPoint[];
  keyTakeaways: string[];
  actionSteps: string[];
  bibleVerses: BibleVerse[];
  prayerFocus: string[];
  quizQuestions: QuizQuestion[];
  dailyDevotions: DailyDevotion[];
  tags: string[];
}

export interface Sermon {
  id: string;
  userId: string;
  userName: string;
  source: "youtube" | "audio" | "video";
  sourceUrl?: string;
  fileName?: string;
  thumbnailUrl?: string;
  rawTranscript?: string;
  analysis: SermonAnalysis;
  isPublic: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingStatus {
  stage:
    | "uploading"
    | "transcribing"
    | "analyzing"
    | "generating_devotions"
    | "generating_quiz"
    | "complete"
    | "error";
  progress: number;
  message: string;
}
