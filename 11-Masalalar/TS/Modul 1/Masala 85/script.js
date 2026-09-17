"use strict";
// [Mavzu: Sikl operatorlari]
/*
85. 3 xonali sonlar ichida 3 ga va 5 ga bo'linadigan sonlar nechtaligini
aniqlovchi dastur tuzing.
*/
{
    let soni = 0;
    for (let i = 100; i <= 999; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            soni++;
        }
    }
    console.log("Soni: " + soni);
}
