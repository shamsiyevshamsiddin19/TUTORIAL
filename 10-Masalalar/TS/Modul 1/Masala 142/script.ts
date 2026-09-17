// [Mavzu: Stringlar bilan ishlash]
/*
142. Str satrini tarkibida 'A' harfi necha marta borligini aniqlovchi dastur
tuzing.
*/

{
let str: string = prompt("Matn kiriting:") || "";
let count: number = 0;

for (let i = 0; i < str.length; i++) {
    if (str[i] === 'A' || str[i] === 'a') {
        count++;
    }
}

console.log("'A' harfi soni: " + count);
}
