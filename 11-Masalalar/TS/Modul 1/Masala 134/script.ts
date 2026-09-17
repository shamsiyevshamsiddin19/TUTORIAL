// [Mavzu: Sikl operatorlari]
/*
134. Foydalanuvchi tomonidan sonlar kiritilaveradi. Bu jarayon 0 son
kiritilguncha davom etadi.  Kiritilgan musbat sonlarning yig'indisini
toping.
*/

{
let sum: number = 0;
let son: number = Number(prompt("Son kiriting:"));

while (son !== 0) {
    if (son > 0) {
        sum += son;
    }
    son = Number(prompt("Son kiriting:"));
}

console.log("Musbat sonlar yig'indisi: " + sum);
}
