"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
21. Uch xonali son berilgan. Uni o'ngdan birinchi raqamni o'chirib, chap
tarafiga yozishdan hosil bo'lgan sonni aniqlovchi programma tuzilsin.
(Masalan: input - 473, output - 347)
*/
{
    let n21 = Number(prompt("Uch xonali sonni kiriting: "));
    let birlar = n21 % 10;
    let qolgani = (n21 / 10) | 0;
    console.log("Natija: " + (birlar * 100 + qolgani));
}
