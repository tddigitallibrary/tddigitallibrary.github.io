import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.register = async function(){

try{

let nama = document.getElementById("nama").value;
let kelas = document.getElementById("kelas").value;
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

// validasi
if(kelas === ""){
alert("Silakan pilih kelas.");
return;
}

// buat akun auth
let userCredential = await createUserWithEmailAndPassword(auth,email,password);

// simpan nama ke Firebase Auth
await updateProfile(userCredential.user,{
displayName:nama
});

let uid = userCredential.user.uid;

// simpan data user ke Firestore
await setDoc(doc(db,"users",uid),{

nama:nama,
kelas:kelas,
email:email,
role:"user"

});

alert("Registrasi berhasil");

window.location="index.html";

}catch(error){

alert(error.message);

}

};
