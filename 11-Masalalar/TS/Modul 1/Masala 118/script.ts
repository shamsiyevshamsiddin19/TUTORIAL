// [Mavzu: Sikl operatorlari]
/*
118. Foydalanuvchi tomonidan kiritilgan N soni asosida quyidagi shaklni
chiqaruvchi dastur tuzing. Masalan: N=5
   *    *       *    *
   *    *       *    *

   *    *       *    *
   *    *       *    *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= N; j++) {
        if (j % 2 === 1) {
            process.stdout.write("* ");
        } else {
            process.stdout.write("  ");
        }
    }
    console.log("");
}
}
