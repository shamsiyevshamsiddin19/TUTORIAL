"use strict";
// [Mavzu: Sikl operatorlari]
/*
93. n butun soni berilgan. Berilgan son raqamlarini teskari tartibda
chiqaruvchi programma tuzilsin.
*/
{
    let n = 12345;
    let teskari = "";
    while (n > 0) {
        teskari += n % 10;
        n = Math.floor(n / 10);
    }
    console.log(teskari);
}
