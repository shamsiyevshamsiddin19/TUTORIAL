"use strict";
// [Mavzu: Sikl operatorlari]
/*
69. 1 dan 100 gacha bo'lgan toq sonlarni alohida va juft sonlarni alohida
qatorda ekranga chiqaruvchi dastur tuzing.
*/
{
    let toqlar = "";
    let juftlar = "";
    for (let i = 1; i <= 100; i++) {
        if (i % 2 !== 0)
            toqlar += i + " ";
        else
            juftlar += i + " ";
    }
    console.log("Toq sonlar: " + toqlar);
    console.log("Juft sonlar: " + juftlar);
}
