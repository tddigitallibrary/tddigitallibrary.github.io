import { db, auth } from "./firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// ========================
// LOGOUT
// ========================
window.logout = async function(){
try{
await signOut(auth);
window.location.href = "index.html";
}catch(e){
console.log("Logout error:", e);
}
};


// ========================
// PINJAM (sementara / dummy)
// ========================
window.pinjam = async function(id,nama,jumlah){

if(jumlah <= 0){
alert("Stok habis!");
return;
}

try{

// ambil user login
let user = auth.currentUser;

// 1. simpan ke koleksi peminjaman
await addDoc(collection(db,"peminjaman"),{
nama_user: user.email,
barang: nama,
barangID: id,
tanggal_pinjam: new Date().toLocaleDateString(),
status: "dipinjam"
});

// 2. kurangi stok barang
let ref = doc(db,"barang",id);
let snap = await getDoc(ref);

let stokSekarang = snap.data().jumlah;

await updateDoc(ref,{
jumlah: stokSekarang - 1
});

alert("Berhasil meminjam!");

}catch(e){
console.log(e);
alert("Gagal meminjam");
}

};


// ========================
// LOAD DATA REALTIME
// ========================
function load(){

const list = document.getElementById("list");

onSnapshot(collection(db,"barang"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(doc=>{

let data = doc.data();

// fallback jenis jika kosong
let jenis = data.jenis || "Umum";

// cek stok
let isHabis = data.jumlah == 0;

// warna indikator
let warna = isHabis ? "red" : "#10b981";

list.innerHTML += `
<div class="card">

<div class="badge">${jenis}</div>

<h3>${data.nama}</h3>

<p style="color:${warna}; font-weight:bold;">
${isHabis ? "❌ Habis" : "✔ Tersedia"} (${data.jumlah})
</p>

<button 
${isHabis ? "disabled" : ""} 
onclick="pinjam('${doc.id}','${data.nama}',${data.jumlah})">

${isHabis ? "Stok Habis" : "Pinjam"}

</button>

</div>
`;

});

});

}


// ========================
// INIT
// ========================
load();
