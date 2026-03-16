import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const firebaseConfig = {

apiKey:"API_KEY",
authDomain:"PROJECT.firebaseapp.com",
projectId:"PROJECT_ID",
storageBucket:"PROJECT.appspot.com",
messagingSenderId:"XXXX",
appId:"XXXX"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);