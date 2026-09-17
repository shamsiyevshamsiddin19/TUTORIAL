"use strict";
// [Mavzu: Sikl operatorlari]
/*
97. n butun soni berilgan. Berilgan son raqamlari yig'indisini va raqamlari
sonini chiqaruvchi programma tuzilsin.
*/
{
    let n = 48291;
    let vaqtincha = Math.abs(n);
    let yigindi = 0;
    let raqamlarSoni = 0;
    if (vaqtincha === 0) {
        raqamlarSoni = 1;
    }
    else {
        while (vaqtincha > 0) {
            yigindi += vaqtincha % 10;
            raqamlarSoni++;
            vaqtincha = Math.floor(vaqtincha / 10);
        }
    }
    console.log("Raqamlar yig'indisi: " + yigindi);
    console.log("Raqamlar soni: " + raqamlarSoni);
}
