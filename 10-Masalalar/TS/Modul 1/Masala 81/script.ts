// [Mavzu: Sikl operatorlari]
/*
81. Barcha 3 xonali sonlar ichida yuzlar va birlar xonasidagi raqam 3 ga
teng bo'lgan barcha sonlarni ekranga chiqaring.
*/

{
for (let i = 100; i <= 999; i++) {
  let yuzlar: number = Math.floor(i / 100);
  let birlar: number = i % 10;

  if (yuzlar === 3 && birlar === 3) {
    console.log(i);
  }
}
}
