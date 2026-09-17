// [Mavzu: Sikl operatorlari]
/*
110. while sikl operatori orqali 2 dan 9 gacha karra jadvalni ekranga
chiqaruvchi dastur tuzing.
*/

{
let i: number = 2;
while (i <= 9) {
  let j: number = 1;
  console.log(i + " lik karra jadvali:");
  while (j <= 10) {
    console.log(i + " * " + j + " = " + i * j);
    j++;
  }
  console.log("--------------------");
  i++;
}
}
