"use strict";
// [Mavzu: Shart operatorlari]
/*
65. Oy raqami berilgan. Kiritilgan oy qaysi faslga tegishli ekanligini
chiqaruvchi programma tuzilsin. (3-oy bahor, 11-oy kuz)
*/
{
    let oy = 11;
    let fasl;
    switch (oy) {
        case 12:
        case 1:
        case 2:
            fasl = "Qish";
            break;
        case 3:
        case 4:
        case 5:
            fasl = "Bahor";
            break;
        case 6:
        case 7:
        case 8:
            fasl = "Yoz";
            break;
        case 9:
        case 10:
        case 11:
            fasl = "Kuz";
            break;
        default:
            fasl = "Bunday oy yo'q";
    }
    console.log(fasl);
}
