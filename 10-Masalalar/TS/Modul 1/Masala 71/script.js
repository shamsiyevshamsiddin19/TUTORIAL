"use strict";
// [Mavzu: Sikl operatorlari]
/*
71. a dan b gacha butun sonlar berilgan (a<b) a va b sonlari orasidagi
barcha butun sonlarni yig'indisini chiqaruv chi programma tuzilsin .
a va b yig'indiga kirmasin.
*/
{
    let a = 4;
    let b = 12;
    let yigindi = 0;
    for (let i = a + 1; i < b; i++) {
        yigindi += i;
    }
    console.log("Yig'indi: " + yigindi);
}
