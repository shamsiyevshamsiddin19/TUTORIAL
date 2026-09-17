// [Mavzu: Chiziqli algoritmlar]
/*
1.  3 ta sonni o'rta arifmetigini topuvchi dastur tuzing.
3 ta son uchun o'rta arifmetik formulasi: (a+b+c)/3
*/

{
let a: number = Number(prompt("Birinchi sonni kiriting:"));
let b: number = Number(prompt("Ikkinchi sonni kiriting:"));
let c: number = Number(prompt("Uchinchi sonni kiriting:"));

let ortachaArifmetik: number = (a + b + c) / 3;

console.log("3 ta sonning o'rta arifmetigi: " + ortachaArifmetik);
}
