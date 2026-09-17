"use strict";
// [Mavzu: Sikl operatorlari]
/*
83. Barcha 2 xonali sonlar ichida raqamlar yig'indisi 9 ga yoki 15 ga teng
bo'lgan sonlarni ekranga chiqaring.
*/
{
    for (let i = 10; i <= 99; i++) {
        let onlar = Math.floor(i / 10);
        let birlar = i % 10;
        let yigindi = onlar + birlar;
        if (yigindi === 9 || yigindi === 15) {
            console.log(i);
        }
    }
}
