// [Mavzu: Shart operatorlari]
/*
34. Foydalanuvchi tomonidan oyning raqami kiritilsa u qaysi faslga
kirishini aniqlovchi dastur tuzing.

Input: Output:
12 Qish
9 Kuz
1 Qish
*/

{
let oyraqami: number = Number(prompt("Oy raqamini kiriting: "));
switch (oyraqami) {
case 12: case 1: case 2: {
    console.log("Qish");
    break;
}
case 3: case 4: case 5: {
    console.log("bahor");
    break;  

}
case 6: case 7: case 8: {
    console.log("yoz");
    break;
}
case 9: case 10: case 11: {
    console.log("kuz");
    break;
}
default: {
    console.log("Bunday oy mavjud emas");
    break;
}
}
}
