"use strict";
// [Mavzu: Shart operatorlari]
/*
64. a va b butun sonlar berilgan. Agar o'zgaruvchilar o'zaro teng
bo'lmasa, a va b o'zgaruv chilari ularning yig'indisini o'zlashtirsin, aks
holda 0 ni o'zlashtirsin. a va b ning qiymatini ekranga chiqaring.
*/
{
    let a = 14;
    let b = 9;
    if (a !== b) {
        let yigindi = a + b;
        a = yigindi;
        b = yigindi;
    }
    else {
        a = 0;
        b = 0;
    }
    console.log("a = " + a);
    console.log("b = " + b);
}
