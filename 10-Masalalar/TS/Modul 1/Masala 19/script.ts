// [Mavzu: Chiziqli algoritmlar]
/*
19. Qo'shimcha o'zgaruvchidan foydalanmasdan a va b o'zgaruvchilar
qiymatini almashtirib ekranga chiqaruvchi dastur tuzing.
Masalan, a=3 va b=4 kiritilsa, u holda ekranga  a=4 va b=3 kabi
chiqarilishi kerak
*/

{
let a19: number = Number(prompt("a ni kiriting: "));
let b19: number = Number(prompt("b ni kiriting: "));
a19=a19+b19;
b19=a19-b19;
a19=a19-b19;
console.log("a: " + a19 + ", b: " + b19);
}
