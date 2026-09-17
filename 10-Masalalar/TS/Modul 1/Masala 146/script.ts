// [Mavzu: Math funksiyalari]
/*
146. Berilgan sonning kvadrat ildizini va kubildizini qaytaradigan dastur
tuzing
*/

{
let num: number = Number(prompt("Son kiriting:"));

console.log("Kvadrat ildiz: " + Math.sqrt(num));
console.log("Kub ildiz: " + Math.cbrt(num));
console.log("Kub ildiz (darajaga ko'tarish): " + Math.pow(num, 1/3));
}
