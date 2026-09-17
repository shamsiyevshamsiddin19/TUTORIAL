// [Mavzu: Sikl operatorlari]
/*
116. Konsoldan kiritilgan N soni asosida quyidagi shaklni chiqaruvchi
dastur tuzing. Bu yerda:  N - 3 dan katta toq son deb hisoblansin.
     Misol: N=5

*              *
   *        *
        *
    *      *
*          *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === j || j === N - i + 1) {
            row += "* ";
        } else {
            row += "  ";
        }
    }
    console.log(row);
}
}
