// [Mavzu: Chiziqli algoritmlar]
/*
20. 999 dan katta son berilgan. Uni yuzliklar xonasidagi raqamni
aniqlovchi programma tuzilsin. (Masalan: input - 4783, output - 7)
*/

{
let n20: number = Number(prompt("999 dan katta sonни kiriting: "));
let yuzliklarxonasi: number = Number((n20 % 1000) / 100) | 0;
console.log("Yuzliklar xonasidagi raqam: " + yuzliklarxonasi);
}
