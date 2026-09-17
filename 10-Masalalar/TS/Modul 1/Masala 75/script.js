"use strict";
// [Mavzu: Sikl operatorlari]
/*
75. n butun soni berilgan (n > 0). Agar n soni 3 ning darajasi bo'lsa
"3 ning darajasi", aks xolda "3 ning darajasi emas" degan natija
chiqarwchi dastur tuzing.
ESLATMA: Qoldiqli bo'lish va bo'lish amallarini ishlatmang.
*/
{
    let n = 81;
    let daraja = 1;
    while (daraja < n) {
        daraja *= 3;
    }
    if (daraja === n) {
        console.log("3 ning darajasi");
    }
    else {
        console.log("3 ning darajasi emas");
    }
}
