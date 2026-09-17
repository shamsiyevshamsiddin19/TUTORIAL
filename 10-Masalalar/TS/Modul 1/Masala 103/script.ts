// [Mavzu: Sikl operatorlari]
/*
103. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos harflarni
chiqaruvchi dastur   tuzing. Misol: N=5

E E E E E
D D D D
C C C
B B
A
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = N; i >= 1; i--) {
    let row: string = "";
    for (let j = 1; j <= i; j++) {
        let charCode: number = 64 + i; // A=65, B=66...
        row += String.fromCharCode(charCode) + " ";
    }
    console.log(row);
}
}

