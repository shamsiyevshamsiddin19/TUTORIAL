// [Mavzu: Sikl operatorlari]
/*
124. Foydalanuvchi tomonidan sonlar kiritilaveradi. Bu jarayon musbat
bo'lmagan son kiritilguncha davom etadi. Kiritilgan musbat
sonlarning sonini chiqaruvchi dastur tuzing.
*/

{
let count: number = 0;
let son: number = Number(prompt("Son kiriting:"));

while (son > 0) {
    count++;
    son = Number(prompt("Son kiriting:"));
}

console.log("Musbat sonlar soni: " + count);
}
