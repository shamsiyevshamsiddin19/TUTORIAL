// [Mavzu: Sikl operatorlari]
/*
117. Foydalanuvchi tomonidan kiritilgan N soni asosida quyidagi shaklga
mos sonlarni chiqaruvchi dastur tuzing. Misol N=5 bo'lsa,

      5
4 4
3 3 3
2 2 2 2
1 1 1 1 1
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = N; i >= 1; i--) {
    let row: string = "";
    for (let j = 1; j <= i; j++) {
        row += i + " ";
    }
    console.log(row);
}
}
