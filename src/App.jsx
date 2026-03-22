import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════════════════

const TOLCS = {
  MED: {
    id:"MED", key:"TOLC-MED", emoji:"🩺",
    color:"#f87171", glow:"rgba(248,113,113,.18)",
    subject:"Medicina & Scienze della Salute",
    facolta:["Medicina","Odontoiatria","Veterinaria","Professioni Sanitarie"],
    desc:"55 domande · 90 min · Biologia, Chimica, Fisica, Matematica, Ragionamento",
    timerSec:3300,
    sezioni:[
      {nome:"Biologia",n:15,color:"#4ade80",icon:"🧬"},
      {nome:"Chimica & Fisica",n:15,color:"#fb923c",icon:"⚗️"},
      {nome:"Matematica & Ragionamento",n:13,color:"#60a5fa",icon:"📐"},
      {nome:"Comprensione Testo",n:7,color:"#c084fc",icon:"📖"},
      {nome:"Lingua Inglese",n:5,color:"#94a3b8",icon:"🇬🇧"},
    ],
    tip:"La biologia è la sezione con più peso: dedica almeno il 40% del tempo allo studio di cellula, genetica e fisiologia.",
    prompt:`Sei un esperto di test universitari TOLC italiani CISIA. Genera ESATTAMENTE 30 domande a scelta multipla per il TOLC-MED 2025 (Medicina/Veterinaria), difficoltà reale V anno liceo scientifico. Distribuisci: 12 Biologia (cellula eucariotica/procariotica, DNA replicazione/trascrizione/traduzione, mitosi/meiosi, genetica mendeliana, fisiologia umana, enzimi, metabolismo), 9 Chimica (struttura atomica, tavola periodica, legami chimici, stechiometria, pH/acidi-basi, ossidoriduzioni, gruppi funzionali), 5 Matematica (equazioni 2° grado, logaritmi, geometria, probabilità), 4 Ragionamento Logico. Ogni domanda ha 5 opzioni. SOLO JSON: [{"d":"testo domanda","o":["A) ...","B) ...","C) ...","D) ...","E) ..."],"r":"A","s":"spiegazione concisa 1-2 frasi","m":"Biologia"}]`,
  },
  PSI: {
    id:"PSI", key:"TOLC-PSI", emoji:"🧠",
    color:"#c084fc", glow:"rgba(192,132,252,.18)",
    subject:"Psicologia & Scienze Cognitive",
    facolta:["Psicologia","Scienze Cognitive","Neuroscienze","Scienze dell'Educazione"],
    desc:"50 domande · 100 min · Comprensione, Logica, Matematica, Biologia",
    timerSec:3600,
    sezioni:[
      {nome:"Comprensione del Testo",n:10,color:"#60a5fa",icon:"📖"},
      {nome:"Matematica di Base",n:10,color:"#f87171",icon:"🔢"},
      {nome:"Ragionamento Verbale",n:10,color:"#c084fc",icon:"🔤"},
      {nome:"Ragionamento Numerico",n:10,color:"#fb923c",icon:"📊"},
      {nome:"Biologia",n:10,color:"#4ade80",icon:"🧬"},
    ],
    tip:"Il ragionamento logico è la sezione più allenabile: fai tanti esercizi di analogie e serie numeriche. Non richiede teoria, solo pratica.",
    prompt:`Genera ESATTAMENTE 30 domande per il TOLC-PSI 2025 (Psicologia/Scienze Cognitive), stile CISIA ufficiale. Distribuisci: 6 Comprensione Testo, 6 Matematica Base (percentuali, proporzioni, probabilità), 6 Ragionamento Verbale (analogie, sinonimi), 6 Ragionamento Numerico (serie, grafici), 6 Biologia (sistema nervoso, cellula, genetica). SOLO JSON: [{"d":"...","o":["A) ...","B) ...","C) ...","D) ...","E) ..."],"r":"B","s":"...","m":"Ragionamento Verbale"}]`,
  },
  E: {
    id:"E", key:"TOLC-E", emoji:"📊",
    color:"#34d399", glow:"rgba(52,211,153,.18)",
    subject:"Economia, Diritto & Management",
    facolta:["Economia","Management","Giurisprudenza","Scienze Politiche","Statistica"],
    desc:"36 domande · 90 min · Matematica, Ragionamento, Scienze",
    timerSec:3300,
    sezioni:[
      {nome:"Matematica",n:13,color:"#60a5fa",icon:"📐"},
      {nome:"Ragionamento su Testi e Dati",n:13,color:"#c084fc",icon:"🧩"},
      {nome:"Comprensione Verbale",n:10,color:"#34d399",icon:"📖"},
    ],
    tip:"La matematica pesa molto: è tutta di scuola media/primo liceo. Concentrati su percentuali, equazioni lineari e probabilità classica.",
    prompt:`Genera ESATTAMENTE 30 domande per il TOLC-E 2025 (Economia/Giurisprudenza), stile CISIA. Distribuisci: 12 Matematica (equazioni, percentuali, proporzioni, funzioni, logaritmi base, probabilità, statistica, geometria piana), 11 Ragionamento su Testi e Dati (brano argomentativo, tabelle/grafici, logica deduttiva), 7 Comprensione Verbale. SOLO JSON: [{"d":"...","o":["A) ...","B) ...","C) ...","D) ...","E) ..."],"r":"C","s":"...","m":"Matematica"}]`,
  },
  I: {
    id:"I", key:"TOLC-I", emoji:"⚙️",
    color:"#60a5fa", glow:"rgba(96,165,250,.18)",
    subject:"Ingegneria, Informatica & Fisica",
    facolta:["Ingegneria","Informatica","Fisica","Matematica","Architettura"],
    desc:"50 domande · 110 min · Matematica, Logica, Scienze, Comprensione",
    timerSec:3960,
    sezioni:[
      {nome:"Matematica",n:20,color:"#60a5fa",icon:"📐"},
      {nome:"Logica",n:10,color:"#c084fc",icon:"🧩"},
      {nome:"Scienze (Fisica + Chimica)",n:10,color:"#fb923c",icon:"⚗️"},
      {nome:"Comprensione Verbale",n:10,color:"#4ade80",icon:"📖"},
    ],
    tip:"La matematica vale 40% del test. Al Politecnico di Milano è richiesto punteggio ≥ 20. Dai priorità ad algebra, equazioni e funzioni.",
    prompt:`Genera ESATTAMENTE 30 domande per il TOLC-I 2025 (Ingegneria/Politecnico), stile CISIA, difficoltà reale. Distribuisci: 14 Matematica (equazioni/disequazioni 2° grado, logaritmi, funzioni esponenziali, trigonometria valori notevoli, geometria analitica, valore assoluto, disequazioni fratte), 7 Logica (sillogismi, deduzione, problem solving, serie alfanumeriche), 6 Scienze (fisica: cinematica, Newton, energia; chimica: mole, pH), 3 Comprensione Verbale. SOLO JSON: [{"d":"...","o":["A) ...","B) ...","C) ...","D) ...","E) ..."],"r":"D","s":"...","m":"Matematica"}]`,
  },
  SU: {
    id:"SU", key:"TOLC-SU", emoji:"📚",
    color:"#2dd4bf", glow:"rgba(45,212,191,.18)",
    subject:"Studi Umanistici & Comunicazione",
    facolta:["Lettere","Filosofia","Comunicazione","Scienze Politiche","Beni Culturali"],
    desc:"50 domande · 100 min · Italiano (30q), Cultura (10q), Logica (10q)",
    timerSec:3600,
    sezioni:[
      {nome:"Comprensione Testo & Lingua Italiana",n:30,color:"#60a5fa",icon:"📖"},
      {nome:"Conoscenze dagli Studi",n:10,color:"#f87171",icon:"🎓"},
      {nome:"Ragionamento Logico",n:10,color:"#2dd4bf",icon:"🧩"},
    ],
    tip:"La sezione di italiano pesa il 60% del test. Allenati a leggere brani e rispondere velocemente: hai solo 2 minuti per domanda.",
    prompt:`Genera ESATTAMENTE 30 domande per il TOLC-SU 2025 (Lettere/Comunicazione/Scienze Politiche), stile CISIA ufficiale. Distribuisci: 14 Comprensione Testo Italiano (2 brani ~150 parole, domande su significato, inferenze, struttura, tono), 6 Grammatica & Lingua (analisi logica, analisi del periodo, ortografia, subordinate), 5 Cultura Umanistica (storia, letteratura italiana, arte, filosofia), 5 Ragionamento Logico. SOLO JSON: [{"d":"...","o":["A) ...","B) ...","C) ...","D) ...","E) ..."],"r":"A","s":"...","m":"Comprensione Testo"}]`,
  },
  B: {
    id:"B", key:"TOLC-B", emoji:"🧬",
    color:"#fb923c", glow:"rgba(251,146,60,.18)",
    subject:"Biologia, Biotecnologie & Scienze Naturali",
    facolta:["Biologia","Biotecnologie","Scienze Naturali","Scienze dell'Alimentazione","Scienze Ambientali"],
    desc:"50 domande · 110 min · Biologia (20q), Chimica (15q), Matematica (8q), Fisica (7q)",
    timerSec:3960,
    sezioni:[
      {nome:"Biologia",n:20,color:"#4ade80",icon:"🧬"},
      {nome:"Chimica",n:15,color:"#fb923c",icon:"⚗️"},
      {nome:"Matematica",n:8,color:"#60a5fa",icon:"📐"},
      {nome:"Fisica",n:7,color:"#c084fc",icon:"⚡"},
    ],
    tip:"Biologia e Chimica valgono il 70% del test. Studia la biologia molecolare (DNA, sintesi proteica) e la chimica organica (gruppi funzionali, biomolecole).",
    prompt:`Genera ESATTAMENTE 30 domande per il TOLC-B 2025 (Biologia/Biotecnologie), stile CISIA, difficoltà reale. Distribuisci: 13 Biologia (organelli, mitosi/meiosi, DNA, replicazione, trascrizione, traduzione, genetica mendeliana, metabolismo, fisiologia), 10 Chimica (struttura atomica, tavola periodica, legami, stechiometria, acidi/basi, redox, chimica organica), 4 Matematica, 3 Fisica. SOLO JSON: [{"d":"...","o":["A) ...","B) ...","C) ...","D) ...","E) ..."],"r":"E","s":"...","m":"Biologia"}]`,
  },
  F: {
    id:"F", key:"TOLC-F", emoji:"💊",
    color:"#fbbf24", glow:"rgba(251,191,36,.18)",
    subject:"Farmacia & Chimica Farmaceutica",
    facolta:["Farmacia","Chimica e Tecnologie Farmaceutiche","Chimica","Scienze Chimiche"],
    desc:"50 domande · 100 min · Biologia, Chimica, Matematica, Fisica, Logica",
    timerSec:3600,
    sezioni:[
      {nome:"Biologia",n:15,color:"#4ade80",icon:"🧬"},
      {nome:"Chimica",n:15,color:"#fbbf24",icon:"⚗️"},
      {nome:"Matematica",n:7,color:"#60a5fa",icon:"📐"},
      {nome:"Fisica",n:7,color:"#fb923c",icon:"⚡"},
      {nome:"Logica",n:6,color:"#c084fc",icon:"🧩"},
    ],
    tip:"La chimica è il cuore del TOLC-F: vale 30% del test. Studia bene la chimica organica (gruppi funzionali, stereoisomeria) critica per farmacia.",
    prompt:`Genera ESATTAMENTE 30 domande per il TOLC-F 2025 (Farmacia/CTF), stile CISIA. Distribuisci: 10 Biologia (cellula, DNA, trascrizione, traduzione, mitosi/meiosi, genetica mendeliana, metabolismo, fisiologia), 10 Chimica (struttura atomica, legami, stechiometria, acidi/basi, redox, chimica organica: alcani/alcheni/areni, gruppi funzionali, isomeria, biomolecole), 4 Matematica, 4 Fisica, 2 Logica. SOLO JSON: [{"d":"...","o":["A) ...","B) ...","C) ...","D) ...","E) ..."],"r":"B","s":"...","m":"Chimica"}]`,
  },
};

