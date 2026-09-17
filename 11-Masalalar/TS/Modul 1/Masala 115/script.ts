// [Mavzu: Sikl operatorlari]
/*
115. Konsoldan kiritilgan N soni asosida quyidagi shaklni chiqaruvchi
dastur tuzing. Bu yerda: N - 3 dan katta toq son deb hisoblansin.
         Misol: N=5

*               *
*               *
*  *  *  *  *
*       *
*         *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === 1 || i === N) {
            if (j === 1 || j === N) {
                row += "* ";
            } else {
                row += "  ";
            }
        } else if (i === 2) {
            if (j === 1 || j === N) {
                row += "* ";
            } else {
                row += "  ";
            }
        } else if (i === 3) {
            row += "* ";
        } else if (i === 4) {
            if (j === 1 || j === Math.ceil(N / 2)) {
                row += "* ";
            } else {
                row += "  ";
            }
        } else if (i === 5) {
            if (j === 1 || j === N - 1) {
                row += "* ";
            } else {
                row += "  ";
            }
        }
    }
    console.log(row);
}
}
