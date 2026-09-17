// [Mavzu: Sikl operatorlari]
/*
107. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos diagonal
ko'rinishida sonlarni chiqaruvchi dastur tuzing, Misol: N=5
5
 4
         3
             2
          1
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (j === i || j === N - i + 1) {
            row += j;
        } else {
            row += " ";
        }
    }
    console.log(row);
}
}
