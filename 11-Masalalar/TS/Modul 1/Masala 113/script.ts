// [Mavzu: Sikl operatorlari]
/*
113. Konsonldan kiritilgan N soni asosida quyidagi shaklni chiqaruvchi
dastur tuzing. Misol: N=5
*  *  *  *  *
*      *      *
*  *  *  *  *
*      *      *
*  *  *  *  *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === 1 || i === N || i === Math.ceil(N / 2)) {
            row += "* ";
        } else {
            if (j === 1 || j === N || j === Math.ceil(N / 2)) {
                row += "* ";
            } else {
                row += "  ";
            }
        }
    }
    console.log(row);
}
}
