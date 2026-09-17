"use strict";
// [Mavzu: Shart operatorlari]
/*
68. Yoshni yillarda aniqlovchi 20 -69 gacha butun  son berilgan. Son
kiritilganda, unga mos so'zlarda ifodalab ekranga chiqaruvchi
programma tuzilsin. (input - 47, output - "qirq yetti yosh")
*/
{
    let yosh = 47;
    let onlar = Math.floor(yosh / 10);
    let birlar = yosh % 10;
    let onlarSoz = "";
    let birlarSoz = "";
    switch (onlar) {
        case 2:
            onlarSoz = "yigirma";
            break;
        case 3:
            onlarSoz = "o'ttiz";
            break;
        case 4:
            onlarSoz = "qirq";
            break;
        case 5:
            onlarSoz = "ellik";
            break;
        case 6:
            onlarSoz = "oltmish";
            break;
    }
    switch (birlar) {
        case 1:
            birlarSoz = "bir";
            break;
        case 2:
            birlarSoz = "ikki";
            break;
        case 3:
            birlarSoz = "uch";
            break;
        case 4:
            birlarSoz = "to'rt";
            break;
        case 5:
            birlarSoz = "besh";
            break;
        case 6:
            birlarSoz = "olti";
            break;
        case 7:
            birlarSoz = "yetti";
            break;
        case 8:
            birlarSoz = "sakkiz";
            break;
        case 9:
            birlarSoz = "to'qqiz";
            break;
    }
    console.log((onlarSoz + " " + birlarSoz).trim() + " yosh");
}