const FC = {
  MED:[
    {topic:"🧬 Biologia Cellulare",cards:[
      {f:"Qual è la funzione del mitocondrio?",b:"Produzione di ATP tramite respirazione aerobica: glicolisi (citoplasma) → ciclo di Krebs → catena di trasporto elettroni (matrice + creste). 1 glucosio → ~36-38 ATP. 'Centrale energetica' della cellula."},
      {f:"Mitosi vs Meiosi: differenze principali",b:"Mitosi: 2 cellule figlie diploidi (2n) identiche → cellule somatiche. Meiosi: 4 cellule aploidi (n) geneticamente diverse → gameti. La meiosi ha 2 divisioni e produce crossing-over (variabilità genetica)."},
      {f:"Leggi di Mendel (1ª e 2ª)",b:"1ª Segregazione: gli alleli si separano nella meiosi, ogni gamete riceve uno solo. 2ª Assortimento Indipendente: geni su cromosomi diversi si trasmettono indipendentemente. Solo per geni non linkati!"},
      {f:"Struttura del DNA (doppia elica)",b:"Antiparallela (3'→5' e 5'→3'). Basi: A-T (2 ponti H), G-C (3 ponti H). Backbone: deossiribosio + fosfato. Watson & Crick 1953. Replicazione: semiconservativa. RNA usa uracile al posto di timina."},
      {f:"Fasi del ciclo cellulare",b:"Interfase: G1 (crescita) → S (replicazione DNA) → G2 (preparazione). M-fase: Profase→Metafase→Anafase→Telofase→Citodieresi. G1 è la fase più lunga in cellule differenziate."},
      {f:"Cosa sono gli enzimi? Effetto pH e T°",b:"Catalizzatori biologici proteici. Abbassano l'energia di attivazione. Ogni enzima ha pH e T° ottimali (es. pepsina: pH~2; amilasi salivare: pH~7). Denaturazione oltre 40-45°C."},
    ]},
    {topic:"⚗️ Chimica",cards:[
      {f:"pH: definizione e scala",b:"pH = -log[H⁺]. Scala 0-14: 7 = neutro, <7 acido, >7 basico. Ogni unità = ×10 differenza in [H⁺]. pOH = -log[OH⁻]. pH + pOH = 14 (a 25°C). Sangue umano: pH = 7.35-7.45."},
      {f:"Cos'è la mole e il numero di Avogadro",b:"Mole = 6.022×10²³ entità (Nₐ). 1 mole ha massa = peso molecolare in grammi. n = m/M. Es: 1 mol H₂O = 18 g. Fondamentale per calcoli stechiometrici."},
      {f:"Legame ionico vs covalente vs idrogeno",b:"Ionico: trasferimento e⁻ (metallo-nonmetallo; es. NaCl). Covalente: condivisione e⁻ (nonmetallo-nonmetallo; es. H₂O, CH₄). Idrogeno: debole, tra H e N/O/F — fondamentale per struttura DNA e proteine."},
      {f:"Ossidazione e riduzione (redox)",b:"Ossidazione: perdita di e⁻ → aumento N.O. → agente riducente. Riduzione: acquisto di e⁻ → diminuzione N.O. → agente ossidante. Mnemonica: OIL RIG (Oxidation Is Loss, Reduction Is Gain)."},
      {f:"Gruppi funzionali principali",b:"−OH = alcol; −COOH = acido carbossilico; −CHO = aldeide; C=O (interno) = chetone; −NH₂ = ammina; −CO−NH− = ammide (legame peptidico). Determinano proprietà e reattività!"},
    ]},
    {topic:"❤️ Fisiologia Umana",cards:[
      {f:"Come funziona la sinapsi chimica?",b:"Potenziale d'azione → terminale presinaptico → esocitosi neurotrasmettitori (acetilcolina, dopamina, serotonina, GABA) nello spazio sinaptico → legame a recettori postsinaptici → risposta eccitatoria (EPSP) o inibitoria (IPSP)."},
      {f:"Ciclo cardiaco: sistole e diastole",b:"Diastole: atri ricevono sangue. Sistole atriale → aperte valvole AV. Sistole ventricolare → sangue in aorta (sx) e arteria polmonare (dx). Frequenza normale: 60-100 bpm."},
      {f:"Dove si digere e si assorbe il cibo?",b:"Bocca: amido (amilasi). Stomaco: proteine (pepsina, HCl). Intestino tenue: tutto il resto — bile (lipidi), lipasi, proteasi. Assorbimento: villi e microvilli → glucosio/aa → vena porta; lipidi → linfatici."},
      {f:"Ormoni steroidei vs peptidici",b:"Steroidei (colesterolo; es. cortisolo, estrogeni): liposolubili, recettore nucleare, effetto lento-duraturo. Peptidici (insulina, ADH): idrosolubili, recettore di membrana → secondi messaggeri (cAMP) → effetto rapido."},
    ]},
  ],
  PSI:[
    {topic:"🧠 Neuroscienze di Base",cards:[
      {f:"Struttura del neurone e potenziale d'azione",b:"Soma + dendriti (input) + assone (output, mielinizzato→più veloce) + bottoni sinaptici. Potenziale d'azione: depolarizzazione (Na⁺ entra) → ripolarizzazione (K⁺ esce) → refrattarietà. Soglia: ~-55mV. Tutto-o-niente."},
      {f:"Sistema nervoso autonomo",b:"Simpatico: 'lotta-o-fuga' → adrenalina/noradrenalina → ↑FC, ↑glicemia, dilatazione pupille. Parasimpatico: 'riposo-digestione' → acetilcolina → ↓FC, digestione, costrizione pupille. Antagonisti e complementari."},
      {f:"Lobi cerebrali e funzioni",b:"Frontale: funzioni esecutive, controllo motorio, area di Broca (produzione linguaggio). Parietale: integrazione sensoriale, spazio. Temporale: udito, memoria, Wernicke (comprensione). Occipitale: visione."},
      {f:"Plasticità sinaptica: LTP e LTD",b:"LTP (Long-Term Potentiation): rinforzo sinaptico duraturo dopo stimolazione ripetuta → base cellulare dell'apprendimento (ippocampo). LTD (Long-Term Depression): indebolimento sinaptico → affinamento circuiti (cerebelletto)."},
    ]},
    {topic:"📐 Matematica di Base",cards:[
      {f:"Come calcolare percentuali velocemente",b:"X% di N = N × (X/100). Trucchi: 10% = ÷10; 5% = metà del 10%; 25% = ÷4; 50% = ÷2. Es: 15% di 240 → 10%(24)+5%(12) = 36. Variazione%: ((Nf−Ni)/Ni)×100."},
      {f:"Probabilità: regole fondamentali",b:"P(A) = casi favorevoli / totali. 0≤P(A)≤1. Complemento: P(non A)=1−P(A). OR (disgiunti): P(A∪B)=P(A)+P(B). AND (indipendenti): P(A∩B)=P(A)×P(B). Condizionata: P(A|B)=P(A∩B)/P(B)."},
      {f:"Statistica: media, mediana, moda",b:"Media: Σxi/n (sensibile agli outlier). Mediana: valore centrale (con outlier è migliore). Moda: valore più frequente. Varianza: media degli scarti al quadrato. Deviazione standard = √varianza."},
    ]},
  ],
  E:[
    {topic:"📐 Matematica Economica",cards:[
      {f:"Variazione percentuale",b:"Var% = ((Vf−Vi)/Vi)×100. Attenzione: da 80 a 100 = +25%, ma da 100 a 80 = −20% (basi diverse!). Indice: Vf/Vi×100. In economia: chiarire sempre la base di riferimento."},
      {f:"Funzioni: lineare, quadratica, esponenziale",b:"Lineare: f(x)=mx+q → retta; m=pendenza. Quadratica: f(x)=ax²+bx+c → parabola; vertice x=−b/2a. Esponenziale: f(x)=aˣ → crescita rapida (interesse composto, crescita demografica)."},
      {f:"Probabilità condizionata e Bayes",b:"P(A|B)=P(A∩B)/P(B). Bayes: P(A|B)=P(B|A)×P(A)/P(B). Nel TOLC-E: saper leggere tabelle di contingenza e applicare probabilità ai dati economici."},
    ]},
    {topic:"🌍 Cultura Economica",cards:[
      {f:"PIL, Inflazione, Disoccupazione",b:"PIL = C+I+G+(X−M). Inflazione: ↑prezzi → erosione potere d'acquisto → BCE mira al 2% annuo. Stagflazione: inflazione+recessione (rara, pericolosa). NAIRU: tasso 'naturale' di disoccupazione."},
      {f:"Offerta e domanda: equilibrio",b:"Prezzo di equilibrio: domanda=offerta. Surplus: prezzo > equilibrio. Carenza: prezzo < equilibrio. Elasticità: sensibilità Q al variare di P. Beni Giffen (paradosso): ↑P → ↑Q domandata."},
    ]},
  ],
  I:[
    {topic:"📐 Algebra & Funzioni",cards:[
      {f:"Formula quadratica e discriminante",b:"x = (−b ± √Δ) / 2a  dove Δ = b²−4ac. Δ>0 → 2 soluzioni reali; Δ=0 → radice doppia; Δ<0 → nessuna reale. Viète: x₁+x₂ = −b/a; x₁·x₂ = c/a."},
      {f:"Proprietà dei logaritmi",b:"log(xy)=logx+logy; log(x/y)=logx−logy; log(xⁿ)=n·logx; log_a(a)=1; log_a(1)=0. Cambio base: log_a(x)=log(x)/log(a). Inverso: se log_a(x)=k allora x=aᵏ."},
      {f:"Trigonometria: valori notevoli",b:"sin(30°)=½, sin(45°)=√2/2, sin(60°)=√3/2, sin(90°)=1. cos(x)=sin(90°−x). tan(x)=sin(x)/cos(x). Identità fondamentale: sin²x+cos²x=1."},
      {f:"Geometria analitica: retta e parabola",b:"Retta: y=mx+q. Parallele: m₁=m₂. Perpendicolari: m₁·m₂=−1. Distanza P da retta: d=|ax₀+by₀+c|/√(a²+b²). Parabola: vertice V=(−b/2a, −Δ/4a)."},
    ]},
    {topic:"⚡ Fisica",cards:[
      {f:"3 Leggi di Newton",b:"1ª (Inerzia): F netta=0 → moto uniforme. 2ª: F=ma. 3ª: azione−reazione su corpi diversi. Peso: P=mg (g≈9.8 m/s²). Attrito: f=μN."},
      {f:"Moto uniformemente accelerato",b:"v=v₀+at; x=x₀+v₀t+½at²; v²=v₀²+2a(x−x₀). Caduta libera: a=g≈9.8 m/s², v₀=0. Gittata massima: θ=45°."},
      {f:"Energia e lavoro",b:"Eₖ=½mv². Eₚ_grav=mgh. Eₚ_elastica=½kx² (Hooke: F=−kx). Lavoro: W=F·d·cos(θ). Conservazione: Eₖ+Eₚ=cost (no attrito). Potenza: P=W/t=F·v."},
    ]},
  ],
  SU:[
    {topic:"📖 Letteratura Italiana",cards:[
      {f:"Dante Alighieri: vita, opere, stile",b:"1265−1321 (Firenze, esiliato 1302). Divina Commedia: 100 canti in terzine, 3 cantiche. Vita Nova, De Vulgari Eloquentia, Convivio. Guidato da Virgilio (Inf/Purg) e Beatrice (Paradiso)."},
      {f:"Petrarca, Boccaccio e il '300",b:"Petrarca (1304−74): Canzoniere (366 liriche per Laura). Boccaccio (1313−75): Decameron (100 novelle, cornice della peste 1348) → padre della prosa narrativa italiana. Entrambi: riscoperta dei classici."},
      {f:"Leopardi: pessimismo e opere",b:"1798−1837. Pessimismo storico → cosmico. Canti (L'Infinito, A Silvia, La Ginestra). Operette Morali (prosa filosofica). Zibaldone. Stile: indefinitezza, ricordo, illusioni."},
      {f:"Verismo: caratteristiche e Verga",b:"Fine '800. Principi: impersonalità, regressione narratore, dialettalismi. Verga: I Malavoglia (famiglia Aci Trezza), Mastro-don Gesualdo. Critica al 'progresso' che travolge i deboli."},
    ]},
    {topic:"🏛️ Storia",cards:[
      {f:"Risorgimento: tappe fondamentali",b:"1820−21: moti carbonari. 1848: Prima guerra indipendenza. 1859: Seconda guerra. 1860: Spedizione dei Mille (Garibaldi). 1861: Proclamazione Regno d'Italia. 1866: Veneto. 1870: Roma capitale."},
      {f:"Prima e Seconda Guerra Mondiale",b:"WWI (1914−18): causa scatenante assassinio arciduca; Italia neutrale poi Interventismo (Patto di Londra 1915); 'vittoria mutilata'. WWII (1939−45): 8 settembre 1943 armistizio; Resistenza; 25 aprile 1945 Liberazione."},
    ]},
  ],
  B:[
    {topic:"🧬 Biologia Molecolare",cards:[
      {f:"DNA: struttura e replicazione",b:"Doppia elica antiparallela. Basi: A≡T (2 ponti H), G≡C (3 ponti H). Replicazione: semiconservativa. Enzimi: elicasi (srotola), primasi (primer), DNA polimerasi III (sintetizza 5'→3'), ligasi (unisce frammenti Okazaki)."},
      {f:"Trascrizione: da DNA a mRNA",b:"Nel nucleo. RNA polimerasi II sintetizza pre-mRNA. Processing: 5'-capping, poly-A tail, splicing (rimozione introni) tramite spliceosoma → mRNA maturo esce dal nucleo."},
      {f:"Traduzione: dal codone alla proteina",b:"Ribosomi. Codone AUG (Met) = inizio. tRNA: anticodone complementare; porta amminoacido. Siti A (aminoacil), P (peptidil), E (exit). Stop: UAA, UAG, UGA. Codice genetico: degenerato, universale."},
    ]},
    {topic:"⚗️ Chimica Organica",cards:[
      {f:"Gruppi funzionali e reattività",b:"−OH (alcol): solubile in H₂O. −COOH (acido): acidico. −CHO (aldeide): facilmente ossidabile. C=O (chetone): non ossidabile. −NH₂ (ammina): basica. −CO−NH− (ammide/legame peptidico): stabile."},
      {f:"Le 4 classi di biomolecole",b:"Carboidrati: rapporto C:H:O 1:2:1; amido (riserva piante), glicogeno (animali), cellulosa (struttura). Lipidi: idrofobi, fosfolipidi (membrane), steroidi. Proteine: aa+legami peptidici. Acidi nucleici: DNA+RNA."},
    ]},
  ],
  F:[
    {topic:"💊 Chimica Farmaceutica",cards:[
      {f:"Acidi e basi in farmacologia",b:"pKa = pH a cui il farmaco è 50% ionizzato. Non ionizzata (lipofilica) attraversa membrane. Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]). Aspirina (pKa 3.5): nello stomaco prevale forma non ionizzata → assorbita."},
      {f:"Metabolismo dei farmaci: fase I e II",b:"Fase I (fegato, CYP450): ossidazione/riduzione/idrolisi → introduce gruppi polari. Fase II: coniugazione (glucuronidazione, solfatazione) → ↑idrosolubilità → eliminazione renale/biliare. Pro-drug: si attiva nel metabolismo."},
      {f:"Cinetica di Michaelis-Menten",b:"v = Vmax×[S]/(Km+[S]). Km = [S] alla metà di Vmax → misura affinità enzima-substrato. Inibitori competitivi: ↑Km apparente, Vmax invariata. Fondamentale per farmaci inibitori enzimatici."},
    ]},
    {topic:"🧬 Biologia per Farmacia",cards:[
      {f:"Struttura cellulare batterica vs eucariotica",b:"Batterica: no nucleo, no organelli, parete (peptidoglicano → bersaglio antibiotici), ribosomi 70S. Eucariotica: nucleo, mitocondri, ribosomi 80S. Antibiotici sfruttano questa differenza (beta-lattamici vs parete; tetracicline vs 30S)."},
      {f:"Sistemi di trasporto transmembrana",b:"Diffusione semplice: no proteina, piccole/apolari molecole. Facilitata: proteina trasportatrice, con gradiente. Trasporto attivo primario: pompa Na⁺/K⁺-ATPasi, contro gradiente, usa ATP. Endocitosi/esocitosi: vescicole."},
    ]},
  ],
};

