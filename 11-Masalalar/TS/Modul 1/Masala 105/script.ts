// [Mavzu: Sikl operatorlari]
/*
105. Foydalanuvchi tomonidan kiritilgan N soni asosida quyidagi shaklga
mos sonlarni chiqaruvchi dastur tuzing. Misol: N=5
                     5
        45
                 345
   2345
 12345
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = N; i >= 1; i--) {
    let row: string = "";
    for (let k = 1; k < i; k++) {
        row += " ";
    }
    for (let j = i; j <= N; j++) {
        row += j;
    }
    console.log(row);
}
}
