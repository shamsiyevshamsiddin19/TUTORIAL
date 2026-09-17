// [Mavzu: Sikl operatorlari]
/*
106. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos diagonal
ko'rinishida sonlarni chiqaruvchi dastur tuzing, Misol: N=5
1
     2
         3
             4
        5
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === j || j === N - i + 1) {
            row += j + " ";
        } else {
            row += "  ";
        }
    }
    console.log(row);
}
}
