import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const tabelBuku = document.getElementById("tabelBuku");
const tabelPinjam = document.getElementById("tabelPinjam");

async function loadDashboard(){

/* TOTAL BUKU */

const bukuSnapshot = await getDocs(collection(db,"buku"));

document.getElementById("totalBuku").innerText = bukuSnapshot.size;


/* TOTAL PINJAM */

const pinjamSnapshot = await getDocs(collection(db,"peminjaman"));

document.getElementById("totalPinjam").innerText = pinjamSnapshot.size;

}

loadDashboard();
