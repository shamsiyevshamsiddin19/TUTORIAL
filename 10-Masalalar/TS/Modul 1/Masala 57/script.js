"use strict";
// [Mavzu: Shart operatorlari]
/*
57. A, B, C haqiqiy sonlari berilgan. Agar berilgan sonlar o'sish yoki
kamayish tartibida berilgan bo'lsa, sonlarni ikkilantiring, aks holda
sonlarni ishorasi o'zgartirilsin. A, B, C ning qiymatlari ekranga
chiqarilsin.
*/
{
    let A = Number(prompt("A sonini kiriting: "));
    let B = Number(prompt("B sonini kiriting: "));
    let C = Number(prompt("C sonini kiriting: "));
    if ((A < B && B < C) || (A > B && B > C)) {
        A *= 2;
        B *= 2;
        C *= 2;
    }
    else {
        A = -A;
        B = -B;
        C = -C;
    }
    console.log("Natija: " + A + ", " + B + ", " + C);
}
