// [Mavzu: Stringlar bilan ishlash]
/*
147. Berilgan str satrdagi birinchi va oxirgi belgini ekranga chiqaruvchi
dastur  tuzing.
*/

{
let str: string = prompt("Matn kiriting:") || "";

if (str.length > 0) {
    console.log("Birinchi belgi: " + str[0]);
    console.log("Oxirgi belgi: " + str[str.length - 1]);
} else {
    console.log("Matn bo'sh");
}
}
