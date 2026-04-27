import { auth, db } from "./firebase.js";

import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// LOGIN
window.login = async function(){

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

try{

let userCred = await signInWithEmailAndPassword(auth,email,password);

let uid = userCred.user.uid;

// ambil role
let userDoc = await getDoc(doc(db,"users",uid));

let role = userDoc.data().role;


// AUTO REDIRECT
if(role === "admin"){
window.location.href = "admin.html";
}else{
window.location.href = "user.html";
}

}catch(e){

alert("Login gagal");

}

};


// REGISTER
window.register = async function(){

let nama = document.getElementById("nama").value;
let email = document.getElementById("regEmail").value;
let password = document.getElementById("regPassword").value;
let role = document.getElementById("role").value;

try{

let userCred = await createUserWithEmailAndPassword(auth,email,password);

let uid = userCred.user.uid;

// simpan ke firestore
await setDoc(doc(db,"users",uid),{
nama:nama,
email:email,
role:role
});

alert("Register berhasil");

}catch(e){

alert("Register gagal");

}

};