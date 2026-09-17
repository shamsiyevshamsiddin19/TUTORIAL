// [Mavzu: Sikl operatorlari]
/*
97. n butun soni berilgan. Berilgan son raqamlari yig'indisini va raqamlari
sonini chiqaruvchi programma tuzilsin.
*/

{
let n: number = 48291;
let vaqtincha: number = Math.abs(n);
let yigindi: number = 0;
let raqamlarSoni: number = 0;

if (vaqtincha === 0) {
  raqamlarSoni = 1;
} else {
  while (vaqtincha > 0) {
    yigindi += vaqtincha % 10;
    raqamlarSoni++;
    vaqtincha = Math.floor(vaqtincha / 10);
  }
}

console.log("Raqamlar yig'indisi: " + yigindi);
console.log("Raqamlar soni: " + raqamlarSoni);
}
