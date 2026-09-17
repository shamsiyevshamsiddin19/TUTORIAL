"use strict";
// [Mavzu: Sikl operatorlari]
/*
89. a va b butun sonlari berilgan (a<b). a dan b gacha barcha butun
sonlarni ko'paytmasini ekranga chiqaruvchi programma tuzilsin.
*/
{
    let a = 3;
    let b = 7;
    let kopaytma = 1;
    for (let i = a; i <= b; i++) {
        kopaytma *= i;
    }
    console.log("Ko'paytma: " + kopaytma);
}
