// [Mavzu: Sikl operatorlari]
/*
129. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos shaklni
chiqaruvchi dastur tuzing.
Misol: N=4                             Misol: N=3
 @                                                 @
 @ @                                             @ @
 @ @ @                                        @ @ @
 @ @ @ @
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let j = 1; j <= i; j++) {
        row += "@ ";
    }
    console.log(row);
}
}
