"use strict";
// [Mavzu: Shart operatorlari]
/*
54. Uchta son berilgan. Shu sonlardan yig'indisi eng katta bo'ladigan
ikkitasini ekranga chiqaruvchi dastur tuzilsin.
*/
{
    let a = Number(prompt("a sonini kiriting: "));
    let b = Number(prompt("b sonini kiriting: "));
    let c = Number(prompt("c sonini kiriting: "));
    let max1 = Math.max(a, b, c);
    let max2;
    if (max1 === a) {
        max2 = Math.max(b, c);
    }
    else if (max1 === b) {
        max2 = Math.max(a, c);
    }
    else {
        max2 = Math.max(a, b);
    }
    console.log("Natija: " + max1 + " va " + max2);
}
