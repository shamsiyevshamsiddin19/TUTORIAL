// [Mavzu: Sikl operatorlari]
/*
77. Foydalanuvchi tomonidan sonlar kiritilaveradi. Bu jarayon 0
kiritilguncha davom etadi. Shu kiritilgan sonlarning ko'paytmasini
toping. Ko'paytmada 0 raqami hisobga olinmasin.
*/

{
let kopaytma: number = 1;

while (true) {
  let son: number = Number(prompt("Sonni kiriting: "));

  if (son === 0) {
    break;
  }

  kopaytma *= son;
}

console.log("Ko'paytma: " + kopaytma);
}
