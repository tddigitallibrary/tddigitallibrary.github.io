import { db, auth } from "./firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// LOGOUT
window.logout = async function(){

try{
await signOut(auth);
window.location.href = "index.html";
}catch(e){
console.log(e);
}

};


// PINJAM (dummy dulu)
window.pinjam = function(id,nama,jumlah){
alert("Pinjam: " + nama);
};


// LOAD DATA
function load(){

const list = document.getElementById("list");

onSnapshot(collection(db,"barang"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(doc=>{

let data = doc.data();

list.innerHTML += `
<div class="card">

<div class="badge">${data.jenis}</div>

<h3>${data.nama}</h3>
<p>Jumlah: ${data.jumlah}</p>

<button onclick="pinjam('${doc.id}','${data.nama}',${data.jumlah})">
Pinjam
</button>

</div>
`;

});

});

}

load();
