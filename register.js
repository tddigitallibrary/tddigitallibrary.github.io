// Import Firebase
import { auth, db } from "./firebase.js";

import { 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { 
  doc, setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Form register
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    // Membuat akun di Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Simpan data user ke Firestore
    await setDoc(doc(db, "users", user.uid), {
      nama: nama,
      email: email,
      role: "siswa",
      createdAt: new Date()
    });

    // Notifikasi berhasil
    alert("Registrasi berhasil! Silakan login.");

    // Redirect ke halaman login
    window.location.href = "login.html";

  } catch (error) {

    console.error(error);

    alert("Registrasi gagal: " + error.message);

  }
});
