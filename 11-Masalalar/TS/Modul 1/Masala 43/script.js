"use strict";
// [Mavzu: Shart operatorlari]
/*
43.Uchta butun a, b, c sonlar berilgan. Jumlani rostlikka tekshiring: a, b, c
sonlarning faqat ikkitasi musbat son.
*/
{
    let a43 = Number(prompt("Birinchi sonni kiriting: "));
    let b43 = Number(prompt("Ikkinchi sonni kiriting: "));
    let c43 = Number(prompt("Uchinchi sonni kiriting: "));
    if ((a43 > 0 && b43 > 0 && c43 <= 0) || (a43 > 0 && b43 <= 0 && c43 > 0) || (a43 <= 0 && b43 > 0 && c43 > 0)) {
        console.log("Natija: True");
    }
    else {
        console.log("Natija: False");
    }
}
