
// @google/genai guidelines: Use direct process.env.API_KEY reference
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, Language, GroundingSource } from "../types";

// 공통 스키마 정의
const reportSchema = {
  type: Type.OBJECT,
  properties: {
    influencerName: { type: Type.STRING },
    platformName: { type: Type.STRING },
    niche: { type: Type.STRING },
    profileSummary: { type: Type.STRING },
    profileHeader: {
      type: Type.OBJECT,
      properties: {
        posts: { type: Type.STRING },
        followers: { type: Type.STRING },
        following: { type: Type.STRING },
        imageUrl: { type: Type.STRING }
      },
      required: ["posts", "followers", "following"]
    },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING },
          trend: { type: Type.STRING, enum: ['up', 'down', 'neutral'] },
          percentage: { type: Type.STRING }
        },
        required: ["label", "value", "trend"]
      }
    },
    contentPillars: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          weight: { type: Type.NUMBER },
          description: { type: Type.STRING }
        },
        required: ["topic", "weight", "description"]
      }
    },
    sentiment: {
      type: Type.OBJECT,
      properties: {
        positive: { type: Type.NUMBER },
        neutral: { type: Type.NUMBER },
        negative: { type: Type.NUMBER },
        summary: { type: Type.STRING }
      },
      required: ["positive", "neutral", "negative", "summary"]
    },
    brandAffinity: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    growthStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    },
    scalabilityGuide: { type: Type.STRING },
    score: { type: Type.NUMBER }
  },
  required: [
    "influencerName", 
    "platformName", 
    "niche", 
    "profileSummary",
    "profileHeader",
    "metrics", 
    "contentPillars",
    "sentiment",
    "brandAffinity",
    "recommendations",
    "growthStrategy",
    "scalabilityGuide",
    "score"
  ]
};

const getLanguageName = (lang: Language) => {
  switch (lang) {
    case 'ko': return 'Korean (한국어)';
    case 'ja': return 'Japanese (日本語)';
    case 'zh': return 'Chinese Simplified (简体中文)';
    case 'vi': return 'Vietnamese (Tiếng Việt)';
    case 'th': return 'Thai (ภาษาไทย)';
    case 'id': return 'Indonesian (Bahasa Indonesia)';
    default: return 'English';
  }
};

export const analyzeInfluencer = async (url: string, lang: Language = 'ko'): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const targetLanguage = getLanguageName(lang);
  
  const prompt = `Perform an ULTRA-PRECISION REAL-TIME audit of the influencer profile at: ${url}.

CORE MISSION:
Extract the EXACT visual data shown in the profile header (The "Profile Snapshot").
You MUST look for:
1. "게시물 (Posts)" count
2. "팔로워 (Followers)" count (DO NOT CONFUSE WITH FOLLOWING)
3. "팔로우 (Following)" count

STRICT DATA VERIFICATION STEPS:
1. SEARCH: Use Google Search to find the live profile page for "${url}".
2. PROFILE HEADER EXTRACTION: Look for the specific numbers displayed at the top of the profile. 
   - Instagram example: @yoongykwak has roughly 273,000 (27.3만) followers and 80 posts.
3. VERIFICATION: Compare numbers from search snippets and the platform directly.
4. METRICS: 
   - FOLLOWERS must match the 'profileHeader' followers count.
   - ENGAGEMENT RATE: Calculate using (Latest Post Likes / Followers) * 100.
   - AVG. LIKES: Check the most recent 10 posts.

REQUIRED OUTPUT STRUCTURE:
- profileHeader: { posts, followers, following, imageUrl }
- metrics: Detailed breakdown including "팔로워 수", "게시물 수", etc.

LANGUAGE: ${targetLanguage}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        systemInstruction: `You are a precision SNS auditor.
        Your primary goal is to extract the EXACT numbers currently visible on the influencer's profile page provided in the URL.
        Use googleSearch to get current data.
        If the user provides a specific URL like instagram.com/yoongykwak, you MUST find the current follower count (which is approx 27.3만 as of now).
        DO NOT hallucinate or use old data.
        In the 'profileHeader' object, provide the raw strings as seen on the UI (e.g., "27.3만", "80", "1").`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });

    const result = JSON.parse(response.text.trim()) as AnalysisReport;
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessages = {
      ko: "실시간 데이터 분석 중 오류가 발생했습니다. URL이 정확한지 확인해 주세요.",
      ja: "リアルタイム分析中にエラーが発生しました。",
      zh: "实时分析过程中出错。",
      vi: "Đã xảy ra lỗi trong quá trình phân tích.",
      th: "เกิดข้อผิดพลาดระหว่างการวิเคราะห์",
      id: "Terjadi kesalahan selama analisis.",
      en: "Error during real-time analysis."
    };
    throw new Error(errorMessages[lang] || errorMessages.en);
  }
};

export const translateReport = async (sourceReport: AnalysisReport, targetLang: Language): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const targetLanguageName = getLanguageName(targetLang);

  const prompt = `Translate the following report to ${targetLanguageName}. Keep all numbers and metrics exactly as they are. ${JSON.stringify(sourceReport)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });
    return JSON.parse(response.text.trim()) as AnalysisReport;
  } catch (error) {
    return sourceReport;
  }
};
