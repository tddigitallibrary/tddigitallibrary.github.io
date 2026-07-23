// ======================================================
// IMPORT
// ======================================================

// firebase
import { db, auth } from "./firebase.js";

// firestore
import{

collection,
addDoc,
getDocs,
getDoc,
doc,
updateDoc,
deleteDoc,
onSnapshot

} from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// auth
import{

signOut

} from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";



// ======================================================
// VARIABEL GLOBAL
// ======================================================

let chart;

let editId = null;



// ======================================================
// DARK MODE
// ======================================================

window.toggleDark=function(){

document.body.classList.toggle("dark");

}



// ======================================================
// LOGOUT
// ======================================================

window.logout=async function(){

await signOut(auth);

location.href="index.html";

}



// ======================================================
// SIDEBAR
// ======================================================

window.showPage=function(page){

document.querySelectorAll("main section").forEach(sec=>{

sec.style.display="none";

});

document.getElementById(page).style.display="block";

}



// ======================================================
// MODAL
// ======================================================

window.openModal=function(id=null,data=null){

document.getElementById("modal").style.display="block";

if(data){

editId=id;

document.getElementById("nama").value=data.nama;

document.getElementById("jenis").value=data.jenis;

document.getElementById("jumlah").value=data.jumlah;

}else{

editId=null;

document.getElementById("nama").value="";

document.getElementById("jenis").selectedIndex=0;

document.getElementById("jumlah").value=1;

}

}



window.tutup=function(){

document.getElementById("modal").style.display="none";

editId=null;

}



// ======================================================
// CRUD BARANG
// ======================================================

window.simpan=async function(){

let nama=document.getElementById("nama").value;

let jenis=document.getElementById("jenis").value;

let jumlah=parseInt(document.getElementById("jumlah").value);

if(nama==""){

alert("Nama barang belum diisi");

return;

}

if(jenis==""){

alert("Jenis belum dipilih");

return;

}

if(editId){

await updateDoc(doc(db,"barang",editId),{

nama,

jenis,

jumlah

});

}else{

await addDoc(collection(db,"barang"),{

nama,

jenis,

jumlah

});

}

tutup();

}



window.hapusBarang=async function(id){

if(confirm("Hapus barang ini?")){

await deleteDoc(doc(db,"barang",id));

}

}



// ======================================================
// LOAD DATA BARANG
// ======================================================

async function loadData(){

let table=document.getElementById("table");

table.innerHTML="";

let total=0;

let habis=0;

let snap=await getDocs(collection(db,"barang"));

snap.forEach((d)=>{

let data=d.data();

total++;

if(data.jumlah==0){

habis++;

}

table.innerHTML+=`

<tr>

<td>${data.nama}</td>

<td>${data.jenis}</td>

<td>${data.jumlah}</td>

<td>

<button
onclick='openModal("${d.id}",${JSON.stringify(data)})'>
Edit
</button>

<button
onclick='hapusBarang("${d.id}")'>
Hapus
</button>

</td>

</tr>

`;

});

document.getElementById("totalBarang").innerHTML=total;

document.getElementById("stokHabis").innerHTML=habis;

}



// ======================================================
// SEARCH
// ======================================================

window.search=function(keyword){

keyword=keyword.toLowerCase();

document.querySelectorAll("#table tr").forEach(row=>{

row.style.display=row.innerText.toLowerCase().includes(keyword)

? ""

:"none";

});

}



// ======================================================
// LOAD GRAFIK
// ======================================================

function loadGrafik(){

onSnapshot(collection(db,"peminjaman"),(snapshot)=>{

let dataMap={};

snapshot.forEach((d)=>{

let data=d.data();

if(data.status=="dipinjam"){

if(!dataMap[data.barang]){

dataMap[data.barang]=0;

}

dataMap[data.barang]+=Number(data.jumlah);

}

});

updateChart(dataMap);

});

}



// ======================================================
// UPDATE CHART
// ======================================================

function updateChart(data){

let labels=Object.keys(data);

let values=Object.values(data);

if(chart){

chart.destroy();

}

chart=new Chart(document.getElementById("chart"),{

type:"bar",

data:{

labels,

datasets:[{

label:"Jumlah Dipinjam",

data:values,

backgroundColor:"#6366f1",

borderRadius:10

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:true,

ticks:{

precision:0

}

}

}

}

});

}



// ======================================================
// LOAD PEMINJAMAN
// ======================================================

function loadPeminjaman(){

const table=document.getElementById("tablePinjam");

onSnapshot(collection(db,"peminjaman"),(snapshot)=>{

table.innerHTML="";

let total=0;

snapshot.forEach((d)=>{

let data=d.data();

total++;

table.innerHTML+=`

<tr>

<td>${data.nama??"-"}</td>

<td>${data.email??"-"}</td>

<td>${data.kelas??"-"}</td>

<td>${data.barang??"-"}</td>

<td>${data.jumlah??0}</td>

<td>${data.status??"-"}</td>

<td>${data.tanggal_pinjam??"-"}</td>

</tr>

`;

});

document.getElementById("totalPinjam").innerHTML=total;

});

}



// ======================================================
// INIT
// ======================================================

loadData();

loadGrafik();

loadPeminjaman();