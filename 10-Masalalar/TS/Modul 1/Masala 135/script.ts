// [Mavzu: Stringlar bilan ishlash]
/*
135. Str satrini tarkibida '*' belgisi necha marta borligini aniqlovchi
dastur tuzing.
*/

{
let str: string = prompt("Matn kiriting:") || "";
let count: number = 0;

for (let i = 0; i < str.length; i++) {
    if (str[i] === '*') {
        count++;
    }
}

console.log("'*' belgisi soni: " + count);
}
