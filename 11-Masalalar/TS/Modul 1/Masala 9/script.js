"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
9. Berilgan to'rt xonali sonni o'nlar xonasidagi raqamni aniqlab natijani
ekranga chiqaradigan dastur tuzing.

Input: Output:
N = 1452 5
N = 4789  8
*/
{
    let n = Number(prompt("To'rt xonali sonни kiriting: "));
    let onlarxonasi = Math.floor((n % 100) / 10);
    console.log("Soning o'nlar xonasidagi raqami: " + onlarxonasi);
}
