// [Mavzu: Sikl operatorlari]
/*
119. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos sonlarni
chiqaruvchi dastur tuzing. Masalan: N = 5

* * * * *
* * * *
* * *
* *
*
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = N; i >= 1; i--) {
    let row: string = "";
    for (let j = 1; j <= i; j++) {
        row += "* ";
    }
    console.log(row);
}
}
