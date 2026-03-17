import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const tabel = document.getElementById("tabelBuku");


async function loadBuku(){

tabel.innerHTML="";

const snapshot = await getDocs(collection(db,"buku"));

document.getElementById("totalBuku").innerText = snapshot.size;

snapshot.forEach(doc=>{

const buku = doc.data();

tabel.innerHTML += `
<tr>
<td>${buku.judul}</td>
<td>${buku.penulis}</td>
<td>${buku.stok}</td>
<td><button>Update</button></td>
</tr>
`;

});

}

loadBuku();


window.tambahBuku = async function(){

const judul = document.getElementById("judul").value;
const penulis = document.getElementById("penulis").value;
const stok = document.getElementById("stok").value;

await addDoc(collection(db,"buku"),{

judul,
penulis,
stok:Number(stok)

});

alert("Buku berhasil ditambah");

loadBuku();

}
