// [Mavzu: Sikl operatorlari]
/*
132. Konsoldan kiritilgan N soni asosida quyidagi shaklni chiqaruvchi
dastur tuzing, Misol: N=4

4  4  4  4
4          4
4          4
            4  4  4  4
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === 1 || i === N) {
            row += N + " ";
        } else {
            if (j === 1 || j === N) {
                row += N + " ";
            } else {
                row += "  ";
            }
        }
    }
    console.log(row);
}
}
