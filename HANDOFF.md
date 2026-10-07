# HANDOFF — Sito Appetito (demo ristorante)

## Goal

Costruire un sito demo statico (HTML/CSS/JS puro, nessun framework) per un ristorante italiano generico chiamato "Appetito", con logo generico, palette scura ed elegante (oro antico/bronzo + bordeaux su base espresso), e via via arricchito su richiesta dell'utente con sezioni e micro-interazioni premium.

Percorso progetto: `C:\Users\Alessandro\OneDrive - FONDAZIONE I.T.S\Desktop\Siti\Demo_Ristoranti_2`

Link pubblicato (Artifact claude.ai, privato, ripubblicabile sullo stesso URL): **https://claude.ai/artifact/F1mVnT4TNTNv89kTxLFPiU** — versione 3 al momento di questo handoff.

## Struttura file

- `index.html` — homepage completa
- `menu.html` — menù a categorie (antipasti/primi/secondi/dolci/bevande), tab di navigazione, resta a **superficie chiara** ("carta del menù") tramite classe `.on-light` mentre il resto del sito è scuro
- `chi-siamo.html` — storia, valori, timeline, team, mappa, CTA finale
- `galleria.html` — griglia foto con filtri categoria + lightbox
- `css/style.css` — unico foglio di stile, design system a token CSS
- `js/script.js` — tutta la logica JS (vanilla, IIFE unico)
- `images/hero-dining.jpg` — foto hero reale (735×490px, fornita dall'utente)
- `.claude/launch.json` — config per `preview_start` (usa `npx serve . -l 5173`)

## Stato attuale — cosa è stato fatto

1. **Sito base**: header con logo+nav (Menù, Catering, Scopri di noi, Galleria, FAQ) + CTA Contattaci, hero, sezione CTA menù, piatti scorrevoli, catering, form prenotazione, mappa, statistiche, recensioni, FAQ, footer. Tre pagine interne collegate.
2. **Font**: Cormorant Garamond (titoli) + Jost (corpo/nav), niente Inter/Manrope.
3. **Palette scura elegante**: rifatta da zero. Il sito è a **base scura di default** (`--color-bg` = `--color-ink-900`, `body` e `h1-h4` di default hanno testo chiaro `--color-text-on-dark`). Le **card chiare** (dish-card, faq-item, review-card, value-card, reserve-form-card, menu-tab) hanno override espliciti per riportare il testo scuro (`--color-ink-900`) — vedi sotto "Pattern critico da rispettare".
4. **Animazioni**: reveal-down sugli h2 (IntersectionObserver, classe `.reveal-down`/`.is-in`, aggiunta solo via JS così senza JS i titoli restano visibili), effetto "liquido" radiale oro→bordeaux su tutti i `.btn` all'hover (pseudo-elemento `::before`), card piatti con bordo che si illumina + frecce overlay rotonde, mazzo recensioni cliccabile che cicla in loop (7 card).
5. **Sezione statistiche**: 3 box (recensioni, media, anni esperienza) con hover glow.
6. **Mappa**: iframe Google Maps embed (leggero, nessuna libreria) su `index.html` e `chi-siamo.html`, con indirizzo fittizio "Via Roma 12, Roma, Italia" e link "Apri in Google Maps".
7. **Immagine hero**: sostituita due volte su richiesta utente; l'attuale è 735×490px (migliorata ma non altissima risoluzione) con filtro SVG di sharpening + contrast/saturate via CSS.

## Pattern critico da rispettare (IMPORTANTE per modifiche future)

Il sito ha un'architettura "dark-first" non banale:
- Default globale: sfondo scuro, testo chiaro (`body{color:var(--color-text-on-dark)}`, `h1,h2,h3,h4{color:var(--color-text-on-dark)}`).
- `--color-text` (= ink-900, scuro) è usato **esplicitamente** ovunque serva testo scuro su una superficie chiara (card).
- Ogni componente con `background: var(--color-surface)` (chiaro) **deve** avere un override esplicito di colore per sé e per i suoi h3/h4 interni, perché i tag h1-h4 hanno una regola propria che vince sempre sull'ereditarietà del genitore. Esempio già applicato: `.dish-card h3{color:var(--color-ink-900)}`, `.value-card{color:var(--color-ink-900)} .value-card h3{color:var(--color-ink-900)}`, `.reserve-form-card{color:...} h3{color:...}`, `.review-card{color:var(--color-ink-900)}`.
- **Se aggiungi una nuova card/sezione chiara, ricordati sempre questo doppio override** (blanket color sul contenitore + h-tag esplicito), altrimenti il testo sarà chiaro-su-chiaro e invisibile.
- La sezione menù (`menu.html`, contenuto voci di menù) usa la classe utility `.on-light` per restare chiara mentre il resto del sito è scuro — pattern riutilizzabile per altre sezioni che devono restare chiare.

## What Worked

- Pubblicare come Artifact multi-file (file_path = versione di `index.html` senza tag `<!doctype>/<html>/<head>/<body>` + `files` map per css/js/immagini/altre pagine html complete) — funziona bene, ripubblicare sullo stesso `url` aggiorna il link.
- Usare `<details>/<summary>` nativi per l'accordion FAQ: zero JS per il toggle, accessibile di default.
- Verificare i contrasti colore via `getComputedStyle` in JS (più affidabile degli screenshot in questo ambiente, vedi sotto).
- Effetto liquido bottoni: pseudo-elemento radiale con stop-gradiente compressi entro il raggio effettivamente visibile del bottone (il cerchio è più grande del bottone stesso, quindi i colori esterni del gradiente vengono ritagliati/non si vedono se non li si comprime).

## What Didn't Work / Limitazioni note dell'ambiente di test

**Il pannello Browser di anteprima in questa sessione ha bug/limitazioni ricorrenti che NON sono bug del sito:**
- `window.scrollTo({behavior:'smooth'})` spesso non anima affatto in questo ambiente headless.
- `requestAnimationFrame` risulta throttlato/mai eseguito quando il pannello non è in primo piano ("fronted").
- `IntersectionObserver` a volte non spara mai i callback anche con l'elemento chiaramente in viewport (verificato con test isolato).
- Le transizioni CSS talvolta non completano/non si riflettono in `getComputedStyle` subito dopo l'aggiunta di una classe.
- Screenshot a scroll ≠ 0 spesso tornano vuoti o con l'header "fixed" mal posizionato/duplicato — sembra un problema di compositing del pannello, non del CSS (verificato che gli screenshot a scroll 0 sono sempre corretti).
- **Conclusione pratica**: per verificare feature scroll/animation-dipendenti, usare check di stato via `javascript_exec` (classi, computed style, click diretti sugli elementi) invece di fidarsi di screenshot a metà pagina o di attendere che animazioni "si vedano".
- **La mappa Google Maps (iframe) risulta bianca/vuota nell'anteprima Artifact di claude.ai** per via della Content-Security-Policy del visualizzatore Artifact che blocca iframe verso domini esterni non in whitelist. Funzionerà correttamente su un hosting reale (fuori da claude.ai). Va comunicato chiaramente all'utente ogni volta che si ripubblica.
- Il file server locale (`npx serve . -l 5173`) può servire risposte cache stale per `script.js`/`style.css` tra una modifica e l'altra nello stesso browser tab — se un cambiamento CSS/JS non sembra applicarsi, ricaricare con `fetch(url,{cache:'no-store'})` per verificare cosa il server sta davvero servendo prima di sospettare un bug nel codice.
- L'utente ha avuto difficoltà ad aprire il link Artifact da solo ("non me lo apre", causa non chiarita — non ha risposto alla domanda di chiarimento). Soluzione adottata: aprire il sito direttamente nel pannello Browser di Claude Code per farglielo vedere. Se ricapita, chiedere subito uno screenshot dell'errore o il browser/dispositivo usato, invece di riproporre la domanda a scelta multipla (l'utente l'ha scartata la prima volta).
- Attenzione: quando l'utente allega un'immagine in chat, il file non è automaticamente accessibile su disco. Va cercato nella cartella Downloads dell'utente (`$env:USERPROFILE\Downloads`) ordinando per data di modifica decrescente, e va sempre **verificato leggendolo con il tool Read prima di usarlo** (il nome del file può essere fuorviante, es. un file chiamato "Romantic limousine package..." conteneva in realtà la foto del tavolo del ristorante).

## Sessione 2026-09-17 — animazioni hero, recensioni, FAQ, cursore

1. **Hero premium**: scrim scurito (doppio gradiente lineare+radiale), testo con text-shadow, parola in corsivo `<em>` con gradiente oro-bordeaux via `background-clip:text`. **Attenzione**: la prima versione usava `var(--color-terracotta-400)` che non esiste nel design system (solo 500/600 sono definiti) — una singola custom property non risolta invalida l'intera dichiarazione `background` shorthand, rendendo il testo invisibile (color:transparent senza fallback). Controllare sempre che le variabili CSS usate esistano davvero in `:root` prima di usarle in `background`/`gradient`.
2. **Hero intro "impilamento piatti"**: nuovo blocco `.hero-intro` (overlay `.hero-media`/`.hero-scrim`, z-index 5) con 4 `.hero-intro-plate` che si impilano in ~1.2s (animation-delay scaglionati 0/.2/.4/.6s), poi l'overlay scorre via verso l'alto (`translateY(-100%)`) rivelando l'hero; `.hero-content` parte da `opacity:0/translateY(46px)` e sale in scena con `animation-delay:1.15s`. Tutto in puro CSS (nessun JS/IntersectionObserver), per evitare i bug noti del pannello di anteprima su rAF/IO. Disattivato interamente sotto `prefers-reduced-motion: reduce`.
3. **Recensioni più leggibili**: le card impilate dietro quella in primo piano ora hanno opacità 0.92/0.68 (prima 0.75/0.45) e offset maggiore, così si vede chiaramente che ce ne sono altre. `.review-hint` è ora un badge con bordo/sfondo dorato e icona animata (freccina che "pulsa"), non più testo piccolo appena leggibile. Aggiunta un'icona posate (`#icon-utensils`) in trasparenza (opacity .1) ai lati del mazzo, visibile solo da 1200px in su (`.reviews-decor`).
4. **FAQ hover glow**: la domanda (`.faq-question`) ora cambia colore e prende un `text-shadow` dorato diffuso su hover/focus/apertura, non solo il bordo della card come prima.
5. **Frecce scroller piatti ferme in hover**: `.dish-arrow:hover`/`:focus-visible` forza `transform:translateY(-50%)`, annullando lo `scale(1.06)` ereditato da `.btn-icon:hover` (restava solo il cambio colore).
6. **Cursor glow**: nuovo elemento `.cursor-glow` creato via JS (`js/script.js`, in coda) e iniettato in tutte le pagine (è in `script.js`, condiviso), radiale oro molto leggero (~10% opacità) che segue il mouse con `requestAnimationFrame` throttling. Disattivo su touch/coarse pointer e con `prefers-reduced-motion: reduce`.
7. **Verificato** in browser locale (`npx serve . -l 5174` — la 5173 era occupata da un'altra sessione, cambiata anche in `.claude/launch.json`): animazione hero, gradiente testo, stack recensioni via `getComputedStyle`, regole CSS FAQ/frecce verificate leggendo `document.styleSheets` (il pannello di anteprima ha lo stesso bug noto di screenshot vuoti a scroll≠0 e `getBoundingClientRect` che non aggiorna dopo scroll — verificare sempre via computed style/cssRules, mai fidarsi di screenshot a metà pagina).

## Sessione 2026-09-17 (parte 2) — foto piatti reali, cursore, recensioni

**Le immagini incollate direttamente in chat non sono leggibili da disco in questo ambiente** (verificato a fondo: nessuna copia in `%TEMP%\claude\...`, `%APPDATA%\Claude\scratch-workspaces`, `claude-code-sessions`, `Downloads`, ecc. — l'app evidentemente le invia come blocchi immagine nella richiesta API senza scriverle su disco). Soluzione adottata: ho chiesto all'utente di salvarle a mano in una cartella con nomi precisi, poi le ho trovate come screenshot in `Foto demo\` (nomi tipo `Screenshot 2026-09-17 100900.png`) e le ho identificate una per una leggendole col tool Read, rinominandole/copiandole in `images/dishes/*.png` con nomi descrittivi. **Ricorda questo pattern se ricapita**: non dare per scontato che un'immagine incollata in chat sia salvata da qualche parte accessibile — chiedere subito all'utente di salvarla a mano con un nome noto, verificare poi con `Get-ChildItem` filtrando per data recente in tutto il profilo utente (Desktop/Downloads/cartelle progetto), non solo nelle cartelle temp di Claude.

1. **14 foto piatti reali aggiunte** in `images/dishes/` (burrata-pomodorini, fusilli-pomodoro, gnocchi-pomodorini, insalata-caesar, insalata-mela-capra, insalata-pomodoro, linguine-vongole, macedonia, paccheri-pomodoro, pasta-pesto, ravioli-pomodoro, rigatoni-guanciale, tiramisu, torta-piccola — tutte `.png`, non `.jpg`, perché sono screenshot).
2. **Meccanismo di innesto foto**: nuova regola CSS `.ph img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }` — funziona su qualunque contenitore `.ph` esistente (dish-card, menu-item, menu-cta-media) senza toccarne le dimensioni/aspect-ratio, che restano quelle già definite altrove (es. `.menu-item .ph` è fisso 96×96px, `.dish-card .ph` è aspect-ratio 1/1). Per usare una foto reale: sostituire il contenuto del div `.ph` con `<img src="images/dishes/xxx.png" alt="..." loading="lazy">`, **senza** gli span `.ph-icon`/`.ph-label` del placeholder.
3. **Solo 4 foto combaciavano esattamente** con piatti già a menù (Pacchero alla Norma, Linguine allo Scoglio, Tiramisù, e Burrata assegnata a "Bruschette della Casa" come nuovo piatto separato). Per le altre 10, invece di forzare un abbinamento sbagliato (es. insalata Caesar su "Pollo alla Cacciatora" — visivamente incoerente), **ho aggiunto nuovi piatti nel menù** che descrivono fedelmente ciò che si vede nella foto (es. "Spinaci, Mela e Caprino", "Rigatoni al Guanciale", "Trofie al Pesto", "Macedonia di Frutta Fresca", ecc.) in `menu.html`, nelle categorie Antipasti/Primi/Dolci. Risotto allo Zafferano, Tagliata al Rosmarino, secondi di carne/pesce e bevande restano placeholder: nessuna foto fornita corrispondeva.
4. **Home page**: le 6 dish-card usano ora foto reali dove disponibili (Pacchero, Linguine Scoglio, Conchigliette≈gnocchi-pomodorini, Tiramisù); Risotto e Tagliata restano placeholder. Il box `.menu-cta-media` ("La nostra cucina") ora mostra `pasta-pesto.png`.
5. **Cursor glow ridotto**: da 380px a 130px di diametro (l'utente lo trovava troppo grande).
6. **`.review-hint` centrato verticalmente**: passato da `inline-flex` (che con `margin:auto` non si centra mai, essendo inline) a `display:flex; width:fit-content; margin-inline:auto`, centratura orizzontale verificata via `getBoundingClientRect` (gap sinistra/destra identico).
7. **Grafiche laterali recensioni potenziate**: icona posate da opacity 0.1→0.16, da 240px→280/320px, breakpoint abbassato da 1200px a 1024px (prima non si vedeva quasi mai sugli schermi tipici).
8. **Bug del pannello di anteprima incontrato di nuovo**: subito dopo `navigate`, `window.innerWidth`/`innerHeight` possono risultare `0` e tutti i layout percentuali/flex collassano a 0×0 nei controlli via `getBoundingClientRect` — non è un bug del sito. Basta un `computer{action:"screenshot"}` (anche se poi non serve il risultato) per "risvegliare" il rendering del pannello e far tornare le misure corrette. Aggiunto ai problemi noti della sezione precedente.

## Sessione 2026-09-17 (parte 3) — nav, altre 13 foto, font titoli, mappa

1. **Nav riordinata** in tutte e 4 le pagine (desktop + mobile): ora è Menù, Scopri di noi, Galleria, Catering, FAQ (prima Catering era subito dopo Menù).
2. **13 nuove foto** (interni, cena romantica, chef in azione, piatti di carne/pesce) trovate in `Foto demo\` (stavolta erano download reali, non screenshot) e copiate in `images/gallery/*.jpg` con nomi descrittivi. Distribuite tra galleria (9 slot sostituiti/aggiunti, categorie sala/piatti/eventi), home (catering-collage ph--1/ph--3, dish-card Tagliata), chi-siamo (foto chef in `about-hero-grid`) e menu.html (foto Tagliata + 3 nuovi piatti: Filetto al Vino Rosso, Costolette di Agnello, Gamberi Scottati, per usare foto senza forzare abbinamenti sbagliati — stesso approccio della sessione precedente).
3. **Lightbox della galleria riscritto**: prima leggeva `.ph-label` per la didascalia e non mostrava alcuna immagine reale (solo l'icona placeholder). Ora l'elemento nel markup del lightbox è `<img data-lightbox-img>` e `script.js` (`renderLightbox`) copia `src`/`alt` dalla foto cliccata e usa il testo di `.gallery-item-overlay` come didascalia. **Se in futuro si aggiungono gallery-item, verificare che abbiano sempre un `<img>` dentro `.ph` e uno `.gallery-item-overlay` con testo**, altrimenti il lightbox si rompe.
4. **Titoli in corsivo serif**: `h1,h2,h3,h4{font-style:italic}` globale — richiesto import Google Fonts aggiornato con i pesi italic `1,700` (prima mancava, c'erano solo `1,500;1,600`) in tutte e 4 le pagine, altrimenti il browser avrebbe fatto un fake-italic bruttino sui pesi 700 mancanti. Le animazioni reveal-down restano intatte (agiscono solo su opacity/transform, mai su font-style).
5. **Date della timeline** (`chi-siamo.html`) ingrandite: cerchio da 56px→68px, font-size da 0.85rem→1.2rem (altrimenti "Oggi" avrebbe sforato il cerchio).
6. **Mappa "non compare" in home — causa reale trovata**: non era un bug del sito, ma la Content-Security-Policy del visualizzatore Artifact di claude.ai che blocca gli iframe verso domini esterni (Google Maps incluso) — comportamento già noto e documentato sopra, ma capita che l'utente lo scambi per un bug. **Soluzione definitiva applicata**: sostituito l'`<iframe>` in `index.html` e `chi-siamo.html` con una card statica cliccabile (`.map-frame` ora è un `<a>`, non contiene più iframe) che apre Google Maps in una nuova scheda — funziona identica sia nell'Artifact sia su hosting reale, elimina il problema alla radice invece di limitarsi a documentarlo. Se l'utente vuole una mappa realmente interattiva embedded, servirà hosting reale fuori da claude.ai (l'iframe lì funzionerebbe) oppure un embed via link `<img>` statico di Static Maps API (richiede API key Google, a pagamento oltre soglia gratuita).
7. **Bug sweep eseguito**: verificato nessuna variabile CSS `var(--color-*)` non definita in `:root` (il bug precedente con `--color-terracotta-400` era isolato), nessun `id` duplicato in nessuna delle 4 pagine, nessun riferimento a `images/...` rotto (tutti i file esistono su disco), nessun residuo `role="img" aria-label` orfano lasciato da conversioni placeholder→foto reale.

## Consigli sicurezza / privacy / cookie (informativi, non ancora implementati)

L'utente non è esperto in materia — ha chiesto cosa serve implementare. Punti chiave da comunicare quando richiesto, **non ancora implementati nel sito**:
- **Cookie banner GDPR**: il sito attualmente non usa cookie/tracker propri (niente Google Analytics, niente pixel), ma **Google Fonts** viene caricato da `fonts.googleapis.com`/`fonts.gstatic.com` (in tutte le pagine) e questo di per sé trasmette l'IP del visitatore a Google — in Italia il Garante Privacy lo considera un trasferimento dati che richiede quantomeno un'informativa, idealmente self-hosting dei font per evitarlo del tutto. Se in futuro si aggiunge Analytics/Meta Pixel/ecc., serve un vero cookie banner con consenso opt-in prima del caricamento.
- **Privacy policy**: obbligatoria per legge se si raccolgono dati personali — e il form di prenotazione (`#reserve-form`) raccoglie nome, telefono, email: serve una pagina "Privacy Policy" linkata dal footer/form, anche minimale.
- **Form di prenotazione**: **attenzione — è finto**, non invia dati da nessuna parte (`setTimeout` + reset, vedi `js/script.js`). Se diventa reale, il backend che riceve questi dati deve gestirli in modo sicuro (HTTPS obbligatorio, no invio in chiaro, conservazione limitata nel tempo, informativa esplicita accanto al campo).
- **HTTPS**: qualunque hosting reale usato deve avere certificato SSL attivo (quasi tutti gli hosting moderni lo includono gratis, es. Let's Encrypt).
- **Nessuna vulnerabilità XSS/injection nota**: il sito è statico, senza backend proprio, quindi la superficie d'attacco è minima finché il form resta finto.

## Sessione 2026-09-17 (parte 4) — bug reale nei filtri della galleria

L'utente segnalava "i pulsanti delle categorie non sono cliccabili" in `galleria.html`. **Il click handler in JS funzionava correttamente** (verificato con click reali via `computer` tool, non solo `.click()` sintetico: `aria-pressed` cambiava e la griglia si filtrava). Il bug vero era **visivo**: `.menu-tab[aria-selected="true"]` — lo stile "attivo" condiviso con le tab di `menu.html` — mette uno sfondo quasi nero (`--color-ink-900`). Su `menu.html` funziona perché quella sezione è `.on-light` (sfondo chiaro): il pulsante scuro spicca. Ma `galleria.html` NON ha `.on-light` (resta scura di default, come il resto del sito) e i filtri usano `aria-pressed` non `aria-selected` — quindi (a) lo stile attivo non veniva nemmeno applicato (mismatch aria-pressed/aria-selected) e (b) anche aggiungendolo, lo sfondo scuro-su-scuro sarebbe stato invisibile, dando l'impressione che il click non facesse nulla.

**Fix applicato**: aggiunta la regola `.menu-tab[aria-pressed="true"]` (oltre a `aria-selected`) per coerenza generale, **più** un override scoped `.gallery-filters .menu-tab` con stile pensato per sezioni scure — pillola trasparente con bordo chiaro di default, pillola piena color oro (`--color-ochre-500`) con testo scuro quando attiva: alto contrasto, ben visibile. **Pattern da ricordare**: componenti condivisi (`.menu-tab`) che vengono riusati in contesti chiari E scuri vanno sempre verificati in entrambi, non solo dove sono stati creati la prima volta.

Aggiunta anche una 4ª foto alla categoria "eventi" (`chef-dettaglio-piatto.jpg`, già presente su disco ma non ancora usata in galleria) così tutte e 3 le categorie hanno almeno 4 foto (sala=4, piatti=5, eventi=4). Rimossa anche una frase di copy dimenticata nell'hero della pagina ("Le foto qui sotto sono placeholder...") ormai non più vera.

## Sessione 2026-09-30 — rebrand a "trattoria", nuova foto hero, più foto galleria/team

1. **Rebrand "ristorante" → "trattoria"**: sostituite tutte le occorrenze visibili nel sito (title/meta di `index.html`, eyebrow hero, testi FAQ/footer/chi-siamo, alt/aria-label delle foto galleria). "Cucina italiana" è rimasto invariato (si riferisce alla cucina, non al tipo di locale). Verificato con grep case-insensitive che non resti nessun residuo in html/css/js.
2. **Foto hero sostituita**: l'utente ha fornito `Nuove foto\Foto Hero.png` (6.5MB, 2835×3544, con grandi bordi neri attorno alla foto vera). Ho rilevato il bounding box del contenuto reale via script PowerShell/System.Drawing (soglia luminosità sui pixel), ritagliato, ridimensionato a 1800px di larghezza e ricompresso in JPEG qualità 85 → `images/hero-trattoria.jpg` (1800×1806, ~400KB). **Pattern riutilizzabile**: quando un utente fornisce un'immagine con bordi neri/letterbox (es. esportata da un tool AI con canvas fisso), usare `System.Drawing.Bitmap.GetPixel` su una griglia campionata per trovare i limiti del contenuto non-nero prima di ritagliare — non assumere che l'immagine fornita sia già pronta all'uso.
3. **10 nuove foto aggiunte**: 2 foto di chef (ritratti in divisa, sfondo studio/cucina) usate per i primi due membri del team in `chi-siamo.html` (Executive Chef, Sous Chef — Maître di Sala e Pastry Chef restano placeholder, nessuna foto fornita per quelli). Le altre 8 (interni con volte in mattoni, dehor con lanterne/fiori/peperoncini, tavoli con pasta/pizza) aggiunte come nuovi elementi in `galleria.html` (categorie sala/piatti), portando i totali a sala=10, piatti=7, eventi=4.
4. **Verificato** che tutte le nuove immagini caricano correttamente (nessun 404/broken image) via `naturalWidth`/`complete` su tutte le pagine coinvolte.

## Sessione 2026-09-30 (parte 2) — "perché è così lento?"

L'utente ha segnalato lentezza generale. Due cause reali trovate e corrette:

1. **Filtro SVG costoso sull'hero — causa principale**: `.hero-media img` aveva `filter: url(#hero-sharpen) ...` con un `<feConvolveMatrix>` (convoluzione 3×3 calcolata pixel-per-pixel), introdotto quando la foto hero era piccola/sfocata (735×490). Con la sostituzione della foto hero in questa stessa sessione precedente (ora 1800×1806, già nitida), quel filtro è rimasto ma ora deve ricalcolare la convoluzione su ~6 volte più pixel ad ogni repaint/scroll — pesante per la CPU/GPU, specialmente durante le animazioni dell'hero (impilamento piatti + reveal). **Rimosso interamente** (sia la regola CSS sia il `<filter id="hero-sharpen">` nell'SVG sprite di `index.html`, ormai inutilizzato), lasciando solo `contrast/saturate/brightness` (filtri CSS nativi, economici, gestiti in GPU). **Pattern da ricordare**: ogni volta che si sostituisce un'immagine con una versione a risoluzione più alta, ricontrollare se ci sono filtri CSS pesanti (`feConvolveMatrix`, `feGaussianBlur` con raggio grande, ecc.) calibrati sulla vecchia immagine — il costo di questi filtri scala con il numero di pixel.
2. **Peso immagini eccessivo**: le 14 foto piatti in `images/dishes/` erano salvate come **PNG** (screenshot dell'utente) invece di JPEG — un formato lossless è molto inefficiente per foto reali. Convertite tutte in JPEG qualità 82 via script PowerShell/System.Drawing: **2.81MB → 249KB** (-91%), aggiornati tutti i riferimenti `.png`→`.jpg` in `index.html`, `menu.html`, `galleria.html` (22 occorrenze). Il peso totale immagini del sito è sceso da ~5.8MB a ~3.3MB.

**Nota per l'utente**: se il sito sembra lento anche ora, ricordare che il link è un Artifact di claude.ai in anteprima — quell'ambiente ha sempre un overhead di caricamento maggiore di un hosting reale (vedi limitazioni note più sopra). Su hosting reale con questi fix dovrebbe essere nettamente più scattante.

## Sessione 2026-09-30 (parte 3) — bug reale nei filtri galleria + audit sito completo

**Trovato il vero bug dei filtri galleria** (l'utente aveva ragione, non era un problema di percezione come temuto in precedenza): `.gallery-item { display: block; ... }` in `css/style.css` ha la **stessa specificità** (0,1,0, una classe) della regola nativa del browser `[hidden] { display: none }`. Quando lo JS faceva `item.hidden = true`, l'attributo `hidden` veniva impostato correttamente nel DOM, ma **visivamente non succedeva nulla**: a parità di specificità vince sempre il foglio di stile dell'autore (il nostro) su quello dello user-agent (del browser), quindi `display:block` restava applicato e l'elemento restava visibile. **Fix**: aggiunta la regola esplicita `.gallery-item[hidden] { display: none; }` subito dopo. Verificato con click reale (non sintetico) che ora il filtro "Sala" mostra solo le 10 foto di categoria sala, non tutte e 21.

**Pattern da ricordare per il futuro**: ogni volta che si nasconde un elemento via `elemento.hidden = true` in JS, controllare che non esista nel CSS una regola con `display` sulla stessa classe a parità o maggiore specificità — altrimenti l'attributo `hidden` viene silenziosamente ignorato. Cercare `grep ".hidden\s*="` nel JS e incrociare con le regole CSS della classe interessata è il modo più veloce per trovarlo. In questo progetto era l'unico punto che usava `.hidden` via JS, quindi il bug era isolato lì.

**Audit completo eseguito** (bug sweep + performance, come richiesto):
- Nessun errore in console su nessuna delle 4 pagine.
- Nessun link/ancora interno o cross-pagina rotto (controllato con script che incrocia ogni `href="#id"` e `href="pagina.html#id"` con gli `id` realmente presenti).
- Nessun `<img>` senza `alt`.
- Tutte le immagini di tutte le pagine caricano correttamente (nessun 404/broken, verificato via `naturalWidth`/`complete`).
- CSS 52KB, JS 16KB non compressi — trascurabili rispetto al peso delle immagini, non serve ottimizzarli ulteriormente.
- Galleria (pagina più pesante): 21 foto ≈ 2.1MB totali, tutte lazy-load tranne quelle sopra la piega — accettabile per una pagina-galleria, il browser le carica solo man mano che si scrolla.
- `images/hero-dining.jpg` (la vecchia foto hero, ora sostituita) non è più referenziata da nessuna pagina — file morto ma innocuo (nessuna pagina lo richiede più, non pesa sul caricamento).

**Riempito il riquadro vuoto** nella sezione "Il catering di Appetito" (era `.ph.ph--2`, l'unico placeholder rimasto lì) con `images/gallery/pasta-tavola.jpg`, già disponibile e riutilizzata (mostra più piatti assieme, adatta a un "buffet di catering allestito").

## Next Steps / cose ancora aperte

1. **Foto hero**: l'utente potrebbe fornire una versione a risoluzione ancora più alta della stessa foto (idealmente ≥1600px di larghezza) per eliminare del tutto la leggera morbidezza residua.
2. **Foto piatti/catering/team**: sono ancora tutti placeholder (box con icona "immagine" e pattern). L'utente ha detto che manderà le foto reali quando le ha — sostituire in `dish-card .ph`, `catering-collage .ph--1/2/3`, `team-card .ph`, `galleria.html` quando arrivano.
3. **Indirizzo reale**: l'indirizzo usato ovunque (header prenotazione, footer, mappa) è fittizio "Via Roma 12, 00100 Città" — da sostituire con l'indirizzo vero se l'utente lo fornisce, aggiornando sia il testo sia l'URL dell'iframe Google Maps e il link "Apri in Google Maps" in `index.html` e `chi-siamo.html`.
4. Non ancora verificato in un vero browser (solo nel pannello Claude Code) l'effetto reveal-down dei titoli e il timing esatto dell'effetto liquido — probabile che siano corretti (logica CSS/JS standard) ma vale la pena un controllo visivo rapido da parte dell'utente in Chrome/Edge reali.
5. Se l'utente chiede ulteriori modifiche, ricordarsi di **rigenerare la copia in scratchpad** (versione di `index.html` senza doctype/html/head/body) e ripubblicare con `Artifact` passando `url` (non un nuovo file) per mantenere lo stesso link. Il percorso scratchpad usato finora: `C:\Users\ALESSA~1\AppData\Local\Temp\claude\...\scratchpad\appetito-index.html` (il GUID di sessione cambia ad ogni nuova conversazione, quindi va ricreato da zero copiando il contenuto aggiornato di `index.html`).
