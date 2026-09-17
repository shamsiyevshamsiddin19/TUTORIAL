// [Mavzu: Sikl operatorlari]
/*
99. n butun soni berilgan. Berilgan son raqamlarini teskari tartibda
chiqaruvchi programma tuzilsin.
*/

{
let n: number = 9876;
let teskari: number = 0;

while (n > 0) {
  teskari = teskari * 10 + (n % 10);
  n = Math.floor(n / 10);
}

console.log("Teskari son: " + teskari);
}
