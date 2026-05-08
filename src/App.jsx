import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://xorltrddwujfiwsfkhqu.supabase.co",
  "sb_publishable_pKz_5jRAIet3gQh19-GXuQ_w5ojHEiS"
);

const RECIPES = [
  { id:1, name:"Crispy Chicken Burrito", emoji:"🌯", cat:"High Protein", time:"30 min", srv:1, diff:"Łatwy", kcal:"~420 kcal", prot:"~40g", desc:"Chrupiący kurczak w cornflakes, sos miodowo-musztardowy, sałatka ogórkowa.",
    ing:[{n:"Pierś z kurczaka",a:"140",u:"g"},{n:"Mąka pszenna",a:"40",u:"g"},{n:"Jajko",a:"1",u:"szt"},{n:"Cornflakes",a:"45",u:"g"},{n:"Miód",a:"10",u:"g"},{n:"Musztarda",a:"10",u:"g"},{n:"Ogórek",a:"130",u:"g"},{n:"Jalapeño",a:"½",u:"szt"},{n:"Sos sojowy",a:"10",u:"ml"},{n:"Tortilla",a:"1",u:"szt"}],
    eq:["Air Fryer","3 talerze","Nóż i deska"],
    mise:["Rozkrusz cornflakes — nie za drobno","3 talerze: mąka, jajko, cornflakes","Pokrój ogórka i jalapeño","Rozgrzej air fryer do 195°C"],
    steps:[{s:1,t:"3 talerze",a:"Panieruj: mąka, jajko, cornflakes. Mocno dociskaj."},{s:2,t:"Air Fryer 195°C",a:"Spryskaj olejem. 16 min, przekładaj w połowie. 74°C."},{s:3,t:"Miska",a:"10g miodu + 10g musztardy + pieprz."},{s:4,t:"Miska",a:"Ogórek + jalapeño + 10ml sos sojowy + ocet."},{s:5,t:"Tortilla",a:"Kurczak, sos, sałatka. Zawiń."}]},
  { id:2, name:"PB&J Overnight Oats", emoji:"🥜", cat:"Śniadanie", time:"5 min + noc", srv:1, diff:"Łatwy", kcal:"~500 kcal", prot:"~47g", desc:"Masło orzechowe + proszek arachidowy + mrożone owoce. W 100% gotowe dzień wcześniej.",
    ing:[{n:"Płatki owsiane górskie",a:"60",u:"g"},{n:"Mleko UHT wysokobiałkowe",a:"150",u:"ml"},{n:"Skyr pitny owocowy",a:"100",u:"ml"},{n:"Nasiona chia",a:"10",u:"g"},{n:"Proszek arachidowy",a:"20",u:"g"},{n:"Masło orzechowe",a:"15",u:"g"},{n:"Mrożone owoce",a:"80",u:"g"},{n:"Orzechy",a:"15",u:"g"},{n:"Miód",a:"10",u:"g"}],
    eq:["Słoik 500ml","Łyżka","Lodówka"],
    mise:["Słoik min. 500ml","Masło orzechowe w temp. pokojowej","Owoce zamrożone wrzucasz prosto"],
    steps:[{s:1,t:"Słoik",a:"60g płatków + 10g chia + 20g proszku. Wymieszaj suche."},{s:2,t:"Słoik",a:"150ml mleka + 100ml skyru + 10g miodu + sól. Mieszaj."},{s:3,t:"Słoik",a:"15g masła orzechowego + 15g orzechów."},{s:4,t:"Słoik",a:"80g mrożonych owoców na wierzch."},{s:5,t:"Lodówka",a:"Min. 6h. Rano zamieszaj."}]},
  { id:3, name:"Tropical Overnight Oats", emoji:"🥭", cat:"Śniadanie", time:"5 min + noc", srv:1, diff:"Łatwy", kcal:"~455 kcal", prot:"~44g", desc:"Skyr mango-marakuja + proszek arachidowy + kokos. Gotowe dzień wcześniej.",
    ing:[{n:"Płatki owsiane górskie",a:"60",u:"g"},{n:"Mleko UHT wysokobiałkowe",a:"120",u:"ml"},{n:"Skyr pitny mango-marakuja",a:"150",u:"ml"},{n:"Nasiona chia",a:"10",u:"g"},{n:"Proszek arachidowy",a:"20",u:"g"},{n:"Wiórki kokosowe",a:"10",u:"g"},{n:"Mrożone mango",a:"80",u:"g"},{n:"Orzechy",a:"15",u:"g"},{n:"Miód",a:"8",u:"g"}],
    eq:["Słoik 500ml","Łyżka","Lodówka"],
    mise:["Słoik min. 500ml","Wiórki kokosowe możesz podprażyć 2 min"],
    steps:[{s:1,t:"Słoik",a:"60g płatków + 10g chia + 20g proszku + 10g kokosa."},{s:2,t:"Słoik",a:"120ml mleka + 150ml skyru + 8g miodu + sól."},{s:3,t:"Słoik",a:"15g orzechów."},{s:4,t:"Słoik",a:"80g mrożonego mango na wierzch."},{s:5,t:"Lodówka",a:"Min. 6h. Rano zamieszaj."}]},
  { id:4, name:"Szparagi z jajkiem i brązowym masłem", emoji:"🍳", cat:"Śniadanie", time:"15 min", srv:1, diff:"Łatwy", kcal:"~340 kcal", prot:"~15g", desc:"Szparagi, jajko sadzone i beurre noisette. Pilnuj masła żeby nie przepalić.",
    ing:[{n:"Szparagi zielone",a:"200",u:"g"},{n:"Jajka",a:"2",u:"szt"},{n:"Masło niesolone",a:"40",u:"g"},{n:"Chleb na zakwasie",a:"2",u:"kromki"},{n:"Cytryna",a:"½",u:"szt"},{n:"Olej rzepakowy",a:"10",u:"ml"}],
    eq:["Patelnia stalowa 28cm","Mała patelnia 20cm","Griddle żeliwny"],
    mise:["Szparagi — odłam twarde końce","Jajka 10 min przed z lodówki","Masło 40g podziel na kawałki"],
    steps:[{s:1,t:"Patelnia 28cm",a:"Test wodny, 10ml oleju, szparagi płasko. 2 min, obróć, 2 min. Sól."},{s:2,t:"Patelnia 20cm",a:"Jajka. 2-3 min — białko ścięte, żółtko płynne."},{s:3,t:"Ta sama patelnia",a:"40g masła. Bąble, cisza, orzechowy zapach + brązowe drobinki = NATYCHMIAST zdejmij."},{s:4,t:"Griddle",a:"Chleb 1-2 min z każdej strony."},{s:5,t:"Talerz",a:"Chleb, szparagi, jajka, brązowe masło, cytryna, pieprz."}]},
  { id:5, name:"Kurczak miso-butter-gochujang", emoji:"🍗", cat:"Obiad", time:"30 min", srv:2, diff:"Średni", kcal:"~400 kcal", prot:"~51g", desc:"Kurczak z glazurą miso-butter-gochujang, szparagi sojowo-sezamowe.",
    ing:[{n:"Piersi z kurczaka",a:"2",u:"szt"},{n:"Szparagi zielone",a:"400",u:"g"},{n:"Masło niesolone",a:"60",u:"g"},{n:"Białe miso",a:"30",u:"g"},{n:"Gochujang",a:"10",u:"g"},{n:"Sos sojowy",a:"30",u:"ml"},{n:"Olej sezamowy",a:"10",u:"ml"},{n:"Czosnek",a:"4",u:"ząbki"},{n:"Imbir świeży",a:"2",u:"cm"},{n:"Miód",a:"10",u:"g"},{n:"Sezam",a:"15",u:"g"}],
    eq:["Patelnia stalowa 36cm","2 miseczki","Termometr"],
    mise:["Kurczak 15 min przed z lodówki, osusz","Glazura: 60g masła + 30g miso + 10g gochujang + 10g miodu","Sos: 30ml sojowy + 10ml sezamowy"],
    steps:[{s:1,t:"Patelnia 36cm",a:"20ml oleju, piersi. Nie ruszaj 4-5 min. Obróć 3-4 min. 65°C."},{s:2,t:"Ta sama patelnia",a:"Czosnek+imbir 30 sek. Glazura. Polewaj 1-2 min. 74°C. 3 min odpoczynku."},{s:3,t:"NIE myj patelni",a:"Szparagi 2-3 min. Sos sojowo-sezamowy 30 sek. Sezam."},{s:4,t:"Deska",a:"Kurczak w plastry. Talerze + szparagi + resztka glazury."}]},
  { id:6, name:"Kurczak w cornflakes — Air Fryer", emoji:"🌽", cat:"Low Fat", time:"25 min", srv:1, diff:"Łatwy", kcal:"~360 kcal", prot:"~44g", desc:"Mąka, jajko, cornflakes — air fryer z 5ml oleju. Chrupiący i lekki.",
    ing:[{n:"Pierś z kurczaka",a:"1",u:"szt"},{n:"Mąka pszenna",a:"40",u:"g"},{n:"Jajko",a:"1",u:"szt"},{n:"Cornflakes niesłodzone",a:"50",u:"g"},{n:"Czosnek granulowany",a:"2",u:"g"},{n:"Papryka wędzona",a:"2",u:"g"},{n:"Olej rzepakowy",a:"5",u:"ml"}],
    eq:["Air Fryer","3 głębokie talerze","Termometr"],
    mise:["Osusz kurczaka ręcznikiem","3 talerze: mąka, jajko, cornflakes z przyprawami","Air fryer do 195°C"],
    steps:[{s:1,t:"3 talerze",a:"Mąka, jajko, cornflakes z przyprawami. Mocno dociskaj."},{s:2,t:"Air Fryer 195°C",a:"5ml oleju z góry. 16 min, przekładaj w połowie. 74°C."},{s:3,t:"Talerz",a:"2 min odpoczynku."}]},
  { id:7, name:"Burrito Bowl z kurczakiem chipotle", emoji:"🌮", cat:"Meksykański", time:"35 min + marynata", srv:6, diff:"Łatwy", kcal:"~480 kcal", prot:"~42g", desc:"Kurczak marynowany overnight w chipotle. Meal prep 6 porcji — lepszy na drugi dzień.",
    ing:[{n:"Piersi z kurczaka",a:"800",u:"g"},{n:"Salsa chipotle Herdez (marynata)",a:"100",u:"g"},{n:"Sos sojowy (marynata)",a:"20",u:"ml"},{n:"Czosnek świeży (marynata)",a:"4",u:"ząbki"},{n:"Kmin rzymski (marynata)",a:"4",u:"g"},{n:"Papryka wędzona (marynata)",a:"4",u:"g"},{n:"Sok z limonki (marynata)",a:"30",u:"ml"},{n:"Ryż basmati",a:"360",u:"g"},{n:"Fasola czarna",a:"2",u:"puszki"},{n:"Kukurydza",a:"1",u:"puszka"},{n:"Cebula czerwona",a:"1",u:"szt"},{n:"Awokado",a:"3",u:"szt"},{n:"Śmietana 18%",a:"200",u:"ml"},{n:"Kolendra świeża",a:"1",u:"pęczek"},{n:"Limonki",a:"2",u:"szt"},{n:"Olej rzepakowy",a:"20",u:"ml"}],
    eq:["Patelnia stalowa 36cm","Garnek ze stali nierdzewnej","Miska do marynaty","Pojemniki meal prep"],
    mise:["DZIEŃ WCZEŚNIEJ WIECZOREM: pokrój 800g kurczaka w plastry ~1.5cm. W misce wymieszaj: 100g salsa chipotle + 20ml sos sojowy + 4 ząbki czosnku przeciśniętego + 4g kmin + 4g papryka wędzona + 30ml sok z limonki. Zalej kurczaka marynatą, zakryj folią i wstaw do lodówki na minimum 8 godzin.","Dzień gotowania: wyjmij kurczaka z lodówki 15 min przed smażeniem — zimny kurczak na patelni = para zamiast przypieczenia","Cebula czerwona: pokrój w drobną kostkę, zalej sokiem z 1 limonki, szczyptą soli — odstaw na 15 min. To szybka pikla która przełamie tłustość kurczaka.","Fasolę i kukurydzę odcedź i opłucz zimną wodą","Awokado kroisz dopiero przed samym podaniem — inaczej ściemnieje"],
    steps:[{s:1,t:"Garnek ze stali nierdzewnej",a:"Wsyp 360g ryżu basmati, zalej 540ml zimnej wody (proporcja 1:1.5), szczyptę soli. Doprowadź do wrzenia na mocnym ogniu, zmniejsz do minimum, przykryj. Gotuj 12 min, zdejmij z ognia, nie odkrywaj przez kolejne 5 min. Przed podaniem wmieszaj posiekaną kolendrę i sok z połowy limonki."},{s:2,t:"Patelnia stalowa 36cm — MAKSYMALNY ogień",a:"Rozgrzej patelnię 2-3 min do maksimum (test wodny). Wlej 20ml oleju. Kurczak wchodzi PARTIAMI — nie wrzucaj całości naraz bo się ugotuje w parze. Pierwsza porcja: rozkładasz plastry w jednej warstwie, NIE ruszasz przez 3-4 min aż brzegi zaczną bielec. Dopiero wtedy obracasz. Kolejne 2-3 min. Chcesz ciemne, lekko zwęglone brzegi — to cały smak. Temperatura wewnętrzna: 74°C. Odkładasz na deskę, robisz kolejną partię."},{s:3,t:"Deska do krojenia",a:"Kurczaka możesz zostawić w plasterkach lub poszarpać widelcami na grubsze kawałki — obie opcje działają. Awokado: przekrój wzdłuż, usuń pestkę, łyżką wyciągnij miąższ, pokrój w plastry lub kostkę. Od razu skrop sokiem z limonki żeby nie ściemniało."},{s:4,t:"Pojemniki meal prep (6 szt.)",a:"Na dno każdego pojemnika: garść ryżu. Obok: 2-3 łyżki fasoli czarnej, 2 łyżki kukurydzy. Na wierzch: porcja kurczaka. Dekoracja: łyżka pikli z cebuli, plastry awokado, łyżka śmietany 18%. Skrop resztką soku z limonki. Zamknij. W lodówce trzyma 4 dni — smak się przegryza i jest lepszy na drugi dzień."}]},
  { id:8, name:"Chili con carne", emoji:"🫕", cat:"Meksykański", time:"20 min + 90 min", srv:6, diff:"Łatwy", kcal:"~520 kcal", prot:"~38g", desc:"Dutch oven — samo się gotuje. Lepsze na drugi dzień. 6 porcji meal prep.",
    ing:[{n:"Wołowina mielona",a:"700",u:"g"},{n:"Fasola czarna",a:"2",u:"puszki"},{n:"Polpa pomidorowa",a:"2",u:"puszki"},{n:"Koncentrat pomidorowy",a:"60",u:"g"},{n:"Cebula",a:"2",u:"szt"},{n:"Czosnek świeży",a:"6",u:"ząbków"},{n:"Papryka czerwona",a:"2",u:"szt"},{n:"Salsa chipotle Herdez",a:"80",u:"g"},{n:"Kmin rzymski",a:"6",u:"g"},{n:"Papryka wędzona",a:"6",u:"g"},{n:"Oregano",a:"4",u:"g"},{n:"Bulion lub woda",a:"200",u:"ml"},{n:"Olej rzepakowy",a:"20",u:"ml"},{n:"Śmietana 18%",a:"150",u:"ml"},{n:"Ser żółty",a:"150",u:"g"}],
    eq:["Dutch oven 5.6L","Deska"],
    mise:["Cebule w kostkę","Czosnek posiekaj","Papryki w kostkę 1.5cm","Przyprawy do miseczki: 6g kmin + 6g papryka + 4g oregano"],
    steps:[{s:1,t:"Dutch oven",a:"20ml oleju, cebula 5-6 min, czosnek 1 min, papryki 3 min."},{s:2,t:"Dutch oven mocny",a:"700g wołowiny. Rozbijaj łyżką. 8-10 min aż zbrązowieje."},{s:3,t:"Dutch oven",a:"Przyprawy 1 min. Koncentrat 2 min."},{s:4,t:"Dutch oven",a:"Polpa + fasola + chipotle + 200ml bulionu. Sól i pieprz."},{s:5,t:"Dutch oven mały ogień",a:"Przykryj. 60-90 min, mieszaj co 20 min. Najlepsze na drugi dzień."},{s:6,t:"Miski",a:"Na ryż lub chleb. Śmietana + ser."}]},
];

