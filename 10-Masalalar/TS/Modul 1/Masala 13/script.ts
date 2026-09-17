// [Mavzu: Chiziqli algoritmlar]
/*
13.Uch xonali son berilgan. Uni chapdan birinchi raqamни o'chirib, o'n
tarafiga yozishdan hosil bo'lgan sonни aniqlovchi programma tuzilsin.
(Masalan: input - 478, output - 784)
*/

{
let n13: number = Number(prompt("Uch xonali sonни kiriting: "));
let qolgan: number = n13 % 100;
let birinchi: number = (n13 / 100) | 0;
console.log("Natija: " + (qolgan * 10 + birinchi));
}
