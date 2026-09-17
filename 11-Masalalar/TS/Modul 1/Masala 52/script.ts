// [Mavzu: Shart operatorlari]
/*
52. Deylik, A yilning tartibi bo'lsin (0<A<50000). Shu yil tegishli bo'lgan
asr tartibini chiqaruvchi dastur tuzing.
*/

{
let A: number = Number(prompt("Yilning tartibini kiriting (0 < A < 50000): "));

if (A > 0 && A < 50000) {
    let asr: number = Math.ceil(A / 100);
    console.log("Natija: " + asr + "-asr");
} else {
    console.log("Natija: Noto'g'ri yil kiritildi.");
}
}
