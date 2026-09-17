"use strict";
// [Mavzu: Shart operatorlari]
/*
41. 3 ta a, b, c sonlar berilgan. Agar shu sonlardan ixtiyoriy biri
ikkinchisidan 10 taga yoki undan ko'proqqa farq qilsa, ekranga true,
aks holda false chiqaradigan dastur tuzing.

Input: Output:
a = 1, b = 7, c = 11 True
a = 1, b = 7, c = 10  False
a = 14, b = 7, c = 8 False
a = 14, b = 7, c = 2 True
*/
{
    let a41 = Number(prompt("Birinchi sonni kiriting: "));
    let b41 = Number(prompt("Ikkinchi sonni kiriting: "));
    let c41 = Number(prompt("Uchinchi sonni kiriting: "));
    if (Math.abs(a41 - b41) >= 10 || Math.abs(a41 - c41) >= 10 || Math.abs(b41 - c41) >= 10) {
        console.log("Natija: True");
    }
    else {
        console.log("Natija: False");
    }
}
