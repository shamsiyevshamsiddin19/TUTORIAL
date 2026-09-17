// [Mavzu: Shart operatorlari]
/*
53. 3 ta a, b, c sonlar berilgan. Agar ixtiyoriy 2ta sonni qo'shib, qolgan 3 -
songa teng bo'lsa, ekranga true, aks holda false chiqaring.
*/

{
let a: number = Number(prompt("a sonini kiriting: "));
let b: number = Number(prompt("b sonini kiriting: "));
let c: number = Number(prompt("c sonini kiriting: "));

if (a + b === c || a + c === b || b + c === a) {
    console.log("Natija: true");
} else {
    console.log("Natija: false");
}
}
