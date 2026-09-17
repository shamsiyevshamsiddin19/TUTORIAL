// [Mavzu: Sikl operatorlari]
/*
86. Barcha 2 xonali sonlar ichida raqamlar yig'indisi 12 dan katta bo'lgan
barcha sonlarni ekranga chiqaring.
*/

{
for (let i = 10; i <= 99; i++) {
  let onlar: number = Math.floor(i / 10);
  let birlar: number = i % 10;

  if (onlar + birlar > 12) {
    console.log(i);
  }
}
}
