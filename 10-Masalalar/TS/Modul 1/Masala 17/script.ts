// [Mavzu: Chiziqli algoritmlar]
/*
17. Faylning hajmi baytlarda berilgan. Fayl hajmini to'liq kilobaytlarda
ifodalovchi programma tuzilsin.
*/

{
let bayt: number = Number(prompt("Fayl hajmini baytlarda kiriting: "));
let kilobayt: number = Math.floor(bayt / 1024);
console.log("Fayl hajmi to'liq kilobaytlarda: " + kilobayt + " KB");
}
