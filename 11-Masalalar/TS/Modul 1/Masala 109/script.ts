// [Mavzu: Sikl operatorlari]
/*
109. N natural son berilgan. Uning murakkab yoki murakkab emasligini
aniqlovchi dastur tuzing. Murakkab son - 1 va o'zidan tashqari yana
bo'luvchisi mavjud bo'lgan son. Masalan: 4 ning bo'luvchilari - 1,2,4
*/

{
let N: number = Number(prompt("N ni kiriting:"));
let murakkab: boolean = false;

if (N > 1) {
    for (let i = 2; i <= Math.sqrt(N); i++) {
        if (N % i === 0) {
            murakkab = true;
            break;
        }
    }
}

console.log(N + (murakkab ? " - murakkab son" : " - murakkab emas"));
}
