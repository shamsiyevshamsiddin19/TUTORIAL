"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
24. a hafta bilan b sutka berilgan, bular jami necha soat bo'lishini
aniqlovchi dastur tuzing.

Input: Output:
a=2, b=1 360
a=0, b=4 96
a=7, b=0 1176
*/
{
    let a24 = Number(prompt("Hafta sonini kiriting: "));
    let b24 = Number(prompt("Sutka sonini kiriting: "));
    console.log("Natija: " + (a24 * 168 + b24 * 24));
}
