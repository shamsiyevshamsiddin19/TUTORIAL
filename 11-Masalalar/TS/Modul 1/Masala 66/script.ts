// [Mavzu: Shart operatorlari]
/*
66. 1-7 gacha butun s onlar berilgan. Kiritilgan songa mos ravishda hafta
kunlarini ekranga chiqaruvchi programma tuzilsin. (1-Dushanba, 2 -
Seshanba, ...)
*/

{
let kunRaqami: number = 4;
let kun: string;

switch (kunRaqami) {
  case 1:
    kun = "Dushanba";
    break;
  case 2:
    kun = "Seshanba";
    break;
  case 3:
    kun = "Chorshanba";
    break;
  case 4:
    kun = "Payshanba";
    break;
  case 5:
    kun = "Juma";
    break;
  case 6:
    kun = "Shanba";
    break;
  case 7:
    kun = "Yakshanba";
    break;
  default:
    kun = "Bunday hafta kuni yo'q";
}

console.log(kun);
}
