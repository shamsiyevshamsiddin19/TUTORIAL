// [Mavzu: Chiziqli algoritmlar]
/*
12.Uch xonali son berilgan. Uning yuzlar xonasidagi raqamni aniqlovchi
programma tuzilsin.
*/

{
let n12: number = Number(prompt("Uch xonali sonni kiriting: "));
let yuzlarxonasi: number = Number((n12 / 100) % 10 | 0);
console.log("Soning yuzlar xonasidagi raqami: " + yuzlarxonasi);
}
