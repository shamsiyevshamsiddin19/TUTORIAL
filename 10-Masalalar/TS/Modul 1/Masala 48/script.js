"use strict";
// [Mavzu: Shart operatorlari]
/*
48. 3 ta a, b, c sonlari berilgan. Agar shu sonlar ichida faqat 2 tasi musbat
bo'lsa, bu sonlarni yig'indisini aks holda ko'paytmasini ekranga
chiqaruvchi dastur tuzing.

Input: Output:
a=2, b=1, c=7 14
a=8, b=10, c=0 18
a=7, b=-5, c=9 16
*/
{
    let a = Number(prompt("a sonini kiriting: "));
    let b = Number(prompt("b sonini kiriting: "));
    let c = Number(prompt("c sonini kiriting: "));
    let musbatSoni = 0;
    let yigindi = 0;
    let kopaytma = a * b * c;
    if (a > 0) {
        musbatSoni++;
        yigindi += a;
    }
    if (b > 0) {
        musbatSoni++;
        yigindi += b;
    }
    if (c > 0) {
        musbatSoni++;
        yigindi += c;
    }
    if (musbatSoni === 2) {
        console.log("Natija: " + yigindi);
    }
    else {
        console.log("Natija: " + kopaytma);
    }
}
