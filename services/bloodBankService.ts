import { ref, onValue, push, set, update, get, off } from 'firebase/database';
import { db, isFirebaseConfigured } from './firebaseConfig';
import { BloodType, BloodRequest, BloodDonor, BloodBank, BloodBankStock } from '../types';

export { isFirebaseConfigured };

// ─────────────────────────────────────────────
// DEMO DATA (used for initial seed & fallback)
// ─────────────────────────────────────────────

const DEMO_BLOOD_BANKS: BloodBank[] = [
  {
    id: 'bank-1',
    name: 'Government Rajiv Gandhi General Hospital Blood Bank',
    address: 'Park Town, Chennai - 600003',
    district: 'Chennai',
    phone: '044-25305000',
    type: 'Government',
    operatingHours: '24/7',
    stock: { 'A+': 12, 'A-': 3, 'B+': 8, 'B-': 1, 'O+': 18, 'O-': 2, 'AB+': 5, 'AB-': 0 },
    updatedAt: Date.now() - 1800000,
  },
  {
    id: 'bank-2',
    name: 'KMCH Blood Bank & Transfusion Services',
    address: 'Avinashi Road, Coimbatore - 641014',
    district: 'Coimbatore',
    phone: '0422-4323800',
    type: 'Hospital',
    operatingHours: '8AM–8PM',
    stock: { 'A+': 6, 'A-': 0, 'B+': 14, 'B-': 2, 'O+': 9, 'O-': 3, 'AB+': 2, 'AB-': 1 },
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'bank-3',
    name: 'Madurai Government Medical College Blood Centre',
    address: 'Panagal Road, Madurai - 625020',
    district: 'Madurai',
    phone: '0452-2532535',
    type: 'Government',
    operatingHours: '24/7',
    stock: { 'A+': 4, 'A-': 2, 'B+': 7, 'B-': 0, 'O+': 11, 'O-': 1, 'AB+': 3, 'AB-': 0 },
    updatedAt: Date.now() - 900000,
  },
  {
    id: 'bank-4',
    name: 'Sri Ramachandra Blood Bank',
    address: 'Porur, Chennai - 600116',
    district: 'Chennai',
    phone: '044-45928500',
    type: 'Hospital',
    operatingHours: '24/7',
    stock: { 'A+': 9, 'A-': 1, 'B+': 5, 'B-': 1, 'O+': 15, 'O-': 4, 'AB+': 6, 'AB-': 2 },
    updatedAt: Date.now() - 600000,
  },
  {
    id: 'bank-5',
    name: 'Tirunelveli Medical College Blood Bank',
    address: 'High Ground Road, Tirunelveli - 627011',
    district: 'Tirunelveli',
    phone: '0462-2572611',
    type: 'Government',
    operatingHours: '24/7',
    stock: { 'A+': 3, 'A-': 0, 'B+': 6, 'B-': 0, 'O+': 8, 'O-': 1, 'AB+': 1, 'AB-': 0 },
    updatedAt: Date.now() - 7200000,
  },
  {
    id: 'bank-6',
    name: 'Salem Government District Hospital Blood Bank',
    address: 'Saradha College Road, Salem - 636016',
    district: 'Salem',
    phone: '0427-2223850',
    type: 'Government',
    operatingHours: '24/7',
    stock: { 'A+': 5, 'A-': 1, 'B+': 9, 'B-': 2, 'O+': 13, 'O-': 0, 'AB+': 4, 'AB-': 1 },
    updatedAt: Date.now() - 1200000,
  },
];

const DEMO_DONORS: BloodDonor[] = [
  { id: 'donor-1', name: 'Ramesh K.', bloodType: 'O+', district: 'Chennai', phone: '9876543210', available: true, totalDonations: 5, registeredAt: Date.now() - 86400000 * 30 },
  { id: 'donor-2', name: 'Priya S.', bloodType: 'A+', district: 'Coimbatore', phone: '9876501234', available: true, totalDonations: 3, registeredAt: Date.now() - 86400000 * 15 },
  { id: 'donor-3', name: 'Karthik M.', bloodType: 'B+', district: 'Madurai', phone: '9865432100', available: false, totalDonations: 8, lastDonated: Date.now() - 86400000 * 45, registeredAt: Date.now() - 86400000 * 90 },
  { id: 'donor-4', name: 'Anitha R.', bloodType: 'AB-', district: 'Chennai', phone: '9944123456', available: true, totalDonations: 2, registeredAt: Date.now() - 86400000 * 7 },
  { id: 'donor-5', name: 'Suresh P.', bloodType: 'O-', district: 'Salem', phone: '9788991234', available: true, totalDonations: 12, registeredAt: Date.now() - 86400000 * 180 },
  { id: 'donor-6', name: 'Deepa V.', bloodType: 'B-', district: 'Tirunelveli', phone: '9901234567', available: true, totalDonations: 1, registeredAt: Date.now() - 86400000 * 3 },
];