const SMAPS = {
  MED:[
    {area:"🧬 Biologia",color:"#4ade80",topics:[
      {t:"Biologia Cellulare",sub:["Cellula procariotica vs eucariotica","Organelli: mitocondri, RER/REL, Golgi, lisosomi","Membrana: modello a mosaico fluido, trasporto","Ciclo cellulare: G1, S, G2, mitosi, checkpoint"]},
      {t:"Genetica",sub:["Leggi di Mendel: 1ª e 2ª","Eredità X-linked, codominanza, penetranza","Struttura DNA/RNA, replicazione semiconservativa","Trascrizione e traduzione, codice genetico","Mutazioni: puntiformi, frameshift, nonsense"]},
      {t:"Fisiologia Umana",sub:["Sistema nervoso: potenziale d'azione, sinapsi, SNA","Sistema cardiocircolatorio: ciclo cardiaco, pressione","Sistema respiratorio: volumi polmonari, emoglobina","Sistema endocrino: ipofisi, tiroide, pancreas (insulina/glucagone)","Sistema immunitario: innato vs adattativo, anticorpi","Sistema renale: filtrazione glomerulare, omeostasi"]},
      {t:"Metabolismo",sub:["Glicolisi: glucosio → 2 piruvato + 2 ATP netti","Ciclo di Krebs + catena di trasporto elettroni","Gluconeogenesi, glicogenolisi, glicogenosintesi","Metabolismo lipidico: β-ossidazione, sintesi acidi grassi","Fotosintesi: reazioni luce-dipendenti e ciclo Calvin"]},
    ]},
    {area:"⚗️ Chimica",color:"#fb923c",topics:[
      {t:"Chimica Generale",sub:["Struttura atomica: numero atomico, isotopi","Configurazione elettronica, regola di Aufbau","Tavola periodica: tendenze EN, IE, raggi atomici","Legami: ionico, covalente, metallico, ponti H, VdW","N.O. e bilanciamento redox"]},
      {t:"Stechiometria",sub:["Mole e numero di Avogadro (6.022×10²³)","Massa molare, calcoli moli↔grammi↔molecole","Bilanciamento equazioni","Resa percentuale; eccesso e deficienza","Gas ideale: PV=nRT"]},
      {t:"Soluzioni & Acido-Base",sub:["Molarità, molalità, % in massa","Proprietà colligative: crioscopia, osmosi","Brønsted-Lowry: acido (dona H⁺), base (accetta H⁺)","pH, pOH, Kw; calcolo pH acidi/basi","Soluzioni tampone: sangue pH 7.35-7.45"]},
      {t:"Chimica Organica",sub:["IUPAC: alcani, alcheni, alchini, benzene","Gruppi funzionali e reattività","Isomeria: strutturale, geometrica, ottica","Biomolecole: glucidi, lipidi, amminoacidi, proteine"]},
    ]},
    {area:"📐 Matematica & Fisica",color:"#60a5fa",topics:[
      {t:"Matematica",sub:["Algebra: equazioni 1°/2° grado, sistemi","Logaritmi: proprietà e applicazioni","Esponenziali: crescita e decadimento","Trigonometria: sin/cos/tan, valori notevoli","Geometria: aree, volumi, Pitagora"]},
      {t:"Fisica",sub:["Cinematica: MRU, MRUA (v=v₀+at, x=v₀t+½at²)","3 Leggi di Newton, peso P=mg, attrito","Lavoro W=Fdcosθ, energia cinetica Eₖ=½mv²","Onde: λ, frequenza f, velocità v=λf","Gas ideali: PV=nRT, leggi di Boyle/Gay-Lussac"]},
    ]},
  ],
  I:[
    {area:"📐 Matematica",color:"#60a5fa",topics:[
      {t:"Algebra",sub:["Prodotti notevoli: (a±b)², (a+b)(a-b)","Scomposizione in fattori","Equazioni e disequazioni 1° e 2° grado","Sistemi: sostituzione, Cramer, compatibilità"]},
      {t:"Geometria Analitica",sub:["Retta: forma esplicita/implicita, pendenza","Parabola: vertice, fuoco, asse di simmetria","Circonferenza: equazione (x-a)²+(y-b)²=r²","Ellisse e iperbole (riconoscimento)"]},
      {t:"Trigonometria",sub:["Valori notevoli: sin/cos per 0°,30°,45°,60°,90°","Identità fondamentale: sin²x+cos²x=1","Formule addizione e duplicazione","Equazioni goniometriche fondamentali"]},
      {t:"Funzioni",sub:["Dominio, codominio, grafico","Funzioni pari/dispari, iniettive, suriettive","Funzioni esponenziali e logaritmiche","Funzioni trigonometriche: grafici e periodicità"]},
    ]},
    {area:"⚡ Fisica",color:"#fb923c",topics:[
      {t:"Meccanica",sub:["Cinematica: MRU, MRUA, moto circolare uniforme","3 Leggi di Newton; forza peso, tensione, attrito","Piano inclinato; forza di attrito μN","Lavoro, potenza, energia cinetica e potenziale","Quantità di moto, impulso-momento"]},
      {t:"Termodinamica",sub:["Temperature: Celsius, Kelvin (K=°C+273)","Gas ideali: PV=nRT; equazioni di stato","I principio: ΔU=Q+W","Trasformazioni: isoterma, isobara, isocora, adiabatica"]},
      {t:"Elettromagnetismo",sub:["Legge di Coulomb F=kq₁q₂/r²","Campo elettrico; potenziale elettrico","Corrente I=Q/t; legge di Ohm V=RI","Circuiti serie e parallelo; potenza P=RI²"]},
    ]},
    {area:"🧩 Logica",color:"#c084fc",topics:[
      {t:"Logica Formale",sub:["Proposizioni e connettivi: ¬, ∧, ∨, →, ↔","Tabelle di verità; tautologie","Sillogismi; modus ponens, modus tollens","Quantificatori ∀ e ∃; negazione","Serie logiche: numeriche, letterali, alfanumeriche"]},
    ]},
  ],
  PSI:[
    {area:"🧠 Neurobiologia",color:"#c084fc",topics:[
      {t:"Sistema Nervoso",sub:["Neuroni: soma, dendriti, assone","Potenziale d'azione: Na⁺/K⁺, refrattarietà","Tipi di sinapsi: elettriche e chimiche","Lobi cerebrali e funzioni specializzate","LTP, LTD; neurogenesi; plasticità"]},
      {t:"Psicobiologia",sub:["Aree di Broca (produzione) e Wernicke (comprensione)","Sistema limbico: amigdala, ippocampo, ipotalamo","Neurotrasmettitori: dopamina, serotonina, GABA, glutammato","Ritmi circadiani: melatonina, ciclo sonno-veglia"]},
    ]},
    {area:"🔢 Matematica",color:"#f87171",topics:[
      {t:"Matematica di Base",sub:["Frazioni, potenze, radici; proporzioni e percentuali","Equazioni lineari e sistemi semplici","Probabilità: classica, frequentista, condizionata","Statistica: media, mediana, moda, varianza","Grafici: barre, torta, dispersione — lettura e interpretazione"]},
    ]},
    {area:"🧬 Biologia",color:"#4ade80",topics:[
      {t:"Biologia & Genetica",sub:["Organelli principali e funzioni","Mitosi vs meiosi; cariotipo umano (46 cromosomi)","Genetica mendeliana: genotipo, fenotipo, Punnett","Alberi genealogici: pattern ereditari","Sistema endocrino: asse ipotalamo-ipofisi"]},
    ]},
  ],
  E:[
    {area:"📐 Matematica",color:"#34d399",topics:[
      {t:"Algebra e Analisi",sub:["Equazioni e disequazioni 1° e 2° grado","Funzioni: lineare, quadratica, esponenziale, logaritmica","Proprietà dei logaritmi; equazioni esponenziali","Progressioni aritmetiche e geometriche"]},
      {t:"Statistica e Probabilità",sub:["Distribuzione dati: frequenze, istogrammi","Medie: aritmetica, ponderata, geometrica","Varianza e deviazione standard","Probabilità classica, complementare, condizionata","Combinatoria: permutazioni, combinazioni semplici"]},
      {t:"Matematica Finanziaria",sub:["Percentuali: calcolo, variazione, ripartizione","Interesse semplice e composto","Lettura e interpretazione di grafici economici","Indici: compositi, deflatori; numeri indice (base 100)"]},
    ]},
    {area:"🧩 Ragionamento",color:"#60a5fa",topics:[
      {t:"Ragionamento su Testi e Dati",sub:["Comprensione testi argomentativi: tesi e argomenti","Analisi grafici: barre, linee, scatter, torta","Tabelle statistiche e a doppia entrata","Ragionamento inferenziale: deduzione vs induzione"]},
      {t:"Cultura Economica",sub:["Microeconomia: domanda/offerta, equilibrio, elasticità","Macroeconomia: PIL, inflazione, disoccupazione","Sistema bancario: BCE, tassi di interesse","Fonti del diritto italiano: Costituzione, leggi, regolamenti","Diritto dell'UE: regolamenti e direttive"]},
    ]},
  ],
  SU:[
    {area:"📖 Lingua Italiana",color:"#2dd4bf",topics:[
      {t:"Grammatica",sub:["Morfologia: parti del discorso e variazioni","Sintassi della frase semplice: soggetto, predicato, complementi","Analisi del periodo: coordinate, subordinate e loro tipi","Congiuntivo: usi principali","Ortografia: accento, apostrofo, h, doppie","Punteggiatura: virgola, punto e virgola, due punti"]},
      {t:"Letteratura Italiana",sub:["Trecento: Dante (Divina Commedia), Petrarca, Boccaccio","Quattro-Cinquecento: Ariosto, Machiavelli, Tasso","Ottocento: Foscolo, Leopardi (Canti), Manzoni, Verga","Novecento: Pirandello, Svevo, Ungaretti, Montale, Calvino"]},
      {t:"Analisi del Testo",sub:["Narrativo: narratore, focalizzazione, fabula vs intreccio","Poetico: metro, rime, figure retoriche","Figure retoriche: metafora, similitudine, anafora, chiasmo","Argomentativo: struttura tesi-argomenti-conclusione"]},
    ]},
    {area:"🏛️ Storia & Filosofia",color:"#f87171",topics:[
      {t:"Storia Moderna e Contemporanea",sub:["Rivoluzione Francese e Napoleone","Risorgimento (1820-1870)","Prima Guerra Mondiale; trattati di pace","Fascismo, Nazismo, Shoah","Seconda Guerra Mondiale; Resistenza; 25 Aprile","Guerra Fredda; Italia repubblicana (1948-oggi)"]},
      {t:"Filosofia",sub:["Platone: mondo delle idee, Repubblica","Aristotele: logica, metafisica, etica","Illuminismo: Locke, Rousseau, Montesquieu, Voltaire","Kant: critica della ragione pura, imperativo categorico","Hegel: dialettica. Marx: materialismo storico. Nietzsche: superuomo"]},
    ]},
  ],
  B:[
    {area:"🧬 Biologia",color:"#4ade80",topics:[
      {t:"Biologia Cellulare",sub:["Procarioti vs eucarioti","Organelli e funzioni","Membrane: struttura, trasporto (osmosi, facilitata, attivo)","Metabolismo: glicolisi, ciclo di Krebs, fosforilazione ossidativa, fermentazione"]},
      {t:"Genetica & Biologia Molecolare",sub:["Leggi di Mendel; X-linked; codominanza","DNA: struttura, replicazione semiconservativa","Trascrizione (pre-mRNA → processing → mRNA) e traduzione","Codice genetico: degenerazione, universalità, stop","Mutazioni: puntiformi, frameshift; Hardy-Weinberg"]},
      {t:"Biologia degli Organismi",sub:["Virus: ciclo litico vs lisogenico, retrovirus (HIV)","Batteri: struttura, resistenza, plasmidi","Piante: fotosintesi, trasporto xilema/floema","Ecologia: catene alimentari, cicli biogeochimici (C, N, P)"]},
    ]},
    {area:"⚗️ Chimica",color:"#fb923c",topics:[
      {t:"Chimica Inorganica",sub:["Struttura atomica; configurazione elettronica","Tavola periodica: tendenze EN, IE","Legami: ionico, covalente (σ e π), metallico, ponti H","Stechiometria: bilanciamento, mole, calcoli di resa","Acidi e basi: Arrhenius, Brønsted-Lowry; pH; tamponi","Reazioni redox: N.O., bilanciamento","Gas: PV=nRT, legge di Dalton"]},
      {t:"Chimica Organica",sub:["Idrocarburi: alcani (sp³), alcheni (sp²), alchini (sp), benzene","Isomeria: strutturale, geometrica (E/Z), ottica (R/S)","Gruppi funzionali: alcoli, aldeidi, chetoni, acidi, ammine, esteri, ammidi","Biomolecole complete: mono/di/polisaccaridi, lipidi, amminoacidi, proteine, acidi nucleici"]},
    ]},
  ],
  F:[
    {area:"💊 Chimica per Farmacia",color:"#fbbf24",topics:[
      {t:"Chimica Generale",sub:["Struttura atomica; configurazione elettronica; periodicità","Legami chimici: ionico, covalente, ponti H, VdW","Stechiometria: bilanciamento, mole, resa","Acidi/basi: Ka, Kb, pH, tamponi; Henderson-Hasselbalch","Equilibri: Kc, Kp; Le Chatelier; Ksp","Reazioni redox: N.O., bilanciamento, celle elettrochimiche"]},
      {t:"Chimica Organica",sub:["IUPAC: alcani, alcheni, alchini, cicloalcani, benzene","Stereoisomeria: E/Z, R/S, enantiomeri, diastereomeri","Principali classi: alcoli, fenoli, eteri, aldeidi, chetoni, acidi, esteri, ammidi, ammine","Reattività: SN1/SN2, E1/E2, addizione elettrofila, sostituzione aromatica","Biomolecole: carboidrati, lipidi, amminoacidi, proteine, acidi nucleici"]},
    ]},
    {area:"🧬 Biologia & Fisica",color:"#4ade80",topics:[
      {t:"Biologia per Farmacia",sub:["Membrana: struttura e trasporto (biodisponibilità)","DNA: struttura, replicazione, trascrizione, traduzione","Ciclo cellulare, apoptosi; tecniche di biologia molecolare (PCR, cenni)","SNA: simpatico/parasimpatico (agonisti/antagonisti)","Metabolismo farmaci: ADME, CYP450, fase I e II"]},
      {t:"Fisica applicata",sub:["Pressione: idrostatica, osmosi, pressione di vapore","Termodinamica: calore, temperatura, cambiamenti di stato","Onde: luce (UV-Vis → spettroscopia), onde sonore","Logaritmi ed esponenziali: applicazioni a pH, cinetica farmacologica"]},
    ]},
  ],
};

