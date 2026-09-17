// [Mavzu: Chiziqli algoritmlar]
/*
25. Agar internet tezligi 750 kbayt/sekund bo'lsa 1.8 GBayt axborotni
necha sekundda uzatish mumkinligini aniqlaydigan dastur tuzing.
*/

{
let tezlik: number = 750;
let axborot: number = 1.8 * 1024 * 1024; 
let vaqt: number = axborot / tezlik;
console.log("Natija: " + vaqt + " sekund");
}
