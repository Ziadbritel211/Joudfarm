// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCy5PmZxgzfnawvWr_Af18G1EY1r6n8q1g",
  authDomain: "joudfarm-b3664.firebaseapp.com",
  projectId: "joudfarm-b3664",
  storageBucket: "joudfarm-b3664.firebasestorage.app",
  messagingSenderId: "259248071613",
  appId: "1:259248071613:web:04b3cbf355eac215e1e8d4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
