// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxO6-KZYaWRLnGuO2bhQ0oP_Rs0xjppoE",
  authDomain: "peminjaman-buku-77482.firebaseapp.com",
  projectId: "peminjaman-buku-77482",
  storageBucket: "peminjaman-buku-77482.firebasestorage.app",
  messagingSenderId: "189272980506",
  appId: "1:189272980506:web:90486cc16aa7fb814165a3",
  measurementId: "G-VPXLXPQJ1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
