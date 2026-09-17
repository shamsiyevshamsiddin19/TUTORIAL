// [Mavzu: Sikl operatorlari]
/*
90. 1 kg konfet narxi berilgan (haqiqiy son). 0.1, 0.2, ..., 1 kg konfet
narxlarini ekranga chiqaruvchi programma tuzilsin.
*/

{
let narx: number = 18000;

for (let i = 1; i <= 10; i++) {
  let kg: number = i / 10;
  console.log(kg.toFixed(1) + " kg konfet narxi: " + narx * kg);
}
}
