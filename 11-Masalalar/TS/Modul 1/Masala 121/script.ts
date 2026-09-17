// [Mavzu: Sikl operatorlari]
/*
121. Konsoldan kiritilgan N soni asosida quyidagi shaklga mos sonlarni
chiqaruvchi dastur tuzing. Masalan: N = 5
  *  *  *  *  *
          *  *  *  *
              *  *  *
                  *  *
                      *
*/

{
let N: number = Number(prompt("N ni kiriting:"));

for (let i = 1; i <= N; i++) {
    let row: string = "";
    for (let k = 1; k < i; k++) {
        row += " ";
    }
    for (let j = i; j <= N; j++) {
        row += "* ";
    }
    console.log(row);
}
}