const RISORSE_GENERALI = [
  {name:"CISIA – Area Esercitazioni",tag:"Ufficiale",color:"#60a5fa",url:"https://allenamento.cisiaonline.it",desc:"Simulazioni ufficiali identiche ai test reali. MOOC gratuiti di matematica e logica, prove anni precedenti commentate. Punto di partenza obbligatorio."},
  {name:"TestBuddy",tag:"Gratuito",color:"#4ade80",url:"https://testbuddy.it/tolc",desc:"Simulazioni gratuite per tutti i TOLC, quiz per argomento, analisi AI degli errori ricorrenti. Oltre 70.000 studenti. Piano di studio personalizzato."},
  {name:"TestBusters",tag:"Guide",color:"#fb923c",url:"https://www.testbusters.it",desc:"Guide dettagliate su cosa studiare per ogni TOLC, corsi online e manuali, oltre 1.000 docenti. Lezioni registrate disponibili 48h dopo."},
  {name:"Alpha Test",tag:"Libri",color:"#c084fc",url:"https://www.alphatest.it",desc:"I libri più usati per prepararsi ai test universitari in Italia. Kit completi: manuale teorico + eserciziario + quizzario + prove simulate."},
  {name:"Khan Academy Italiano",tag:"Video",color:"#2dd4bf",url:"https://it.khanacademy.org",desc:"Videolezioni gratuite di matematica, fisica, chimica, biologia. Ottimo per ripassare la teoria in modo interattivo senza libri."},
  {name:"Elia Bombardelli – YouTube",tag:"YouTube",color:"#f87171",url:"https://www.youtube.com/@EliaBombardelli",desc:"Il canale YouTube di matematica più visto in Italia: 70M+ visualizzazioni. Algebra, funzioni, trigonometria, logaritmi — fondamentale per TOLC-I, E, F."},
  {name:"thefaculty app",tag:"App",color:"#60a5fa",url:"https://thefacultyapp.com",desc:"App gratuita con simulazioni TOLC illimitate: autovalutazione, simulazione ufficiale, rapida e personalizzata. Classifica comparativa."},
  {name:"AlmaLaurea",tag:"Orientamento",color:"#2dd4bf",url:"https://www2.almalaurea.it/cgi-php/universita/statistiche/",desc:"Database nazionale dei laureati: tasso di occupazione, stipendi, tempo per trovare lavoro per facoltà e ateneo. Fondamentale per scegliere con dati reali."},
];

