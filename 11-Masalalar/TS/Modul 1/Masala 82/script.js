"use strict";
// [Mavzu: Sikl operatorlari]
/*
82. 3 xonali sonlar ichidan barcha palindrom sonlar ekranga chiqarilsin.
Palindrom son o'ngdan o'qisa ham chapdan o'qisa ham bir xil sonlar
Masalan : 101, 232, 222,606,888, 919
*/
{
    for (let i = 100; i <= 999; i++) {
        let yuzlar = Math.floor(i / 100);
        let birlar = i % 10;
        if (yuzlar === birlar) {
            console.log(i);
        }
    }
}
