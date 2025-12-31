import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AnalysisResult, MarketTrend } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Core Analysis with Thinking Model
export const analyzeJobFit = async (
  experience: string,
  jd: string
): Promise<AnalysisResult> => {
  const prompt = `
    You are an expert career coach and HR strategist. 
    
    Candidate Experience:
    ${experience}

    Target Job Description (JD):
    ${jd}

    Please analyze the fit and provide a structured JSON response with **ALL CONTENT IN SIMPLIFIED CHINESE**:
    1. 'extractedSkills': 
       - Extract 'core' (technical/hard) skills and 'soft' traits from the JD.
       - **CRITICAL**: Sort both lists by **IMPORTANCE** (most critical to the role first).
       - Translate to Chinese.
    2. 'workStyle': Infer the target employee's work style and personality preferences based on the JD tone and requirements. Provide in Chinese.
    3. 'suggestions': Provide a concrete 'positioning' statement for the resume and a list of 'improvements' (actionable advice to bridge gaps). Provide in Chinese.
    4. 'greeting': Draft a professional, concise outreach message to the Hiring Manager/HR in Chinese.
       - **Tone**: Confident, succinct, respectful, NOT overly enthusiastic or bubbly.
       - **Content**: Connect the candidate's top strength directly to the JD's core need.
       - **Length**: Max 3-4 sentences. It should feel like a senior-level intro.

    Think deeply about the hidden requirements in the JD.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Thinking model
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          extractedSkills: {
            type: Type.OBJECT,
            properties: {
              core: { type: Type.ARRAY, items: { type: Type.STRING } },
              soft: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
          workStyle: { type: Type.STRING },
          suggestions: {
            type: Type.OBJECT,
            properties: {
              positioning: { type: Type.STRING },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
          greeting: { type: Type.STRING },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AnalysisResult;
};

// 2. Market Research with Search Grounding
export const getMarketTrends = async (jobTitle: string): Promise<MarketTrend[]> => {
  const prompt = `Find 3 recent market trends or interview focuses for the role of "${jobTitle}" in 2024/2025. Return a JSON array. Ensure the content is in Simplified Chinese.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
    },
  });

  // Since Search results structure can vary, we try to parse relevant chunks or text
  // However, we asked for JSON.
  const text = response.text;
  
  // Basic parsing attempt if the model returns a direct JSON array
  try {
     const parsed = JSON.parse(text || "[]");
     if(Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
            trend: item.trend || item.title || "Market Trend",
            source: item.source || "Google Search"
        }));
     }
  } catch (e) {
      // Fallback if strict JSON fails with search tools sometimes
  }

  // Fallback: extract from text if JSON parsing fails or schema wasn't perfect
  return [
    { trend: "Check the search results for the latest industry requirements.", source: "Google Search Grounding" }
  ];
};

// 3. TTS for Coaching
export const generateAudioAdvice = async (textToRead: string): Promise<AudioBuffer> => {
    // This function is kept for reference but usually handled via fetchTTSBase64 in component for AudioContext reasons
     return Promise.reject("Handled in component for AudioContext"); 
};

export const fetchTTSBase64 = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Aoede' }, 
              },
          },
        },
      });
      
      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) throw new Error("Failed to generate audio");
      return data;
}