// [Mavzu: Stringlar bilan ishlash]
/*
149. Str satridagi oxirgi 2 katta harfni ekranga chiqaruvchi dastur tuzing.
*/

{
let str: string = prompt("Matn kiriting:") || "";
let kattaHarflar: string = "";

for (let i = 0; i < str.length; i++) {
    if (str[i] >= 'A' && str[i] <= 'Z') {
        kattaHarflar += str[i];
    }
}

let oxirgiIkki: string = kattaHarflar.slice(-2);
console.log("Oxirgi 2 katta harf: " + oxirgiIkki);
}
