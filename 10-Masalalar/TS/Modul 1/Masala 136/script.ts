// [Mavzu: Stringlar bilan ishlash]
/*
136. Berilgan belgini katta yoki kichik harf ekanligini aniqlaydigan dastur
tuzing. Agar belgi harf bo'lmasa "harf emas" , katta harf bo'lsa
"katta harf" , kichik harf bo'lsa " kichik harf"  nomli natijani chop
qiling.
*/

{
let belgi: string = prompt("Belgi kiriting:") || "";

if (belgi >= 'A' && belgi <= 'Z') {
    console.log("katta harf");
} else if (belgi >= 'a' && belgi <= 'z') {
    console.log("kichik harf");
} else {
    console.log("harf emas");
}
}
