// [Mavzu: Stringlar bilan ishlash]
/*
148. Berilgan str satrida agar harflar va raqamlar soni yig'indisi satr
uzunligining yarmiga teng bo'lsa "Ok" degan, aks holda "error"
yozuvi chiqadigan dastur tuzing.
*/

{
let str: string = prompt("Matn kiriting:") || "";
let count: number = 0;

for (let i = 0; i < str.length; i++) {
    let ch: string = str[i];
    if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9')) {
        count++;
    }
}

if (count === str.length / 2) {
    console.log("Ok");
} else {
    console.log("error");
}
}
