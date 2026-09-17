// [Mavzu: Sikl operatorlari]
/*
120. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos sonlarni
chiqaruvchi dastur tuzing. Masalan: N = 5
      *
             *  *
         *  *  *
    *  *  *  *
*  *  *  *  *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let k = 1; k <= N - i; k++) {
        row += " ";
    }
    for (let j = 1; j <= i; j++) {
        row += "* ";
    }
    console.log(row);
}
}
