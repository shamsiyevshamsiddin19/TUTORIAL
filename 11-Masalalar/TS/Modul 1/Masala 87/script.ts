// [Mavzu: Sikl operatorlari]
/*
87. 1 kg konfet narxi berilgan (haqiqiy son). 1.1, 1.2, ..., 2 kg konfet
narxlarini ekranga chiqaruvchi programma tuzilsin.
*/

{
let narx: number = 18000;

for (let i = 11; i <= 20; i++) {
  let kg: number = i / 10;
  console.log(kg.toFixed(1) + " kg konfet narxi: " + narx * kg);
}
}
