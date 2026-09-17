"use strict";
// [Mavzu: Shart operatorlari]
/*
45.Jumlani rostlikka tekshiring: Berilgan uch xonali sonning raqamlari
ketma ket o'suvchi yoki kamayuvchi bo'lib joylashgan.
*/
{
    let n45 = Number(prompt("Uch xonali sonni kiriting: "));
    let yuzlar45 = (n45 / 100) | 0;
    let onlar45 = ((n45 % 100) / 10) | 0;
    let birliklar45 = n45 % 10;
    if ((yuzlar45 < onlar45 && onlar45 < birliklar45) || (yuzlar45 > onlar45 && onlar45 > birliklar45)) {
        console.log("Natija: True");
    }
    else {
        console.log("Natija: False");
    }
}
