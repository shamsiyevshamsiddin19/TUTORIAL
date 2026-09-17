// [Mavzu: Shart operatorlari]
/*
51. 0 dan katta 2 ta son berilgan. 21 dan katta bo'lmagan va 21 ga eng
yaqin sonni ekranga chiqaring. Agar ikkala son ham 21 dan katta
bo'lsa, ekranga 0 ni chiqaradigan dastur tuzing.
*/

{
let a: number = Number(prompt("a ni kriting:"))
let b: number = Number(prompt("b ni kriting:"))

let result: number

if (a > 21 && b > 21) {
    result = 0
} else if (a > 21) {
    result = b
} else if (b > 21) {
    result = a
} else {
    result = Math.max(a, b)
}

console.log(result)
}
