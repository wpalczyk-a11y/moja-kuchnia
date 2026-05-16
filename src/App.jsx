import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://xorltrddwujfiwsfkhqu.supabase.co",
  "sb_publishable_pKz_5jRAIet3gQh19-GXuQ_w5ojHEiS"
);

const RECIPES = [
  { id:1, name:"Crispy Chicken Burrito", emoji:"🌯", cat:"High Protein", time:"30 min", srv:1, diff:"Łatwy", kcal:"~420 kcal", prot:"~40g", desc:"Chrupiący kurczak w cornflakes, sos miodowo-musztardowy, sałatka ogórkowa.",
    ing:[{n:"Pierś z kurczaka",a:"140",u:"g"},{n:"Mąka pszenna",a:"40",u:"g"},{n:"Jajko",a:"1",u:"szt"},{n:"Cornflakes",a:"45",u:"g"},{n:"Miód",a:"10",u:"g"},{n:"Musztarda Dijon",a:"10",u:"g"},{n:"Ogórek",a:"130",u:"g"},{n:"Jalapeño",a:"½",u:"szt"},{n:"Sos sojowy",a:"10",u:"ml"},{n:"Ocet z czerwonego wina",a:"5",u:"ml"},{n:"Tortilla",a:"1",u:"szt"}],
    eq:["Air Fryer","3 talerze","Nóż i deska"],
    mise:["Rozkrusz cornflakes — nie za drobno","3 talerze: mąka, jajko, cornflakes","Pokrój ogórka i jalapeño","Rozgrzej air fryer do 195°C"],
    steps:[{s:1,t:"3 talerze",a:"Panieruj: mąka → jajko → cornflakes. Mocno dociskaj."},{s:2,t:"Air Fryer 195°C",a:"Spryskaj spray'em z oleju awokado. 16 min, przekładaj w połowie. 74°C."},{s:3,t:"Miska",a:"10g miodu + 10g musztardy Dijon + pieprz."},{s:4,t:"Miska",a:"Ogórek + jalapeño + 10ml sos sojowy + 5ml ocet z czerwonego wina."},{s:5,t:"Tortilla",a:"Kurczak, sos, sałatka. Zawiń ciasno."}]},

  { id:10, name:"Dark Berry Overnight Oats", emoji:"🫐", cat:"Śniadanie", time:"5 min + noc", srv:1, diff:"Łatwy", kcal:"~430 kcal", prot:"~43g", desc:"Skyr jagodowy + kakao + masło migdałowe + mrożone wiśnie. Deserowa owsianka z wysokim białkiem.",
    ing:[{n:"Płatki owsiane górskie",a:"60",u:"g"},{n:"Mleko UHT wysokobiałkowe",a:"140",u:"ml"},{n:"Skyr pitny jagodowy",a:"150",u:"ml"},{n:"Nasiona chia",a:"5",u:"g"},{n:"GymBeam Powdered Peanut Butter",a:"15",u:"g"},{n:"Kakao ciemne niesłodzone",a:"8",u:"g"},{n:"Masło migdałowe",a:"12",u:"g"},{n:"Mrożone wiśnie lub jagody",a:"80",u:"g"},{n:"Syrop klonowy",a:"8",u:"g"},{n:"Sól",a:"1",u:"szczypta"}],
    eq:["Słoik 500ml","Łyżka","Lodówka"],
    mise:["Słoik min. 500ml","Masło migdałowe w temp. pokojowej","Wiśnie wrzucasz prosto zamrożone"],
    steps:[{s:1,t:"Słoik",a:"60g płatków + 5g chia + 15g proszku + 8g kakao. Wymieszaj suche — kakao lubi się grudkować."},{s:2,t:"Słoik",a:"140ml mleka + 150ml skyru + 8g syropu klonowego + sól. Mieszaj aż kakao się rozpuści."},{s:3,t:"Słoik",a:"12g masła migdałowego."},{s:4,t:"Słoik",a:"80g mrożonych wiśni na wierzch — puszczą sok przez noc."},{s:5,t:"Lodówka",a:"Min. 6h. Rano zamieszaj — sok z wiśni zabarwia całość na ciemnofioletowy kolor."}]},

  { id:4, name:"Szparagi z jajkiem i brązowym masłem", emoji:"🍳", cat:"Śniadanie", time:"15 min", srv:1, diff:"Łatwy", kcal:"~340 kcal", prot:"~15g", desc:"Szparagi, jajko sadzone i beurre noisette. Pilnuj masła żeby nie przepalić.",
    ing:[{n:"Szparagi zielone",a:"200",u:"g"},{n:"Jajka",a:"2",u:"szt"},{n:"Masło niesolone",a:"40",u:"g"},{n:"Chleb na zakwasie",a:"2",u:"kromki"},{n:"Cytryna",a:"½",u:"szt"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"}],
    eq:["Patelnia stalowa 28cm","Mała patelnia 20cm","Griddle żeliwny"],
    mise:["Szparagi — odłam twarde końce","Jajka 10 min przed z lodówki","Masło 40g podziel na kawałki"],
    steps:[{s:1,t:"Patelnia 28cm",a:"Test wodny → spray awokado → szparagi płasko. 2 min, obróć, 2 min. Sól."},{s:2,t:"Patelnia 20cm",a:"Jajka. 2-3 min — białko ścięte, żółtko płynne."},{s:3,t:"Ta sama patelnia",a:"40g masła. Bąble → cisza → orzechowy zapach + brązowe drobinki = NATYCHMIAST zdejmij do miseczki."},{s:4,t:"Griddle żeliwny",a:"Chleb 1-2 min z każdej strony."},{s:5,t:"Talerz",a:"Chleb, szparagi, jajka, brązowe masło, cytryna, pieprz."}]},

  { id:5, name:"Kurczak miso-butter-gochujang", emoji:"🍗", cat:"Obiad", time:"30 min", srv:2, diff:"Średni", kcal:"~400 kcal", prot:"~51g", desc:"Kurczak z glazurą miso-butter-gochujang i sriracha, szparagi sojowo-sezamowe.",
    ing:[{n:"Piersi z kurczaka",a:"2",u:"szt"},{n:"Szparagi zielone",a:"400",u:"g"},{n:"Masło niesolone",a:"60",u:"g"},{n:"Białe miso",a:"30",u:"g"},{n:"Gochujang",a:"8",u:"g"},{n:"Sriracha Flying Goose",a:"4",u:"g"},{n:"Sos sojowy",a:"30",u:"ml"},{n:"Olej sezamowy",a:"10",u:"ml"},{n:"Czosnek",a:"4",u:"ząbki"},{n:"Imbir świeży",a:"2",u:"cm"},{n:"Syrop klonowy",a:"10",u:"g"},{n:"Sezam",a:"15",u:"g"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"}],
    eq:["Patelnia stalowa 36cm","2 miseczki","Termometr"],
    mise:["Kurczak 15 min przed z lodówki, osusz — wilgoć blokuje rumienienie","Glazura: 60g masła + 30g miso + 8g gochujang + 4g sriracha + 10g syropu klonowego","Sos szparagowy: 30ml sojowy + 10ml sezamowy","Czosnek zgnieć, imbir zetrzyj"],
    steps:[{s:1,t:"Patelnia 36cm",a:"Test wodny → spray awokado → piersi. NIE ruszaj 4-5 min. Obróć 3-4 min. 65°C."},{s:2,t:"Ta sama patelnia",a:"Czosnek + imbir 30 sek. Glazura. Polewaj kurczaka 1-2 min. 74°C. Odpocznij 3 min."},{s:3,t:"NIE myj patelni",a:"Szparagi 2-3 min. Sos sojowo-sezamowy 30 sek. 15g sezamu na wierzch."},{s:4,t:"Deska",a:"Kurczak w plastry. Talerze: kurczak + szparagi + resztka glazury."}]},

  { id:6, name:"Kurczak w cornflakes — Air Fryer", emoji:"🌽", cat:"Low Fat", time:"25 min", srv:1, diff:"Łatwy", kcal:"~360 kcal", prot:"~44g", desc:"Mąka, jajko, cornflakes — air fryer ze spray'em awokado. Chrupiący i lekki.",
    ing:[{n:"Pierś z kurczaka",a:"1",u:"szt"},{n:"Mąka pszenna",a:"40",u:"g"},{n:"Jajko",a:"1",u:"szt"},{n:"Cornflakes niesłodzone",a:"50",u:"g"},{n:"Czosnek granulowany",a:"2",u:"g"},{n:"Papryka wędzona",a:"2",u:"g"},{n:"Spray z oleju awokado",a:"",u:"do spryskania"}],
    eq:["Air Fryer","3 głębokie talerze","Termometr"],
    mise:["Osusz kurczaka ręcznikiem — klucz do chrupkości","3 talerze: mąka, jajko rozkłócone, cornflakes z przyprawami","Air fryer do 195°C przez 5 min"],
    steps:[{s:1,t:"3 talerze",a:"Mąka → jajko → cornflakes z czosnkiem i papryką. Mocno dociskaj."},{s:2,t:"Air Fryer 195°C",a:"Spryskaj spray'em z obu stron. 16 min, przekładaj po 8 min. 74°C."},{s:3,t:"Talerz",a:"2 min odpoczynku. Sos: skyr + czosnek granulowany + sok z cytryny."}]},

  { id:7, name:"Burrito Bowl z kurczakiem chipotle", emoji:"🌮", cat:"Meksykański", time:"35 min + marynata", srv:6, diff:"Łatwy", kcal:"~480 kcal", prot:"~42g", desc:"Kurczak marynowany overnight w chipotle. Meal prep 6 porcji — lepszy na drugi dzień.",
    ing:[{n:"Piersi z kurczaka",a:"800",u:"g"},{n:"Chipotle Molidos Clemente Jacques (marynata)",a:"40",u:"g"},{n:"Sos sojowy (marynata)",a:"20",u:"ml"},{n:"Czosnek świeży (marynata)",a:"4",u:"ząbki"},{n:"Kmin rzymski (marynata)",a:"4",u:"g"},{n:"Papryka wędzona (marynata)",a:"4",u:"g"},{n:"Sok z limonki (marynata)",a:"30",u:"ml"},{n:"Ryż basmati",a:"360",u:"g"},{n:"Fasola czarna",a:"2",u:"puszki"},{n:"Kukurydza",a:"1",u:"puszka"},{n:"Cebula czerwona",a:"1",u:"szt"},{n:"Awokado",a:"3",u:"szt"},{n:"Śmietana 18%",a:"200",u:"ml"},{n:"Kolendra świeża",a:"1",u:"pęczek"},{n:"Limonki",a:"2",u:"szt"},{n:"Tabasco Chipotle McIlhenny",a:"",u:"do smaku"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"}],
    eq:["Patelnia stalowa 36cm","Garnek","Miska do marynaty","Pojemniki meal prep x6"],
    mise:["DZIEŃ WCZEŚNIEJ: kurczak w plastry 1.5cm. Marynata: 40g Chipotle Molidos Clemente Jacques + 20ml sojowy + 4 ząbki + 4g kmin + 4g papryka + 30ml limonka. Lodówka min. 8h.","Wyjmij kurczaka 15 min przed — zimny = para zamiast przypieczenia","Pikla: cebula w kostkę + sok z limonki + sól, odstaw 15 min","Fasolę i kukurydzę odcedź","Awokado kroisz tuż przed podaniem"],
    steps:[{s:1,t:"Garnek",a:"360g ryżu + 540ml wody + sól. Wrzenie → minimum → przykryj. 12 min, 5 min bez odkrywania. Kolendra + sok z limonki na koniec."},{s:2,t:"Patelnia 36cm MAX ogień",a:"Spray awokado. Kurczak PARTIAMI. Jedna warstwa, NIE ruszaj 3-4 min. Obróć 2-3 min. Zwęglone brzegi = smak. 74°C."},{s:3,t:"Deska",a:"Kurczak w plastry lub poszarpaj widelcami. Awokado: pokrój, skrop limonką."},{s:4,t:"Pojemniki x6",a:"Ryż → fasola → kukurydza → kurczak → pikla → awokado → śmietana. Kilka kropel Tabasco Chipotle. Zamknij. 4 dni w lodówce."}]},

  { id:11, name:"Tacos al Pastor", emoji:"🌮", cat:"Meksykański", time:"30 min + marynata 4h", srv:4, diff:"Średni", kcal:"~520 kcal", prot:"~44g", desc:"Wieprzowina w marynacie z chipotlem, ananasem i octem z czerwonego wina. Griddle żeliwny daje zwęglone brzegi i soczysty środek.",
    ing:[{n:"Karkówka wieprzowa lub łopatka",a:"700",u:"g"},{n:"Chipotle Molidos Clemente Jacques",a:"25",u:"g"},{n:"Ananas świeży lub z puszki",a:"150",u:"g"},{n:"Ocet z czerwonego wina",a:"30",u:"ml"},{n:"Sos sojowy",a:"20",u:"ml"},{n:"Czosnek świeży",a:"4",u:"ząbki"},{n:"Kmin rzymski",a:"5",u:"g"},{n:"Oregano",a:"3",u:"g"},{n:"Papryka wędzona",a:"4",u:"g"},{n:"Syrop klonowy",a:"20",u:"g"},{n:"Tortille małe corn lub flour",a:"12",u:"szt"},{n:"Cebula biała",a:"1",u:"szt"},{n:"Kolendra świeża",a:"1",u:"pęczek"},{n:"Limonki",a:"3",u:"szt"},{n:"Ananas do serwowania",a:"80",u:"g"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"}],
    eq:["Griddle żeliwny na 2 palniki","Blender","Miska do marynaty","Deska"],
    mise:["MARYNATA min. 4h: zblenduj 25g chipotle Molidos + 150g ananasa + 30ml ocet + 20ml sojowy + 4 ząbki + 5g kmin + 3g oregano + 4g papryka + 20g syrop klonowy. Gładka pasta.","Mięso w plastry ~0.5cm, zalej marynatą, lodówka min. 4h","Wyjmij mięso 20 min przed smażeniem","Cebula biała w drobną kostkę, kolendra posiekana, limonki przekrojone","Ananas do serwowania w małe kawałki"],
    steps:[{s:1,t:"Griddle żeliwny MAX ogień",a:"Rozgrzewaj 4-5 min aż zacznie lekko dymić. Spray awokado. Mięso PARTIAMI — jedna warstwa, NIE ruszaj 2-3 min. Chcesz mocne przypieczenie i lekko zwęglone brzegi. Obróć 1-2 min."},{s:2,t:"Deska",a:"Mięso pokrój lub posiekaj na mniejsze kawałki. 2-3 min odpoczynku."},{s:3,t:"Griddle — ścierką zetrzyj nadmiar tłuszczu",a:"Tortille po 30-45 sek z każdej strony. Mają złapać lekkie przypieczenie i zmiękczyć."},{s:4,t:"Talerz",a:"Tortilla → mięso → cebula biała → kawałek ananasa → kolendra → sok z limonki. Opcjonalnie kilka kropel Tabasco Chipotle jeśli chcesz więcej ognia."}]},

  { id:12, name:"Korean-Mexican Fusion Bowl", emoji:"🥢", cat:"Fusion", time:"35 min + marynata 2h", srv:4, diff:"Średni", kcal:"~490 kcal", prot:"~46g", desc:"Gochujang + chipotle razem w marynacie. Ryż, pikla ogórkowa, sezam. Dwa światy które działają razem lepiej niż osobno.",
    ing:[{n:"Piersi lub udka kurczaka",a:"700",u:"g"},{n:"Gochujang",a:"20",u:"g"},{n:"Chipotle Molidos Clemente Jacques",a:"10",u:"g"},{n:"Sos sojowy",a:"30",u:"ml"},{n:"Syrop klonowy",a:"15",u:"g"},{n:"Olej sezamowy",a:"15",u:"ml"},{n:"Czosnek świeży",a:"4",u:"ząbki"},{n:"Imbir świeży",a:"3",u:"cm"},{n:"Ocet ryżowy",a:"20",u:"ml"},{n:"Ryż basmati",a:"320",u:"g"},{n:"Ogórek",a:"2",u:"szt"},{n:"Ocet ryżowy do pikli",a:"40",u:"ml"},{n:"Cukier do pikli",a:"10",u:"g"},{n:"Sól do pikli",a:"5",u:"g"},{n:"Sezam",a:"20",u:"g"},{n:"Dymka",a:"4",u:"szt"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"}],
    eq:["Patelnia stalowa 36cm","Garnek","Miska do marynaty","2 miseczki"],
    mise:["Marynata: 20g gochujang + 10g chipotle Molidos + 30ml sojowy + 15g syrop klonowy + 15ml olej sezamowy + 4 ząbki + imbir + 20ml ocet ryżowy. Kurczak w plastry 1.5cm, zalej, min. 2h.","Pikla: ogórek w cienkie plasterki + 40ml ocet ryżowy + 10g cukier + 5g sól. 30 min.","Sezam podpraż 2 min na suchej patelni","Wyjmij kurczaka 15 min przed smażeniem"],
    steps:[{s:1,t:"Garnek",a:"320g ryżu + 480ml wody + sól. Wrzenie → minimum → przykryj. 12 min, 5 min bez odkrywania."},{s:2,t:"Patelnia 36cm MAX ogień",a:"Spray awokado. Kurczak PARTIAMI — jedna warstwa, NIE ruszaj 3-4 min. Marynata będzie karmelizować — chcesz ciemnych zwęglonych kawałków. Obróć 2-3 min. 74°C."},{s:3,t:"Deska",a:"Kurczak w plastry lub poszarpaj widelcami."},{s:4,t:"Miski",a:"Ryż → kurczak → pikla ogórkowa → dymka → sezam → kilka kropel oleju sezamowego. Sriracha po boku."}]},

  { id:13, name:"Chipotle Quesadilla", emoji:"🫓", cat:"Meksykański", time:"15 min", srv:2, diff:"Łatwy", kcal:"~480 kcal", prot:"~38g", desc:"Chrupiąca z zewnątrz, roztopiony ser w środku. Szybka kolacja lub lunch z kurczakiem z grilla.",
    ing:[{n:"Pierś z kurczaka",a:"300",u:"g"},{n:"Chipotle Molidos Clemente Jacques",a:"12",u:"g"},{n:"Czosnek granulowany",a:"2",u:"g"},{n:"Papryka wędzona",a:"2",u:"g"},{n:"Tortilla duża 25-30cm",a:"2",u:"szt"},{n:"Ser żółty",a:"80",u:"g"},{n:"Fasola czarna z puszki",a:"60",u:"g"},{n:"Kukurydza z puszki",a:"40",u:"g"},{n:"Jalapeño słoik",a:"4",u:"plasterki"},{n:"Śmietana 18%",a:"50",u:"g"},{n:"Sok z limonki",a:"20",u:"ml"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"}],
    eq:["Patelnia stalowa 28cm","Deska","Łopatka"],
    mise:["Kurczak w plastry cienkie, wymieszaj z 12g chipotle Molidos + 2g czosnek + 2g papryka wędzona","Ser zetrzyj na tarce — nie kupuj tartego, ten w kawałku topi się lepiej","Fasolę i kukurydzę odsącz"],
    steps:[{s:1,t:"Patelnia 28cm średni-mocny ogień",a:"Spray awokado. Kurczak w plastry — 2-3 min z każdej strony. 74°C. Odłóż na deskę, pokrój w kawałki."},{s:2,t:"Ta sama patelnia — średni ogień",a:"Spray awokado. Tortilla na patelnię. Na połowie: ser (połowa) → kurczak → fasola → kukurydza → jalapeño → reszta sera. Ser z dwóch stron skleja quesadillę."},{s:3,t:"Ta sama patelnia",a:"Złóż tortillę na pół. Dociskaj łopatką. 2-3 min aż złoto-brązowa i chrupiąca. Obróć ostrożnie. 2 min."},{s:4,t:"Deska",a:"Pokrój w trójkąty. Śmietana + sok z limonki jako sos do maczania. Jedz od razu."}]},

  { id:14, name:"Enchiladas z kurczakiem chipotle", emoji:"🫔", cat:"Meksykański", time:"20 min + 25 min piekarnik", srv:4, diff:"Średni", kcal:"~540 kcal", prot:"~42g", desc:"Sos pomidorowo-chipotle, roztopiony ser, chrupiące brzegi. Idealne na weekend gdy masz więcej czasu.",
    ing:[{n:"Piersi z kurczaka",a:"500",u:"g"},{n:"Chipotle Molidos Clemente Jacques (do kurczaka)",a:"15",u:"g"},{n:"Czosnek granulowany",a:"3",u:"g"},{n:"Kmin rzymski",a:"3",u:"g"},{n:"Tortille średnie",a:"8",u:"szt"},{n:"Ser żółty starty",a:"200",u:"g"},{n:"Fasola czarna",a:"1",u:"puszka"},{n:"Polpa pomidorowa",a:"1",u:"puszka (400g)"},{n:"Chipotle Molidos Clemente Jacques (sos)",a:"20",u:"g"},{n:"Czosnek świeży (sos)",a:"3",u:"ząbki"},{n:"Kmin rzymski (sos)",a:"4",u:"g"},{n:"Oregano (sos)",a:"3",u:"g"},{n:"Ocet z czerwonego wina",a:"10",u:"ml"},{n:"Syrop klonowy",a:"10",u:"g"},{n:"Śmietana 18%",a:"100",u:"ml"},{n:"Kolendra świeża",a:"1",u:"pęczek"},{n:"Limonka",a:"1",u:"szt"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"}],
    eq:["Naczynie do zapiekania","Patelnia stalowa 28cm","Piekarnik"],
    mise:["Rozgrzej piekarnik do 190°C","Kurczak w plastry, wymieszaj z 15g chipotle Molidos + 3g czosnek + 3g kmin","Sos enchilada: patelnia spray awokado → 3 ząbki czosnku 1 min → 400g polpy + 20g chipotle Molidos + 4g kmin + 3g oregano + 10ml ocet + 10g syrop klonowy. Gotuj 8 min na małym ogniu. Spróbuj — dymny, lekko ostry, lekko słodki.","Naczynie do zapiekania posmaruj cienką warstwą sosu"],
    steps:[{s:1,t:"Patelnia 28cm",a:"Spray awokado, średni-mocny ogień. Kurczak 3-4 min z każdej strony. 74°C. Deska, poszarpaj widelcami. Wymieszaj z fasolą odsączoną."},{s:2,t:"Tortille — podgrzej 20 sek w mikrofalówce",a:"Na każdej: łyżka sosu enchilada → garść mieszanki kurczak+fasola → łyżka sera. Zawiń ciasno."},{s:3,t:"Naczynie do zapiekania",a:"Układaj złączeniem do dołu, ciasno obok siebie. Zalej resztą sosu równomiernie. Posyp obficie resztą sera."},{s:4,t:"Piekarnik 190°C",a:"20-25 min bez przykrycia. Ser złoto-brązowy i bąbelkujący. Ostatnie 3 min włącz grill żeby ser się lekko przypalił."},{s:5,t:"Stół",a:"Śmietana na wierzchu, kolendra, sok z limonki. Jedz od razu — enchiladas stygną i tracą chrupkość."}]},

  { id:8, name:"Chili con carne", emoji:"🫕", cat:"Meksykański", time:"20 min + 90 min", srv:6, diff:"Łatwy", kcal:"~520 kcal", prot:"~38g", desc:"Dutch oven — samo się gotuje. Lepsze na drugi dzień. 6 porcji meal prep.",
    ing:[{n:"Wołowina mielona",a:"700",u:"g"},{n:"Fasola czarna",a:"2",u:"puszki"},{n:"Polpa pomidorowa",a:"2",u:"puszki"},{n:"Koncentrat pomidorowy",a:"60",u:"g"},{n:"Cebula",a:"2",u:"szt"},{n:"Czosnek świeży",a:"6",u:"ząbków"},{n:"Papryka czerwona",a:"2",u:"szt"},{n:"Chipotle Molidos Clemente Jacques",a:"30",u:"g"},{n:"Tabasco Chipotle McIlhenny",a:"",u:"do smaku"},{n:"Kmin rzymski",a:"6",u:"g"},{n:"Papryka wędzona",a:"6",u:"g"},{n:"Oregano",a:"4",u:"g"},{n:"Bulion lub woda",a:"200",u:"ml"},{n:"Spray z oleju awokado",a:"",u:"do smażenia"},{n:"Śmietana 18%",a:"150",u:"ml"},{n:"Ser żółty",a:"150",u:"g"}],
    eq:["Dutch oven 5.6L","Deska"],
    mise:["Cebule w kostkę","Czosnek posiekaj","Papryki w kostkę 1.5cm","Przyprawy: 6g kmin + 6g papryka + 4g oregano"],
    steps:[{s:1,t:"Dutch oven",a:"Spray awokado → cebula 5-6 min → czosnek 1 min → papryki 3 min."},{s:2,t:"Dutch oven mocny",a:"700g wołowiny. Rozbijaj łyżką. 8-10 min aż mocno zbrązowieje."},{s:3,t:"Dutch oven",a:"Przyprawy 1 min. Koncentrat 2 min."},{s:4,t:"Dutch oven",a:"Polpa + fasola + 30g Chipotle Molidos Clemente Jacques + Tabasco Chipotle do smaku + 200ml bulionu. Sól i pieprz."},{s:5,t:"Dutch oven mały ogień",a:"Przykryj. 60-90 min, mieszaj co 20 min. Najlepsze na drugi dzień."},{s:6,t:"Miski",a:"Na ryż lub chleb. Śmietana + ser."}]},

  { id:9, name:"Bułki do burgerów / hot dogów", emoji:"🍞", cat:"Piekarnia", time:"30 min + 2h", srv:8, diff:"Średni", kcal:"~220 kcal", prot:"~6g", desc:"Miękkie bułki z dodatkiem skrobi ziemniaczanej. Z mlekiem wychodzą jak brioche.",
    ing:[{n:"Mąka pszenna",a:"400",u:"g"},{n:"Skrobia ziemniaczana",a:"42",u:"g"},{n:"Cukier",a:"25",u:"g"},{n:"Sól",a:"8",u:"g"},{n:"Drożdże instant",a:"6",u:"g"},{n:"Masło miękkie",a:"50",u:"g"},{n:"Mleko lub woda",a:"225",u:"g"},{n:"Jajko",a:"1",u:"szt"},{n:"Białko do posmarowania",a:"1",u:"szt"},{n:"Masło roztopione po wypieku",a:"20",u:"g"},{n:"Mak (opcjonalnie)",a:"",u:"do posypania"}],
    eq:["Misa lub mikser z hakiem","Waga kuchenna","Blacha + papier","Piekarnik"],
    mise:["Masło wyjmij 30 min wcześniej — ma być miękkie","Aktywuj drożdże: 50g mleka do 30°C + 6g drożdży + łyżeczka cukru, 10 min aż spieni","Blacha z papierem gotowa","Piekarnik z lampką = ciepłe miejsce do wyrastania"],
    steps:[{s:1,t:"Misa lub mikser",a:"400g mąki + 42g skrobi + 25g cukru + 8g soli — wymieszaj suche. Dodaj drożdże, resztę mleka (175g), jajko, 50g masła. Wyrabiaj 8 min ręcznie lub 5 min hakiem. Lekka kleistość = OK, nie dosypuj mąki."},{s:2,t:"Misa przykryta",a:"Uformuj kulę, przykryj. Ciepłe miejsce, 60 min. Ciasto podwoi objętość."},{s:3,t:"Blat + waga",a:"Podziel na 8 porcji po 90-95g. Kulki, przykryj, 3 min odpoczynku."},{s:4,t:"Blat",a:"Każdą kulkę spłaszcz, zawiń 2-3 razy naciągając powierzchnię. Roluj na podłużny lub okrągły kształt."},{s:5,t:"Blacha",a:"Układaj 1-2cm od siebie z oparciem dla skrajnych. Przykryj, 60 min wyrastania."},{s:6,t:"Piekarnik 175°C",a:"Posmaruj białkiem, posyp makiem. 15-16 min. Po wyjęciu od razu 20g roztopionego masła — miękka skórka."}]},
];

const INIT_PANTRY = [
  {name:"Ryż basmati",category:"Kasze i zboża",status:"high"},{name:"Ryż czarny",category:"Kasze i zboża",status:"high"},{name:"Kasza gryczana",category:"Kasze i zboża",status:"high"},{name:"Kasza manna",category:"Kasze i zboża",status:"high"},{name:"Quinoa trójkolorowa",category:"Kasze i zboża",status:"high"},
  {name:"Ciecierzyca sucha",category:"Strączki",status:"high"},{name:"Soczewica czerwona",category:"Strączki",status:"high"},{name:"Fasola czarna puszki",category:"Strączki",status:"high"},
  {name:"Orecchiette",category:"Makarony",status:"high"},{name:"Maccheroni",category:"Makarony",status:"high"},{name:"Udon noodles",category:"Makarony",status:"high"},
  {name:"Nasiona chia",category:"Nasiona i orzechy",status:"high"},{name:"Siemię lniane",category:"Nasiona i orzechy",status:"high"},{name:"Sezam",category:"Nasiona i orzechy",status:"high"},{name:"Słonecznik",category:"Nasiona i orzechy",status:"high"},{name:"Wiórki kokosowe",category:"Nasiona i orzechy",status:"high"},{name:"Orzechy włoskie",category:"Nasiona i orzechy",status:"high"},{name:"Migdały",category:"Nasiona i orzechy",status:"high"},
  {name:"Sos sojowy jasny 1.8L",category:"Sosy azjatyckie",status:"high"},{name:"Sos ostrygowy",category:"Sosy azjatyckie",status:"high"},{name:"Olej sezamowy",category:"Sosy azjatyckie",status:"high"},{name:"Ocet ryżowy",category:"Sosy azjatyckie",status:"high"},{name:"Sos hoisin",category:"Sosy azjatyckie",status:"high"},{name:"Mirin",category:"Sosy azjatyckie",status:"high"},{name:"Sambal oelek",category:"Sosy azjatyckie",status:"high"},{name:"Sriracha Flying Goose",category:"Sosy azjatyckie",status:"high"},
  {name:"Worcestershire",category:"Sosy inne",status:"high"},{name:"Tabasco classic",category:"Sosy inne",status:"high"},{name:"Tabasco Chipotle McIlhenny",category:"Sosy inne",status:"high"},{name:"Hot sauce Babuszka",category:"Sosy inne",status:"high"},{name:"Harissa",category:"Sosy inne",status:"high"},{name:"Musztarda Dijon",category:"Sosy inne",status:"high"},{name:"Chipotle Molidos Clemente Jacques",category:"Sosy inne",status:"high"},
  {name:"Spray z oleju awokado rafinowany",category:"Oleje i octy",status:"high"},{name:"Olej awokado nierafinowany",category:"Oleje i octy",status:"high"},{name:"Aceto balsamico",category:"Oleje i octy",status:"high"},{name:"Ocet jabłkowy",category:"Oleje i octy",status:"high"},{name:"Glazura balsamiczna",category:"Oleje i octy",status:"high"},{name:"Ocet z czerwonego wina",category:"Oleje i octy",status:"high"},{name:"Syrop klonowy",category:"Oleje i octy",status:"high"},
  {name:"Koncentrat pomidorowy",category:"Pomidory i puszki",status:"high"},{name:"Pomidory suszone",category:"Pomidory i puszki",status:"high"},{name:"Polpa puszki",category:"Pomidory i puszki",status:"high"},{name:"Kukurydza sweetcorn",category:"Pomidory i puszki",status:"high"},{name:"Jalapeño słoik",category:"Pomidory i puszki",status:"high"},
  {name:"Masło orzechowe smooth",category:"Pasty i proszki",status:"high"},{name:"Masło migdałowe",category:"Pasty i proszki",status:"high"},{name:"GymBeam Powdered Peanut Butter",category:"Pasty i proszki",status:"high"},
  {name:"Kmin rzymski mielony",category:"Przyprawy",status:"high"},{name:"Oregano",category:"Przyprawy",status:"high"},{name:"Cynamon",category:"Przyprawy",status:"high"},{name:"Majeranek",category:"Przyprawy",status:"high"},{name:"Zioła prowansalskie",category:"Przyprawy",status:"high"},{name:"Czosnek granulowany",category:"Przyprawy",status:"high"},{name:"Kurkuma",category:"Przyprawy",status:"high"},{name:"Papryka słodka",category:"Przyprawy",status:"high"},{name:"Papryka wędzona",category:"Przyprawy",status:"high"},{name:"Sól morska",category:"Przyprawy",status:"high"},
];

const DAYS = ["Pon","Wt","Śr","Czw","Pt","Sob","Nd"];
const SLOTS = ["Śniadanie","Obiad","Przekąska"];
const SLOT_STYLE = {
  Śniadanie:{bg:"#fef9ee",border:"#f0b429",text:"#7a4f00"},
  Obiad:{bg:"#f0faf0",border:"#4caf50",text:"#1b5e20"},
  Przekąska:{bg:"#fdf0fa",border:"#ce93d8",text:"#6a1b9a"},
};
const DIFF_COL = {"Łatwy":"#4caf50","Średni":"#e09000","Trudny":"#ef5350"};
const SNXT = {high:"med",med:"low",low:"brak",brak:"high"};
const SBAR = {high:100,med:62,low:25,brak:0};
const SBCOL = {high:"#4caf50",med:"#e09000",low:"#e07030",brak:"transparent"};

const C = {
  bg:"#f7f3ed", surface:"#ffffff", ink:"#1a1612", ink2:"#4a4138", ink3:"#8a7d6e",
  line:"#e8e0d2", line2:"#f0e8d8", accent:"#8b3a3a", gold:"#b8954f", green:"#4caf50",
};

const GF = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600&display=swap');`;

const GLOBAL_CSS = `
${GF}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{margin:0;background:${C.bg};font-family:'Inter',sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased;}
input,select,button{font-family:'Inter',sans-serif;}
input:focus,select:focus{outline:2px solid ${C.accent};outline-offset:-1px;}
::-webkit-scrollbar{display:none;}
`;

function Serif({children, size=22, style={}}) {
  return <span style={{fontFamily:"'Fraunces',serif",fontSize:size,...style}}>{children}</span>;
}

function SecTitle({children}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"6px 0 14px"}}>
      <div style={{width:16,height:1,background:C.accent,flexShrink:0}}/>
      <Serif size={15} style={{fontWeight:500,color:C.ink}}>{children}</Serif>
    </div>
  );
}

function Card({children, style={}}) {
  return (
    <div style={{background:C.surface,borderRadius:20,boxShadow:"0 1px 3px rgba(26,22,18,0.05),0 4px 20px rgba(26,22,18,0.05)",marginBottom:12,...style}}>
      {children}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("list");
  const [sel, setSel] = useState(null);
  const [filt, setFilt] = useState("Wszystkie");
  const [cookStep, setCookStep] = useState(0);
  const [pantry, setPantry] = useState([]);
  const [cart, setCart] = useState([]);
  const [week, setWeek] = useState({});
  const [editing, setEditing] = useState(null);
  const [weekQ, setWeekQ] = useState("");
  const [pantryQ, setPantryQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [lowAlert, setLowAlert] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  // Pantry add
  const [showPantryAdd, setShowPantryAdd] = useState(false);
  const [newPName, setNewPName] = useState("");
  const [newPCat, setNewPCat] = useState("Inne");
  // Cart add
  const [showCartAdd, setShowCartAdd] = useState(false);
  const [newCName, setNewCName] = useState("");
  const [newCAmt, setNewCAmt] = useState("");
  const [newCUnit, setNewCUnit] = useState("szt");
  const pollRef = useRef(null);

  const initWeek = () => {
    const w = {};
    DAYS.forEach(d => { w[d] = {}; SLOTS.forEach(s => { w[d][s] = ""; }); });
    return w;
  };

  const loadAll = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      const [{ data:p, error:pe }, { data:c }, { data:w }] = await Promise.all([
        sb.from("pantry").select("*").order("category"),
        sb.from("shopping_list").select("*").order("created_at"),
        sb.from("week_plan").select("*"),
      ]);
      if (pe) throw pe;
      if (p && p.length > 0) setPantry(p);
      else {
        const { data:s } = await sb.from("pantry").insert(INIT_PANTRY).select();
        setPantry(s || []);
      }
      setCart(c || []);
      const wk = initWeek();
      if (w) w.forEach(r => { if (wk[r.day]) wk[r.day][r.slot] = r.meal || ""; });
      setWeek(wk);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
    pollRef.current = setInterval(async () => {
      const { data:c } = await sb.from("shopping_list").select("*").order("created_at");
      if (c) setCart(c);
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [loadAll]);

  const checkLow = (recipe) => {
    const lows = recipe.ing.filter(i => {
      const f = pantry.find(p => p.name.toLowerCase().includes(i.n.toLowerCase().split(" ")[0]));
      return f && (f.status === "low" || f.status === "brak");
    });
    if (lows.length) { setLowAlert(lows); setShowAlert(true); }
  };

  const openR = (r) => { setSel(r); setView("recipe"); setCookStep(0); checkLow(r); };
  const back = () => { setView("list"); setSel(null); setShowAlert(false); };

  const addToCart = async (items) => {
    const toAdd = items.filter(i => i.n).map(i => ({ name:i.n, amount:i.a||"", unit:i.u||"", recipe:sel?.name||"Ręcznie", checked:false }));
    const { data:added } = await sb.from("shopping_list").insert(toAdd).select();
    setCart(p => [...p, ...(added||[])]);
    setShowAlert(false); setView("cart");
  };

  const addCartManual = async () => {
    if (!newCName.trim()) return;
    const { data:added } = await sb.from("shopping_list").insert([{ name:newCName.trim(), amount:newCAmt, unit:newCUnit, recipe:"Ręcznie", checked:false }]).select();
    setCart(p => [...p, ...(added||[])]);
    setNewCName(""); setNewCAmt(""); setNewCUnit("szt"); setShowCartAdd(false);
  };

  const toggleCart = async (id, checked) => {
    await sb.from("shopping_list").update({ checked:!checked }).eq("id", id);
    setCart(p => p.map(i => i.id===id ? {...i,checked:!checked} : i));
  };

  const clearChecked = async () => {
    await sb.from("shopping_list").delete().eq("checked", true);
    setCart(p => p.filter(i => !i.checked));
  };

  const clearAll = async () => {
    await sb.from("shopping_list").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setCart([]);
  };

  const cycleStatus = async (id, cur) => {
    const next = SNXT[cur];
    await sb.from("pantry").update({ status:next }).eq("id", id);
    setPantry(p => p.map(i => i.id===id ? {...i,status:next} : i));
  };

  const addPantryManual = async () => {
    if (!newPName.trim()) return;
    const { data:added } = await sb.from("pantry").insert([{ name:newPName.trim(), category:newPCat, status:"high" }]).select();
    if (added) setPantry(p => [...p, ...added]);
    setNewPName(""); setShowPantryAdd(false);
  };

  const pantryToCart = async (item) => {
    const { data:added } = await sb.from("shopping_list").insert([{ name:item.name, amount:"", unit:"", recipe:"Magazyn", checked:false }]).select();
    setCart(p => [...p, ...(added||[])]);
    setView("cart");
  };

  const setMeal = async (d, sl, val) => {
    await sb.from("week_plan").upsert([{ day:d, slot:sl, meal:val }], { onConflict:"day,slot" });
    setWeek(p => ({ ...p, [d]:{ ...p[d], [sl]:val } }));
    setEditing(null); setWeekQ("");
  };

  const cats = ["Wszystkie", ...new Set(RECIPES.map(r => r.cat))];
  const filtR = filt==="Wszystkie" ? RECIPES : RECIPES.filter(r => r.cat===filt);
  const filtSearch = RECIPES.filter(r => r.name.toLowerCase().includes(weekQ.toLowerCase()));
  const filtP = pantry.filter(i => i.name.toLowerCase().includes(pantryQ.toLowerCase()));
  const pCats = [...new Set(pantry.map(i => i.category))];
  const lowCount = pantry.filter(i => i.status==="low" || i.status==="brak").length;
  const cartPending = cart.filter(i => !i.checked).length;

  const TABS = [
    {id:"list", lbl:"Przepisy"},
    {id:"week", lbl:"Tydzień"},
    {id:"pantry", lbl: lowCount > 0 ? `Magazyn ⚠` : "Magazyn"},
    {id:"cart", lbl: cartPending > 0 ? `Koszyk (${cartPending})` : "Koszyk"},
  ];

  // Input style helper
  const inp = {padding:"11px 14px",borderRadius:12,border:`1px solid ${C.line}`,background:C.bg,fontSize:13,color:C.ink,width:"100%",boxSizing:"border-box"};

  if (loading) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
        <div style={{fontSize:52}}>🍳</div>
        <Serif size={18} style={{fontWeight:300,color:C.ink3}}>Ładowanie kuchni…</Serif>
      </div>
    </>
  );

  if (err) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:24,textAlign:"center"}}>
        <div style={{fontSize:40}}>⚠️</div>
        <div style={{color:"#ef5350",fontSize:13}}>{err}</div>
        <button onClick={loadAll} style={{background:C.ink,color:C.bg,border:"none",borderRadius:12,padding:"12px 28px",cursor:"pointer",fontSize:14}}>Spróbuj ponownie</button>
      </div>
    </>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{minHeight:"100vh",background:C.bg}}>

        {/* MODAL — brakujące składniki */}
        {showAlert && lowAlert.length > 0 && (
          <div style={{position:"fixed",inset:0,background:"rgba(26,22,18,0.65)",zIndex:300,display:"flex",alignItems:"flex-end"}}>
            <div style={{background:C.surface,borderRadius:"24px 24px 0 0",padding:"24px 24px 44px",width:"100%",maxWidth:500,margin:"0 auto",boxShadow:"0 -20px 60px rgba(0,0,0,0.2)"}}>
              <Serif size={21} style={{display:"block",marginBottom:8}}>Sprawdź magazyn</Serif>
              <div style={{fontSize:13,color:C.ink3,marginBottom:16,lineHeight:1.5}}>Te składniki masz na wyczerpaniu:</div>
              {lowAlert.map((i,idx) => (
                <div key={idx} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.line2}`,fontSize:14}}>
                  <span>{i.n}</span><span style={{color:"#e07030",fontWeight:600}}>{i.a} {i.u}</span>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:20}}>
                <button onClick={() => addToCart(lowAlert)} style={{flex:1,background:C.ink,color:C.bg,border:"none",borderRadius:14,padding:14,cursor:"pointer",fontSize:14,fontWeight:500}}>Dodaj do koszyka</button>
                <button onClick={() => setShowAlert(false)} style={{flex:1,background:"transparent",color:C.ink,border:`1.5px solid ${C.line}`,borderRadius:14,padding:14,cursor:"pointer",fontSize:14}}>Ignoruj</button>
              </div>
            </div>
          </div>
        )}

        {/* NAGŁÓWEK */}
        <div style={{background:C.bg,position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.line2}`}}>
          <div style={{maxWidth:760,margin:"0 auto",padding:"14px 20px 0"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              {view==="recipe"||view==="cook" ? (
                <button onClick={back} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:C.ink2,fontSize:14,padding:0}}>
                  <span style={{fontSize:20}}>←</span> Wróć
                </button>
              ) : (
                <Serif size={22} style={{fontWeight:400,letterSpacing:"-0.3px"}}>
                  Moja <em style={{fontStyle:"italic",color:C.accent}}>Kuchnia</em>
                </Serif>
              )}
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:9,letterSpacing:2,color:C.green,textTransform:"uppercase",fontWeight:600}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>live
              </div>
            </div>
            <div style={{display:"flex",gap:20,overflowX:"auto"}}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setView(t.id)} style={{background:"none",border:"none",borderBottom:view===t.id?`2px solid ${C.accent}`:"2px solid transparent",padding:"0 0 12px",color:view===t.id?C.ink:C.ink3,fontSize:13,fontWeight:view===t.id?600:400,cursor:"pointer",whiteSpace:"nowrap",letterSpacing:"0.2px",transition:"color 0.15s"}}>
                  {t.lbl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:760,margin:"0 auto",padding:"0 20px 80px"}}>

          {/* ─── LISTA PRZEPISÓW ─── */}
          {view==="list" && <>
            <div style={{padding:"26px 0 20px"}}>
              <div style={{fontSize:10,letterSpacing:3,color:C.ink3,textTransform:"uppercase",marginBottom:8,fontWeight:500}}>
                {new Date().toLocaleDateString("pl",{weekday:"long",day:"numeric",month:"long"})}
              </div>
              <Serif size={30} style={{display:"block",fontWeight:300,lineHeight:1.1,letterSpacing:"-0.5px",marginBottom:6}}>
                Co <em style={{fontStyle:"italic",color:C.accent}}>gotujemy</em><br/>dzisiaj?
              </Serif>
              <div style={{fontSize:13,color:C.ink3}}>{RECIPES.length} przepisów w kolekcji</div>
            </div>
            <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:24,paddingBottom:2}}>
              {cats.map(c => (
                <button key={c} onClick={() => setFilt(c)} style={{padding:"8px 16px",background:filt===c?C.ink:"transparent",color:filt===c?C.bg:C.ink2,border:`1px solid ${filt===c?C.ink:C.line}`,borderRadius:100,fontSize:12,whiteSpace:"nowrap",cursor:"pointer",fontWeight:filt===c?500:400,transition:"all 0.15s"}}>
                  {c}
                </button>
              ))}
            </div>
            {filtR.map(r => (
              <Card key={r.id} style={{cursor:"pointer"}}>
                <div onClick={() => openR(r)} style={{display:"flex",gap:16,padding:"18px",alignItems:"center"}}>
                  <div style={{width:68,height:68,background:C.line2,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,flexShrink:0}}>{r.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",gap:8,marginBottom:5,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:9,letterSpacing:2,color:C.accent,textTransform:"uppercase",fontWeight:600}}>{r.cat}</span>
                      <span style={{fontSize:9,background:DIFF_COL[r.diff]+"20",color:DIFF_COL[r.diff],padding:"2px 8px",borderRadius:10,fontWeight:600}}>{r.diff}</span>
                    </div>
                    <Serif size={17} style={{display:"block",marginBottom:5,lineHeight:1.2,letterSpacing:"-0.2px"}}>{r.name}</Serif>
                    <div style={{display:"flex",gap:8,fontSize:11,color:C.ink3,flexWrap:"wrap"}}>
                      <span>⏱ {r.time}</span>
                      <span>· 👥 {r.srv} {r.srv===1?"porcja":"porcji"}</span>
                      {r.kcal && <span>· 🔥 {r.kcal}</span>}
                      {r.prot && <span>· 💪 {r.prot}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </>}

          {/* ─── PRZEPIS DETAIL ─── */}
          {view==="recipe" && sel && <div>
            <div style={{textAlign:"center",padding:"26px 0 22px",borderBottom:`1px solid ${C.line2}`,marginBottom:22}}>
              <div style={{width:116,height:116,background:C.surface,borderRadius:"50%",margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,boxShadow:`0 8px 32px rgba(139,58,58,0.1)`}}>{sel.emoji}</div>
              <div style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",fontWeight:600,marginBottom:10}}>{sel.cat}</div>
              <Serif size={25} style={{display:"block",fontWeight:400,lineHeight:1.15,letterSpacing:"-0.5px",marginBottom:10,color:C.ink}}>{sel.name}</Serif>
              <p style={{fontSize:13,color:C.ink2,lineHeight:1.6,maxWidth:300,margin:"0 auto 18px"}}>{sel.desc}</p>
              <div style={{display:"flex",justifyContent:"center",gap:20,paddingTop:18,borderTop:`1px solid ${C.line2}`,flexWrap:"wrap"}}>
                {[["⏱",sel.time,"Czas"],["👥",sel.srv+(sel.srv===1?" porcja":" porcji"),"Ilość"],sel.kcal&&["🔥",sel.kcal,"Energia"],sel.prot&&["💪",sel.prot,"Białko"]].filter(Boolean).map(([icon,val,lbl],i) => (
                  <div key={i} style={{textAlign:"center"}}>
                    <Serif size={15} style={{display:"block",fontWeight:500,lineHeight:1,marginBottom:4,color:C.ink}}>{val}</Serif>
                    <div style={{fontSize:9,letterSpacing:2,color:C.ink3,textTransform:"uppercase"}}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:22}}>
              <button onClick={() => addToCart(sel.ing)} style={{flex:1,background:"transparent",border:`1.5px solid ${C.ink}`,color:C.ink,borderRadius:14,padding:"13px",cursor:"pointer",fontSize:13,fontWeight:500}}>🛒 Do koszyka</button>
              <button onClick={() => { setCookStep(0); setView("cook"); }} style={{flex:2,background:C.ink,border:"none",color:C.bg,borderRadius:14,padding:"13px",cursor:"pointer",fontSize:13,fontWeight:500}}>Tryb gotowania →</button>
            </div>
            <div style={{marginBottom:20}}>
              <SecTitle>Sprzęt</SecTitle>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {sel.eq.map((e,i) => <span key={i} style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:10,padding:"6px 12px",fontSize:12,color:C.ink2}}>{e}</span>)}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <SecTitle>Składniki</SecTitle>
              <Card style={{padding:"4px 18px"}}>
                {sel.ing.map((i,idx) => i.n && (
                  <div key={idx} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:idx<sel.ing.length-1?`1px solid ${C.line2}`:"none",fontSize:14}}>
                    <span style={{color:C.ink}}>{i.n}</span>
                    <span style={{color:C.ink3,fontWeight:500}}>{i.a} {i.u}</span>
                  </div>
                ))}
              </Card>
            </div>
            <div style={{marginBottom:20}}>
              <SecTitle>Mise en place</SecTitle>
              {sel.mise.map((m,i) => (
                <div key={i} style={{display:"flex",gap:14,padding:"10px 0",borderBottom:i<sel.mise.length-1?`1px solid ${C.line2}`:"none"}}>
                  <Serif size={20} style={{color:C.accent,fontWeight:400,lineHeight:1,minWidth:20,flexShrink:0}}>{i+1}</Serif>
                  <span style={{fontSize:13,lineHeight:1.65,color:C.ink2,paddingTop:2}}>{m}</span>
                </div>
              ))}
            </div>
            <div style={{marginBottom:20}}>
              <SecTitle>Kroki</SecTitle>
              {sel.steps.map(s => (
                <div key={s.s} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:s.s<sel.steps.length?`1px solid ${C.line2}`:"none"}}>
                  <div style={{width:28,height:28,background:C.ink,color:C.bg,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,fontWeight:700}}>{s.s}</div>
                  <div>
                    <div style={{fontSize:9,color:C.accent,letterSpacing:2,marginBottom:4,textTransform:"uppercase",fontWeight:600}}>{s.t}</div>
                    <div style={{fontSize:14,lineHeight:1.65,color:C.ink2}}>{s.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {/* ─── TRYB GOTOWANIA ─── */}
          {view==="cook" && sel && (
            <div style={{position:"fixed",inset:0,background:C.ink,color:C.bg,display:"flex",flexDirection:"column",padding:"64px 28px 40px",zIndex:200}}>
              <div style={{display:"flex",gap:4,marginBottom:28}}>
                {sel.steps.map((_,i) => (
                  <div key={i} onClick={() => setCookStep(i)} style={{flex:1,height:3,borderRadius:2,background:i<=cookStep?C.gold:"rgba(255,255,255,0.15)",cursor:"pointer",transition:"background 0.2s"}}/>
                ))}
              </div>
              <div style={{fontSize:10,letterSpacing:3,color:C.gold,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Krok {cookStep+1} z {sel.steps.length}</div>
              <Serif size={13} style={{fontStyle:"italic",fontWeight:300,color:"rgba(255,255,255,0.4)",display:"block",marginBottom:12}}>{sel.steps[cookStep].t}</Serif>
              <div style={{flex:1,overflow:"auto"}}>
                <Serif size={23} style={{fontWeight:300,lineHeight:1.45,color:C.bg,letterSpacing:"-0.3px",display:"block"}}>{sel.steps[cookStep].a}</Serif>
              </div>
              <div style={{display:"flex",gap:12,marginTop:20}}>
                <button onClick={() => setCookStep(p => Math.max(0,p-1))} disabled={cookStep===0} style={{flex:1,padding:"15px",borderRadius:16,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.55)",cursor:cookStep===0?"not-allowed":"pointer",opacity:cookStep===0?0.35:1,fontSize:14,fontWeight:500}}>← Poprzedni</button>
                {cookStep < sel.steps.length-1
                  ? <button onClick={() => setCookStep(p => p+1)} style={{flex:2,padding:"15px",borderRadius:16,border:"none",background:C.gold,color:C.ink,cursor:"pointer",fontSize:14,fontWeight:700}}>Następny →</button>
                  : <button onClick={() => setView("recipe")} style={{flex:2,padding:"15px",borderRadius:16,border:"none",background:"#4caf50",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700}}>Gotowe! 🎉</button>
                }
              </div>
            </div>
          )}

          {/* ─── TYDZIEŃ ─── */}
          {view==="week" && <div style={{paddingTop:24}}>
            <Serif size={26} style={{display:"block",fontWeight:300,letterSpacing:"-0.5px",marginBottom:6}}>
              Plan <em style={{fontStyle:"italic",color:C.accent}}>tygodnia</em>
            </Serif>
            <div style={{fontSize:13,color:C.ink3,marginBottom:20}}>Kliknij slot żeby przypisać przepis</div>
            {DAYS.map(d => (
              <Card key={d} style={{overflow:"hidden",marginBottom:10}}>
                <div style={{background:C.ink,color:C.bg,padding:"8px 16px",fontSize:9,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>{d}</div>
                <div style={{padding:"8px 12px"}}>
                  {SLOTS.map(sl => (
                    <div key={sl} style={{marginBottom:6}}>
                      {editing?.d===d && editing?.sl===sl ? (
                        <div style={{background:C.bg,borderRadius:10,padding:10,border:`1.5px solid ${C.accent}`}}>
                          <input autoFocus value={weekQ} onChange={e => setWeekQ(e.target.value)} placeholder="Szukaj lub wpisz…" style={{...inp,marginBottom:6}}/>
                          {weekQ && <div style={{marginBottom:6}}>
                            {filtSearch.map(r => <div key={r.id} onClick={() => setMeal(d,sl,r.name)} style={{padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:13,background:C.surface,border:`1px solid ${C.line}`,marginBottom:4,display:"flex",gap:8,color:C.ink2}}><span>{r.emoji}</span><span>{r.name}</span></div>)}
                          </div>}
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={() => weekQ && setMeal(d,sl,weekQ)} style={{flex:1,background:C.ink,color:C.bg,border:"none",borderRadius:8,padding:"9px",cursor:"pointer",fontSize:12,fontWeight:500}}>Zapisz</button>
                            <button onClick={() => { setEditing(null); setWeekQ(""); }} style={{flex:1,background:"transparent",color:C.ink2,border:`1px solid ${C.line}`,borderRadius:8,padding:"9px",cursor:"pointer",fontSize:12}}>Anuluj</button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => setEditing({d,sl})} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:10,cursor:"pointer",background:week[d]&&week[d][sl]?SLOT_STYLE[sl].bg:C.bg,border:`1px solid ${week[d]&&week[d][sl]?SLOT_STYLE[sl].border:C.line2}`,transition:"all 0.15s"}}>
                          <span style={{fontSize:9,fontWeight:700,minWidth:70,color:week[d]&&week[d][sl]?SLOT_STYLE[sl].text:C.ink3,textTransform:"uppercase",letterSpacing:1,flexShrink:0}}>{sl}</span>
                          <span style={{flex:1,fontSize:13,color:week[d]&&week[d][sl]?SLOT_STYLE[sl].text:C.line}}>{week[d]&&week[d][sl]||"+ dodaj"}</span>
                          {week[d]&&week[d][sl] && <span onClick={e => { e.stopPropagation(); setMeal(d,sl,""); }} style={{color:"#ef5350",fontSize:16,lineHeight:1,padding:"0 2px"}}>×</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>}

          {/* ─── MAGAZYN ─── */}
          {view==="pantry" && <div style={{paddingTop:24}}>
            <Serif size={26} style={{display:"block",fontWeight:300,letterSpacing:"-0.5px",marginBottom:6}}>
              Stan <em style={{fontStyle:"italic",color:C.accent}}>spiżarni</em>
            </Serif>
            <div style={{fontSize:13,color:C.ink3,marginBottom:16}}>Kliknij pasek żeby zmienić ilość · + żeby dodać do koszyka</div>
            {lowCount > 0 && (
              <div style={{background:"#fff8f0",border:"1px solid #e07030",borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:18}}>⚠️</span>
                <div style={{fontSize:13,color:C.ink2}}><b style={{color:"#e07030"}}>{lowCount} {lowCount===1?"produkt":"produktów"}</b> na wyczerpaniu</div>
              </div>
            )}
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <input value={pantryQ} onChange={e => setPantryQ(e.target.value)} placeholder="Szukaj produktu…" style={{...inp,flex:1,width:"auto"}}/>
              <button onClick={() => setShowPantryAdd(!showPantryAdd)} style={{width:44,height:44,borderRadius:12,background:showPantryAdd?C.accent:C.ink,color:C.bg,border:"none",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,flexShrink:0}}>+</button>
            </div>
            {showPantryAdd && (
              <Card style={{padding:16,marginBottom:16,border:`1.5px solid ${C.accent}`}}>
                <Serif size={15} style={{display:"block",marginBottom:12,fontWeight:500}}>Nowy produkt</Serif>
                <input value={newPName} onChange={e => setNewPName(e.target.value)} placeholder="Nazwa produktu…" style={{...inp,marginBottom:8}} onKeyDown={e => e.key==="Enter" && addPantryManual()}/>
                <select value={newPCat} onChange={e => setNewPCat(e.target.value)} style={{...inp,marginBottom:12}}>
                  {[...pCats,"Inne"].map(c => <option key={c}>{c}</option>)}
                </select>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addPantryManual} style={{flex:1,background:C.ink,color:C.bg,border:"none",borderRadius:10,padding:"11px",cursor:"pointer",fontSize:13,fontWeight:500}}>Dodaj</button>
                  <button onClick={() => setShowPantryAdd(false)} style={{flex:1,background:"transparent",color:C.ink2,border:`1px solid ${C.line}`,borderRadius:10,padding:"11px",cursor:"pointer",fontSize:13}}>Anuluj</button>
                </div>
              </Card>
            )}
            {pCats.map(c => {
              const items = filtP.filter(i => i.category===c);
              if (!items.length) return null;
              return (
                <div key={c} style={{marginBottom:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${C.line}`}}>
                    <Serif size={14} style={{color:C.ink2,fontWeight:500}}>{c}</Serif>
                    <span style={{fontSize:10,letterSpacing:2,color:C.ink3,textTransform:"uppercase"}}>{items.length}</span>
                  </div>
                  {items.map(it => (
                    <div key={it.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.line2}`}}>
                      <div onClick={() => cycleStatus(it.id, it.status)} title="Kliknij żeby zmienić stan" style={{width:38,height:6,background:C.line,borderRadius:3,flexShrink:0,overflow:"hidden",cursor:"pointer",position:"relative"}}>
                        <div style={{height:"100%",width:`${SBAR[it.status]}%`,background:SBCOL[it.status],borderRadius:3,transition:"all 0.3s"}}/>
                      </div>
                      <span onClick={() => cycleStatus(it.id, it.status)} style={{fontSize:14,flex:1,cursor:"pointer",opacity:it.status==="brak"?0.38:1,textDecoration:it.status==="brak"?"line-through":"none",color:C.ink}}>{it.name}</span>
                      <button onClick={() => pantryToCart(it)} title="Dodaj do koszyka" style={{width:30,height:30,borderRadius:"50%",background:it.status==="low"||it.status==="brak"?C.accent:C.line2,border:"none",color:it.status==="low"||it.status==="brak"?C.bg:C.ink3,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,flexShrink:0}}>+</button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>}

          {/* ─── KOSZYK ─── */}
          {view==="cart" && <div style={{paddingTop:24}}>
            <Serif size={26} style={{display:"block",fontWeight:300,letterSpacing:"-0.5px",marginBottom:6}}>
              Lista <em style={{fontStyle:"italic",color:C.accent}}>zakupów</em>
            </Serif>
            <div style={{fontSize:13,color:C.ink3,marginBottom:18}}>Zsynchronizowane z żoną co 5 sek</div>

            {/* Przyciski akcji */}
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <button onClick={() => setShowCartAdd(!showCartAdd)} style={{flex:1,minWidth:140,background:showCartAdd?C.ink:"transparent",color:showCartAdd?C.bg:C.ink,border:`1.5px solid ${C.ink}`,borderRadius:12,padding:"11px 14px",cursor:"pointer",fontSize:13,fontWeight:500,transition:"all 0.15s"}}>+ Dodaj ręcznie</button>
              {cart.length > 0 && <>
                <button onClick={clearChecked} style={{padding:"11px 14px",background:"transparent",border:`1px solid ${C.line}`,color:C.ink3,borderRadius:12,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>Usuń ✓</button>
                <button onClick={clearAll} style={{padding:"11px 14px",background:"transparent",border:"1px solid #ef5350",color:"#ef5350",borderRadius:12,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>Wyczyść</button>
              </>}
            </div>

            {showCartAdd && (
              <Card style={{padding:16,marginBottom:16,border:`1.5px solid ${C.accent}`}}>
                <Serif size={15} style={{display:"block",marginBottom:12,fontWeight:500}}>Nowa pozycja</Serif>
                <input value={newCName} onChange={e => setNewCName(e.target.value)} placeholder="Nazwa produktu…" style={{...inp,marginBottom:8}} onKeyDown={e => e.key==="Enter" && addCartManual()}/>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <input value={newCAmt} onChange={e => setNewCAmt(e.target.value)} placeholder="Ilość" style={{...inp,flex:1,width:"auto"}}/>
                  <select value={newCUnit} onChange={e => setNewCUnit(e.target.value)} style={{...inp,flex:1,width:"auto"}}>
                    {["szt","g","kg","ml","l","opak","puszka","pęczek"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addCartManual} style={{flex:1,background:C.ink,color:C.bg,border:"none",borderRadius:10,padding:"11px",cursor:"pointer",fontSize:13,fontWeight:500}}>Dodaj</button>
                  <button onClick={() => setShowCartAdd(false)} style={{flex:1,background:"transparent",color:C.ink2,border:`1px solid ${C.line}`,borderRadius:10,padding:"11px",cursor:"pointer",fontSize:13}}>Anuluj</button>
                </div>
              </Card>
            )}

            {cart.length === 0 ? (
              <div style={{textAlign:"center",padding:"50px 20px",color:C.ink3}}>
                <Serif size={48} style={{display:"block",marginBottom:14}}>🛒</Serif>
                <div style={{fontSize:15,marginBottom:6}}>Lista jest pusta</div>
                <div style={{fontSize:13}}>Wejdź w przepis i kliknij "Do koszyka"</div>
              </div>
            ) : (
              [...new Set(cart.map(i => i.recipe))].map(rn => (
                <div key={rn} style={{marginBottom:22}}>
                  <div style={{fontSize:9,letterSpacing:2,color:C.ink3,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>{rn}</div>
                  {cart.filter(i => i.recipe===rn).map(item => (
                    <div key={item.id} onClick={() => toggleCart(item.id, item.checked)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.line2}`,cursor:"pointer",opacity:item.checked?0.38:1,transition:"opacity 0.2s"}}>
                      <div style={{width:22,height:22,border:`2px solid ${item.checked?C.ink:C.line}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:item.checked?C.ink:"transparent",flexShrink:0,transition:"all 0.15s"}}>
                        {item.checked && <span style={{color:C.bg,fontSize:12,fontWeight:700}}>✓</span>}
                      </div>
                      <span style={{flex:1,fontSize:15,textDecoration:item.checked?"line-through":"none",color:C.ink}}>{item.name}</span>
                      <span style={{color:C.ink3,fontSize:12,fontWeight:500}}>{item.amount} {item.unit}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>}

        </div>
      </div>
    </>
  );
}
