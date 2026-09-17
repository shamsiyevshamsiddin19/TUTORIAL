"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
10. a haqiqiy son berilgan bo'lsin. Faqat ko'paytirish amalidan
foydalanib: a^7 darajasini 4 ta amal bilan hisoblaydigan dastur tuzing.
*/
{
    let a10 = Number(prompt("Haqiqiy sonни kiriting: "));
    let A1 = a10 * a10;
    let A2 = A1 * a10;
    let A3 = A2 * A2;
    let A4 = A3 * a10;
    console.log("a ning 7-darajasi: " + A4);
}
