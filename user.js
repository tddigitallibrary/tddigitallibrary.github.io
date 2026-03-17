import { db, auth } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


const tabelBuku = document.getElementById("tabelBuku");
const tabelPinjam = document.getElementById("tabelPinjam");
const searchInput = document.getElementById("search");

let dataBuku = [];
let userId = null;


/* CEK LOGIN USER */

onAuthStateChanged(auth, (user) => {

if(!user){

alert("Silakan login terlebih dahulu");
window.location.href="login.html";
return;

}

userId = user.uid;

loadDashboard();
loadBuku();
loadPinjaman();

});


/* LOAD DASHBOARD */

async function loadDashboard(){

/* TOTAL BUKU */

const bukuSnapshot = await getDocs(collection(db,"buku"));
document.getElementById("totalBuku").innerText = bukuSnapshot.size;


/* TOTAL PINJAMAN USER */

const q = query(
collection(db,"peminjaman"),
where("userId","==",userId)
);

const pinjamSnapshot = await getDocs(q);

document.getElementById("totalPinjam").innerText = pinjamSnapshot.size;

}


/* LOAD DATA BUKU */

async function loadBuku(){

tabelBuku.innerHTML="";

const snapshot = await getDocs(collection(db,"buku"));

dataBuku = [];

snapshot.forEach(doc => {

const buku = doc.data();

dataBuku.push(buku);

tabelBuku.innerHTML += `
<tr>
<td>${buku.judul}</td>
<td>${buku.penulis}</td>
<td>${buku.stok}</td>
<td>
<button onclick="pinjamBuku('${buku.judul}')">Pinjam</button>
</td>
</tr>
`;

});

}


/* PINJAM BUKU */

window.pinjamBuku = async function(judul){

await addDoc(collection(db,"peminjaman"),{

judul:judul,
userId:userId,
status:"dipinjam",
tanggal:new Date()

});

alert("Buku berhasil dipinjam");

loadDashboard();
loadPinjaman();

}


/* LOAD BUKU YANG DIPINJAM USER */

async function loadPinjaman(){

tabelPinjam.innerHTML="";

const q = query(
collection(db,"peminjaman"),
where("userId","==",userId)
);

const snapshot = await getDocs(q);

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
