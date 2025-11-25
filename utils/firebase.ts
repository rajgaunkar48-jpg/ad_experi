import { getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app as initializedApp } from './firebaseconfig';

// If app is already initialized elsewhere, use it, otherwise use the imported one
const app = (getApps().length ? getApp() : initializedApp) as any;

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
