"use strict";
// [Mavzu: Sikl operatorlari]
/*
73. a va b butun sonlar berilgan (a<b). a dan b gacha bo'lgan barcha
butun sonlarni    ko'paytmasini chiqaruvchi dastur tuzing. (a va b
ham ko'paytmaga kirsin)
*/
{
    let a = 2;
    let b = 6;
    let kopaytma = 1;
    for (let i = a; i <= b; i++) {
        kopaytma *= i;
    }
    console.log("Ko'paytma: " + kopaytma);
}
