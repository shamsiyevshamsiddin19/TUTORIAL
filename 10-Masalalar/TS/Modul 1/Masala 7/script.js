"use strict";
// [Mavzu: Chiziqli algoritmlar]
/*
7. 1 dollar 11200 so'm. Mijoz necha so'm puli borligini kiritsa unga shu
puliga to'g'ri keladigan valyuta miqdorini aniqlovchi dastur tuzing.
*/
{
    let dollar = 11200;
    let som = Number(prompt("Mijozning pul miqdorini kiriting (so'mda):"));
    let valyuta = som / dollar;
    console.log("Mijozning puliga to'g'ri keladigan valyuta miqdori: " + valyuta + " dollar");
}
