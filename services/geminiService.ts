
import { GoogleGenAI, Type } from "@google/genai";
import { SentimentAnalysis, SentimentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const sentimentSchema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      description: "The primary sentiment of the text. Must be one of: POSITIVE, NEGATIVE, NEUTRAL.",
    },
    score: {
      type: Type.NUMBER,
      description: "A sentiment intensity score from 0.0 (extremely negative) to 1.0 (extremely positive). 0.5 is neutral.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A short one-sentence explanation for why this sentiment was chosen.",
    },
    keyAspects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key product aspects mentioned in the review (e.g., 'price', 'durability', 'shipping').",
    },
  },
  required: ["sentiment", "score", "reasoning", "keyAspects"],
};

export async function analyzeReviewSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment of the following e-commerce review: "${text}"`,
      config: {
        systemInstruction: "You are an expert e-commerce sentiment analyst. Provide precise classification and scoring based on the linguistic nuances of customer feedback. Ensure the 'sentiment' property is exactly 'POSITIVE', 'NEGATIVE', or 'NEUTRAL'.",
        responseMimeType: "application/json",
        responseSchema: sentimentSchema,
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    // Safety check and normalization
    return {
      sentiment: (result.sentiment?.toUpperCase() as SentimentType) || SentimentType.NEUTRAL,
      score: typeof result.score === 'number' ? result.score : 0.5,
      reasoning: result.reasoning || "No reasoning provided.",
      keyAspects: Array.isArray(result.keyAspects) ? result.keyAspects : [],
    };
  } catch (error) {
    console.error("Gemini Sentiment Analysis Error:", error);
    throw new Error("Failed to analyze sentiment. Please try again.");
  }
}
