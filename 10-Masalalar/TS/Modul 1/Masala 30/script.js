"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
30. Bitta belgi kompyuter xotirasidan 2 bayt joy oladi deb biling. Faylning
hajmi foydalanuvchi tomonidan KBaytda kiritilsa unda nechta belgi
borligini aniqlovchi dastur tuzing.
*/
{
    let hajm = Number(prompt("Fayl hajmini kiriting (KB): "));
    let belgilar = hajm * 1024 / 2;
    console.log("Natija: " + belgilar + " belgi");
}
