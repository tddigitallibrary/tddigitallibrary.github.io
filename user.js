import { auth, db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// LOGOUT
window.logout = async function(){
await signOut(auth);
window.location.href = "index.html";
};


// LOAD BARANG
async function loadData(){

let list = document.getElementById("list");

let snapshot = await getDocs(collection(db,"barang"));

snapshot.forEach((d)=>{

let data = d.data();

list.innerHTML += `
<div>${data.nama} (${data.jumlah})</div>
`;

});

}

loadData();