"use strict";
// [Mavzu: Shart operatorlari]
/*
47. Yoshni yillarda ifodalovchi dastur tuzing. Bunda 10 -60 oraliqda butun
son berilgan. Son kiritilganda unga mos  qiymatni  so'zlarda
ifodalovchi dasturi tuzilsin. ("20 -yigirma yosh", "43 -qir uch yosh" va
h.k)
*/
{
    let yosh47 = Number(prompt("Yoshni kiriting (10-60): "));
    let birlarSoz47 = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
    let onlarSoz47 = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish"];
    let onlar47 = Math.floor(yosh47 / 10);
    let birlar47 = yosh47 % 10;
    let yoshSoz47 = (onlarSoz47[onlar47] + " " + birlarSoz47[birlar47]).trim();
    console.log(yosh47 + " - " + yoshSoz47 + " yosh");
}
