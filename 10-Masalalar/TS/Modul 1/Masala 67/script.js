"use strict";
// [Mavzu: Shart operatorlari]
/*
67. Oy raqami berilgan. Shu oyda nechta kun borligini chiqaruvchi
programma tuzilsin.
*/
{
    let oy = 2;
    let kunlarSoni;
    switch (oy) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            kunlarSoni = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            kunlarSoni = 30;
            break;
        case 2:
            kunlarSoni = 28;
            break;
        default:
            kunlarSoni = 0;
    }
    if (kunlarSoni === 0) {
        console.log("Bunday oy yo'q");
    }
    else {
        console.log(kunlarSoni + " kun");
    }
}
