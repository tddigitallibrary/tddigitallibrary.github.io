import { db } from "./firebase.js";

import {
collection,
getDocs,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


async function loadBuku(){

let snap = await getDocs(collection(db,"buku"));

let html="";

snap.forEach(b=>{

let data = b.data();

html += `
<p>
${data.judul} | Stok : ${data.stok}
<button onclick="pinjam('${b.id}',${data.stok})">
Pinjam
</button>
</p>
`;

});

document.getElementById("bukuList").innerHTML = html;

}

window.pinjam = async function(id,stok){

if(stok<=0){

alert("Stok habis");

return;

}

await updateDoc(doc(db,"buku",id),{

stok:stok-1

});

alert("Buku dipinjam");

loadBuku();

}

loadBuku();
