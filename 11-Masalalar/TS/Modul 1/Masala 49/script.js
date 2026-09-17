"use strict";
// [Mavzu: Shart operatorlari]
/*
49. 4 ta a, b, c, d son berilgan, kattasidan kichigini ayirib ekranga natijani
chiqaruvchi, agar u sonlar o'zaro teng bo'lsa yig'indisini ekranga
chiqaruvchi dastur tuzing.

Input: Output:
a=2, b=2, c=2, d=2 8
a=9, b=2, c=7, d=2 7
a=3, b=8, c=2, d=8 6
*/
{
    let a = Number(prompt("a sonini kiriting: "));
    let b = Number(prompt("b sonini kiriting: "));
    let c = Number(prompt("c sonini kiriting: "));
    let d = Number(prompt("d sonini kiriting: "));
    if (a === b && b === c && c === d) {
        console.log("Natija: " + (a + b + c + d));
    }
    else {
        let maxSon = Math.max(a, b, c, d);
        let minSon = Math.min(a, b, c, d);
        console.log("Natija: " + (maxSon - minSon));
    }
}
