"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
18. Berilgan n sekund necha soat va minutdan iboratligini aniqlaydigan
dastur tuzing.  Input: n=3662.   Output: 1 soat 1 minut.
*/
{
    let n18 = Number(prompt("Sekundni kiriting: "));
    let soat = (n18 / 3600) | 0;
    let minut = ((n18 % 3600) / 60) | 0;
    console.log(soat + " soat " + minut + " minut");
}
