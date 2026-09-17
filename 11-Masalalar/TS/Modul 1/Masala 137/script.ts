// [Mavzu: Stringlar bilan ishlash]
/*
137. Berilgan 5 ta sonni qabul qilib, shundan eng katta ikkinchi sonni
topadigan dastur tuzing.
*/

{
let numbers: number[] = [];

for (let i = 0; i < 5; i++) {
    numbers.push(Number(prompt((i + 1) + "-sonni kiriting:")));
}

numbers.sort((a, b) => b - a);
console.log("Eng katta ikkinchi son: " + numbers[1]);
console.log("Barcha sonlar: " + numbers.join(", "));
}