const DEMO_REQUESTS: BloodRequest[] = [
  {
    id: 'req-1',
    patientName: 'Murugan A.',
    bloodType: 'O-',
    hospital: 'Rajiv Gandhi General Hospital',
    district: 'Chennai',
    units: 2,
    urgency: 'CRITICAL',
    contactPhone: '9788123456',
    status: 'OPEN',
    createdAt: Date.now() - 3600000,
    notes: 'Post-surgery trauma patient. Urgent.',
  },
  {
    id: 'req-2',
    patientName: 'Lakshmi B.',
    bloodType: 'AB+',
    hospital: 'KMCH Hospital',
    district: 'Coimbatore',
    units: 1,
    urgency: 'URGENT',
    contactPhone: '9876541230',
    status: 'OPEN',
    createdAt: Date.now() - 7200000,
    notes: 'Scheduled surgery tomorrow morning.',
  },
];

// In-memory store for fallback mode
let demoRequests: BloodRequest[] = [...DEMO_REQUESTS];
let demoDonors: BloodDonor[] = [...DEMO_DONORS];
const demoListeners: Map<string, (data: any) => void> = new Map();

// Auto-seed Firebase RTDB if it is empty
async function seedFirebaseIfNeeded() {
  if (!isFirebaseConfigured || !db) return;
  try {
    const banksSnap = await get(ref(db, 'bloodBanks'));
    if (!banksSnap.exists()) {
      console.log('[VillageHealth] Seeding initial Blood Banks data into Firebase...');
      for (const bank of DEMO_BLOOD_BANKS) {
        const { id, ...data } = bank;
        await set(ref(db, `bloodBanks/${id}`), data);
      }
    }

    const donorsSnap = await get(ref(db, 'donors'));
    if (!donorsSnap.exists()) {
      console.log('[VillageHealth] Seeding initial Donors data into Firebase...');
      for (const donor of DEMO_DONORS) {
        const { id, ...data } = donor;
        await set(ref(db, `donors/${id}`), data);
      }
    }

    const reqSnap = await get(ref(db, 'bloodRequests'));
    if (!reqSnap.exists()) {
      console.log('[VillageHealth] Seeding initial Blood Requests into Firebase...');
      for (const reqItem of DEMO_REQUESTS) {
        const { id, ...data } = reqItem;
        await set(ref(db, `bloodRequests/${id}`), data);
      }
    }
  } catch (e) {
    console.warn('[VillageHealth] Automatic seeding failed (check database security rules):', e);
  }
}

// Trigger auto-seed on module load
seedFirebaseIfNeeded();

// ─────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────

export const TN_DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul',
  'Thanjavur', 'Ranipet', 'Villupuram', 'Cuddalore', 'Kancheepuram',
  'Tiruppur', 'Namakkal', 'Krishnagiri', 'Dharmapuri', 'Perambalur',
  'Ariyalur', 'Nagapattinam', 'Tiruvarur', 'Ramanathapuram', 'Virudhunagar',
  'Sivaganga', 'Theni', 'Pudukkottai', 'Karur', 'Nilgiris',
  'Kallakurichi', 'Chengalpattu', 'Tenkasi', 'Tirupattur', 'Mayiladuthurai',
  'Other'
];

