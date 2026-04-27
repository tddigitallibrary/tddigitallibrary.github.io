import { auth, db } from "./firebase.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


window.login = async function(){

try{

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

let userCredential = await signInWithEmailAndPassword(auth,email,password);

let uid = userCredential.user.uid;

let userDoc = await getDoc(doc(db,"users",uid));

if(!userDoc.exists()){

alert("Data user tidak ada di database");

return;

}

let role = userDoc.data().role;

if(role=="admin"){

window.location="admin.html";

}else{

window.location="user.html";

}

}catch(error){

alert(error.message);

}

}
