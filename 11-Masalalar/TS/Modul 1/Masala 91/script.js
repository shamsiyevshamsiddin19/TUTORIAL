"use strict";
// [Mavzu: Sikl operatorlari]
/*
91. Berilgan sonning necha xonali ekanini aniqlovchi dastur tuzing.
*/
{
    let son = 54892;
    let vaqtincha = Math.abs(son);
    let xonaSoni = 0;
    if (vaqtincha === 0) {
        xonaSoni = 1;
    }
    else {
        while (vaqtincha > 0) {
            xonaSoni++;
            vaqtincha = Math.floor(vaqtincha / 10);
        }
    }
    console.log("Xonalar soni: " + xonaSoni);
}
