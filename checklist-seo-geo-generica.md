# Checklist SEO + GEO — Sito Web (versione generica)

> Checklist di riferimento, valida per qualsiasi attività locale/business.
> Contiene la parte SEO classica aggiornata e la parte GEO (ottimizzazione
> per le ricerche fatte tramite AI). Da personalizzare con keyword, settore
> e dati specifici del cliente quando il progetto verrà avviato.

---

## ⚠️ Errori comuni da evitare

- **Densità keyword (1-2%)**: metrica superata, Google non la usa più come
  fattore diretto. Scrivere in modo naturale conta più che contare le
  ripetizioni della keyword.
- **Keyword nel nome dell'attività su Google Business Profile**: pratica che
  viola le linee guida di Google (keyword stuffing nel nome) e può causare
  la sospensione della scheda. Usare SOLO il nome commerciale reale; le
  keyword vanno nella descrizione e nei servizi, non nel nome.
- **"Schema Markup: quando appropriato"**: indicazione troppo generica —
  vedi sezione GEO sotto per i tipi specifici da usare in base al business.
- **Backlinks/link building**: utile in teoria, ma per un sito nuovo di una
  singola attività locale è la voce con priorità più bassa nei primi mesi.
  Meglio concentrare le energie su Google Business Profile e recensioni,
  che pesano di più per un business locale.

---

## ✅ SEO On-Page

- Title tag con keyword principale, preferibilmente all'inizio
- Meta description con keyword, 150-160 caratteri
- Un solo H1 per pagina, con keyword principale
- Keyword nelle prime 100 parole del testo
- Almeno 3 H2, con la keyword in almeno uno
- Contenuto reale e utile, non solo riempitivo (600-800 parole per pagina è
  un buon riferimento, ma la qualità conta più della lunghezza)
- Paragrafi brevi (max 4 righe) per leggibilità mobile
- Alt text descrittivo su ogni immagine, con keyword quando pertinente
- Nomi file immagine descrittivi (es. `servizio-citta.jpg`, non `IMG_2341.jpg`)
- Immagini compresse per velocità di caricamento
- 2-3 link interni tra le sezioni del sito con anchor text descrittivi

---

## 📍 Local SEO / Google Business Profile

Nel 2026 la scheda Google Business Profile non serve solo per comparire
nella mappa: è anche la fonte principale da cui Google e le AI prendono i
dati per le risposte automatiche (AI Overviews). Una scheda incompleta
significa pochissimo materiale per farsi citare.

- NAP (Nome, Indirizzo, Telefono) identico ovunque compaia online (sito,
  Google, Facebook, Instagram, directory di settore) — anche una differenza
  minima nell'indirizzo confonde i sistemi
- Categoria principale corretta e specifica (non generica)
- Fino a 9 categorie secondarie pertinenti
- Descrizione completa dell'attività con keyword naturali
- Orari sempre aggiornati, incluse festività
- Almeno 10 foto reali (esterno, interno, lavori/prodotti, staff),
  **aggiornate almeno una volta al mese** — i profili "vivi" con contenuti
  recenti sono premiati rispetto a quelli statici
- Servizi/prodotti elencati con descrizione
- Messaggistica e sezione Domande & Risposte attive
- Post periodici su GBP (offerte, novità, eventi)
- **Recensioni**: contano di più la frequenza e la freschezza che il numero
  totale — un'attività con 50 recensioni recenti supera spesso una con 200
  vecchie e ferme. Rispondere a tutte entro 24-48 ore.

---

## 🤖 GEO — Ottimizzazione per le ricerche fatte tramite AI

Le AI (Google AI Overview, ChatGPT, Perplexity, Gemini) leggono il sito in
modo diverso da un utente: cercano risposte dirette ed estraibili, non
prosa da interpretare.

- **Dati strutturati Schema.org** da inserire nel codice (JSON-LD):
  - `LocalBusiness` (o tipo più specifico in base al settore) con nome,
    indirizzo, orari, telefono
  - `FAQPage` per la sezione domande frequenti
  - `Review` / `AggregateRating` per mostrare le recensioni in modo
    leggibile dalle macchine
  - `OpeningHoursSpecification` per gli orari
- **Sezione FAQ testuale e diretta**, con domande scritte come le farebbe
  davvero un cliente e risposte brevi e chiare nei primi 1-2 righe di ogni
  risposta
- **Informazioni chiave scritte in testo semplice**, non solo dentro
  immagini: prezzi indicativi, servizi/prodotti offerti, modalità di
  prenotazione/contatto, eventuali certificazioni — le AI non "vedono" bene
  il testo dentro le foto
- **Pagina "Chi siamo" con segnali di fiducia (E-E-A-T)**: esperienza,
  formazione, certificazioni pertinenti al settore — le AI danno più peso a
  contenuti che dimostrano competenza reale
- **Coerenza delle informazioni su tutto il web**: le AI spesso incrociano
  più fonti (sito, Google, social, directory) — dati discordanti riducono
  la fiducia nella risposta generata
- **File `llms.txt`**: da aggiungere a sito e contenuti definitivi (mappa
  riassuntiva delle pagine principali per i modelli AI) — utile ma da
  considerare un tocco finale a basso costo, non una priorità iniziale

---

## 🔎 Ricerca keyword — metodo generico

Da adattare al settore e alla città specifici quando il progetto parte:

- `[servizio] [città]` (es. "idraulico Milano", "parrucchiere Torino")
- `[servizio] vicino a me` (query "near me" — fondamentale per il local pack)
- `miglior [servizio] [città]`
- `quanto costa [servizio]` / `preventivo [servizio]`
- varianti per specializzazione/stile offerto (es. tipi di trattamento,
  categorie di prodotto, specializzazioni)
- `prenotazione [servizio] [città]`
- domande su sicurezza/qualità/certificazioni pertinenti al settore
- `[servizio] orari` / `[servizio] aperto la domenica`

Suggerimento: trasformare 4-5 di queste in vere domande FAQ sul sito (es.
"Quanto costa X?", "Che servizi offrite?", "Serve prenotazione?") — utile
sia per la SEO classica che per la GEO.

---

## 🛠 Controlli tecnici finali

- Mobile-friendly, velocità di caricamento sotto i 3 secondi
- HTTPS attivo
- URL con keyword quando possibile
- Sitemap.xml e robots.txt presenti
- Google Analytics con tracciamento eventi/conversioni (es. click sul form)
- Search Console collegata
- Accessibilità di base (contrasto colori, navigazione da tastiera, alt
  text su tutte le immagini) — oltre a essere corretto eticamente, è anche
  un segnale positivo per Google

---

## 📌 Priorità: cosa fare nella demo vs dopo l'accettazione del cliente

**Nella demo (struttura di base):**
HTML semantico, title/meta, H1 corretto, alt text, schema.org base
(LocalBusiness), sitemap, HTTPS, velocità/mobile-friendly.

**Dopo l'accettazione (contenuti definitivi):**
Ricerca keyword approfondita e mirata, FAQ complete, ottimizzazione GBP,
strategia recensioni, backlink, contenuti extra (blog/post), llms.txt.
