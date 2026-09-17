"use strict";
// [Mavzu: Sikl operatorlari]
/*
98. n butun soni berilgan. Berilgan son raqamlari orasida 5 raqami bor
yo'qligini aniqlovchi programma tuzilsin.
*/
{
    let n = 74251;
    let vaqtincha = Math.abs(n);
    let bor = false;
    while (vaqtincha > 0) {
        if (vaqtincha % 10 === 5) {
            bor = true;
            break;
        }
        vaqtincha = Math.floor(vaqtincha / 10);
    }
    if (bor) {
        console.log("5 raqami bor");
    }
    else {
        console.log("5 raqami yo'q");
    }
}
