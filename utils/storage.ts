import { collection, addDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

export type Severity = 'Mild' | 'Moderate' | 'Severe';

export type Symptom = {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  date: string; // ISO string
};

export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  date: string; // ISO string
};

function getUserCollection(name: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User is not authenticated');
  return collection(db, 'users', uid, name);
}

// Backwards compatible constants in case someone needs them
const symptomsCollection = () => getUserCollection('symptoms');
const medicinesCollection = () => getUserCollection('medicines');

export const storageUtils = {
  async getSymptoms(): Promise<Symptom[]> {
    const q = query(symptomsCollection(), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const items: Symptom[] = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      const dateVal = data.date instanceof Timestamp ? data.date.toDate().toISOString() : new Date(data.date).toISOString();
      return {
        id: doc.id,
        name: data.name,
        severity: data.severity as Severity,
        description: data.description || '',
        date: dateVal,
      };
    });
    return items;
  },

  async saveSymptom(symptom: Omit<Symptom, 'id' | 'date'> & { date?: string }): Promise<void> {
    const payload = {
      name: symptom.name,
      severity: symptom.severity,
      description: symptom.description || '',
      date: symptom.date ? new Date(symptom.date).toISOString() : new Date().toISOString(),
    };
    await addDoc(symptomsCollection(), payload);
  },

  async getMedicines(): Promise<Medicine[]> {
    const q = query(medicinesCollection(), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const items: Medicine[] = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      const dateVal = data.date instanceof Timestamp ? data.date.toDate().toISOString() : new Date(data.date).toISOString();
      return {
        id: doc.id,
        name: data.name,
        dosage: data.dosage,
        time: data.time,
        date: dateVal,
      };
    });
    return items;
  },

  async saveMedicine(m: Omit<Medicine, 'id' | 'date'> & { date?: string }): Promise<void> {
    const payload = {
      name: m.name,
      dosage: m.dosage,
      time: m.time,
      date: m.date ? new Date(m.date).toISOString() : new Date().toISOString(),
    };
    await addDoc(medicinesCollection(), payload);
  },

  getTodayItems<T extends { date: string }>(items: T[]): T[] {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const end = start + 24 * 60 * 60 * 1000 - 1;
    return items.filter((i) => {
      const ts = new Date(i.date).getTime();
      return ts >= start && ts <= end;
    });
  },

  getWeekItems<T extends { date: string }>(items: T[]): T[] {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    return items.filter((i) => new Date(i.date).getTime() >= weekAgo);
  },
};

export default storageUtils;
