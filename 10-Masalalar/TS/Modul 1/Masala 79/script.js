"use strict";
// [Mavzu: Sikl operatorlari]
/*
79. Barcha 2 xonali sonlar ichida kamida 1 ta raqami 8 bo'lgan barcha
sonlarni ekranga chiqaruvchi dastur tuzing.
*/
{
    for (let i = 10; i <= 99; i++) {
        let onlar = Math.floor(i / 10);
        let birlar = i % 10;
        if (onlar === 8 || birlar === 8) {
            console.log(i);
        }
    }
}
