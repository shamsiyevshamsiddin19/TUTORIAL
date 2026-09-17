// [Mavzu: Sikl operatorlari]
/*
127. n butun soni berilgan. Quyidagi yig'indini hisoblovchi programma
tuzilsin:
             S = 1 + 1/2 + 1/3 + .. 1/n.
*/

{
let n: number = Number(prompt("n ni kiriting:"));
let S: number = 0;

for (let i = 1; i <= n; i++) {
    S += 1 / i;
}

console.log("S = " + S);
}
