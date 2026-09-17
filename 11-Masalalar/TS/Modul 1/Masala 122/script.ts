// [Mavzu: Sikl operatorlari]
/*
122. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos sonlarni
chiqaruvchi dastur tuzing. Masalan: N = 5
* * * * *
* *   *
*  *  *
*   * *
* * * * *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === 1 || i === N || j === 1 || j === N || j === i || j === N - i + 1) {
            row += "* ";
        } else {
            row += "  ";
        }
    }
    console.log(row);
}
}
