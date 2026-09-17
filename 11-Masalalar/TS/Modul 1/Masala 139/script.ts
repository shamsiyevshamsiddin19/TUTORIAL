// [Mavzu: Math funksiyalari]
/*
139. Berilgan num sonini yaxlitlash dasturini tuzing. Yordam:  math.h
kutbxonasi funkiyalari.
*/

{
let num: number = Number(prompt("Son kiriting:"));
let yaxlitlangan: number = Math.round(num);
console.log("Yaxlitlangan: " + yaxlitlangan);
console.log("Math.round() -> " + yaxlitlangan);
console.log("Math.floor() -> " + Math.floor(num));
console.log("Math.ceil() -> " + Math.ceil(num));
console.log("Math.trunc() -> " + Math.trunc(num));
}
