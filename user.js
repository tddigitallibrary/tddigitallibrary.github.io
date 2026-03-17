import { db } from "./firebase.js";

import {
collection,
getDocs,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const tabelBuku = document.getElementById("tabelBuku");
const tabelPinjam = document.getElementById("tabelPinjam");
const searchInput = document.getElementById("search");

let dataBuku=[];


async function loadBuku(){

const snapshot = await getDocs(collection(db,"buku"));

console.log("jumlah buku:",snapshot.size);

snapshot.forEach(doc=>{
console.log(doc.data());
});

}

loadBuku();


window.pinjamBuku = async function(judul){

await addDoc(collection(db,"peminjaman"),{

judul,
status:"dipinjam"

});

alert("Buku berhasil dipinjam");

loadPinjaman();

}


async function loadPinjaman(){

tabelPinjam.innerHTML="";

const snapshot = await getDocs(collection(db,"peminjaman"));

document.getElementById("totalPinjam").innerText = snapshot.size;

snapshot.forEach(doc=>{

const pinjam = doc.data();

tabelPinjam.innerHTML += `
<tr>
<td>${pinjam.judul}</td>
<td>${pinjam.status}</td>
</tr>
`;

});

}

loadPinjaman();


/* SEARCH BUKU */

searchInput.addEventListener("keyup",()=>{

const keyword = searchInput.value.toLowerCase();

tabelBuku.innerHTML="";

dataBuku
.filter(b => b.judul.toLowerCase().includes(keyword))
.forEach(b=>{

tabelBuku.innerHTML += `
<tr>
<td>${b.judul}</td>
<td>${b.penulis}</td>
<td>${b.stok}</td>
<td>
<button onclick="pinjamBuku('${b.judul}')">Pinjam</button>
</td>
</tr>
`;

});

});
