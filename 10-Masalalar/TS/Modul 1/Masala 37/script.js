"use strict";
// [Mavzu: Shart operatorlari]
/*
37. 2 ta a va b butun sonlar berilgan. Ularning yig'indisi 10...19 oraliqda
bo'lsa, ekranga 20 chiqaring, aks holda yig'indini o'zini chiqaradigan
dastur tuzilsin.

Input: Output:
a = 3, b =4 7
a = 9, b =4 20
a = 11, b =10 21
*/
{
    let a37 = Number(prompt("Birinchi sonni kiriting: "));
    let b37 = Number(prompt("Ikkinchi sonni kiriting: "));
    if (a37 + b37 >= 10 && a37 + b37 <= 19) {
        console.log("Natija: 20");
    }
    else {
        console.log("Natija: " + (a37 + b37));
    }
}