const RISORSE_TOLC = {
  MED:[
    {name:"CISIA – Syllabus TOLC-MED",url:"https://www.cisiaonline.it/area-tematica-tolc-tolc-med/struttura-e-syllabus/",desc:"Programma ufficiale completo: tutti gli argomenti possibili nel test. Punto di partenza obbligatorio.",tag:"Ufficiale"},
    {name:"TestBuddy – TOLC-MED",url:"https://testbuddy.it/tolc/tolc-med",desc:"Simulazioni specifiche per medicina con analisi per argomento, quiz mirati, mnemofrasi per biologia e chimica.",tag:"Gratuito"},
    {name:"Khan Academy – Biologia",url:"https://it.khanacademy.org/science/biology",desc:"Videolezioni gratuite su cellula, genetica, evoluzione, fisiologia umana. Ideale per colmare lacune di biologia.",tag:"Video"},
    {name:"Khan Academy – Chimica",url:"https://it.khanacademy.org/science/chemistry",desc:"Struttura atomica, legami chimici, stechiometria, acidi e basi. Fondamentale per la sezione chimica.",tag:"Video"},
    {name:"TestBusters – TOLC-MED",url:"https://www.testbusters.it/test-ammissione/medicina-tolc-med",desc:"Corsi con docenti specializzati, lezioni registrate, simulazioni e manuali. Metodo pratico.",tag:"Guide"},
  ],
  PSI:[
    {name:"CISIA – Syllabus TOLC-PSI",url:"https://www.cisiaonline.it/area-tematica-tolc-tolc-psi/struttura-e-syllabus/",desc:"Programma ufficiale completo per Psicologia.",tag:"Ufficiale"},
    {name:"TestBuddy – TOLC-PSI",url:"https://testbuddy.it/tolc/tolc-psi",desc:"Simulazioni cronometrate, quiz per sezione, analisi progressi.",tag:"Gratuito"},
    {name:"Khan Academy – Matematica",url:"https://it.khanacademy.org/math",desc:"Percentuali, probabilità, statistica. Ottimo per la sezione matematica del TOLC-PSI.",tag:"Video"},
    {name:"Khan Academy – Biologia",url:"https://it.khanacademy.org/science/biology",desc:"Sistema nervoso, sinapsi, genetica mendeliana — sezione Biologia del TOLC-PSI.",tag:"Video"},
  ],
  E:[
    {name:"CISIA – Syllabus TOLC-E",url:"https://www.cisiaonline.it/area-tematica-tolc-tolc-e/struttura-e-syllabus/",desc:"Programma ufficiale per Economia e Giurisprudenza.",tag:"Ufficiale"},
    {name:"TestBuddy – TOLC-E",url:"https://testbuddy.it/tolc/tolc-e",desc:"Quiz e simulazioni per TOLC-E con analisi dettagliata della sezione matematica.",tag:"Gratuito"},
    {name:"Elia Bombardelli – Matematica",url:"https://www.youtube.com/@EliaBombardelli",desc:"Funzioni, logaritmi, probabilità, statistica. Perfetto per la sezione matematica del TOLC-E.",tag:"YouTube"},
    {name:"Khan Academy – Matematica",url:"https://it.khanacademy.org/math",desc:"Funzioni, logaritmi, probabilità, statistica — gratis.",tag:"Video"},
  ],
  I:[
    {name:"CISIA – Syllabus TOLC-I",url:"https://www.cisiaonline.it/area-tematica-tolc-tolc-i/struttura-e-syllabus/",desc:"Il programma ufficiale per Ingegneria: matematica, logica, scienze e comprensione.",tag:"Ufficiale"},
    {name:"TestBuddy – TOLC-I",url:"https://testbuddy.it/blog/tolc/syllabus-tolc-i-2025-argomenti-e-struttura",desc:"Syllabus 2025 dettagliato con simulazioni cronometrate e analisi per sezione.",tag:"Gratuito"},
    {name:"Elia Bombardelli – Matematica",url:"https://www.youtube.com/@EliaBombardelli",desc:"Trigonometria, funzioni, geometria analitica — FONDAMENTALE per il TOLC-I.",tag:"YouTube"},
    {name:"thefaculty – Simulazioni",url:"https://thefacultyapp.com",desc:"App gratuita: simulazioni ufficiali, rapide, personalizzate. Classifica con altri candidati.",tag:"App"},
    {name:"TestBusters – TOLC-I",url:"https://www.testbusters.it/test-ammissione/ingegneria-tolc-i",desc:"Corsi, manuali e simulazioni. Strategie di time management per matematica e logica.",tag:"Guide"},
  ],
  SU:[
    {name:"CISIA – Syllabus TOLC-SU",url:"https://www.cisiaonline.it/area-tematica-tolc-tolc-su/struttura-e-syllabus/",desc:"Programma ufficiale per Studi Umanistici: italiano, cultura generale e logica.",tag:"Ufficiale"},
    {name:"TestBuddy – TOLC-SU",url:"https://testbuddy.it/blog/tolc/tolc-su-2025-guida-completa-struttura-e-modalita",desc:"Guida 2025 con syllabus dettagliato e simulazioni gratuite.",tag:"Gratuito"},
    {name:"Treccani Online",url:"https://www.treccani.it/vocabolario/",desc:"Il vocabolario Treccani online: fondamentale per arricchire il lessico e capire le parole in contesto.",tag:"Gratuito"},
    {name:"CISIA – MOOC Logica",url:"https://allenamento.cisiaonline.it",desc:"Moduli gratuiti di logica di base: perfetti per la sezione ragionamento del TOLC-SU.",tag:"Ufficiale"},
  ],
  B:[
    {name:"CISIA – Syllabus TOLC-B",url:"https://www.cisiaonline.it/area-tematica-tolc-tolc-b/struttura-e-syllabus/",desc:"Programma ufficiale per Biologia e Scienze Naturali. Aggiornato al 2025.",tag:"Ufficiale"},
    {name:"TestBuddy – TOLC-B",url:"https://testbuddy.it/tolc/tolc-b",desc:"Simulazioni e quiz per argomento specifici per TOLC-B.",tag:"Gratuito"},
    {name:"Khan Academy – Biologia",url:"https://it.khanacademy.org/science/biology",desc:"Biologia molecolare (DNA, RNA, sintesi proteica), cellulare, genetica, evoluzione.",tag:"Video"},
    {name:"Khan Academy – Chimica Organica",url:"https://it.khanacademy.org/science/organic-chemistry",desc:"Gruppi funzionali, isomeria, biomolecole — molto utile per TOLC-B.",tag:"Video"},
  ],
  F:[
    {name:"CISIA – Syllabus TOLC-F",url:"https://www.cisiaonline.it/area-tematica-tolc-tolc-f/struttura-e-syllabus/",desc:"Programma ufficiale per Farmacia e CTF: biologia, chimica organica, matematica, fisica, logica.",tag:"Ufficiale"},
    {name:"TestBuddy – TOLC-F",url:"https://testbuddy.it/tolc/tolc-f/simulazioni",desc:"Simulazioni e esercizi per argomento. La chimica organica è la sezione chiave.",tag:"Gratuito"},
    {name:"Khan Academy – Chimica Organica",url:"https://it.khanacademy.org/science/organic-chemistry",desc:"Chimica organica completa: gruppi funzionali, stereoisomeria, reazioni. Essenziale per Farmacia.",tag:"Video"},
    {name:"Elia Bombardelli – Matematica",url:"https://www.youtube.com/@EliaBombardelli",desc:"Logaritmi, equazioni, funzioni — per la sezione matematica del TOLC-F.",tag:"YouTube"},
  ],
};

const ORI_CARDS = [
  {icon:"🩺",title:"Ti appassiona il corpo umano, la salute, aiutare le persone?",tolcs:["MED","F","B"],facolta:"Medicina, Farmacia, Biotecnologie, Professioni Sanitarie",color:"#f87171",tip:"Medicina e Odontoiatria sono a numero chiuso con graduatoria nazionale. Valuta anche Farmacia o Biotecnologie se vuoi più opzioni di accesso."},
  {icon:"🧠",title:"Ti affascina la mente umana, il comportamento, le neuroscienze?",tolcs:["PSI","MED"],facolta:"Psicologia, Neuroscienze, Scienze Cognitive, Scienze dell'Educazione",color:"#c084fc",tip:"Psicologia è molto richiesta — verifica la soglia minima per l'università che vuoi. Alcune facoltà sono a numero programmato locale."},
  {icon:"📊",title:"Ti piacciono economia, diritto, politica internazionale?",tolcs:["E","SU"],facolta:"Economia, Management, Giurisprudenza, Scienze Politiche",color:"#34d399",tip:"TOLC-E per Economia e Giurisprudenza. TOLC-SU per Scienze Politiche in molti atenei. Alcuni usano entrambi — controlla il bando!"},
  {icon:"⚙️",title:"Ti attraggono matematica, tecnologia, costruire cose, problem solving?",tolcs:["I"],facolta:"Ingegneria (tutte le specializzazioni), Informatica, Fisica, Matematica",color:"#60a5fa",tip:"Al Politecnico di Milano e di Torino il TOLC-I ha soglie alte. Inizia a prepararti prima: la matematica richiede pratica costante."},
  {icon:"📚",title:"Ami la letteratura, la comunicazione, le lingue, la storia dell'arte?",tolcs:["SU"],facolta:"Lettere, Filosofia, Comunicazione, Beni Culturali, Architettura, Lingue",color:"#2dd4bf",tip:"Il TOLC-SU pesa molto sulla comprensione dell'italiano (60% del test). Leggi molto, cura la grammatica e analizza testi argomentativi."},
  {icon:"🧬",title:"Ti appassionano biologia, ambiente, scienze della vita?",tolcs:["B","F","MED"],facolta:"Biologia, Biotecnologie, Scienze Naturali, Scienze Ambientali, Agraria",color:"#fb923c",tip:"TOLC-B per la maggior parte dei corsi biologici. TOLC-F se sei interessato a Farmacia o CTF. La chimica è fondamentale per entrambi."},
];

const GUIDA_STEPS = [
  {n:"01",icon:"🔍",title:"Scopri quale TOLC ti serve",color:"#60a5fa",body:["Il TOLC varia per ogni corso di laurea. Prima di fare qualsiasi cosa, controlla il bando di ammissione del corso che ti interessa sul sito dell'università.","Stessa università, corsi diversi → possono richiedere TOLC diversi. Il TOLC è valido per TUTTE le università che richiedono lo stesso tipo.","Alcuni corsi (es. Medicina) hanno una graduatoria nazionale separata. Alcuni atenei usano punteggi minimi per sezione, non solo il totale.","💡 Consiglio: scegli la tua 1ª, 2ª e 3ª scelta di università/corso e controlla i requisiti di ciascuna sul loro sito ufficiale."]},
  {n:"02",icon:"📝",title:"Registrati su CISIA",color:"#4ade80",body:["Vai su cisiaonline.it → crea il tuo account con documento d'identità. Puoi registrarti ANCHE se sei al 4° o 5° anno di liceo — non serve aspettare il diploma!","Una volta registrato, accedi all'Area Esercitazioni (allenamento.cisiaonline.it) GRATIS: simulazioni complete, MOOC, prove anni precedenti.","💡 Consiglio: registrati subito, anche se il test è lontano. Inizia con le simulazioni gratuite per capire il tuo livello di partenza."]},
  {n:"03",icon:"📅",title:"Prenota la sessione",color:"#c084fc",body:["Puoi sostenere il TOLC una volta al mese (max 12 volte l'anno). Il punteggio migliore è quello che conta — non la media!","TOLC@UNI: in presenza in una sede universitaria aderente. TOLC@CASA: da remoto dal tuo PC (requisiti: webcam, microfono, connessione stabile).","Prenotazione → pagamento (~30€) → ricevuta di convocazione → risultati disponibili ~48h dopo.","💡 Consiglio: prenota PRIMA possibile (gennaio/febbraio per studenti di V anno). Le sessioni si esauriscono rapidamente."]},
  {n:"04",icon:"📚",title:"Prepara con metodo",color:"#fbbf24",body:["FASE 1 — Mappatura (settimana 1): fai una simulazione su CISIA o TestBuddy per capire forza e debolezza per sezione.","FASE 2 — Studio teorico (settimane 2-5): studia gli argomenti deboli dal syllabus CISIA. Usa libri + Khan Academy + flashcard.","FASE 3 — Esercizi mirati (settimane 6-8): risolvi quiz per argomento (TestBuddy, TestBusters). Annota e classifica gli errori.","FASE 4 — Simulazioni totali (ultime 2 settimane): almeno 3 simulazioni complete cronometrate. Analizza ogni errore.","💡 Piano minimo: 6-8 settimane con 2-3 ore al giorno producono risultati significativi."]},
  {n:"05",icon:"🎯",title:"Strategia il giorno del test",color:"#f87171",body:["PENALITÀ: risposta corretta = +1 pt, errata = -0.25 pt, omessa = 0 pt. Se elimini 2 opzioni su 5 → conviene rispondere.","GESTIONE DEL TEMPO: una volta finita una sezione, non puoi tornare indietro! Rispetta i timer per sezione.","INGLESE: nessuna penalità! Rispondi SEMPRE a tutte le domande di inglese — non hai niente da perdere.","💡 Il giorno prima: dormi bene, mangia normalmente. Non studiare la notte prima. Porta documento d'identità!"]},
  {n:"06",icon:"🏆",title:"Ottieni l'attestato e iscriviti",color:"#2dd4bf",body:["Dopo la prova, scarica l'attestato (~48h dopo) con punteggio totale e parziale per sezione. Conservalo!","Il TOLC-ID viene usato dall'ateneo per verificare il tuo punteggio nella graduatoria.","Se hai OFA (Obblighi Formativi Aggiuntivi): sei sotto soglia ma puoi iscriverti con corsi di recupero all'università.","💡 La validità del TOLC non scade: un punteggio preso in III-IV anno è già valido per l'iscrizione universitaria al termine della V."]},
];

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════

