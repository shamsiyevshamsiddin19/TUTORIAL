// [Mavzu: Shart operatorlari]
/*
32. Berilgan 4 xonali sonda 3 raqami ishtirok etgan yoki etmaganligini
aniqlaydigan dastur tuzing.

Input: Output:
N = 4253 True
N = 3253 True
N = 4157 False
*/

{
let N32: number = Number(prompt("4 xonali sonni kiriting: "));
let birliklar32: number = N32 % 10;
let onliklar32: number = ((N32 % 100) / 10) | 0;
let yuzliklar32: number = ((N32 % 1000) / 100) | 0;
let qoldiq32: number = ((N32 % 10000) / 1000) | 0;
if (birliklar32 == 3 || onliklar32 == 3 || yuzliklar32 == 3 || qoldiq32 == 3) {
    console.log("Natija: True");
} else {
    console.log("Natija: False");
}
}
