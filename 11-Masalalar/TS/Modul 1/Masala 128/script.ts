// [Mavzu: Sikl operatorlari]
/*
128. a va b butun sonlar berilgan. a dan b gacha sonlari orasidagi barcha
sonlarni ekranga chiqaruvchi programma tuzilsin. Bunda har bir son
o'zini qiymaticha chiqarilsin.
*/

{
let a: number = Number(prompt("a ni kiriting:"));
let b: number = Number(prompt("b ni kiriting:"));

for (let i = a; i <= b; i++) {
    let row: string = "";
    for (let j = 1; j <= i; j++) {
        row += i + " ";
    }
    console.log(row);
}
}
