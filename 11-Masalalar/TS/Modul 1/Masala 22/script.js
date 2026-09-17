"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
22. a sutka va b soat berilgan, ikkalasi jami necha minut bo'lishini
aniqlovchi dastur tuzing.

Input: Output:
a=1, b=1 1500
a=0, b=4 240
a=7, b=0 10080
*/
{
    let a22 = Number(prompt("Sutka sonini kiriting: "));
    let b22 = Number(prompt("Soat sonini kiriting: "));
    console.log("Natija: " + (a22 * 1440 + b22 * 60));
}
