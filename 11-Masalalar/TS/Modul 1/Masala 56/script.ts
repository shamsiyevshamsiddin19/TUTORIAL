// [Mavzu: Shart operatorlari]
/*
56. 5 ta son berilgan. Shu sonlarni Ichida faqatgina toq musbat
sonlarnigina yig'indisini hisoblovchi dastur tuzing.
*/

{
let a: number = Number(prompt("a sonini kiriting: "));
let b: number = Number(prompt("b sonini kiriting: "));
let c: number = Number(prompt("c sonini kiriting: "));
let d: number = Number(prompt("d sonini kiriting: "));
let e: number = Number(prompt("e sonini kiriting: "));

let yigindi: number = 0;

if (a > 0 && a % 2 !== 0) {
    yigindi += a;
}

if (b > 0 && b % 2 !== 0) {
    yigindi += b;
}

if (c > 0 && c % 2 !== 0) {
    yigindi += c;
}

if (d > 0 && d % 2 !== 0) {
    yigindi += d;
}

if (e > 0 && e % 2 !== 0) {
    yigindi += e;
}

console.log("Natija: " + yigindi);
}
