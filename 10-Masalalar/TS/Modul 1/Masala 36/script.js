"use strict";
// [Mavzu: Shart operatorlari]
/*
36. Berilgan 3 ta sondan bir xil bo'lmaganini ekranga chiqaradigan dastur
tuzing. Agar barcha sonlar bir xil bo'lsa '=' belgisi chiqsin.

Input: Output:
a=2, b=4, c=4 2
a=0, b=4, c=3 0 4 3
a=2, b=2, c=2 =
*/
{
    let a36 = Number(prompt("Birinchi sonni kiriting: "));
    let b36 = Number(prompt("Ikkinchi sonni kiriting: "));
    let c36 = Number(prompt("Uchinchi sonni kiriting: "));
    if (a36 !== b36 && a36 !== c36 && b36 !== c36) {
        console.log("Natija: " + a36 + " " + b36 + " " + c36);
    }
    else if (a36 == b36 && a36 !== c36 && b36 !== c36) {
        console.log("Natija: " + c36);
    }
    else if (a36 !== b36 && a36 == c36 && b36 !== c36) {
        console.log("Natija: " + b36);
    }
    else if (a36 !== b36 && a36 !== c36 && b36 == c36) {
        console.log("Natija: " + a36);
    }
    else {
        console.log("Natija: =");
    }
}
