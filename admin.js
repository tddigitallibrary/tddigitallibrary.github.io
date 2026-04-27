import { db, auth } from "./firebase.js";

import {
    collection,
    onSnapshot
    } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
collection,
getDocs,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// DARK MODE
window.toggleDark = () => {
document.body.classList.toggle("dark");
};

// MODAL
window.showTambah = () => {
document.getElementById("modal").style.display="block";
};

window.tutupModal = () => {
document.getElementById("modal").style.display="none";
};

// LOGOUT
window.logout = async () => {
await signOut(auth);
location.href="index.html";
};

// TAMBAH BARANG
window.tambahBarang = async () => {

let nama = document.getElementById("namaBarang").value;
let jumlah = document.getElementById("jumlahBarang").value;

await addDoc(collection(db,"barang"),{
nama:nama,
jumlah:parseInt(jumlah)
});

loadData();
};

// LOAD DATA
async function loadData(){

let table = document.getElementById("table");
table.innerHTML="";

let total=0, habis=0;

let snap = await getDocs(collection(db,"barang"));

snap.forEach(d=>{
let data=d.data();
total++;

let status = data.jumlah==0 ? "Habis" : "Available";
if(data.jumlah==0) habis++;

table.innerHTML += `
<tr>
<td>${data.nama}</td>
<td>${data.jumlah}</td>
<td>${status}</td>
</tr>
`;
});

document.getElementById("totalBarang").innerText=total;
document.getElementById("stokHabis").innerText=habis;

};

let chart;

// ========================
// LOAD GRAFIK REALTIME
// ========================
function loadGrafik(){

onSnapshot(collection(db,"peminjaman"), (snapshot)=>{

let dataMap = {};

snapshot.forEach(d=>{

let data = d.data();

// hanya hitung yang dipinjam
if(data.status === "dipinjam"){

if(dataMap[data.barang]){
dataMap[data.barang]++;
}else{
dataMap[data.barang] = 1;
}

}

});

updateChart(dataMap);

});

}


// ========================
// UPDATE CHART
// ========================
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
loadGrafik();

let editId = null;

// buka modal
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

// SIMPAN (ADD / UPDATE)
window.simpan = async function(){

let nama = document.getElementById("nama").value;
let jenis = document.getElementById("jenis").value;
let jumlah = parseInt(document.getElementById("jumlah").value);

if(editId){
await updateDoc(doc(db,"barang",editId),{
nama,jenis,jumlah
});
}else{
await addDoc(collection(db,"barang"),{
nama,jenis,jumlah
});
}

tutup();
};
loadData();
