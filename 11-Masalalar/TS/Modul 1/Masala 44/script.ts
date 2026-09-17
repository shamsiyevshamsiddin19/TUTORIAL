// [Mavzu: Shart operatorlari]
/*
44.Jumlani rostlikka tekshiring: Berilgan uch xonali sonning raqamlari
ketma ket o'suvchi bo'lib joylashgan.
*/

{
let n44: number = Number(prompt("Uch xonali sonni kiriting: "));
let yuzlar44: number = (n44 / 100) | 0;
let onlar44: number = ((n44 % 100) / 10) | 0;
let birliklar44: number = n44 % 10;
if (yuzlar44 < onlar44 && onlar44 < birliklar44) {
    console.log("Natija: True");
} else {
    console.log("Natija: False");
}
}
