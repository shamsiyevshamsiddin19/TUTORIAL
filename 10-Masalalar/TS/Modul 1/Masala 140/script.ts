// [Mavzu: Math funksiyalari]
/*
140. Berilgan sonni naturallika tekshiradigan dastur tuzing. Yordam:
math.h kutubxonasi funksiyalari.
*/

{
let num: number = Number(prompt("Son kiriting:"));

if (num > 0 && Number.isInteger(num)) {
    console.log(num + " - natural son");
} else {
    console.log(num + " - natural son emas");
}
}
