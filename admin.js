import { auth, db } from "./firebase.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// LOGOUT
window.logout = async function(){
await signOut(auth);
window.location.href = "index.html";
};


// TAMBAH BARANG
window.tambahBarang = async function(){

let nama = document.getElementById("namaBarang").value;
let jumlah = document.getElementById("jumlahBarang").value;

await addDoc(collection(db,"barang"),{
nama:nama,
jumlah:parseInt(jumlah)
});

loadData();

};


// LOAD DATA
async function loadData(){

let list = document.getElementById("list");
list.innerHTML="";

let snapshot = await getDocs(collection(db,"barang"));

snapshot.forEach((d)=>{

let data = d.data();

list.innerHTML += `
<div>${data.nama} (${data.jumlah})</div>
`;

});

}

loadData();