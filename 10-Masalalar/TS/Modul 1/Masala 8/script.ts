// [Mavzu: Chiziqli algoritmlar]
/*
8. 4 xonali son berilgan. Soning o'nlar va minglar xonasidagi raqamlar
ko'paytmasini aniqlovchi dastur tuzing.

Input: Output:
4529 8
7206 0
*/

{
let son8:number = Number(prompt("4 xonali sonni kiriting:"));

let on: number=(son8%100)/10 | 0;
let ming: number=(son8/1000) | 0;
let kopaytma: number=on*ming;

console.log("Soning o'nlar va minglar xonasidagi raqamlar ko'paytmasi: " + kopaytma);
}
