// [Mavzu: Sikl operatorlari]
/*
133. Konsoldan kiritilgan N soni asosida quyidagi shaklni chiqa ruvchi
dastur tuzing, Misol: N=5
* * * * *
 *  *
  *
 *  *
* * * * *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === 1 || i === N || i === j || j === N - i + 1) {
            row += "* ";
        } else {
            row += "  ";
        }
    }
    console.log(row);
}
}
