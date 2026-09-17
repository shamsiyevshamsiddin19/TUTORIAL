// [Mavzu: Chiziqli algoritmlar]
/*
5. A, B va C sonlar berilgan. A ni qiymati B ga, B ni qiymati C ga va C ni
qiymati A ga almashtirilsin. A, B va C ning yangi qiymati ekranga
chiqarilsin.
*/

{
let A5: number = Number(prompt("A sonini kiriting:"));
let B5: number = Number(prompt("B sonini kiriting:"));
let C5: number = Number(prompt("C sonini kiriting:"));

let almashtiruvchi:number=A5;
A5=B5;
B5=C5;
C5=almashtiruvchi;

console.log("A soni: " + A5);
console.log("B soni: " + B5);
console.log("C soni: " + C5);
}
