
import { SupportedLanguage } from './types';

export const LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

export const SPECIALTIES = [
  { id: 'all', name: 'All Facilities', icon: 'Hospital' },
  { id: 'pediatrics', name: 'Pediatrics (Children)', icon: 'Baby' },
  { id: 'cardiology', name: 'Cardiology (Heart Care)', icon: 'HeartPulse' },
  { id: 'emergency', name: 'Emergency & Trauma', icon: 'Siren' },
  { id: 'general', name: 'General Physician', icon: 'Stethoscope' },
  { id: 'maternity', name: "Maternity & Women's", icon: 'UserPlus' },
  { id: 'pharmacy', name: 'Pharmacy & Meds', icon: 'Pill' },
];

export const APP_NAME = "VillageHealth AI";
export const MEDICAL_DISCLAIMER = "Disclaimer: This AI assistant is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition.";

