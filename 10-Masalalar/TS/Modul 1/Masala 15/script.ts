// [Mavzu: Chiziqli algoritmlar]
/*
15. To'rt xonali son berilgan. Uning raqamlari ko'paytmasini hisoblovchi
dastur tuzilsin.
*/

{
let sonn: number = Number(prompt("To'rt xonali sonni kiriting: "));
let minglar: number = (sonn / 1000) | 0;
let yuzlar: number = ((sonn % 1000) / 100) | 0;
let onlar: number = ((sonn % 100) / 10) | 0;
let birliklar: number = sonn % 10;
console.log("Natija: " + minglar * yuzlar * onlar * birliklar);
}
