// [Mavzu: Sikl operatorlari]
/*
76. a va b sonlari berilgan. (a<b) a dan b gacha 4 ga karrali sonlarni
ekranga      chiqaruvchi dastur tuzing. (a va b kirmasin)
*/

{
let a: number = 10;
let b: number = 40;

for (let i = a + 1; i < b; i++) {
  if (i % 4 === 0) console.log(i);
}
}
