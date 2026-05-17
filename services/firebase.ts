import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerUser = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export async function createUserProfile(uid: string, data: Record<string, unknown>) {
  await setDoc(doc(db, "users", uid), { ...data, createdAt: serverTimestamp() });
}

export async function logArrhythmiaEvent(uid: string, event: { label: string; confidence: number; risk: "low" | "medium" | "high"; ecgSnapshot: number[] }) {
  await addDoc(collection(db, "users", uid, "events"), { ...event, timestamp: serverTimestamp() });
}

export async function getRecentEvents(uid: string, count = 20) {
  const q = query(collection(db, "users", uid, "events"), orderBy("timestamp", "desc"), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
