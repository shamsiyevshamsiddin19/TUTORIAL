// [Mavzu: Shart operatorlari]
/*
33. 5 ta butun son berilgan. Shu sonlar orasida nechta musbat va nechta
manfiy,  nechta nol   raqami borligini aniqlovchi dastur tuzing.
*/

{
let son1: number = Number(prompt("Birinchi sonni kiriting: "));
let son2: number = Number(prompt("Ikkinchi sonni kiriting: "));
let son3: number = Number(prompt("Uchinchi sonni kiriting: "));
let son4: number = Number(prompt("To'rtinchi sonni kiriting: "));
let son5: number = Number(prompt("Beshinchi sonni kiriting: "));    

let musbat: number = 0;
let manfiy: number = 0;
let nol: number = 0;

if (son1 > 0 ) {
    musbat ++;
} else if (son1 < 0) {
    manfiy ++;
} else {
    nol ++;
}

if (son2 > 0 ) {
    musbat ++;
} else if (son2 < 0) {
    manfiy ++;
} else {
    nol ++;
}

if (son3 > 0 ) {
    musbat ++;
} else if (son3 < 0) {
    manfiy ++;
} else {
    nol ++; 
}

if (son4 > 0 ) {
    musbat ++;
} else if (son4 < 0) {
    manfiy ++;
} else {
    nol ++;
}

if (son5 > 0 ) {
    musbat ++;
} else if (son5 < 0) {
    manfiy ++;
} else {
    nol ++;

}

console.log(`Musbat sonlar soni: ${musbat}`);
console.log(`Manfiy sonlar soni: ${manfiy}`);
console.log(`Nol sonlar soni: ${nol}`);
}
