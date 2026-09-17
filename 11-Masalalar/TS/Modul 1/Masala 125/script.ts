// [Mavzu: Sikl operatorlari]
/*
125. Berilgan 2 ta sonning EKUKini topadigan dastur tuzing.
*/

{
let a: number = Number(prompt("Birinchi sonni kiriting:"));
let b: number = Number(prompt("Ikkinchi sonni kiriting:"));

let originalA: number = a;
let originalB: number = b;

while (b !== 0) {
    let t: number = b;
    b = a % b;
    a = t;
}

let ekub: number = a;
let ekuk: number = (originalA * originalB) / ekub;

console.log("EKUK(" + originalA + ", " + originalB + ") = " + ekuk);
}
