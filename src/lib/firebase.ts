/**
 * lib/firebase.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase v10 modular SDK setup.
 *
 * SETUP STEPS:
 *  1. Go to https://console.firebase.google.com
 *  2. Create project → "smart-essentials-hub"
 *  3. Add Web App → copy the firebaseConfig
 *  4. Enable Firestore Database (start in test mode for dev)
 *  5. Enable Authentication → Email/Password provider
 *  6. Paste values in .env.local (see .env.example)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import type { Product, Category } from '@/types';

// ─── Config ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ─── Singletons ──────────────────────────────────────────
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

function getFirebaseApp() {
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDB(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

// ─── Auth helpers ─────────────────────────────────────────
export async function adminSignIn(email: string, password: string) {
  const authInstance = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(authInstance, email, password);
  return cred.user;
}

export async function adminSignOut() {
  await signOut(getFirebaseAuth());
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), cb);
}

// ─── Product CRUD ─────────────────────────────────────────
const PRODUCTS_COL = 'products';

export async function fetchAllProducts(category?: Category): Promise<Product[]> {
  const db = getDB();
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (category && category !== 'all') {
    constraints.unshift(where('category', '==', category));
  }
  const q = query(collection(db, PRODUCTS_COL), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const db = getDB();
  const snap = await getDoc(doc(db, PRODUCTS_COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function fetchFeaturedProducts(n = 4): Promise<Product[]> {
  const db = getDB();
  const q = query(
    collection(db, PRODUCTS_COL),
    where('featured', '==', true),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(data: Omit<Product, 'id'>): Promise<string> {
  const db = getDB();
  const ref = await addDoc(collection(db, PRODUCTS_COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const db = getDB();
  await updateDoc(doc(db, PRODUCTS_COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getDB();
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

// ─── Subscribers ──────────────────────────────────────────
export async function addSubscriber(email: string): Promise<void> {
  const db = getDB();
  await addDoc(collection(db, 'subscribers'), {
    email,
    subscribedAt: serverTimestamp(),
  });
}

// ─── Click tracking ───────────────────────────────────────
export async function logClick(event: {
  productId: string;
  title: string;
  price?: string;
}): Promise<void> {
  const db = getDB();
  await addDoc(collection(db, 'clicks'), {
    ...event,
    ts: serverTimestamp(),
  });
}