const INIT_PANTRY = [
  {name:"Ryż basmati",category:"Kasze i zboża",status:"high"},{name:"Ryż czarny",category:"Kasze i zboża",status:"high"},{name:"Kasza gryczana",category:"Kasze i zboża",status:"high"},{name:"Kasza manna",category:"Kasze i zboża",status:"high"},{name:"Quinoa trójkolorowa",category:"Kasze i zboża",status:"high"},
  {name:"Ciecierzyca sucha",category:"Strączki",status:"high"},{name:"Soczewica czerwona",category:"Strączki",status:"high"},{name:"Fasola czarna puszki",category:"Strączki",status:"high"},
  {name:"Orecchiette",category:"Makarony",status:"high"},{name:"Maccheroni",category:"Makarony",status:"high"},{name:"Udon noodles",category:"Makarony",status:"high"},
  {name:"Nasiona chia",category:"Nasiona",status:"high"},{name:"Siemię lniane",category:"Nasiona",status:"high"},{name:"Sezam",category:"Nasiona",status:"high"},{name:"Słonecznik",category:"Nasiona",status:"high"},{name:"Wiórki kokosowe",category:"Nasiona",status:"high"},
  {name:"Orzechy włoskie",category:"Orzechy",status:"high"},{name:"Migdały",category:"Orzechy",status:"high"},
  {name:"Sos sojowy jasny 1.8L",category:"Sosy azjatyckie",status:"high"},{name:"Sos ostrygowy",category:"Sosy azjatyckie",status:"high"},{name:"Olej sezamowy",category:"Sosy azjatyckie",status:"high"},{name:"Ocet ryżowy",category:"Sosy azjatyckie",status:"high"},{name:"Sos hoisin",category:"Sosy azjatyckie",status:"high"},{name:"Mirin",category:"Sosy azjatyckie",status:"high"},{name:"Sambal oelek",category:"Sosy azjatyckie",status:"high"},
  {name:"Worcestershire",category:"Sosy inne",status:"high"},{name:"Tabasco",category:"Sosy inne",status:"high"},{name:"Hot sauce Babuszka",category:"Sosy inne",status:"high"},{name:"Harissa",category:"Sosy inne",status:"high"},{name:"Musztarda Dijon",category:"Sosy inne",status:"high"},{name:"Salsa chipotle Herdez",category:"Sosy inne",status:"high"},
  {name:"Aceto balsamico",category:"Octowe",status:"high"},{name:"Ocet jabłkowy",category:"Octowe",status:"high"},{name:"Glazura balsamiczna",category:"Octowe",status:"high"},
  {name:"Koncentrat pomidorowy",category:"Pomidory",status:"high"},{name:"Pomidory suszone",category:"Pomidory",status:"high"},{name:"Polpa puszki",category:"Pomidory",status:"high"},
  {name:"Kukurydza sweetcorn",category:"Puszki",status:"high"},{name:"Jalapeño słoik",category:"Puszki",status:"high"},
  {name:"Masło orzechowe smooth",category:"Pasty",status:"high"},{name:"Pasta grepska",category:"Pasty",status:"high"},
  {name:"Kmin rzymski mielony",category:"Przyprawy",status:"high"},{name:"Oregano",category:"Przyprawy",status:"high"},{name:"Cynamon",category:"Przyprawy",status:"high"},{name:"Majeranek",category:"Przyprawy",status:"high"},{name:"Zioła prowansalskie",category:"Przyprawy",status:"high"},{name:"Czosnek granulowany",category:"Przyprawy",status:"high"},{name:"Kurkuma",category:"Przyprawy",status:"high"},{name:"Papryka słodka",category:"Przyprawy",status:"high"},{name:"Papryka wędzona",category:"Przyprawy",status:"high"},{name:"Sól morska",category:"Przyprawy",status:"high"},
];

