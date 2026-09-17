"use strict";
// [Mavzu: Sikl operatorlari]
/*
80. Barcha 3 xonali sonlar ichida o'nlar xonasidagi raqam 7 ga teng
bo'lgan barcha sonlarni ekranga chiqaruvchi dastur tuzing.
*/
{
    for (let i = 100; i <= 999; i++) {
        let onlar = Math.floor((i % 100) / 10);
        if (onlar === 7) {
            console.log(i);
        }
    }
}
