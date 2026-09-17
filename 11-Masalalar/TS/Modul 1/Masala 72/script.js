"use strict";
// [Mavzu: Sikl operatorlari]
/*
72. n soni va a butun son berilgan (n>0). a ning n - darajasini aniqlovchi
dastur tuzing.
*/
{
    let n = 5; // daraja
    let a = 2; // asos
    let natija = 1;
    for (let i = 0; i < n; i++) {
        natija *= a;
    }
    console.log(a + " ning " + n + "-darajasi: " + natija);
}
