// [Mavzu: Sikl operatorlari]
/*
131. Konsoldan kiritilgan N soni asosida quyidagi shaklni chiqaruvchi
dastur tuzing.  Bu yerda: N - 3dan katta toq son deb hisoblansin.
Misol: N=6

    6              6
        6      6
            6
       6     6
    6            6
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= N; j++) {
        if (i === j || i + j === N + 1) {
            row += "6 ";
        } else {
            row += "  ";
        }
    }
    console.log(row);
}
}
