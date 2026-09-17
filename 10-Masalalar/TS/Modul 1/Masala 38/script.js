"use strict";
// [Mavzu: Shart operatorlari]
/*
38. Berilgan 4 xonali sonda minglar yoki birlar xonasida 3 raqami ishtirok
etgan yoki etmaganligini aniqlaydigan dastur tuzing.

Input: Output:
3321 "ishtirok etgan"
6543 "ishtirok etgan"
8765 "ishtirok etmagan"
*/
{
    let son38 = Number(prompt("4 xonali sonni kiriting: "));
    let birliklar38 = son38 % 10;
    let minglar38 = ((son38 % 10000) / 1000) | 0;
    if (birliklar38 == 3 || minglar38 == 3) {
        console.log("Natija: ishtirok etgan");
    }
    else {
        console.log("Natija: ishtirok etmagan");
    }
}
