"use strict";
// [Mavzu: Sikl operatorlari]
/*
78. a va b butun sonlari berilgan (a<b). a  va b sonlari orasidagi barcha
sonlarni (a va b sonlarni ham) ekranga chiqaruvchi va chiqarilgan
sonlarni sonini ham chiqaruvchi programma tuzilsin.
*/
{
    let a = 5;
    let b = 12;
    let soni = 0;
    for (let i = a; i <= b; i++) {
        console.log(i);
        soni++;
    }
    console.log("Chiqarilgan sonlar soni: " + soni);
}
