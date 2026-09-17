"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
25. Agar internet tezligi 750 kbayt/sekund bo'lsa 1.8 GBayt axborotni
necha sekundda uzatish mumkinligini aniqlaydigan dastur tuzing.
*/
{
    let tezlik = 750;
    let axborot = 1.8 * 1024 * 1024;
    let vaqt = axborot / tezlik;
    console.log("Natija: " + vaqt + " sekund");
}
