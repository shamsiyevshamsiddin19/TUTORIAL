// [Mavzu: Sikl operatorlari]
/*
84. Barcha 3 xonali sonlar ichida raqamlar yig'indisi 20 ga teng bo'lgan
sonlarni ekranga chiqaring.
*/

{
for (let i = 100; i <= 999; i++) {
  let yuzlar: number = Math.floor(i / 100);
  let onlar: number = Math.floor((i % 100) / 10);
  let birlar: number = i % 10;

  if (yuzlar + onlar + birlar === 20) {
    console.log(i);
  }
}
}
