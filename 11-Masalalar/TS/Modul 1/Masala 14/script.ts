// [Mavzu: Chiziqli algoritmlar]
/*
14. Uch xonali son berilgan. Uning raqamlarini teskari tartibda
yozilishidan hosil bo'lgan sonni chiqaruvchi dastur tuzilsin. Masalan:
123 -> 321
*/

{
let n14: number = Number(prompt("Uch xonali sonni kiriting: "));
let yuzlar14: number = (n14 / 100) | 0;
let onlar14: number = ((n14 % 100) / 10) | 0;
let birliklar14: number = n14 % 10;
console.log("Natija: " + (birliklar14 * 100 + onlar14 * 10 + yuzlar14));
}
