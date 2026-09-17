// [Mavzu: Massivlar]
/*
145. Foydalanuvchi tomonidan kiritilgan 6 ta int toifasidagi sonlar ichidan
eng kichigini va eng kattasini topuvchi dastur tuzing.
*/

{
let sonlar: number[] = [];

for (let i = 0; i < 6; i++) {
    sonlar.push(Number(prompt((i + 1) + "-sonni kiriting:")));
}

console.log("Eng katta: " + Math.max(...sonlar));
console.log("Eng kichik: " + Math.min(...sonlar));
console.log("Barcha sonlar: " + sonlar.join(", "));
}
