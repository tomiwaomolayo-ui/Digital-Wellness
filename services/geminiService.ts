
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMentalHealth = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following mental health description and symptoms: "${description}". Provide a classification and recommendations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: { type: Type.STRING },
          classification: { type: Type.STRING },
          moodAnalysis: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["diagnosis", "classification", "moodAnalysis", "recommendations"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeHealthMetrics = async (metrics: any[]) => {
  const ai = getAI();
  const prompt = `Analyze the following health metrics recorded from wearable devices and manual logs: ${JSON.stringify(metrics)}. 
  Provide a holistic health summary, identify patterns (e.g. impact of sleep on activity levels), and give 3 actionable wellness tips.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "patterns", "tips"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const searchNearbyWellness = async (query: string, location: { latitude: number, longitude: number }) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find ${query} nearby for wellness support.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: { latLng: { latitude: location.latitude, longitude: location.longitude } }
      }
    }
  });
  return { text: response.text, groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
};

export const suggestAdminResources = async (category: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 3 ready-made high-quality learning resources (articles) for the wellness category: "${category}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["title", "content", "author"]
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const practitionerResearch = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a clinical research assistant. Find therapeutic tools, clinical advice, and latest research for: "${query}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tools: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING },
          references: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["tools", "advice", "references"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeDiet = async (foodDescription: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these foods: "${foodDescription}". Classify them and determine if the diet is balanced.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isHealthy: { type: Type.BOOLEAN },
          classification: {
            type: Type.OBJECT,
            properties: {
              proteins: { type: Type.ARRAY, items: { type: Type.STRING } },
              carbohydrates: { type: Type.ARRAY, items: { type: Type.STRING } },
              others: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
          feedback: { type: Type.STRING }
        },
        required: ["isHealthy", "classification", "alternatives", "feedback"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeWeightGoals = async (currentWeight: number, targetWeight: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `User current weight: ${currentWeight}kg, Target weight: ${targetWeight}kg. Provide strategy and importance.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.ARRAY, items: { type: Type.STRING } },
          importance: { type: Type.STRING },
          healthImpact: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["strategy", "importance", "healthImpact"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeGuidance = async (struggles: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze struggles: "${struggles}". Identify strengths, growth areas, and 3 goals.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          goals: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: { title: { type: Type.STRING }, action: { type: Type.STRING } },
              required: ["title", "action"]
            } 
          }
        },
        required: ["strengths", "weaknesses", "goals"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeHolisticHealth = async (data: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze holistic wellness data: ${JSON.stringify(data)}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          connections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["title", "description", "impact"]
            }
          },
          actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "connections", "actionItems"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};
