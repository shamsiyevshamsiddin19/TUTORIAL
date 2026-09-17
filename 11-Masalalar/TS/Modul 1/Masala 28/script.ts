// [Mavzu: Chiziqli algoritmlar]
/*
28. Berigan 3xonali sonning raqamlari ko'paymasini toping.
*/

{
let son28: number = Number(prompt("Uch xonali sonni kiriting: "));
let yuzlar28: number = (son28 / 100) | 0;
let onlar28: number = ((son28 % 100) / 10) | 0;
let birliklar28: number = son28 % 10;
console.log("Natija: " + yuzlar28 * onlar28 * birliklar28);
}
