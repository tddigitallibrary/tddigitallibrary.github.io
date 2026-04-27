import { db, auth } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
updateDoc,
doc,
getDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// LOGOUT
window.logout = async ()=>{
await signOut(auth);
location.href="index.html";
};


// ========================
// LOAD BARANG (REALTIME)
// ========================
function loadBarang(){

const list = document.getElementById("list");

onSnapshot(collection(db,"barang"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(d=>{
let data = d.data();

let status = data.jumlah == 0
? "<b style='color:red'>Habis</b>"
: `(stok:${data.jumlah})`;

list.innerHTML += `
<div class="item">
${data.nama} ${status}

<button onclick="pinjam('${d.id}','${data.nama}',${data.jumlah}')">
Pinjam
</button>
</div>
`;
});

});

}


// ========================
// PINJAM BARANG
// ========================
window.pinjam = async function(id,nama,jumlah){

if(jumlah <= 0){
alert("Stok habis");
return;
}

let user = auth.currentUser;

let namaUser = user.email;

// simpan peminjaman
await addDoc(collection(db,"peminjaman"),{
nama:namaUser,
barang:nama,
barangID:id,
tanggal_pinjam:new Date().toLocaleDateString(),
status:"dipinjam"
});

// kurangi stok
await updateDoc(doc(db,"barang",id),{
jumlah:jumlah - 1
});

};


// ========================
// LOAD RIWAYAT
// ========================
function loadRiwayat(){

const list = document.getElementById("riwayat");

onSnapshot(collection(db,"peminjaman"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(d=>{
let data = d.data();

if(data.status=="dipinjam"){

list.innerHTML += `
<div class="item">
${data.barang}

<button onclick="kembalikan('${d.id}','${data.barangID}')">
Kembalikan
</button>
</div>
`;

}

});

});

}


// ========================
// KEMBALIKAN BARANG
// ========================
window.kembalikan = async function(pinjamID,barangID){

// update status
await updateDoc(doc(db,"peminjaman",pinjamID),{
status:"kembali",
tanggal_kembali:new Date().toLocaleDateString()
});

// tambah stok
let ref = doc(db,"barang",barangID);
let snap = await getDoc(ref);

let jumlah = snap.data().jumlah;

await updateDoc(ref,{
jumlah:jumlah + 1
});

};


// INIT
loadBarang();
loadRiwayat();
