import { db, auth } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// LOGOUT
window.logout = async ()=>{
await signOut(auth);
location.href="index.html";
};


// LOAD BARANG
async function load(){

let list=document.getElementById("list");

let snap=await getDocs(collection(db,"barang"));

snap.forEach(d=>{
let data=d.data();

list.innerHTML += `
<div class="item">
${data.nama} (${data.jumlah})
<button>Pinjam</button>
</div>
`;
});

}

load();
