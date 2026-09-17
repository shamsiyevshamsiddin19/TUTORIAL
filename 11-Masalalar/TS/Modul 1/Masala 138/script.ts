// [Mavzu: Stringlar bilan ishlash]
/*
138. Berilgan str satrdan faqatgina raqamlarini ekranga chiqaradigan
dastur tuzing.
*/

{
let str: string = prompt("Matn kiriting:") || "";
let raqamlar: string = "";

for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9') {
        raqamlar += str[i];
    }
}

console.log("Raqamlar: " + raqamlar);
}
