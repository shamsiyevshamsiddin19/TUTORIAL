// [Mavzu: Stringlar bilan ishlash]
/*
143. Foydalanuvchi tomonidan kiritilgan so'zdagi 'a' harfini 'b' bilan, 'b'
harfini esa 'd' bilan almashtiruvchi dastur tuzilsin.
*/

{
let soz: string = prompt("So'z kiriting:") || "";
let yangiSoz: string = "";

for (let i = 0; i < soz.length; i++) {
    if (soz[i] === 'a') {
        yangiSoz += 'b';
    } else if (soz[i] === 'b') {
        yangiSoz += 'd';
    } else {
        yangiSoz += soz[i];
    }
}

console.log("Natija: " + yangiSoz);
}
