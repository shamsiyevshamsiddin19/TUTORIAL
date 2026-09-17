// [Mavzu: Stringlar bilan ishlash]
/*
144. Bеrilgan str satrda 5 raqami necha marta qatnashganini toping.
*/

{
let str: string = prompt("Matn kiriting:") || "";
let count: number = 0;

for (let i = 0; i < str.length; i++) {
    if (str[i] === '5') {
        count++;
    }
}

console.log("'5' raqami soni: " + count);
}