const DAYS = ["Pon","Wt","Sr","Czw","Pt","Sob","Nd"];
const SLOTS = ["Sniadanie","Obiad","Przekaska"];
const SC = {Sniadanie:"#fef3c7",Obiad:"#dcfce7",Przekaska:"#fce7f3"};
const SBR = {Sniadanie:"#f59e0b",Obiad:"#22c55e",Przekaska:"#ec4899"};
const ST = {Sniadanie:"#92400e",Obiad:"#166534",Przekaska:"#9d174d"};
const DC = {"Łatwy":"#22c55e","Średni":"#f59e0b","Trudny":"#ef4444"};
const SCOL = {high:"#22c55e",med:"#f59e0b",low:"#ef4444",brak:"#9ca3af"};
const SLBL = {high:"DUŻO",med:"TROCHĘ",low:"MAŁO",brak:"BRAK"};
const SNXT = {high:"med",med:"low",low:"brak",brak:"high"};

function Box({t, children}) {
  return (
    <div style={{background:"#fff",borderRadius:12,padding:"13px",marginBottom:10,border:"1.5px solid #e8e0d0"}}>
      <div style={{fontSize:11,fontWeight:"bold",letterSpacing:0.5,marginBottom:9,paddingBottom:7,borderBottom:"1px solid #f0ebe0"}}>{t}</div>
      {children}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("list");
  const [sel, setSel] = useState(null);
  const [filt, setFilt] = useState("Wszystkie");
  const [step, setStep] = useState(0);
  const [pantry, setPantry] = useState([]);
  const [cart, setCart] = useState([]);
  const [week, setWeek] = useState({});
  const [editing, setEditing] = useState(null);
  const [srch, setSrch] = useState("");
  const [psrch, setPsrch] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newCat, setNewCat] = useState("Inne");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lowAlert, setLowAlert] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [err, setErr] = useState(null);
  const pollRef = useRef(null);

  const initWeek = () => {
    const w = {};
    DAYS.forEach(d => { w[d] = {}; SLOTS.forEach(sl => { w[d][sl] = ""; }); });
    return w;
  };

  const loadAll = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      const [{ data: p, error: pe }, { data: c }, { data: w }] = await Promise.all([
        sb.from("pantry").select("*").order("category"),
        sb.from("shopping_list").select("*").order("created_at"),
        sb.from("week_plan").select("*"),
      ]);
      if (pe) throw pe;
      if (p && p.length > 0) {
        setPantry(p);
      } else {
        const { data: seeded } = await sb.from("pantry").insert(INIT_PANTRY).select();
        setPantry(seeded || []);
      }
      setCart(c || []);
      const wk = initWeek();
      if (w) w.forEach(row => { if (wk[row.day]) wk[row.day][row.slot] = row.meal || ""; });
      setWeek(wk);
    } catch(e) { setErr("Błąd połączenia: " + e.message); }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
    pollRef.current = setInterval(async () => {
      const { data: c } = await sb.from("shopping_list").select("*").order("created_at");
      if (c) setCart(c);
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [loadAll]);

  const checkLow = (recipe) => {
    const lows = recipe.ing.filter(i => {
      const found = pantry.find(p => p.name.toLowerCase().includes(i.n.toLowerCase().split(" ")[0]));
      return found && (found.status === "low" || found.status === "brak");
    });
    if (lows.length > 0) { setLowAlert(lows); setShowAlert(true); }
  };

  const openR = (r) => { setSel(r); setView("recipe"); setStep(0); checkLow(r); };
  const back = () => { setView("list"); setSel(null); setShowAlert(false); };

  const addToCart = async (items) => {
    const toAdd = items.filter(i => i.n).map(i => ({ name: i.n, amount: i.a || "", unit: i.u || "", recipe: sel ? sel.name : "Ręcznie", checked: false }));
    const { data: added } = await sb.from("shopping_list").insert(toAdd).select();
    setCart(p => [...p, ...(added || [])]);
    setShowAlert(false); setView("cart");
  };

  const toggleCart = async (id, checked) => {
    await sb.from("shopping_list").update({ checked: !checked }).eq("id", id);
    setCart(p => p.map(i => i.id === id ? {...i, checked: !checked} : i));
  };

  const clearChecked = async () => {
    await sb.from("shopping_list").delete().eq("checked", true);
    setCart(p => p.filter(i => !i.checked));
  };

  const clearAll = async () => {
    await sb.from("shopping_list").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setCart([]);
  };

  const cycleStatus = async (id, current) => {
    const next = SNXT[current];
    await sb.from("pantry").update({ status: next }).eq("id", id);
    setPantry(p => p.map(i => i.id === id ? {...i, status: next} : i));
  };

  const addPantryToCart = async (item) => {
    const toAdd = [{ name: item.name, amount: "", unit: "", recipe: "Magazyn", checked: false }];
    const { data: added } = await sb.from("shopping_list").insert(toAdd).select();
    setCart(p => [...p, ...(added || [])]);
    setView("cart");
  };

  const addPantryItem = async () => {
    if (!newItem.trim()) return;
    const { data: added } = await sb.from("pantry").insert([{ name: newItem.trim(), category: newCat, status: "high" }]).select();
    if (added) setPantry(p => [...p, ...added]);
    setNewItem(""); setShowAdd(false);
  };

  const setMeal = async (d, sl, val) => {
    await sb.from("week_plan").upsert([{ day: d, slot: sl, meal: val }], { onConflict: "day,slot" });
    setWeek(p => ({ ...p, [d]: { ...p[d], [sl]: val } }));
    setEditing(null); setSrch("");
  };

  const cats = ["Wszystkie", ...new Set(RECIPES.map(r => r.cat))];
  const filtR = filt === "Wszystkie" ? RECIPES : RECIPES.filter(r => r.cat === filt);
  const filtSearch = RECIPES.filter(r => r.name.toLowerCase().includes(srch.toLowerCase()));
  const filtP = pantry.filter(i => i.name.toLowerCase().includes(psrch.toLowerCase()));
  const pCats = [...new Set(pantry.map(i => i.category))];
  const lowCount = pantry.filter(i => i.status === "low" || i.status === "brak").length;
  const cartPending = cart.filter(i => !i.checked).length;

  const TABS = [
    {id:"list", lbl:"Przepisy"},
    {id:"week", lbl:"Tydzień"},
    {id:"pantry", lbl: lowCount > 0 ? "Magazyn ⚠" : "Magazyn"},
    {id:"cart", lbl: cartPending > 0 ? `Koszyk (${cartPending})` : "Koszyk"},
  ];

  if (loading) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",background:"#faf7f2",gap:16,fontFamily:"Georgia,serif"}}>
      <div style={{fontSize:52}}>🍳</div>
      <div style={{color:"#a08050",fontSize:15}}>Ładowanie...</div>
    </div>
  );

  if (err) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",background:"#faf7f2",gap:16,padding:24,fontFamily:"Georgia,serif",textAlign:"center"}}>
      <div style={{fontSize:40}}>⚠️</div>
      <div style={{color:"#ef4444",fontSize:14}}>{err}</div>
      <button onClick={loadAll} style={{background:"#2d2416",color:"#faf7f2",border:"none",borderRadius:10,padding:"10px 24px",cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Spróbuj ponownie</button>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#faf7f2",fontFamily:"Georgia,serif",color:"#2d2416"}}>

      {showAlert && lowAlert.length > 0 && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:22,width:"100%",maxWidth:500,margin:"0 auto"}}>
            <div style={{fontWeight:"bold",fontSize:14,marginBottom:6}}>Mało lub brak składników</div>
            <div style={{fontSize:12,color:"#7a6a50",marginBottom:12}}>Te składniki z przepisu masz na wyczerpaniu:</div>
            {lowAlert.map((i,idx) => (
              <div key={idx} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f0ebe0",fontSize:13}}>
                <span>{i.n}</span><span style={{color:"#ef4444",fontWeight:"bold"}}>{i.a} {i.u}</span>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button onClick={() => addToCart(lowAlert)} style={{flex:1,background:"#2d2416",color:"#faf7f2",border:"none",borderRadius:10,padding:11,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Dodaj do koszyka</button>
              <button onClick={() => setShowAlert(false)} style={{flex:1,background:"#fff",color:"#2d2416",border:"1.5px solid #2d2416",borderRadius:10,padding:11,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Ignoruj</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"#2d2416",color:"#faf7f2",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.3)"}}>
        <div style={{maxWidth:760,margin:"0 auto",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          {(view==="recipe"||view==="cook") && (
            <button onClick={back} style={{background:"none",border:"none",color:"#e8d5b0",cursor:"pointer",fontSize:22,padding:"0 8px 0 0"}}>←</button>
          )}
          <div style={{flex:1}}>
            <div style={{fontSize:9,letterSpacing:4,color:"#a08050",textTransform:"uppercase"}}>Moja Kuchnia</div>
            <div style={{fontSize:16}}>
              {view==="list"?"Przepisy":view==="week"?"Plan Tygodnia":view==="pantry"?"Magazyn":view==="cart"?"Lista zakupów":sel?.name||""}
            </div>
          </div>
          <div style={{fontSize:9,color:"#22c55e",letterSpacing:1}}>● LIVE</div>
        </div>
        <div style={{display:"flex",borderTop:"1px solid #3d3426"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{flex:1,padding:"9px 2px",background:"none",border:"none",borderBottom:view===t.id?"2px solid #e8d5b0":"2px solid transparent",color:view===t.id?"#e8d5b0":"#a08050",fontSize:9,letterSpacing:0.5,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",overflow:"hidden",whiteSpace:"nowrap"}}>
              {t.lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"0 14px 60px"}}>

        {view==="list" && <>
          <div style={{display:"flex",gap:6,padding:"14px 0 10px",overflowX:"auto",scrollbarWidth:"none"}}>
            {cats.map(c => <button key={c} onClick={() => setFilt(c)} style={{background:filt===c?"#2d2416":"#fff",color:filt===c?"#faf7f2":"#2d2416",border:"1.5px solid #2d2416",borderRadius:20,padding:"4px 12px",cursor:"pointer",fontSize:11,whiteSpace:"nowrap",fontFamily:"inherit"}}>{c}</button>)}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtR.map(r => (
              <div key={r.id} onClick={() => openR(r)} style={{background:"#fff",borderRadius:14,padding:"14px",cursor:"pointer",border:"1.5px solid #e8e0d0",display:"flex",gap:12}}>
                <div style={{fontSize:38,lineHeight:1,flexShrink:0}}>{r.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:9,letterSpacing:2,color:"#a08050",textTransform:"uppercase"}}>{r.cat}</span>
                    <span style={{fontSize:9,background:DC[r.diff]+"22",color:DC[r.diff],padding:"2px 7px",borderRadius:10,fontWeight:"bold"}}>{r.diff}</span>
                  </div>
                  <div style={{fontSize:16,marginBottom:4}}>{r.name}</div>
                  <div style={{fontSize:12,color:"#7a6a50",marginBottom:6,lineHeight:1.4}}>{r.desc}</div>
                  <div style={{display:"flex",gap:12,fontSize:11,color:"#a08050"}}>
                    <span>⏱ {r.time}</span><span>👥 {r.srv} {r.srv===1?"porcja":"porcji"}</span>
                    {r.kcal && <span>🔥 {r.kcal}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {view==="recipe" && sel && <div>
          <div style={{textAlign:"center",padding:"20px 0 14px"}}>
            <div style={{fontSize:56}}>{sel.emoji}</div>
            <h1 style={{fontSize:22,fontWeight:"normal",margin:"8px 0 8px",lineHeight:1.2}}>{sel.name}</h1>
            <p style={{color:"#7a6a50",fontSize:13,lineHeight:1.5,maxWidth:460,margin:"0 auto 10px"}}>{sel.desc}</p>
            <div style={{display:"flex",gap:14,justifyContent:"center",fontSize:11,color:"#a08050",flexWrap:"wrap"}}>
              <span>⏱ {sel.time}</span><span>👥 {sel.srv} {sel.srv===1?"porcja":"porcji"}</span>
              <span style={{color:DC[sel.diff],fontWeight:"bold"}}>● {sel.diff}</span>
            </div>
            {(sel.kcal||sel.prot) && (
              <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
                {sel.kcal && <span style={{background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#92400e",fontWeight:"bold"}}>🔥 {sel.kcal}</span>}
                {sel.prot && <span style={{background:"#dcfce7",border:"1px solid #22c55e",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#166534",fontWeight:"bold"}}>💪 {sel.prot} białka</span>}
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            <button onClick={() => addToCart(sel.ing)} style={{flex:1,background:"#fff",border:"1.5px solid #2d2416",color:"#2d2416",borderRadius:10,padding:"9px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>🛒 Do koszyka</button>
            <button onClick={() => { setStep(0); setView("cook"); }} style={{flex:1,background:"#2d2416",border:"none",color:"#faf7f2",borderRadius:10,padding:"9px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Tryb gotowania</button>
          </div>
          <Box t="Sprzęt"><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{sel.eq.map((e,i) => <span key={i} style={{background:"#f0ebe0",border:"1px solid #ddd5c0",borderRadius:7,padding:"4px 9px",fontSize:11}}>{e}</span>)}</div></Box>
          <Box t="Składniki">{sel.ing.map((i,idx) => i.n && <div key={idx} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:idx<sel.ing.length-1?"1px solid #f0ebe0":"none",fontSize:12}}><span>{i.n}</span><span style={{color:"#7a6a50",fontWeight:"bold"}}>{i.a} {i.u}</span></div>)}</Box>
          <Box t="Mise en place">{sel.mise.map((m,i) => <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:i<sel.mise.length-1?"1px solid #f0ebe0":"none"}}><span style={{color:"#a08050",fontWeight:"bold",minWidth:18,fontSize:12}}>{i+1}.</span><span style={{fontSize:12,lineHeight:1.5}}>{m}</span></div>)}</Box>
          <Box t="Kroki">{sel.steps.map(s => <div key={s.s} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:s.s<sel.steps.length?"1px solid #f0ebe0":"none"}}><div style={{width:26,height:26,background:"#2d2416",color:"#faf7f2",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,fontWeight:"bold"}}>{s.s}</div><div><div style={{fontSize:9,color:"#a08050",letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>{s.t}</div><div style={{fontSize:13,lineHeight:1.6}}>{s.a}</div></div></div>)}</Box>
        </div>}

        {view==="cook" && sel && <div>
          <div style={{padding:"20px 0 0",textAlign:"center"}}>
            <div style={{fontSize:11,color:"#a08050",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Krok {step+1} z {sel.steps.length}</div>
            <div style={{background:"#e8e0d0",borderRadius:4,height:5,marginBottom:20}}>
              <div style={{background:"#2d2416",height:"100%",borderRadius:4,width:`${((step+1)/sel.steps.length)*100}%`,transition:"width 0.3s"}} />
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:"20px 16px",border:"1.5px solid #e8e0d0",minHeight:180,marginBottom:16}}>
            <div style={{display:"inline-block",background:"#f0ebe0",borderRadius:5,padding:"2px 8px",fontSize:9,color:"#7a6a50",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>{sel.steps[step].t}</div>
            <div style={{fontSize:17,lineHeight:1.7}}>{sel.steps[step].a}</div>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>
            {sel.steps.map((_,i) => <div key={i} onClick={() => setStep(i)} style={{width:i===step?20:7,height:7,borderRadius:4,background:i<=step?"#2d2416":"#e8e0d0",cursor:"pointer",transition:"all 0.2s"}} />)}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={() => setStep(p => Math.max(0,p-1))} disabled={step===0} style={{flex:1,background:"#fff",border:"1.5px solid #2d2416",color:"#2d2416",borderRadius:10,padding:12,cursor:step===0?"not-allowed":"pointer",opacity:step===0?0.4:1,fontSize:14,fontFamily:"inherit"}}>← Poprzedni</button>
            {step < sel.steps.length-1
              ? <button onClick={() => setStep(p => p+1)} style={{flex:1,background:"#2d2416",border:"none",color:"#faf7f2",borderRadius:10,padding:12,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>Następny →</button>
              : <button onClick={() => setView("recipe")} style={{flex:1,background:"#22c55e",border:"none",color:"#fff",borderRadius:10,padding:12,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>Gotowe!</button>
            }
          </div>
        </div>}

        {view==="week" && <div style={{paddingTop:14}}>
          <p style={{color:"#a08050",fontSize:12,marginBottom:12}}>Kliknij slot żeby przypisać przepis lub wpisać ręcznie</p>
          {DAYS.map(d => (
            <div key={d} style={{marginBottom:8,background:"#fff",borderRadius:12,border:"1.5px solid #e8e0d0",overflow:"hidden"}}>
              <div style={{background:"#2d2416",color:"#e8d5b0",padding:"6px 14px",fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>{d}</div>
              <div style={{padding:"6px 10px"}}>
                {SLOTS.map(sl => (
                  <div key={sl} style={{marginBottom:4}}>
                    {editing && editing.d===d && editing.sl===sl ? (
                      <div style={{background:"#faf7f2",borderRadius:7,padding:8,border:"1.5px solid #2d2416"}}>
                        <input autoFocus value={srch} onChange={e => setSrch(e.target.value)} placeholder="Szukaj lub wpisz ręcznie..." style={{width:"100%",padding:"6px 8px",borderRadius:5,border:"1px solid #e8e0d0",fontSize:12,fontFamily:"inherit",boxSizing:"border-box",marginBottom:5}} />
                        {srch && <div style={{marginBottom:5}}>
                          {filtSearch.map(r => <div key={r.id} onClick={() => setMeal(d,sl,r.name)} style={{padding:"4px 7px",borderRadius:4,cursor:"pointer",fontSize:12,background:"#fff",border:"1px solid #e8e0d0",marginBottom:2,display:"flex",gap:6}}><span>{r.emoji}</span><span>{r.name}</span></div>)}
                        </div>}
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={() => srch && setMeal(d,sl,srch)} style={{flex:1,background:"#2d2416",color:"#faf7f2",border:"none",borderRadius:5,padding:"5px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Zapisz</button>
                          <button onClick={() => { setEditing(null); setSrch(""); }} style={{flex:1,background:"#fff",color:"#2d2416",border:"1.5px solid #2d2416",borderRadius:5,padding:"5px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Anuluj</button>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => setEditing({d,sl})} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 7px",borderRadius:6,cursor:"pointer",border:"1px solid",borderColor:week[d]&&week[d][sl]?SBR[sl]:"#e8e0d0",background:week[d]&&week[d][sl]?SC[sl]:"#faf7f2"}}>
                        <span style={{fontSize:9,fontWeight:"bold",minWidth:66,color:week[d]&&week[d][sl]?ST[sl]:"#a08050",textTransform:"uppercase",letterSpacing:1}}>{sl}</span>
                        <span style={{flex:1,fontSize:12,color:week[d]&&week[d][sl]?ST[sl]:"#c8bca8"}}>{week[d]&&week[d][sl] || "+ dodaj"}</span>
                        {week[d]&&week[d][sl] && <span onClick={e => { e.stopPropagation(); setMeal(d,sl,""); }} style={{color:"#ef4444",fontSize:14,padding:"0 3px"}}>×</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>}

        {view==="pantry" && <div style={{paddingTop:14}}>
          {lowCount > 0 && <div style={{background:"#fff3cd",border:"1px solid #f59e0b",borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#92400e"}}>⚠️ {lowCount} {lowCount===1?"produkt":"produktów"} na wyczerpaniu</div>}
          <div style={{background:"#f0ebe0",borderRadius:10,padding:"9px 12px",marginBottom:12,fontSize:11,color:"#7a6a50",lineHeight:1.5}}>
            Kliknij produkt żeby zmienić: <b style={{color:"#22c55e"}}>DUŻO</b> → <b style={{color:"#f59e0b"}}>TROCHĘ</b> → <b style={{color:"#ef4444"}}>MAŁO</b> → <b style={{color:"#9ca3af"}}>BRAK</b>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input value={psrch} onChange={e => setPsrch(e.target.value)} placeholder="Szukaj..." style={{flex:1,padding:"8px 12px",borderRadius:8,border:"1.5px solid #e8e0d0",fontFamily:"inherit",fontSize:13,background:"#fff"}} />
            <button onClick={() => setShowAdd(!showAdd)} style={{background:"#2d2416",color:"#faf7f2",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:16}}>+</button>
          </div>
          {showAdd && <div style={{background:"#fff",border:"1.5px solid #2d2416",borderRadius:10,padding:12,marginBottom:12}}>
            <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Nazwa produktu..." style={{width:"100%",padding:"7px 10px",borderRadius:7,border:"1px solid #e8e0d0",fontFamily:"inherit",fontSize:13,marginBottom:7,boxSizing:"border-box"}} />
            <select value={newCat} onChange={e => setNewCat(e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:7,border:"1px solid #e8e0d0",fontFamily:"inherit",fontSize:13,marginBottom:8,background:"#fff"}}>
              {[...pCats,"Inne"].map(c => <option key={c}>{c}</option>)}
            </select>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addPantryItem} style={{flex:1,background:"#2d2416",color:"#faf7f2",border:"none",borderRadius:7,padding:"8px",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Dodaj</button>
              <button onClick={() => setShowAdd(false)} style={{flex:1,background:"#fff",color:"#2d2416",border:"1.5px solid #2d2416",borderRadius:7,padding:"8px",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Anuluj</button>
            </div>
          </div>}
          {pCats.map(c => {
            const items = filtP.filter(i => i.category === c);
            if (!items.length) return null;
            return <div key={c} style={{marginBottom:16}}>
              <div style={{fontSize:9,letterSpacing:2,color:"#a08050",textTransform:"uppercase",marginBottom:6,paddingBottom:5,borderBottom:"1px solid #f0ebe0"}}>{c}</div>
              {items.map(it => (
                <div key={it.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid #f8f4ee"}}>
                  <div onClick={() => cycleStatus(it.id, it.status)} style={{width:58,padding:"3px 0",background:SCOL[it.status]+"22",borderRadius:6,textAlign:"center",fontSize:9,fontWeight:"bold",color:SCOL[it.status],letterSpacing:1,flexShrink:0,cursor:"pointer"}}>{SLBL[it.status]}</div>
                  <span onClick={() => cycleStatus(it.id, it.status)} style={{fontSize:14,flex:1,opacity:it.status==="brak"?0.5:1,cursor:"pointer"}}>{it.name}</span>
                  <button onClick={() => addPantryToCart(it)} style={{background:"#2d2416",color:"#faf7f2",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontFamily:"inherit",flexShrink:0}}>+ koszyk</button>
                </div>
              ))}
            </div>;
          })}
        </div>}

        {view==="cart" && <div style={{paddingTop:14}}>
          <div style={{background:"#e8f4fd",border:"1px solid #90cdf4",borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#2c5282"}}>
            Zsynchronizowane co 5 sek — żona widzi to samo na swoim telefonie
          </div>
          {cart.length === 0 ? (
            <div style={{textAlign:"center",padding:"50px 20px",color:"#a08050"}}>
              <div style={{fontSize:48,marginBottom:12}}>🛒</div>
              <div style={{fontSize:14,marginBottom:6}}>Lista zakupów jest pusta</div>
              <div style={{fontSize:11}}>Wejdź w przepis i kliknij "Do koszyka"</div>
            </div>
          ) : <>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <button onClick={clearChecked} style={{flex:1,background:"#fff",border:"1.5px solid #a08050",color:"#a08050",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Usuń odhaczone</button>
              <button onClick={clearAll} style={{flex:1,background:"#fff",border:"1.5px solid #ef4444",color:"#ef4444",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Wyczyść wszystko</button>
            </div>
            {[...new Set(cart.map(i => i.recipe))].map(rn => (
              <div key={rn} style={{marginBottom:18}}>
                <div style={{fontSize:9,letterSpacing:2,color:"#a08050",textTransform:"uppercase",marginBottom:8}}>{rn}</div>
                {cart.filter(i => i.recipe === rn).map(item => (
                  <div key={item.id} onClick={() => toggleCart(item.id, item.checked)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #f0ebe0",cursor:"pointer",opacity:item.checked?0.45:1,transition:"opacity 0.2s"}}>
                    <div style={{width:20,height:20,border:`2px solid ${item.checked?"#2d2416":"#c8bca8"}`,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",background:item.checked?"#2d2416":"transparent",flexShrink:0}}>
                      {item.checked && <span style={{color:"#fff",fontSize:11}}>✓</span>}
                    </div>
                    <span style={{flex:1,fontSize:14,textDecoration:item.checked?"line-through":"none"}}>{item.name}</span>
                    <span style={{color:"#7a6a50",fontSize:12}}>{item.amount} {item.unit}</span>
                  </div>
                ))}
              </div>
            ))}
          </>}
        </div>}

      </div>
    </div>
  );
}
