import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.register = async function(){

let nama = document.getElementById("nama").value;

let email = document.getElementById("email").value;

let password = document.getElementById("password").value;

let user = await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",user.user.uid),{

nama:nama,
email:email,
role:"user"

});

alert("Registrasi berhasil");

window.location="index.html";

}
