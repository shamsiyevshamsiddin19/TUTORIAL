// [Mavzu: Sikl operatorlari]
/*
93. n butun soni berilgan. Berilgan son raqamlarini teskari tartibda
chiqaruvchi programma tuzilsin.
*/

{
let n: number = 12345;
let teskari: string = "";

while (n > 0) {
  teskari += n % 10;
  n = Math.floor(n / 10);
}

console.log(teskari);
}
