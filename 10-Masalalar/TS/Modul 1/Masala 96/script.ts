// [Mavzu: Sikl operatorlari]
/*
96. Foydalanuvchi tomonidan butun sonlar kiritilaveradi. Bu jarayon
manfiy son kiritilguncha davom etadi. Shu sonlarning ichida nechtasi
5 ga karrali ekanligini aniqlovchi dastur tuzing.
*/

{
let soni: number = 0;

while (true) {
  let son: number = Number(prompt("Sonni kiriting: "));

  if (son < 0) {
    break;
  }

  if (son % 5 === 0) {
    soni++;
  }
}

console.log("5 ga karrali sonlar soni: " + soni);
}
