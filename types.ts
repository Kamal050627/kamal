
export enum SentimentType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface SentimentAnalysis {
  sentiment: SentimentType;
  score: number; // 0 to 1
  reasoning: string;
  keyAspects: string[];
}

export interface ReviewEntry {
  id: string;
  text: string;
  timestamp: number;
  analysis?: SentimentAnalysis;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  error?: string;
}

export interface SentimentStats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  averageScore: number;
}
