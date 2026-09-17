// [Mavzu: Shart operatorlari]
/*
58. Butun son berilgan. Agar son musbat bo'lsa, 1 ga oshirilsin, agar
manfiy bo'lsa, 2 ga kamaytiring. Agar 0 ga teng bo'lsa, 10 ni
o'zlashtirsin. Hosil bo'lgan sonni ekranga chiqaruvchi programma
tuzilsin.
*/

{
let son: number = Number(prompt("Butun sonni kiriting: "));

if (son > 0) {
    son += 1;
} else if (son < 0) {
    son -= 2;
} else {
    son = 10;
}

console.log("Natija: " + son);
}
