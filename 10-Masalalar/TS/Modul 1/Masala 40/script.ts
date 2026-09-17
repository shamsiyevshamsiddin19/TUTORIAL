// [Mavzu: Shart operatorlari]
/*
40. A son berilgan. Agar A musbat bo'lsa 1 qo'shilgan, manfiy bo'lsa
absolyut qiymatiga (moduliga) 2 qo'shilgan, aks holda 100 ga
bo'lingan qiymatini chiqaruvchi dastur tuzilsin.
*/

{
let a40: number = Number(prompt("A sonni kiriting: "));
if (a40 > 0) {
    console.log("Natija: " + (a40 + 1));
} else if (a40 < 0) {
    console.log("Natija: " + (Math.abs(a40) + 2));
} else {
    console.log("Natija: " + (a40 / 100));
}
}
