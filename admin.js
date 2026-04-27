import { db, auth } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
onSnapshot,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// DARK MODE
window.toggleDark = () => {
document.body.classList.toggle("dark");
};


// LOGOUT
window.logout = async () => {
await signOut(auth);
location.href="index.html";
};


// =======================
// LOAD DATA
// =======================
let editId = null;

async function loadData(){

let table = document.getElementById("table");
table.innerHTML="";

let total=0, habis=0;

let snap = await getDocs(collection(db,"barang"));

snap.forEach(d=>{

let data = d.data();
total++;

let status = data.jumlah==0 ? "Habis" : "Available";
if(data.jumlah==0) habis++;

table.innerHTML += `
<tr>
<td>${data.nama}</td>
<td>${data.jenis || "-"}</td>
<td>${data.jumlah}</td>
<td>
<button onclick="openModal('${d.id}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
Edit
</button>
</td>
</tr>
`;

});

document.getElementById("total").innerText = total;
document.getElementById("habis").innerText = habis;

}


// =======================
// TAMBAH / EDIT
// =======================
window.openModal = function(id=null,data=null){

document.getElementById("modal").style.display="block";

if(data){
editId = id;
document.getElementById("nama").value = data.nama;
document.getElementById("jenis").value = data.jenis;
document.getElementById("jumlah").value = data.jumlah;
}else{
editId = null;
}

};

window.tutup = function(){
document.getElementById("modal").style.display="none";
};


// SIMPAN
window.simpan = async function(){

let nama = document.getElementById("nama").value;
let jenis = document.getElementById("jenis").value;
let jumlah = parseInt(document.getElementById("jumlah").value);

if(editId){
await updateDoc(doc(db,"barang",editId),{
nama, jenis, jumlah
});
}else{
await addDoc(collection(db,"barang"),{
nama, jenis, jumlah
});
}

tutup();
loadData();
};


// =======================
// SEARCH
// =======================
window.search = function(keyword){

let rows = document.querySelectorAll("#table tr");

rows.forEach(r=>{
let text = r.innerText.toLowerCase();
r.style.display = text.includes(keyword.toLowerCase())
? "" : "none";
});

};


// =======================
// GRAFIK REALTIME
// =======================
let chart;

function loadGrafik(){

onSnapshot(collection(db,"peminjaman"), (snapshot)=>{

let dataMap = {};

snapshot.forEach(d=>{

let data = d.data();

if(data.status === "dipinjam"){

dataMap[data.barang] =
(dataMap[data.barang] || 0) + 1;

}

});

updateChart(dataMap);

});

}


function updateChart(data){

let labels = Object.keys(data);
let values = Object.values(data);

if(chart){
chart.destroy();
}

chart = new Chart(document.getElementById("chart"),{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Jumlah Dipinjam",
data:values
}]
}
});

}


// INIT
loadData();
loadGrafik();
