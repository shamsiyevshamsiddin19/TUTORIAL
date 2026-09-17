// [Mavzu: Shart operatorlari]
/*
59. Uchta butun son berilgan. Berilgan sonlar orasida nechta musbat son
borligini aniqlovchi programma tuzilsin.
*/

{
let a: number = Number(prompt("a sonini kiriting: "));
let b: number = Number(prompt("b sonini kiriting: "));
let c: number = Number(prompt("c sonini kiriting: "));

let musbatSoni: number = 0;

if (a > 0) {
    musbatSoni++;
}

if (b > 0) {
    musbatSoni++;
}

if (c > 0) {
    musbatSoni++;
}

console.log("Natija: " + musbatSoni + " ta musbat son bor.");
}
