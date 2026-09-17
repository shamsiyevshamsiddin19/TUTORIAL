// [Mavzu: Sikl operatorlari]
/*
112. While sikl operatori orqali faqat juft sonlarning karra jadvalini
ekranga chiqaruvchi dastur tuzing. (ya'ni 2,4,6,8 karra jadvallarini)
*/

{
let i: number = 2;
while (i <= 8) {
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
