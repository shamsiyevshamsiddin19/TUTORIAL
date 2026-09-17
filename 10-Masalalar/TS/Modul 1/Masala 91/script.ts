// [Mavzu: Sikl operatorlari]
/*
91. Berilgan sonning necha xonali ekanini aniqlovchi dastur tuzing.
*/

{
let son: number = 54892;
let vaqtincha: number = Math.abs(son);
let xonaSoni: number = 0;

if (vaqtincha === 0) {
  xonaSoni = 1;
} else {
  while (vaqtincha > 0) {
    xonaSoni++;
    vaqtincha = Math.floor(vaqtincha / 10);
  }
}

console.log("Xonalar soni: " + xonaSoni);
}
