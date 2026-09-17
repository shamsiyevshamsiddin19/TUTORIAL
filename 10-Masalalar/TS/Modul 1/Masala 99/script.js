"use strict";
// [Mavzu: Sikl operatorlari]
/*
99. n butun soni berilgan. Berilgan son raqamlarini teskari tartibda
chiqaruvchi programma tuzilsin.
*/
{
    let n = 9876;
    let teskari = 0;
    while (n > 0) {
        teskari = teskari * 10 + (n % 10);
        n = Math.floor(n / 10);
    }
    console.log("Teskari son: " + teskari);
}
