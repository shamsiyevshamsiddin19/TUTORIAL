"use strict";
// [Mavzu: Sikl operatorlari]
/*
101. n butun soni berilgan. Berilgan son raqamlari orasida juft raqamlar
bor yo'qligini aniqlovchi programma tuzilsin.
*/
{
    let n = Number(prompt("sonni kriting:"));
    n = Math.abs(n);
    let hasEvenDigit = n === 0;
    while (n > 0) {
        let digit = n % 10;
        if (digit % 2 === 0) {
            hasEvenDigit = true;
            break;
        }
        n = Math.floor(n / 10);
    }
    console.log(hasEvenDigit ? "Juft raqam bor" : "Juft raqam yo'q");
}
