
export enum Platform {
  INSTAGRAM = '인스타그램',
  YOUTUBE = '유튜브',
  BLOG = '블로그/네이버',
  TIKTOK = '틱톡'
}

export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'vi';

export interface InfluencerMetric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  percentage?: string;
}

export interface ContentPillar {
  topic: string;
  weight: number;
  description: string;
}

export interface GrowthStep {
  title: string;
  description: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisReport {
  influencerName: string;
  platformName: string;
  niche: string;
  profileSummary: string;
  metrics: InfluencerMetric[];
  contentPillars: ContentPillar[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    summary: string;
  };
  brandAffinity: string[];
  recommendations: string[];
  growthStrategy: GrowthStep[];
  scalabilityGuide: string;
  score: number;
  sources?: GroundingSource[];
}