export const ALL_BLOOD_TYPES: BloodType[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

/**
 * Search blood banks and donors by blood type + district
 */
export async function searchBloodAvailability(
  bloodType: BloodType,
  district: string
): Promise<{ banks: BloodBank[]; donors: BloodDonor[] }> {
  if (isFirebaseConfigured && db) {
    try {
      const banksSnap = await get(ref(db, 'bloodBanks'));
      const donorsSnap = await get(ref(db, 'donors'));

      const banks: BloodBank[] = [];
      const donors: BloodDonor[] = [];

      if (banksSnap.exists()) {
        banksSnap.forEach((child) => {
          const bank = { id: child.key!, ...child.val() } as BloodBank;
          if (bank.district === district && bank.stock[bloodType] > 0) {
            banks.push(bank);
          }
        });
      }

      if (donorsSnap.exists()) {
        donorsSnap.forEach((child) => {
          const donor = { id: child.key!, ...child.val() } as BloodDonor;
          if (donor.bloodType === bloodType && donor.district === district && donor.available) {
            donors.push(donor);
          }
        });
      }

      return { banks, donors };
    } catch (e) {
      console.warn('Firebase search failed, falling back to demo:', e);
    }
  }

  // Demo fallback
  await new Promise(r => setTimeout(r, 600));
  const banks = DEMO_BLOOD_BANKS.filter(b => b.district === district && b.stock[bloodType] > 0);
  const donors = DEMO_DONORS.filter(d => d.bloodType === bloodType && d.district === district && d.available);
  return { banks, donors };
}

/**
 * Get all open blood requests (real-time)
 */
export function subscribeToBloodRequests(
  callback: (requests: BloodRequest[]) => void
): () => void {
  if (isFirebaseConfigured && db) {
    const reqRef = ref(db, 'bloodRequests');
    const handler = (snap: any) => {
      const requests: BloodRequest[] = [];
      if (snap.exists()) {
        snap.forEach((child: any) => {
          requests.push({ id: child.key, ...child.val() } as BloodRequest);
        });
      }
      callback(requests.filter(r => r.status === 'OPEN').sort((a, b) => b.createdAt - a.createdAt));
    };
    onValue(reqRef, handler);
    return () => off(reqRef, 'value', handler);
  }

  // Demo: immediately call with demo data, simulate live updates
  callback([...demoRequests].filter(r => r.status === 'OPEN').sort((a, b) => b.createdAt - a.createdAt));
  const key = 'requests_' + Date.now();
  demoListeners.set(key, callback);
  return () => demoListeners.delete(key);
}

/**
 * Post a new urgent blood request
 */
export async function postBloodRequest(
  request: Omit<BloodRequest, 'id' | 'status' | 'createdAt'>
): Promise<string> {
  const newRequest: BloodRequest = {
    ...request,
    status: 'OPEN',
    createdAt: Date.now(),
  };

  if (isFirebaseConfigured && db) {
    const newRef = push(ref(db, 'bloodRequests'));
    await set(newRef, newRequest);
    return newRef.key!;
  }

  // Demo fallback
  await new Promise(r => setTimeout(r, 600));
  const id = 'req-' + Date.now();
  const saved = { ...newRequest, id };
  demoRequests = [saved, ...demoRequests];
  demoListeners.forEach(cb => cb([...demoRequests].filter(r => r.status === 'OPEN')));
  return id;
}

/**
 * Fulfill a blood request (mark as fulfilled)
 */
export async function fulfillBloodRequest(requestId: string, fulfilledBy: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await update(ref(db, `bloodRequests/${requestId}`), {
      status: 'FULFILLED',
      fulfilledBy,
    });
    return;
  }
  demoRequests = demoRequests.map(r =>
    r.id === requestId ? { ...r, status: 'FULFILLED', fulfilledBy } : r
  );
  demoListeners.forEach(cb => cb([...demoRequests].filter(r => r.status === 'OPEN')));
}

/**
 * Register a new donor
 */
export async function registerDonor(
  donor: Omit<BloodDonor, 'id' | 'registeredAt'>
): Promise<string> {
  const newDonor: BloodDonor = {
    ...donor,
    registeredAt: Date.now(),
  };

  if (isFirebaseConfigured && db) {
    const newRef = push(ref(db, 'donors'));
    await set(newRef, newDonor);
    return newRef.key!;
  }

  await new Promise(r => setTimeout(r, 500));
  const id = 'donor-' + Date.now();
  demoDonors = [{ ...newDonor, id }, ...demoDonors];
  return id;
}

/**
 * Update blood bank stock
 */
export async function updateBloodBankStock(
  bankId: string,
  stock: BloodBankStock
): Promise<void> {
  const updateData = { stock, updatedAt: Date.now() };

  if (isFirebaseConfigured && db) {
    await update(ref(db, `bloodBanks/${bankId}`), updateData);
    return;
  }

  await new Promise(r => setTimeout(r, 500));
  const idx = DEMO_BLOOD_BANKS.findIndex(b => b.id === bankId);
  if (idx >= 0) {
    DEMO_BLOOD_BANKS[idx] = { ...DEMO_BLOOD_BANKS[idx], stock, updatedAt: Date.now() };
  }
}

/**
 * Register a new blood bank
 */
export async function registerBloodBank(
  bank: Omit<BloodBank, 'id' | 'updatedAt'>
): Promise<string> {
  const newBank: BloodBank = { ...bank, updatedAt: Date.now() };

  if (isFirebaseConfigured && db) {
    const newRef = push(ref(db, 'bloodBanks'));
    await set(newRef, newBank);
    return newRef.key!;
  }

  await new Promise(r => setTimeout(r, 500));
  const id = 'bank-' + Date.now();
  DEMO_BLOOD_BANKS.push({ ...newBank, id });
  return id;
}

/**
 * Get all registered donors (for a district filter)
 */
export async function getDonorsByDistrict(district: string): Promise<BloodDonor[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await get(ref(db, 'donors'));
      const donors: BloodDonor[] = [];
      if (snap.exists()) {
        snap.forEach((child) => {
          const d = { id: child.key!, ...child.val() } as BloodDonor;
          if (d.district === district) donors.push(d);
        });
      }
      return donors;
    } catch (e) {
      console.warn('Firebase getDonors failed:', e);
    }
  }
  await new Promise(r => setTimeout(r, 400));
  return demoDonors.filter(d => d.district === district);
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}
