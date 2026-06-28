export interface Sermon {
  id: string;
  user_id: string;
  title: string;
  source_type: "audio" | "video" | "youtube";
  source_url?: string;
  file_path?: string;
  transcript?: string;
  summary: string;
  main_points: string[];
  key_takeaways: string[];
  action_steps: string[];
  bible_verses: BibleVerse[];
  created_at: string;
  is_public: boolean;
  thumbnail_url?: string;
}

export interface BibleVerse {
  reference: string;
  text: string;
  context: string;
}

export interface DailyDevotion {
  id: string;
  sermon_id: string;
  day: number;
  theme: string;
  reflection: string;
  challenge: string;
  verse: BibleVerse;
  prayer_focus: string;
}

export interface QuizQuestion {
  id: string;
  sermon_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface QuizResult {
  sermon_id: string;
  user_id: string;
  score: number;
  total: number;
  completed_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface SermonProcessingResult {
  title: string;
  summary: string;
  main_points: string[];
  key_takeaways: string[];
  action_steps: string[];
  bible_verses: BibleVerse[];
  devotions: DailyDevotion[];
  quiz: QuizQuestion[];
}
