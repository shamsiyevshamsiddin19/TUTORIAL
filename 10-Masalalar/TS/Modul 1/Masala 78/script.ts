// [Mavzu: Sikl operatorlari]
/*
78. a va b butun sonlari berilgan (a<b). a  va b sonlari orasidagi barcha
sonlarni (a va b sonlarni ham) ekranga chiqaruvchi va chiqarilgan
sonlarni sonini ham chiqaruvchi programma tuzilsin.
*/

{
let a: number = 5;
let b: number = 12;
let soni: number = 0;

for (let i = a; i <= b; i++) {
  console.log(i);
  soni++;
}

console.log("Chiqarilgan sonlar soni: " + soni);
}
