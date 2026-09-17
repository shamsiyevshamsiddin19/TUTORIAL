"use strict";
// [Mavzu: Shart operatorlari]
/*
62. Uchta son berilgan. Shu sonlarni o'rtanchasi (ya'ni katta va kichik
sonlar orasidagi son) ni aniqlovchi dastur tuzing.
*/
{
    let a = 18;
    let b = 7;
    let c = 12;
    let ortancha;
    if ((a > b && a < c) || (a > c && a < b)) {
        ortancha = a;
    }
    else if ((b > a && b < c) || (b > c && b < a)) {
        ortancha = b;
    }
    else {
        ortancha = c;
    }
    console.log("O'rtancha son: " + ortancha);
}
