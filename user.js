import { db } from "./firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


function load(){

const list = document.getElementById("list");

onSnapshot(collection(db,"barang"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(doc=>{

let data = doc.data();

list.innerHTML += `
<div class="card">
<h3>${data.nama}</h3>
<p>Jenis: ${data.jenis}</p>
<p>Jumlah: ${data.jumlah}</p>
</div>
`;

});

});

}

load();
