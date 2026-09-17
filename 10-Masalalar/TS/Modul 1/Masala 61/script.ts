// [Mavzu: Shart operatorlari]
/*
61. 1-999 oraliqdagi sonlar berilgan. Berilgan sonni "ikki xonali toq son",
"uch xonali juft son" va h.k. ekranga yozadigan programma tuzilsin.
*/

{
let son: number = 247;

let xona: string = "";
if (son >= 1 && son <= 9) {
  xona = "bir xonali";
} else if (son >= 10 && son <= 99) {
  xona = "ikki xonali";
} else if (son >= 100 && son <= 999) {
  xona = "uch xonali";
}

let juftToq: string = son % 2 === 0 ? "juft son" : "toq son";

console.log(xona + " " + juftToq);
}
