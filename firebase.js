// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// CONFIG FIREBASE PROJECT ANDA
const firebaseConfig = {
  apiKey: "AIzaSyBxO6-KZYaWRLnGuO2bhQ0oP_Rs0xjppoE",
  authDomain: "peminjaman-buku-77482.firebaseapp.com",
  projectId: "peminjaman-buku-77482",
  storageBucket: "peminjaman-buku-77482.firebasestorage.app",
  messagingSenderId: "189272980506",
  appId: "1:189272980506:web:90486cc16aa7fb814165a3",
  measurementId: "G-VPXLXPQJ1D"
};


// INISIALISASI FIREBASE
const app = initializeApp(firebaseConfig);


// AUTHENTICATION
const auth = getAuth(app);


// DATABASE FIRESTORE
const db = getFirestore(app);


// EXPORT AGAR BISA DIPAKAI FILE LAIN
export { auth, db };
