import { db, auth } from "./firebase.js";

import {
collection,
onSnapshot,
addDoc,
updateDoc,
doc,
getDoc
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
window.pinjam = async function(id,nama,jumlah){

if(jumlah <= 0){
alert("Stok habis!");
return;
}


let qty = document.getElementById(`qty-${id}`).value;

qty = Number(qty);


if(qty > jumlah){
alert("Jumlah melebihi stok!");
return;
}


let kelas = prompt("Masukkan kelas Anda:");

if(!kelas){
alert("Kelas wajib diisi!");
return;
}



try{


let user = auth.currentUser;


if(!user){
alert("Silahkan login terlebih dahulu");
return;
}



// simpan data peminjaman

await addDoc(collection(db,"peminjaman"),{

namaPeminjam: user.displayName || "User",

email: user.email,

kelas: kelas,

barang: nama,

barangID: id,

jumlah: qty,

status:"dipinjam",

tanggal:new Date().toLocaleDateString()

});



// update stok

let ref = doc(db,"barang",id);

let snap = await getDoc(ref);


let stokSekarang = snap.data().jumlah;


await updateDoc(ref,{

jumlah: stokSekarang - qty

});



alert("Berhasil meminjam!");



}catch(e){

console.log(e);

alert("Gagal meminjam");

}


};
// LOAD DATA
function load(){

const list = document.getElementById("list");

onSnapshot(collection(db,"barang"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(doc=>{

let data = doc.data();

let jenis = data.jenis || "Umum";

let isHabis = data.jumlah <= 0;
let warna = isHabis ? "red" : "#10b981";

list.innerHTML += `
<div class="card">

<div class="badge">${jenis}</div>

<h3>${data.nama}</h3>

<p style="color:${warna}; font-weight:bold;">
${isHabis ? "❌ Habis" : "✔ Tersedia"} (${data.jumlah})
</p>

<input type="number" min="1" max="${data.jumlah}" value="1" id="qty-${doc.id}">

<button 
${isHabis ? "disabled" : ""} 
onclick="pinjam('${doc.id}','${data.nama}',${data.jumlah})"

Pinjam

</button>

</div>
`;

});

});

}

load();
