// [Mavzu: Sikl operatorlari]
/*
100. n va k butun sonlari berilgan. Faqat ayirish va qo'shis hdan
foydalanib, n sonini k ga bo'lgandagi qoldiq va butun qismini ekranga
chiqaruvchi programma tuzilsin.
*/

{
let n: number = 17;
let k: number = 5;
let butun: number = 0;

while (n >= k) {
  n -= k;
  butun++;
}

console.log("Butun qismi: " + butun);
console.log("Qoldiq: " + n);
}
