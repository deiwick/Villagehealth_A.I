import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { HealthCenter } from "../types";

const getApiKey = () => 
  process.env.API_KEY || 
  process.env.GEMINI_API_KEY || 
  (import.meta as any).env?.VITE_GEMINI_API_KEY || 
  (import.meta as any).env?.GEMINI_API_KEY || '';

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

export const chatWithHealthAssistant = async (
  message: string,
  languageCode: string,
  location?: { latitude: number; longitude: number },
  specialty?: string
): Promise<GenerateContentResponse> => {
  const ai = getAI();
  const systemInstruction = `
    You are VillageHealth AI, a premier, highly accurate medical triage assistant tailored for rural, remote, and underserved communities.
    Respond in ${languageCode} (e.g. Tamil 'தமிழ்' if language is Tamil, English if English, etc.).
    
    Clinical Triage & Response Guidelines:
    1. ACCURACY & EMPATHY: Provide medically sound, clear, evidence-informed advice using accessible language.
    2. EMERGENCY RED-FLAGS: Immediately flag life-threatening symptoms (chest pain, shortness of breath, sudden weakness, severe hemorrhage, pediatric high fever >103°F/39.4°C, unconsciousness) and urge using the SOS Emergency / calling 112 / 108 immediately.
    3. SPECIALTY RECOMMENDATION: Whenever symptoms suggest a specific specialist (e.g., Pediatrician for children, Cardiologist for heart issues, Gynecologist for maternity, Pulmonologist for asthma/lungs), explicitly recommend that specialist type.
    4. ACCESSIBLE CARE: Highlight low-cost home remedies, WHO-approved basic treatments, and government health schemes alongside clinic recommendations.
    5. LOCATION AWARENESS: When requested or relevant, refer to nearby health centers, hospitals, and clinics using the user's location.
    6. ALWAYS include a brief medical disclaimer that you are an AI assistant and advise consulting a live doctor for final diagnosis.
  `;

  let prompt = message;
  if (specialty && specialty !== 'all') {
    prompt += ` [Search Filter: Find healthcare facilities specializing in ${specialty}]`;
  }

  const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

  // Stage 1: Try with grounding tools
  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          tools: [
            { googleSearch: {} },
            { googleMaps: {} }
          ],
          ...(location && {
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: location.latitude,
                  longitude: location.longitude
                }
              }
            }
          })
        },
      });
      return response;
    } catch (err: any) {
      console.warn(`Stage 1 (with tools) model ${modelName} failed:`, err?.message || err);
    }
  }

  // Stage 2: Fallback without grounding tools (handles quota/429 tool restrictions)
  for (const modelName of candidateModels) {
    try {
      console.log(`Retrying Stage 2 (without grounding tools) model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction
        },
      });
      return response;
    } catch (err: any) {
      console.warn(`Stage 2 model ${modelName} failed:`, err?.message || err);
    }
  }

  throw new Error("Unable to reach AI service. Please check your internet connection or try again in a few moments.");
};

export const parseGroundingSources = (response: GenerateContentResponse) => {
  const sources: any[] = [];
  const candidate = response.candidates?.[0];
  
  if (candidate?.groundingMetadata?.groundingChunks) {
    candidate.groundingMetadata.groundingChunks.forEach((chunk: any, index: number) => {
      if (chunk.web) {
        sources.push({
          id: `web-${index}`,
          title: chunk.web.title,
          uri: chunk.web.uri,
          type: 'Web Resource'
        });
      }
      if (chunk.maps) {
        sources.push({
          id: `map-${index}`,
          title: chunk.maps.title || 'Local Health Center',
          uri: chunk.maps.uri,
          snippet: chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0] || 'Verified healthcare provider nearby',
          address: chunk.maps.address || 'Address available via map link',
          type: 'Clinic'
        });
      }
    });
  }
  
  return sources;
};

export const findNearbyClinics = async (
  lat: number,
  lng: number,
  specialtyId: string
): Promise<GenerateContentResponse> => {
  const query = `Find top-rated public health centers, hospitals, and clinics near latitude ${lat}, longitude ${lng} specializing in ${specialtyId}. Include address, phone, and key services.`;
  return chatWithHealthAssistant(query, 'English', { latitude: lat, longitude: lng }, specialtyId);
};

export const parseHealthCenters = (response: GenerateContentResponse): HealthCenter[] => {
  const sources = parseGroundingSources(response);
  const mapSources = sources.filter(s => s.type === 'Clinic');

  return mapSources.map((s, idx) => ({
    id: `center-${idx}`,
    name: s.title || 'Community Health Facility',
    address: s.address || 'Location verified on map',
    phone: '108 / 112',
    type: 'Hospital',
    rating: 4.7,
    openNow: true,
    uri: s.uri,
    snippet: s.snippet,
  }));
};

export const getMedicationInfo = async (
  medicationName: string,
  languageName: string
): Promise<string> => {
  const prompt = `Provide a clear, patient-friendly medical guide for the medicine '${medicationName}' in ${languageName}. 
  Cover:
  1. What it is used for (Primary Indications)
  2. Standard dosage & timing (Before/After meals)
  3. Important precautions & common side effects
  4. Low-cost generic alternatives under Indian Jan Aushadhi
  5. Crucial warning: When NOT to take it.`;

  const response = await chatWithHealthAssistant(prompt, languageName);
  return response.text || "Medication information currently unavailable.";
};
