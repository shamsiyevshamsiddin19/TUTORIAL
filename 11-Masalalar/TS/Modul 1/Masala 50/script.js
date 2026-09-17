"use strict";
// [Mavzu: Shart operatorlari]
/*
50. 3 ta a, b, c sonlar berilgan. Shu 3 ta sonni ko'paytmasini ekranga
chiqadigan dastur tuzing . Lekin agar sonlardan biri boshqasiga teng
bo'lsa, shu sonlar ko'paytmaga ishtirok etmasin.

Input: Output:
(10, 2, 3) 60
(3, 2, 3) 2
(3, 3, 3) 0
*/
{
    let a = Number(prompt("a sonini kiriting: "));
    let b = Number(prompt("b sonini kiriting: "));
    let c = Number(prompt("c sonini kiriting: "));
    let kopaytma = 1;
    let qatnashdi = false;
    if (a !== b && a !== c) {
        kopaytma *= a;
        qatnashdi = true;
    }
    if (b !== a && b !== c) {
        kopaytma *= b;
        qatnashdi = true;
    }
    if (c !== a && c !== b) {
        kopaytma *= c;
        qatnashdi = true;
    }
    console.log("Natija: " + (qatnashdi ? kopaytma : 0));
}
