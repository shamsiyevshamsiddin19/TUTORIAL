// [Mavzu: Chiziqli algoritmlar]
/*
10. a haqiqiy son berilgan bo'lsin. Faqat ko'paytirish amalidan
foydalanib: a^7 darajasini 4 ta amal bilan hisoblaydigan dastur tuzing.
*/

{
let a10: number = Number(prompt("Haqiqiy sonни kiriting: "));
let A1: number = a10 * a10;
let A2: number = A1 * a10;
let A3: number = A2 * A2;
let A4: number = A3 * a10;
console.log("a ning 7-darajasi: " + A4);
}
