"use strict";
// [Mavzu: Shart operatorlari]
/*
46. Uch xonali a sonni berilgan. Shu sondagi eng katta raqamni aniqlovchi
dastur tuzing.

Input: Output:
a = 584  8
a = 402  4
a = 626 6
a = 101 1
*/
{
    let a46 = Number(prompt("Uch xonali sonni kiriting: "));
    let yuzlar46 = (a46 / 100) | 0;
    let onlar46 = ((a46 % 100) / 10) | 0;
    let birliklar46 = a46 % 10;
    if (yuzlar46 >= onlar46 && yuzlar46 >= birliklar46) {
        console.log("Natija: " + yuzlar46);
    }
    else if (onlar46 >= yuzlar46 && onlar46 >= birliklar46) {
        console.log("Natija: " + onlar46);
    }
    else {
        console.log("Natija: " + birliklar46);
    }
}
