// [Mavzu: Sikl operatorlari]
/*
74. 1 dan 100 gacha bo'lgan toq sonlar ichidan 3 ga bo'linadigan ammo 5
ga bo'linmaydigan sonlarning yig'indisini hisoblovchi dastur tuzing.
*/

{
let sum: number = 0;
for (let i = 1; i <= 100; i += 2) {
  if (i % 3 === 0 && i % 5 !== 0) {
    sum += i;
  }
}
console.log("Yig'indi: " + sum);
}
