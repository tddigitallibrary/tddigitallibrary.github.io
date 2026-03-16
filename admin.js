import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


window.tambahBuku = async function(){

let judul = document.getElementById("judul").value;

let stok = parseInt(document.getElementById("stok").value);

await addDoc(collection(db,"buku"),{

judul:judul,
stok:stok

});

alert("Buku ditambahkan");

loadBuku();

}

async function loadBuku(){

let snap = await getDocs(collection(db,"buku"));

let html="";

snap.forEach(doc=>{

let d = doc.data();

html += `<p>${d.judul} | Stok : ${d.stok}</p>`;

});

document.getElementById("listBuku").innerHTML = html;

}

loadBuku();
