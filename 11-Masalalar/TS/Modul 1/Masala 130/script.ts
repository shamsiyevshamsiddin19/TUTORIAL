// [Mavzu: Sikl operatorlari]
/*
130. N sonigacha bo'lgan barcha tub sonlarni chiqaruvchi dastur tuzing.
*/

{
let N: number = Number(prompt("N ni kiriting:"));
console.log("Tub sonlar:");

for (let i = 2; i <= N; i++) {
    let tub: boolean = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
        if (i % j === 0) {
            tub = false;
            break;
        }
    }
    if (tub) {
        console.log(i);
    }
}
}
