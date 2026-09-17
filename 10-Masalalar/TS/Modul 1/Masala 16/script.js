"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
16. Uch xonali son berilgan. Uning raqamlari yig'indisi hisoblovchi dastur
tuzilsin.
*/
{
    let son16 = Number(prompt("Uch xonali sonни kiriting: "));
    let yuzlar16 = (son16 / 100) | 0;
    let onlar16 = ((son16 % 100) / 10) | 0;
    let birliklar16 = son16 % 10;
    console.log("Natija: " + (yuzlar16 + onlar16 + birliklar16));
}
