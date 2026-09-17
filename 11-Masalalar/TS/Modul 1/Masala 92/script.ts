// [Mavzu: Sikl operatorlari]
/*
92. a va b butun sonlar berilgan. a  va b sonlari orasidagi barcha sonlarni
ekranga chiqaruvchi programma tuzilsin. Bunda har bir son o'zini
qiymaticha chiqarilsin. (input - 2 va 6, output - 3 3 3 4 4 4 4 5 5 5 5 5)
*/

{
let a: number = 2;
let b: number = 6;
let natija: string = "";

for (let i = a + 1; i < b; i++) {
  for (let j = 0; j < i; j++) {
    natija += i + " ";
  }
}

console.log(natija);
}
