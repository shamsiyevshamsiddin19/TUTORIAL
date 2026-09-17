"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
31. Uch xonali son berilgan. Uni o'ngliklar xonasidagi raqam bilan
yuzliklar xonasidagi raqamni almashtirishdan hosil bo'lgan sonni
aniqlovchi programma tuzilsin.
Input: n=358.   Output: 538.
*/
{
    let n31 = Number(prompt("Uch xonali sonni kiriting: "));
    let yuzlar31 = (n31 / 100) | 0;
    let onlar31 = ((n31 % 100) / 10) | 0;
    let birliklar31 = n31 % 10;
    console.log("Natija: " + (onlar31 * 100 + yuzlar31 * 10 + birliklar31));
}
