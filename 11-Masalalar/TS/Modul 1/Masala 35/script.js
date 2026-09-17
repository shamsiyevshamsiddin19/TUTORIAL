"use strict";
// [Mavzu: Shart operatorlari]
/*
35. Imtihondan olingan ball kiritilsa uning bahosini aniqlovchi dastur
tuzing.

Bunda 0-54 -> 2 baho, 55-70 -> 3 baho, 71-84 -> 4 baho, 85-100
-> 5                baho ga teng.

Input: Output:
54 "2  baho"
60  "3  baho"
91 "5  baho"
*/
{
    let ball = Number(prompt("Imtihondan olingan ballni kiriting: "));
    if (ball >= 0 && ball <= 54) {
        console.log("Natija: " + ball + " 2  baho");
    }
    else if (ball >= 55 && ball <= 70) {
        console.log("Natija: " + ball + " 3  baho");
    }
    else if (ball >= 71 && ball <= 84) {
        console.log("Natija: " + ball + " 4  baho");
    }
    else if (ball >= 85 && ball <= 100) {
        console.log("Natija: " + ball + " 5  baho");
    }
}
