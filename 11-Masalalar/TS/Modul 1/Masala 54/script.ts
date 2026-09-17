// [Mavzu: Shart operatorlari]
/*
54. Uchta son berilgan. Shu sonlardan yig'indisi eng katta bo'ladigan
ikkitasini ekranga chiqaruvchi dastur tuzilsin.
*/

{
let a: number = Number(prompt("a sonini kiriting: "));
let b: number = Number(prompt("b sonini kiriting: "));
let c: number = Number(prompt("c sonini kiriting: "));

let max1: number = Math.max(a, b, c);
let max2: number;

if (max1 === a) {
    max2 = Math.max(b, c);
} else if (max1 === b) {
    max2 = Math.max(a, c);
} else {
    max2 = Math.max(a, b);
}

console.log("Natija: " + max1 + " va " + max2);
}
