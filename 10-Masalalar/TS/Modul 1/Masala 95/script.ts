// [Mavzu: Sikl operatorlari]
/*
95. n butun soni berilgan. Quyidagi ko'paytmani hisoblovchi programma
tuzilsin: S = 1.1 * 1.2 * 1.3 * ...    (n ta ko'paytuvchi)
*/

{
let n: number = 5;
let s: number = 1;

for (let i = 1; i <= n; i++) {
  s *= 1 + i / 10;
}

console.log("S = " + s);
}
