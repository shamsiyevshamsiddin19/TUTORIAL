// [Mavzu: Sikl operatorlari]
/*
111. While sikl operatori orqali faqat toq sonlarning karra jadvalini
ekranga chiqaruvchi dastur tuzing. (ya'ni 1,3,5,7,9 karra jadvallarini)
*/

{
let i: number = 1;
while (i <= 9) {
    let j: number = 1;
    console.log(i + " lik karra jadvali:");
    while (j <= 10) {
        console.log(i + " * " + j + " = " + i * j);
        j++;
    }
    console.log("--------------------");
    i += 2;
}
}
