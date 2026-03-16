import { db } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
updateDoc,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// LOAD BUKU
async function loadBuku(){

let list = document.getElementById("listBuku");

list.innerHTML="";

let snapshot = await getDocs(collection(db,"buku"));

snapshot.forEach((d)=>{

let data = d.data();

let status = data.stok==0 ? "<span class='stokHabis'>Stok Habis</span>" : "(stok:"+data.stok+")";

let tombol = data.stok==0 ? "" : `<button onclick="pinjam('${d.id}','${data.judul}',${data.stok})">Pinjam</button>`;

list.innerHTML += `
<div>

${data.judul} ${status}

${tombol}

</div>
`;

});

}


// PINJAM
window.pinjam = async function(id,judul,stok){

if(stok<=0){

alert("Stok habis");

return;

}

let nama = document.getElementById("nama").value;

await addDoc(collection(db,"peminjaman"),{

nama:nama,
buku:judul,
tanggal_pinjam:new Date().toLocaleDateString(),
status:"dipinjam",
bukuID:id

});

await updateDoc(doc(db,"buku",id),{

stok:stok-1

});

loadBuku();
loadRiwayat();

}


// RIWAYAT
async function loadRiwayat(){

let list = document.getElementById("riwayat");

list.innerHTML="";

let snapshot = await getDocs(collection(db,"peminjaman"));

snapshot.forEach((d)=>{

let data = d.data();

let tombol = data.status=="dipinjam"
? `<button onclick="kembalikan('${d.id}','${data.bukuID}')">Kembalikan</button>`
: "Sudah dikembalikan";

list.innerHTML += `
<div>

${data.buku} - ${data.status}

${tombol}

</div>
`;

});

}


// KEMBALIKAN
window.kembalikan = async function(pinjamID,bukuID){

let bukuRef = doc(db,"buku",bukuID);

let bukuSnap = await getDoc(bukuRef);

let stok = bukuSnap.data().stok;

await updateDoc(doc(db,"peminjaman",pinjamID),{

status:"kembali",
tanggal_kembali:new Date().toLocaleDateString()

});

await updateDoc(bukuRef,{

stok:stok+1

});

loadBuku();
loadRiwayat();

}

loadBuku();
loadRiwayat();