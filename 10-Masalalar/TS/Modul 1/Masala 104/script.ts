// [Mavzu: Sikl operatorlari]
/*
104. Foydalanuvchi tomonidan kiritilgan N soni asosida quyidagi shaklga
mos sonlarni chiqaruvchi dastur tuzing. Misol:  N=5
 1
 12
123
1234
12345
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= i; j++) {
        row += j;
    }
    console.log(row);
}
}
