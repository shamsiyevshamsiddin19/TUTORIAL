// [Mavzu: Chiziqli algoritmlar]
/*
27. N sekund vaqt berilgan. Bu N sekund necha kun, soat, minut va
sekunddan iborat ekanligini aniqlovchi programma tuzilsin.
1soat = 3600s
*/

{
let N: number = Number(prompt("Sekundni kiriting: "));
let kun27: number = (N / 86400) | 0; 
let soat27: number = ((N % 86400) / 3600) | 0; 
let minut27: number = ((N % 3600) / 60) | 0; 
let sekund27: number = N % 60;
console.log("Natija: " + kun27 + " kun, " + soat27 + " soat, " + minut27 + " minut, " + sekund27 + " sekund");
}
