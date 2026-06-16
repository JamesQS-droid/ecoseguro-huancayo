import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDiD-UUEUlxzU8JV2wYVrCBthxC5dXIdJ0",
  authDomain: "ecoseguro-huancayo.firebaseapp.com",
  projectId: "ecoseguro-huancayo",
  storageBucket: "ecoseguro-huancayo.firebasestorage.app",
  messagingSenderId: "301153897842",
  appId: "1:301153897842:web:af4f54f1219493823f61eb"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);