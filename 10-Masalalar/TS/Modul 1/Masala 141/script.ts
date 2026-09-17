// [Mavzu: Stringlar bilan ishlash]
/*
141. Berilgan str satrining konsoldan kiritilgan indeksi o'rnidagi belgini
chiqaruvchi dastur kiriting.
*/

{
let str: string = prompt("Matn kiriting:") || "";
let index: number = Number(prompt("Indeks kiriting:"));

if (index >= 0 && index < str.length) {
    console.log("Indeks " + index + " dagi belgi: " + str[index]);
} else {
    console.log("Noto'g'ri indeks");
}
}
