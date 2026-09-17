// [Mavzu: Sikl operatorlari]
/*
123. Berilgan 2 ta sonning EKUBini topadigan dastur tuzing
*/

{
let a: number = Number(prompt("Birinchi sonni kiriting:"));
let b: number = Number(prompt("Ikkinchi sonni kiriting:"));

let x: number = a;
let y: number = b;

while (y !== 0) {
    let t: number = y;
    y = x % y;
    x = t;
}

console.log("EKUB(" + a + ", " + b + ") = " + x);
}
