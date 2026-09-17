// [Mavzu: Sikl operatorlari]
/*
72. n soni va a butun son berilgan (n>0). a ning n - darajasini aniqlovchi
dastur tuzing.
*/

{
let n: number = 5; // daraja
let a: number = 2; // asos
let natija: number = 1;

for (let i = 0; i < n; i++) {
  natija *= a;
}
console.log(a + " ning " + n + "-darajasi: " + natija);
}