const fmt = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;
const timerCol = (s,t) => s/t>0.5?"#4ade80":s/t>0.25?"#fbbf24":"#f87171";

// ══════════════════════════════════════════════════════════════
//  COMPONENTS
// ══════════════════════════════════════════════════════════════

function AstraLogo({ size = "md" }) {
  const h = size === "lg" ? 52 : 34;
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <img
        src="/WoB.png"
        alt="ASTRA Network"
        style={{height:h,width:"auto",objectFit:"contain"}}
      />
    </div>
  );
}

function Badge({ children, color="#2563eb" }) {
  return (
    <span style={{background:`${color}18`,border:`1px solid ${color}35`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color,letterSpacing:".5px",textTransform:"uppercase"}}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
      <div style={{width:28,height:1,background:"rgba(37,99,235,.4)"}}/>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:13,color:"var(--blue-l)",letterSpacing:"1px"}}>{children}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  APP
// ══════════════════════════════════════════════════════════════

export default function App() {
  const [view, setView]     = useState("home");
  const [homeTab, setHomeTab] = useState("tolc");
  const [tid, setTid]       = useState(null);
  const [quiz, setQuiz]     = useState(null);
  const [fc, setFc]         = useState({ti:0,ci:0,flipped:false});
  const [mapOpen, setMapOpen] = useState({});
  const [stats, setStats]   = useState([]);
  const timer = useRef(null);

  const tolc = tid ? TOLCS[tid] : null;
  const go   = (v) => { setView(v); window.scrollTo(0,0); };

  const pickTolc = (id) => {
    setTid(id);
    setFc({ti:0,ci:0,flipped:false});
    setMapOpen({});
    go("dashboard");
  };

  // ── Quiz engine ──────────────────────────────────────────────
  const startQuiz = async () => {
    go("quiz");
    setQuiz({loading:true,qs:[],cur:0,ans:[],tLeft:tolc.timerSec,tTotal:tolc.timerSec,done:false});
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:4000,
          messages:[{role:"user",content:tolc.prompt}]
        })
      });
      const data = await r.json();
      const raw  = data.content?.find(c=>c.type==="text")?.text || "[]";
      const clean = raw.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("["), e=clean.lastIndexOf("]");
      const qs = JSON.parse(clean.slice(s,e+1)).slice(0,30);
      setQuiz(p=>({...p,loading:false,qs,ans:new Array(qs.length).fill(null)}));
    } catch {
      setQuiz(p=>({...p,loading:false,err:"Errore di connessione. Riprova."}));
    }
  };

  useEffect(()=>{
    if(quiz&&!quiz.loading&&!quiz.done&&view==="quiz"&&quiz.qs.length>0){
      timer.current=setInterval(()=>{
        setQuiz(p=>{
          if(!p||p.done) return p;
          if(p.tLeft<=1){clearInterval(timer.current);return calcResults(p);}
          return {...p,tLeft:p.tLeft-1};
        });
      },1000);
    }
    return ()=>clearInterval(timer.current);
  },[quiz?.loading,quiz?.done,view,quiz?.qs.length]);

  const answer = (l) => setQuiz(p=>{const a=[...p.ans];a[p.cur]=l;return{...p,ans:a};});
  const nextQ  = () => setQuiz(p=>({...p,cur:Math.min(p.cur+1,p.qs.length-1)}));
  const prevQ  = () => setQuiz(p=>({...p,cur:Math.max(p.cur-1,0)}));

  const calcResults = (state) => {
    clearInterval(timer.current);
    if(!state.qs.length) return state;
    let ok=0,wrong=0; const byM={};
    state.qs.forEach((q,i)=>{
      const mat=q.m||"Generale";
      if(!byM[mat]) byM[mat]={ok:0,tot:0};
      byM[mat].tot++;
      const a=state.ans[i];
      if(!a) return;
      const corr=q.r||q.corretta;
      if(a===corr){ok++;byM[mat].ok++;}else wrong++;
    });
    const score=Math.max(0,ok-wrong*0.25);
    const result={...state,done:true,score:score.toFixed(2),ok,wrong,byM,skip:state.qs.length-ok-wrong};
    setStats(s=>[...s,{tid,score:parseFloat(result.score),time:new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})}]);
    return result;
  };

  const submit = () => { clearInterval(timer.current); setQuiz(p=>calcResults(p)); };

  // ── Flashcard engine ─────────────────────────────────────────
  const fcTopics  = tid&&FC[tid] ? FC[tid] : [];
  const curTopic  = fcTopics[fc.ti] || {cards:[]};
  const curCard   = curTopic.cards[fc.ci] || {};
  const flipCard  = () => setFc(s=>({...s,flipped:!s.flipped}));
  const nextCard  = () => setFc(s=>({...s,ci:(s.ci+1)%curTopic.cards.length,flipped:false}));
  const prevCard  = () => setFc(s=>({...s,ci:(s.ci-1+curTopic.cards.length)%curTopic.cards.length,flipped:false}));
  const smap      = (tid&&SMAPS[tid]) ? SMAPS[tid] : [];

  // ── Shared styles ────────────────────────────────────────────
  const nav = {
    display:"flex",alignItems:"center",padding:"14px 28px",
    borderBottom:"1px solid var(--border)",
    background:"rgba(6,9,26,.92)",backdropFilter:"blur(16px)",
    position:"sticky",top:0,zIndex:30,gap:16,
  };
  const backBtn = {
    background:"transparent",border:"none",color:"var(--gray)",
    cursor:"pointer",fontSize:13,padding:"4px 0",marginRight:8,
    fontFamily:"'Plus Jakarta Sans',sans-serif",
  };
  const primaryBtn = (c="#2563eb") => ({
    background:c,border:"none",borderRadius:10,
    padding:"11px 24px",cursor:"pointer",color:"#fff",
    fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,
    letterSpacing:".3px",transition:"all .15s ease",
  });
  const card = (extra={}) => ({
    background:"var(--card)",border:"1px solid var(--border)",
    borderRadius:16,backdropFilter:"blur(8px)",...extra,
  });

  // ════════════════════════════════════════════════════════════
  //  VIEW: HOME
  // ════════════════════════════════════════════════════════════
  if (view==="home") return (
    <div style={{minHeight:"100vh",position:"relative",zIndex:1}}>

      {/* NAV */}
      <nav style={nav}>
        <AstraLogo />
        <div style={{flex:1}}/>
        <Badge>TOLC Prep 2025</Badge>
        {stats.length>0 && (
          <div style={{display:"flex",gap:6}}>
            {stats.slice(-3).map((s,i)=>{
              const c=s.score>=20?"#4ade80":s.score>=12?"#fbbf24":"#f87171";
              return <span key={i} style={{fontSize:12,color:c,fontWeight:700}}>{s.score}pt</span>;
            })}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{position:"relative",overflow:"hidden"}}>
        {/* Blurred campus background */}
        <div style={{position:"absolute",inset:"-40px",backgroundImage:"url('/1633603541.png')",backgroundSize:"cover",backgroundPosition:"center",filter:"blur(40px) brightness(0.25)",opacity:0.6,zIndex:0}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(6,9,26,0.5) 0%, rgba(6,9,26,0.95) 100%)",zIndex:0}} />
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"80px 24px 64px",maxWidth:760,margin:"0 auto"}}>
        <SectionLabel>Associazione Studentesca · Bocconi</SectionLabel>
        <h1 className="fade-up" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"clamp(36px,6vw,60px)",lineHeight:1.08,letterSpacing:"-1.5px",color:"var(--white)",margin:"0 0 12px"}}>
          Preparati ai Test{" "}
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:600,color:"var(--blue-l)"}}>TOLC</span>
        </h1>
        <p className="fade-up2" style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:20,color:"var(--gray)",margin:"0 0 32px",letterSpacing:".5px"}}>
          Quiz AI · Flashcard · Mappe di Studio · Risorse Curate
        </p>
        <div className="fade-up3" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8}}>
          {["🎯 Quiz AI simulate","⏱ Timer TOLC reale","🃏 Flashcard animate","🗺 Mappe argomenti","📊 Score con analisi","🔗 Risorse curate","🧭 Orientamento universitario","📋 Guida pratica CISIA"].map(f=>(
            <span key={f} style={{background:"rgba(37,99,235,.08)",border:"1px solid rgba(37,99,235,.18)",borderRadius:20,padding:"5px 14px",fontSize:12,color:"var(--gray)",fontWeight:500}}>{f}</span>
          ))}
        </div>
      </div>
      </div>
      {/* TABS */}
      <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:40,padding:"0 16px",flexWrap:"wrap"}}>
        {[["tolc","I TOLC"],["orientamento","Orientamento"],["risorse","Risorse"],["guida","Guida Pratica"]].map(([id,label])=>(
          <button key={id} className={`tab-astra${homeTab===id?" active":""}`} onClick={()=>setHomeTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── TAB: TOLC ── */}
      {homeTab==="tolc" && (
        <div style={{maxWidth:980,margin:"0 auto",padding:"0 20px 80px"}}>
          <SectionLabel>Scegli il tuo test — {Object.keys(TOLCS).length} TOLC disponibili</SectionLabel>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))",gap:14,marginTop:18}}>
            {Object.values(TOLCS).map((t,i)=>(
              <button key={t.id} className="tolc-card btn-astra" onClick={()=>pickTolc(t.id)}
                style={{...card(),padding:"24px 22px",cursor:"pointer",color:"var(--white)",textAlign:"left",display:"flex",flexDirection:"column",gap:12,animationDelay:`${i*.05}s`}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${t.color}45`;e.currentTarget.style.boxShadow=`0 0 0 1px ${t.color}25, 0 16px 40px ${t.glow}`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <span style={{fontSize:36}}>{t.emoji}</span>
                  <Badge color={t.color}>{t.key}</Badge>
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:17,color:"var(--white)",marginBottom:4}}>{t.subject}</div>
                  <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5}}>{t.facolta.slice(0,3).join(" · ")}</div>
                </div>
                <div style={{fontSize:11,color:"var(--muted)",paddingTop:12,borderTop:"1px solid var(--border)",lineHeight:1.6}}>{t.desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:"auto"}}>
                  <span style={{fontSize:11,color:t.color,fontWeight:600}}>Inizia →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ORIENTAMENTO ── */}
      {homeTab==="orientamento" && (
        <div style={{maxWidth:860,margin:"0 auto",padding:"0 20px 80px"}}>
          <SectionLabel>Trova il tuo percorso</SectionLabel>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,margin:"8px 0 28px",color:"var(--white)"}}>Non sai ancora cosa fare?</h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {ORI_CARDS.map((c,i)=>(
              <div key={i} style={{...card(),padding:"22px 24px"}}>
                <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <span style={{fontSize:34,flexShrink:0}}>{c.icon}</span>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:700,fontSize:16,color:"var(--white)",margin:"0 0 6px",lineHeight:1.4}}>{c.title}</p>
                    <p style={{fontSize:12,color:"var(--muted)",margin:"0 0 12px"}}>{c.facolta}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                      {c.tolcs.map(t=>(
                        <button key={t} className="btn-astra" onClick={()=>pickTolc(t)}
                          style={{background:`${c.color}12`,border:`1px solid ${c.color}30`,borderRadius:8,padding:"5px 14px",cursor:"pointer",color:c.color,fontSize:12,fontWeight:700}}>
                          {TOLCS[t]?.key} →
                        </button>
                      ))}
                    </div>
                    <p style={{margin:0,fontSize:12,color:"var(--gray)",fontStyle:"italic",lineHeight:1.6}}>💡 {c.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: RISORSE ── */}
      {homeTab==="risorse" && (
        <div style={{maxWidth:920,margin:"0 auto",padding:"0 20px 80px"}}>
          <SectionLabel>Piattaforme di preparazione</SectionLabel>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,margin:"8px 0 28px",color:"var(--white)"}}>Risorse curate per la preparazione</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:12}}>
            {RISORSE_GENERALI.map((r,i)=>(
              <a key={i} className="link-card" href={r.url} target="_blank" rel="noopener noreferrer"
                style={{...card(),padding:"20px",textDecoration:"none",color:"var(--white)",display:"block"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <Badge color={r.color}>{r.tag}</Badge>
                  <span style={{fontSize:12,color:"var(--muted)"}}>↗</span>
                </div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:7}}>{r.name}</div>
                <div style={{fontSize:12,color:"var(--gray)",lineHeight:1.7}}>{r.desc}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: GUIDA ── */}
      {homeTab==="guida" && (
        <div style={{maxWidth:780,margin:"0 auto",padding:"0 20px 80px"}}>
          <SectionLabel>Dalla registrazione al voto</SectionLabel>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,margin:"8px 0 28px",color:"var(--white)"}}>Guida Pratica al TOLC</h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {GUIDA_STEPS.map((s,i)=>(
              <div key={i} style={{...card(),overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,padding:"18px 22px",borderBottom:"1px solid var(--border)"}}>
                  <div style={{background:`${s.color}14`,border:`1px solid ${s.color}30`,borderRadius:12,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
                  <div>
                    <div style={{fontSize:10,color:s.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>Step {s.n}</div>
                    <div style={{fontWeight:700,fontSize:16,color:"var(--white)"}}>{s.title}</div>
                  </div>
                </div>
                <div style={{padding:"16px 22px",display:"flex",flexDirection:"column",gap:8}}>
                  {s.body.map((line,j)=>(
                    <p key={j} style={{margin:0,fontSize:13,color:line.startsWith("💡")?s.color:"var(--gray)",lineHeight:1.7,fontWeight:line.startsWith("💡")?600:400}}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Regola -0.25 */}
          <div style={{...card(),padding:"24px",marginTop:16,borderColor:"rgba(37,99,235,.2)"}}>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,margin:"0 0 16px",color:"var(--blue-l)"}}>La regola del −0.25: quando rispondo?</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[{tit:"✅ Rispondi sempre",col:"#4ade80",pts:["Sezione di inglese (zero penalità!)","Hai eliminato 2+ opzioni su 5","Probabilità ≥ 50% di azzeccare"]},
                {tit:"⚠ Lascia in bianco",col:"#f87171",pts:["Non hai idea dell'argomento","Tutte e 5 le opzioni plausibili","Hai eliminato solo 1 opzione"]}].map((b,i)=>(
                <div key={i} style={{background:`${b.col}08`,border:`1px solid ${b.col}20`,borderRadius:12,padding:"14px 16px"}}>
                  <div style={{fontWeight:700,color:b.col,fontSize:13,marginBottom:10}}>{b.tit}</div>
                  {b.pts.map((p,j)=><p key={j} style={{margin:"0 0 5px",fontSize:12,color:"var(--gray)",lineHeight:1.5}}>→ {p}</p>)}
                </div>
              ))}
            </div>
            <p style={{margin:"14px 0 0",fontSize:11,color:"var(--muted)",fontStyle:"italic"}}>Con 5 opzioni, il valore atteso di una risposta casuale è 0 — ma eliminare anche solo 1 opzione rende conveniente rispondere.</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid var(--border)",padding:"32px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <AstraLogo />
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:14,color:"var(--muted)"}}>Main Students' Representative Association · Bocconi University</p>
        <a href="https://www.astrabocconi.com" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"var(--blue-l)",fontWeight:600}}>astrabocconi.com ↗</a>
      </footer>
    </div>
  );

  // ════════════════════════════════════════════════════════════
  //  VIEW: DASHBOARD
  // ════════════════════════════════════════════════════════════
  if (view==="dashboard") {
    const risorse = RISORSE_TOLC[tid] || [];
    return (
      <div style={{minHeight:"100vh",position:"relative",zIndex:1}}>
        <nav style={nav}>
          <button style={backBtn} onClick={()=>go("home")}>← Home</button>
          <AstraLogo />
          <div style={{flex:1}}/>
          <Badge color={tolc.color}>{tolc.key}</Badge>
        </nav>

        <div style={{maxWidth:840,margin:"0 auto",padding:"40px 20px 80px"}}>
          {/* Header */}
          <SectionLabel>{tolc.facolta[0]}</SectionLabel>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:600,margin:"6px 0 6px",color:"var(--white)",lineHeight:1}}>
            {tolc.emoji} {tolc.key}
          </h2>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:15,color:"var(--gray)",margin:"0 0 28px"}}>{tolc.subject}</p>

          {/* Struttura */}
          <div style={{...card(),padding:"20px 22px",marginBottom:18}}>
            <p style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".7px",fontWeight:600,marginBottom:12}}>Struttura del test</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
              {tolc.sezioni.map(s=>(
                <div key={s.nome} style={{background:`${s.color}0e`,border:`1px solid ${s.color}22`,borderRadius:8,padding:"5px 12px",fontSize:12}}>
                  <span>{s.icon}</span>
                  <span style={{marginLeft:6,color:"var(--white)"}}>{s.nome}</span>
                  <span style={{marginLeft:6,fontWeight:700,color:s.color}}>{s.n}q</span>
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:"var(--muted)",margin:"0 0 6px"}}>{tolc.desc} · Penalità: −0.25 per risposta errata · Inglese: nessuna penalità</p>
            {tolc.tip && <p style={{margin:0,fontSize:12,color:`${tolc.color}cc`,fontStyle:"italic",lineHeight:1.6,fontFamily:"'Cormorant Garamond',serif"}}>💡 {tolc.tip}</p>}
          </div>

          {/* Actions */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14,marginBottom:18}}>
            {[
              {icon:"🎯",label:"Quiz Simulazione",sub:"30 domande AI · timer reale · scoring TOLC con −0.25",color:tolc.color,action:startQuiz,primary:true},
              {icon:"🃏",label:"Flashcard",sub:"Concetti chiave per argomento con flip animato",color:"#c084fc",action:()=>go("flashcard")},
              {icon:"🗺",label:"Mappa di Studio",sub:"Tutti gli argomenti del syllabus CISIA organizzati",color:"#34d399",action:()=>go("studymap")},
            ].map(c=>(
              <button key={c.label} className="btn-astra" onClick={c.action}
                style={{...card(c.primary?{background:`${c.color}0e`,borderColor:`${c.color}30`}:{}),padding:"22px 20px",cursor:"pointer",color:"var(--white)",textAlign:"left",width:"100%"}}>
                <div style={{fontSize:30,marginBottom:12}}>{c.icon}</div>
                <div style={{fontWeight:700,fontSize:16,color:c.color,marginBottom:6}}>{c.label}</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>{c.sub}</div>
              </button>
            ))}
          </div>

          {/* Risorse */}
          {risorse.length>0 && (
            <div style={{...card(),padding:"20px 22px",marginBottom:18}}>
              <p style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".7px",fontWeight:600,marginBottom:14}}>Risorse per il {tolc.key}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {risorse.map((r,i)=>(
                  <a key={i} className="link-card" href={r.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 14px",background:"rgba(255,255,255,.02)",border:"1px solid var(--border)",borderRadius:10,textDecoration:"none",color:"var(--white)"}}>
                    <Badge color={tolc.color}>{r.tag}</Badge>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:tolc.color,marginBottom:2}}>{r.name} ↗</div>
                      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{r.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Session scores */}
          {stats.filter(s=>s.tid===tid).length>0 && (
            <div style={{...card(),padding:"16px 20px"}}>
              <p style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",fontWeight:600,marginBottom:10}}>I tuoi quiz di oggi</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {stats.filter(s=>s.tid===tid).map((s,i)=>{
                  const c=s.score>=20?"#4ade80":s.score>=12?"#fbbf24":"#f87171";
                  return(<div key={i} style={{background:`${c}0e`,border:`1px solid ${c}25`,borderRadius:8,padding:"5px 14px",fontSize:13}}>
                    <span style={{fontWeight:700,color:c}}>{s.score} / 30</span>
                    <span style={{marginLeft:8,fontSize:11,color:"var(--muted)"}}>{s.time}</span>
                  </div>);
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  VIEW: QUIZ
  // ════════════════════════════════════════════════════════════
  if (view==="quiz") {
    if (!quiz) return null;

    // Loading
    if (quiz.loading) return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,position:"relative",zIndex:1}}>
        <AstraLogo size="lg"/>
        <div style={{textAlign:"center",marginTop:16}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:22,color:"var(--white)",margin:"0 0 8px"}}>Generazione domande in corso…</p>
          <p style={{fontSize:13,color:"var(--gray)"}}>L'AI sta preparando 30 domande per <strong style={{color:tolc.color}}>{tolc.key}</strong></p>
        </div>
        <div style={{width:260}}><div className="shimmer-bar"/></div>
      </div>
    );

    // Error
    if (quiz.err) return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,position:"relative",zIndex:1}}>
        <p style={{fontSize:16,color:"#f87171"}}>{quiz.err}</p>
        <button className="btn-astra" onClick={()=>go("dashboard")} style={{...primaryBtn()}}>← Dashboard</button>
      </div>
    );

    // Results
    if (quiz.done) {
      const max=quiz.qs.length;
      const pct=(parseFloat(quiz.score)/max)*100;
      const grade=pct>=80?{l:"Ottimo",emoji:"🏆",c:"#4ade80"}:pct>=60?{l:"Buono",emoji:"👍",c:"#fbbf24"}:pct>=40?{l:"Sufficiente",emoji:"📚",c:"#fb923c"}:{l:"Da migliorare",emoji:"💪",c:"#f87171"};
      return (
        <div style={{minHeight:"100vh",position:"relative",zIndex:1}}>
          <nav style={nav}>
            <button style={backBtn} onClick={()=>go("dashboard")}>← Dashboard</button>
            <AstraLogo/>
            <div style={{flex:1}}/>
            <Badge color={tolc.color}>{tolc.key} — Risultati</Badge>
          </nav>
          <div style={{maxWidth:720,margin:"0 auto",padding:"40px 20px 80px"}}>
            {/* Score hero */}
            <div style={{textAlign:"center",marginBottom:36}}>
              <div style={{fontSize:56,marginBottom:8}}>{grade.emoji}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:600,color:grade.c,lineHeight:1}}>{quiz.score}</div>
              <div style={{fontSize:14,color:"var(--gray)",marginTop:4}}>{grade.l} — {pct.toFixed(0)}% corretto</div>
            </div>
            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
              {[{l:"Corrette",v:quiz.ok,c:"#4ade80",icon:"✅"},{l:"Errate (−0.25)",v:quiz.wrong,c:"#f87171",icon:"❌"},{l:"Omesse",v:quiz.skip,c:"var(--gray)",icon:"⏭"}].map(b=>(
                <div key={b.l} style={{...card(),padding:"18px",textAlign:"center"}}>
                  <div style={{fontSize:22}}>{b.icon}</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:b.c}}>{b.v}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>{b.l}</div>
                </div>
              ))}
            </div>
            {/* Per subject */}
            {Object.entries(quiz.byM).length>0 && (
              <div style={{...card(),padding:"20px",marginBottom:24}}>
                <p style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",fontWeight:600,marginBottom:14}}>Performance per materia</p>
                {Object.entries(quiz.byM).map(([mat,d])=>{
                  const p2=d.tot>0?d.ok/d.tot:0;
                  const col=p2>=.7?"#4ade80":p2>=.5?"#fbbf24":"#f87171";
                  return(
                    <div key={mat} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:13,color:"var(--white)"}}>{mat}</span>
                        <span style={{fontSize:13,fontWeight:700,color:col}}>{d.ok}/{d.tot}</span>
                      </div>
                      <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{width:`${p2*100}%`,height:"100%",background:col,borderRadius:2,transition:"width .8s ease"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Review */}
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,marginBottom:14,color:"var(--white)"}}>Revisione domande</h3>
            {quiz.qs.map((q,i)=>{
              const ans=quiz.ans[i];const corr=q.r||q.corretta;
              const isOk=ans&&ans===corr;const isMiss=!ans;
              const col=isOk?"#4ade80":isMiss?"var(--muted)":"#f87171";
              return(
                <div key={i} style={{...card(),padding:"16px",marginBottom:10}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:10}}>
                    <span style={{fontSize:16,flexShrink:0,marginTop:2}}>{isOk?"✅":isMiss?"⏭":"❌"}</span>
                    <div>
                      <Badge color={tolc.color}>{q.m}</Badge>
                      <p style={{fontSize:14,color:"var(--white)",lineHeight:1.6,marginTop:6}}>{q.d}</p>
                    </div>
                  </div>
                  {ans&&ans!==corr&&<p style={{margin:"0 0 4px",fontSize:12,color:"#f87171"}}>La tua risposta: {ans}</p>}
                  <p style={{margin:"0 0 4px",fontSize:12,color:"#4ade80",fontWeight:700}}>Risposta corretta: {corr}</p>
                  {q.s&&<p style={{margin:0,fontSize:12,color:"var(--muted)",lineHeight:1.6,borderTop:"1px solid var(--border)",paddingTop:8,marginTop:6}}>💡 {q.s}</p>}
                </div>
              );
            })}
            <button className="btn-astra" onClick={startQuiz} style={{...primaryBtn(tolc.color),width:"100%",marginTop:16,padding:"14px",fontSize:15}}>
              🔄 Nuovo Quiz
            </button>
          </div>
        </div>
      );
    }

    // Active quiz
    const q=quiz.qs[quiz.cur];
    if (!q) return null;
    const tPct=quiz.tLeft/quiz.tTotal;
    const tColor=timerCol(quiz.tLeft,quiz.tTotal);
    return (
      <div style={{minHeight:"100vh",position:"relative",zIndex:1}}>
        <nav style={{...nav,gap:10}}>
          <button style={backBtn} onClick={()=>go("dashboard")}>← Esci</button>
          <AstraLogo/>
          <span style={{flex:1}}/>
          <div style={{background:`${tColor}14`,border:`1px solid ${tColor}35`,borderRadius:10,padding:"6px 16px",fontSize:14,fontWeight:700,color:tColor,fontVariantNumeric:"tabular-nums"}}>⏱ {fmt(quiz.tLeft)}</div>
          <button className="btn-astra" onClick={submit} style={{background:"rgba(255,255,255,.06)",border:"1px solid var(--border)",borderRadius:10,padding:"6px 16px",cursor:"pointer",color:"var(--gray)",fontSize:13,fontWeight:600}}>Consegna</button>
        </nav>
        {/* Timer bar */}
        <div style={{height:2,background:"rgba(255,255,255,.05)"}}>
          <div style={{height:"100%",width:`${tPct*100}%`,background:tColor,transition:"width 1s linear"}}/>
        </div>

        <div style={{maxWidth:720,margin:"0 auto",padding:"32px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <span style={{fontSize:13,color:"var(--muted)"}}>Domanda <span style={{color:"var(--blue-l)",fontWeight:700}}>{quiz.cur+1}</span> / {quiz.qs.length}</span>
            <Badge color={tolc.color}>{q.m}</Badge>
          </div>

          {/* Question */}
          <div style={{...card(),padding:"24px",marginBottom:16}}>
            <p style={{margin:0,fontSize:16,lineHeight:1.75,color:"var(--white)"}}>{q.d}</p>
          </div>

          {/* Options */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
            {(q.o||[]).map((opt,i)=>{
              const letter=String.fromCharCode(65+i);
              const selected=quiz.ans[quiz.cur]===letter;
              return(
                <button key={i} className="btn-astra" onClick={()=>answer(letter)}
                  style={{...card(selected?{background:`${tolc.color}12`,borderColor:`${tolc.color}45`}:{}),padding:"13px 18px",cursor:"pointer",color:selected?"var(--white)":"var(--gray)",textAlign:"left",fontSize:14,lineHeight:1.5,width:"100%"}}>
                  <span style={{fontWeight:700,color:selected?tolc.color:"var(--muted)",marginRight:10}}>{letter})</span>
                  {opt.replace(/^[A-E]\)\s*/,"")}
                </button>
              );
            })}
          </div>

          {/* Prev/Next */}
          <div style={{display:"flex",gap:12,marginBottom:24}}>
            <button className="btn-astra" onClick={prevQ} disabled={quiz.cur===0}
              style={{flex:1,...card(),padding:"10px",cursor:quiz.cur===0?"not-allowed":"pointer",color:"var(--muted)",fontSize:14,opacity:quiz.cur===0?.4:1}}>← Precedente</button>
            <button className="btn-astra" onClick={nextQ} disabled={quiz.cur===quiz.qs.length-1}
              style={{flex:1,...card({background:`${tolc.color}0e`,borderColor:`${tolc.color}30`}),padding:"10px",cursor:quiz.cur===quiz.qs.length-1?"not-allowed":"pointer",color:tolc.color,fontSize:14,fontWeight:600,opacity:quiz.cur===quiz.qs.length-1?.4:1}}>Successiva →</button>
          </div>

          {/* Quick nav */}
          <div style={{...card(),padding:"14px 16px"}}>
            <p style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:8}}>Navigazione rapida</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {quiz.qs.map((_,i)=>{
                const a=quiz.ans[i];const isCur=quiz.cur===i;
                return(
                  <button key={i} onClick={()=>setQuiz(p=>({...p,cur:i}))}
                    style={{width:28,height:28,borderRadius:6,border:`1px solid ${isCur?tolc.color:a?"rgba(255,255,255,.15)":"var(--border)"}`,background:isCur?`${tolc.color}20`:a?"rgba(255,255,255,.05)":"transparent",cursor:"pointer",color:isCur?tolc.color:a?"var(--white)":"var(--muted)",fontSize:11,fontWeight:isCur?700:400}}>
                    {i+1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  VIEW: FLASHCARD
  // ════════════════════════════════════════════════════════════
  if (view==="flashcard") {
    if (!fcTopics.length) return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,position:"relative",zIndex:1}}>
        <p style={{color:"var(--gray)"}}>Nessuna flashcard disponibile.</p>
        <button className="btn-astra" onClick={()=>go("dashboard")} style={{...primaryBtn()}}>← Indietro</button>
      </div>
    );
    return (
      <div style={{minHeight:"100vh",position:"relative",zIndex:1}}>
        <nav style={nav}>
          <button style={backBtn} onClick={()=>go("dashboard")}>← Dashboard</button>
          <AstraLogo/>
          <div style={{flex:1}}/>
          <Badge color={tolc.color}>{tolc.key} — Flashcard</Badge>
        </nav>
        <div style={{maxWidth:680,margin:"0 auto",padding:"36px 20px 80px"}}>
          {/* Topic tabs */}
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:28}}>
            {fcTopics.map((tp,i)=>(
              <button key={i} className="tab-astra" onClick={()=>setFc({ti:i,ci:0,flipped:false})}
                style={{flexShrink:0,borderColor:fc.ti===i?`${tolc.color}40`:"transparent"}}>{tp.topic}</button>
            ))}
          </div>

          <p style={{textAlign:"center",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:"var(--gray)",fontSize:15,marginBottom:20}}>
            Carta <span style={{color:tolc.color,fontWeight:600}}>{fc.ci+1}</span> di {curTopic.cards.length} — clicca per rivelare
          </p>

          {/* Flip card */}
          <div className="flip-card" onClick={flipCard} style={{minHeight:240}}>
            <div className={`flip-inner${fc.flipped?" flipped":""}`}>
              <div className="flip-front">
                <div style={{...card({borderColor:`${tolc.color}20`}),padding:"44px 36px",minHeight:240,display:"flex",flexDirection:"column",justifyContent:"center",gap:16}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:12,color:tolc.color,letterSpacing:"1px"}}>Domanda</span>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"var(--white)",lineHeight:1.4,margin:0}}>{curCard.f}</p>
                  <span style={{fontSize:11,color:"var(--muted)",marginTop:"auto"}}>Tocca per vedere la risposta →</span>
                </div>
              </div>
              <div className="flip-back">
                <div style={{...card({background:`${tolc.color}08`,borderColor:`${tolc.color}30`}),padding:"40px 36px",minHeight:240,display:"flex",flexDirection:"column",justifyContent:"center",gap:16}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:12,color:"#d4a84b",letterSpacing:"1px"}}>Risposta</span>
                  <p style={{fontSize:14,color:"var(--white)",lineHeight:1.9,margin:0}}>{curCard.b}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots + arrows */}
          <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:24,alignItems:"center"}}>
            <button className="btn-astra" onClick={e=>{e.stopPropagation();prevCard();}}
              style={{...card(),width:40,height:40,borderRadius:"50%",padding:0,cursor:"pointer",color:"var(--gray)",fontSize:18}}>←</button>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              {curTopic.cards.map((_,i)=>(
                <div key={i} onClick={()=>setFc(s=>({...s,ci:i,flipped:false}))}
                  style={{width:fc.ci===i?22:7,height:7,borderRadius:4,background:fc.ci===i?tolc.color:"rgba(255,255,255,.1)",cursor:"pointer",transition:"width .2s"}}/>
              ))}
            </div>
            <button className="btn-astra" onClick={e=>{e.stopPropagation();nextCard();}}
              style={{...card({background:`${tolc.color}0e`,borderColor:`${tolc.color}30`}),width:40,height:40,borderRadius:"50%",padding:0,cursor:"pointer",color:tolc.color,fontSize:18}}>→</button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  VIEW: STUDY MAP
  // ════════════════════════════════════════════════════════════
  if (view==="studymap") return (
    <div style={{minHeight:"100vh",position:"relative",zIndex:1}}>
      <nav style={nav}>
        <button style={backBtn} onClick={()=>go("dashboard")}>← Dashboard</button>
        <AstraLogo/>
        <div style={{flex:1}}/>
        <Badge color={tolc.color}>{tolc.key} — Mappa di Studio</Badge>
      </nav>
      <div style={{maxWidth:840,margin:"0 auto",padding:"36px 20px 80px"}}>
        <SectionLabel>Syllabus ufficiale CISIA</SectionLabel>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,margin:"6px 0 8px",color:"var(--white)"}}>Mappa completa degli argomenti</h2>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:28,lineHeight:1.7}}>
          Copre tutti gli argomenti del syllabus ufficiale CISIA. Per il programma completo visita{" "}
          <a href="https://www.cisiaonline.it" target="_blank" rel="noopener noreferrer" style={{color:"var(--blue-l)"}}>cisiaonline.it ↗</a>
        </p>

        {smap.map((area,i)=>(
          <div key={i} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:3,height:28,background:area.color,borderRadius:2}}/>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:area.color,margin:0}}>{area.area}</h3>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {area.topics.map((t,j)=>{
                const key=`${i}-${j}`;const open=!!mapOpen[key];
                return(
                  <div key={j} style={{...card(),overflow:"hidden"}}>
                    <button onClick={()=>setMapOpen(s=>({...s,[key]:!open}))}
                      style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"transparent",border:"none",cursor:"pointer",color:"var(--white)",textAlign:"left"}}>
                      <span style={{fontWeight:600,fontSize:14}}>{t.t}</span>
                      <span style={{color:area.color,fontSize:11,transition:"transform .2s",transform:open?"rotate(180deg)":"none"}}>▼</span>
                    </button>
                    {open && (
                      <div style={{padding:"4px 20px 16px",borderTop:"1px solid var(--border)"}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
                          {t.sub.map((s,k)=>(
                            <span key={k} style={{background:`${area.color}0a`,border:`1px solid ${area.color}18`,borderRadius:8,padding:"4px 12px",fontSize:12,color:"var(--gray)"}}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}
