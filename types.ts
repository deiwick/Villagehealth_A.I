
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  groundingSources?: Array<{
    title?: string;
    uri: string;
    snippet?: string;
  }>;
}

export interface HealthCenter {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  distance?: string;
  specialty?: string;
  type: 'Clinic' | 'Hospital' | 'Government Center' | 'Pharmacy' | 'Specialist';
  rating?: number;
  openNow?: boolean;
  uri?: string;
  snippet?: string;
}

export interface SOSBeaconPayload {
  beaconId: string;
  timestamp: number;
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
    altitude?: number | null;
  };
  status: 'ACQUIRING_GPS' | 'TRANSMITTING_SATELLITE' | 'BEACON_ACTIVE' | 'CONNECTED';
  emergencyType: 'GENERAL_MEDICAL' | 'CARDIAC' | 'ACCIDENT' | 'PEDIATRIC_CRITICAL';
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type BloodRequestUrgency = 'CRITICAL' | 'URGENT' | 'PLANNED';
export type BloodRequestStatus = 'OPEN' | 'FULFILLED' | 'CANCELLED';

export interface BloodRequest {
  id?: string;
  patientName: string;
  bloodType: BloodType;
  hospital: string;
  district: string;
  units: number;
  urgency: BloodRequestUrgency;
  contactPhone: string;
  status: BloodRequestStatus;
  createdAt: number;
  fulfilledBy?: string | null;
  notes?: string;
}

export interface BloodDonor {
  id?: string;
  name: string;
  bloodType: BloodType;
  district: string;
  phone: string;
  available: boolean;
  lastDonated?: number | null;
  totalDonations?: number;
  registeredAt: number;
}

export interface BloodBankStock {
  'A+': number; 'A-': number;
  'B+': number; 'B-': number;
  'O+': number; 'O-': number;
  'AB+': number; 'AB-': number;
}

export interface BloodBank {
  id?: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  type: 'Government' | 'Private' | 'NGO' | 'Hospital';
  stock: BloodBankStock;
  operatingHours?: string;
  updatedAt: number;
}

export enum AppMode {
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  LOCATOR = 'LOCATOR',
  MEDICINE = 'MEDICINE',
  SYMPTOMS = 'SYMPTOMS',
  FIRST_AID = 'FIRST_AID',
  VACCINES = 'VACCINES',
  GOVT_SCHEMES = 'GOVT_SCHEMES',
  BLOOD_BANK = 'BLOOD_BANK'
}

export type SupportedLanguage = {
  code: string;
  name: string;
  nativeName: string;
};

