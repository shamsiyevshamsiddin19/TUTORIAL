"use strict";
// [Mavzu: Shart operatorlari]
/*
55. A va B natural sonlar berilgan. Bu sonlarning biri ikkinchisining
kvadrati bo'lishi yoki bo'lmasligini aniqlaydigan dastur tuzing.
*/
{
    let A = Number(prompt("A sonini kiriting: "));
    let B = Number(prompt("B sonini kiriting: "));
    if (A === B * B || B === A * A) {
        console.log("Natija: A va B sonlarining biri ikkinchisining kvadrati.");
    }
    else {
        console.log("Natija: A va B sonlarining biri ikkinchisining kvadrati emas.");
    }
}
