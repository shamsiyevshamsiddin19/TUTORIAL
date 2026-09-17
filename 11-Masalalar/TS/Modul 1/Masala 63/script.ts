// [Mavzu: Shart operatorlari]
/*
63. Uchta son berilgan. Agar berilgan sonlar o'sish tartibida bo'lsa,
sonlarni ikkilantiring, aks holda sonlarni ishorasi o'zgaritirilsin. Yangi
sonlarni ekranga chiqaring.
*/

{
let a: number = 4;
let b: number = 8;
let c: number = 12;

if (a < b && b < c) {
  a *= 2;
  b *= 2;
  c *= 2;
} else {
  a = -a;
  b = -b;
  c = -c;
}

console.log(a, b, c);
}
