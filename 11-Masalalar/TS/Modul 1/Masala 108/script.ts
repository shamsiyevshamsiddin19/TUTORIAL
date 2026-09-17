// [Mavzu: Sikl operatorlari]
/*
108. N natural soni berilgan. Uning tub yoki tub emasligini aniqlovchi
dastur tuzing. Tub son - bu faqat o'ziga va 1 ga qoldiqsiz
bo'linadigan son.
*/

{
let N: number = Number(prompt("N ni kiriting:"));
let tub: boolean = true;

if (N <= 1) {
    tub = false;
} else {
    for (let i = 2; i <= Math.sqrt(N); i++) {
        if (N % i === 0) {
            tub = false;
            break;
        }
    }
}

console.log(N + (tub ? " - tub son" : " - tub emas"));
}
