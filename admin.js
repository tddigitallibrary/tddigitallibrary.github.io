import { db, auth } from "./firebase.js";

import {
collection,
getDocs,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// DARK MODE
window.toggleDark = () => {
document.body.classList.toggle("dark");
};

// MODAL
window.showTambah = () => {
document.getElementById("modal").style.display="block";
};

window.tutupModal = () => {
document.getElementById("modal").style.display="none";
};

// LOGOUT
window.logout = async () => {
await signOut(auth);
location.href="index.html";
};

// TAMBAH BARANG
window.tambahBarang = async () => {

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

let table = document.getElementById("table");
table.innerHTML="";

let total=0, habis=0;

let snap = await getDocs(collection(db,"barang"));

snap.forEach(d=>{
let data=d.data();
total++;

let status = data.jumlah==0 ? "Habis" : "Available";
if(data.jumlah==0) habis++;

table.innerHTML += `
<tr>
<td>${data.nama}</td>
<td>${data.jumlah}</td>
<td>${status}</td>
</tr>
`;
});

document.getElementById("totalBarang").innerText=total;
document.getElementById("stokHabis").innerText=habis;

}

loadData();
