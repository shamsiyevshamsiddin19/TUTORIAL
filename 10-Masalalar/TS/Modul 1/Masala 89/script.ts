// [Mavzu: Sikl operatorlari]
/*
89. a va b butun sonlari berilgan (a<b). a dan b gacha barcha butun
sonlarni ko'paytmasini ekranga chiqaruvchi programma tuzilsin.
*/

{
let a: number = 3;
let b: number = 7;
let kopaytma: number = 1;

for (let i = a; i <= b; i++) {
  kopaytma *= i;
}

console.log("Ko'paytma: " + kopaytma);
}
