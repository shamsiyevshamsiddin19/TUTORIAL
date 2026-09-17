// [Mavzu: Shart operatorlari]
/*
39. Butun son berilgan. Agar son musbat bo'lsa 15 martaga oshiring,
manfiy bo'lsa absolut qiymatini (ya'ni modulini), aks holda berilgan
sonning o'zini  ekranga chiqaruvchi dastur tuzing.

Input: Output:
Son = 4    60
Son = -50 50
Son = 0 0
*/

{
let son = Number(prompt("Butun sonni kiriting: "));
if (son > 0) {
    console.log("Son = " + son + " " + (son * 15));
} else if (son < 0) {
    console.log("Son = " + son + " " + Math.abs(son));
} else {
    console.log("Son = " + son + " " + son);
}
}
