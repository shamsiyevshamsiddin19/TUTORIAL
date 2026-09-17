// [Mavzu: Sikl operatorlari]
/*
102. Foydalanuvchi tomonidan kiritilgan N soni asosida quyidagi shaklga
mos sonlarni chiqaruvchi dastur tuzing, Misol:  N=5
1
2 2
3 3 3
4 4 4 4
1 2 3 4 5
*/

let n: number = Number(prompt("n ni kiriting:"));

let natija: string = "";

for (let i = 1; i < n; i++) {
  for (let j = 1; j <= i; j++) {
    natija = natija + i + " ";
  }

  natija = natija + "\n";
}

for (let i = 1; i <= n; i++) {
  natija = natija + i + " ";
}

console.log(natija);