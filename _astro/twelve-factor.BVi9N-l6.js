import{c as a,r as o,m as n}from"./render-template.BSTUbHJp.js";import{u as r}from"./hoisted.GXsh7Kbe.js";import"./astro/assets-service.CWtZdUDo.js";const i=`<h1 id="la-metodologia-twelve-factor">La metodologia Twelve Factor</h1>
<p>Arriva quel momento in cui sei costretto a creare una serie di (micro)servizi, gestirli, deployarli e controllare che tutto funzioni.</p>
<p>Oppure non si parla di servizi ma uno o due applicativi su cui diversi sviluppatori lavorano e magari un sistemista dovrà deployare.</p>
<p>Mi sono imbatutto in questa metodologia di sviluppo software, che abbraccia anche la parte di deploy e monitoraggio del sistema che trovo efficace e vantaggiosa su piu fronti.</p>
<p>La metodologia di cui parlo è <a href="https://12factor.net/" rel="nofollow, noopener, noreferrer" target="_blank">https://12factor.net/</a>. Sul sito si può leggere il manifesto completo che loro hanno spiegato meglio di quello che posso fare io.</p>
<p>Io l’ho applicato su servizi Python, quindi gli esempi e i casi d’uso si riferiranno all’ambiente Python, ma essendo una metodologia può essere applicato a discapito del linguaggio.</p>
<h2 id="1-codebase">1. Codebase</h2>
<p>Per quanto mi riguarda si parla di git. Ma la regola fondamentale è sempre quella di versionare il codice</p>
<img src="https://c.tenor.com/KDuKCXhCrRYAAAAC/tenor.gif" alt="commit and run">
<h2 id="2-dependencies">2. Dependencies</h2>
<p>Riferendosi a Python le dipendenze possono essere definite nel <em>setup.py</em> oppure nel <em>requirements.txt</em>.
In questo modo utilizzando <em>pip</em> e il <em>virtualenv</em> è possibile ricreare lo stesso ambiente anche su macchine diverse senza aver il problema che le versioni delle librerie installate siano diverse.</p>
<p>Questo aiuta anche nel replicare un bug o un comportamento non atteso del software in un determinato commit o in un determinato rilascio</p>
<h2 id="3-config">3. Config</h2>
<p>Qui il campo è ampio a seconda della tecnologia che si usa.
Si può passare dai file <em>.ini</em> degli applicativi Windows , al <em>settings.py</em> di Django fino ai file <a href="https://create-react-app.dev/docs/adding-custom-environment-variables#what-other-env-files-can-be-used" rel="nofollow, noopener, noreferrer" target="_blank">env.*</a> di React.</p>
<p>Ultimamente la mia abitudine è quella di caricare la configurazione del servizio in formato <em>.json</em> su S3 e all’avvio dell’applicazione cercare la sua configurazione, parsarla con uno schema marshmallow e istanziare le varie classi (database, logging, redis, …).</p>
<p>Questo permette di avere una configurazione centrale che può essere usata da diversi sviluppatori senza passarsi file via chat o mail.</p>
<p>Inoltre permette di isolare le configurazioni tra dev, test e produzione con anche gli adeguati permessi per cui uno sviluppatore possa accedere a quella configurazione.</p>
<h2 id="4-backing-services">4. Backing services</h2>
<p>Questo punto dipende molto dall’organizzazione dell’azienda e dalla politica interna.</p>
<p>Di solito il database si tende a tenerlo su una macchina separata, il servizio di posta sta un server dedicato. Alla fine è capace che l’80% dei servizi che servono sono già “remoti”. Per i servizi che restano serve un pò di lungimiranza per capire se con un piccolo sforzo possono essere convertiti in servizi e dargli una identità all’interno dell’azienda.</p>
<h2 id="5-build-release-run">5. Build, release, run</h2>
<p>Nell’emergenza il copia-incolla direttamente sulla macchina di sviluppo può salvare la giornata.</p>
<p><strong>Ma se tutto è un emergenza finice che niente è un’emergenza</strong></p>
<p>Se si decidere di rilasciare un software non è abbastanza che qualcuno si ricordi di averlo fatto.
Un aiuto importante (anche per il tuo io del futuro) è quello di taggare il commit da ci si sta rilasciando usando un numero di versione.</p>
<p>Una best practice è quella di seguire un versionamento semantico che è ben spiegato <a href="https://semver.org/" rel="nofollow, noopener, noreferrer" target="_blank">qui</a>.</p>
<h2 id="6-processes">6. Processes</h2>
<p>I servizi dovrebbe girare in modo stateless quindi senza avere dati necessari al funzionamento all’interno del processo.
Rimane onere del servizio dovre salvare i dati che servono al suo funzionamento, ma il salvatggio dovrebbe avvenire su un database (remoto) oppure su uno storage S3. In questo modo se è necessario riavviare un servizio o spostarlo non è necessario migrare (o richiare di perdere) dati utili al funzionamento.</p>
<h2 id="7-port-binding">7. Port Binding</h2>
<p>Rimando al manifesto visto è spiegato molto bene <a href="https://12factor.net/port-binding" rel="nofollow, noopener, noreferrer" target="_blank">Port Binding</a></p>
<h2 id="8-concurrency">8. Concurrency</h2>
<p>Rimando al manifesto visto è spiegato molto bene <a href="https://12factor.net/concurrency" rel="nofollow, noopener, noreferrer" target="_blank">Concurrency</a></p>
<h2 id="9-disposability">9. Disposability</h2>
<p>Anche qui è spiegato molto bene sul manifesto <a href="https://12factor.net/disposability" rel="nofollow, noopener, noreferrer" target="_blank">Disposability</a>.</p>
<p>L’unica cosa che è necessario ricordarsi è che ogni punto dipende sempre dallo stato generale dell’organizzazione dell’azienda e/o degli applicativi.</p>
<h2 id="10-devprod-parity">10. Dev/prod parity</h2>
<p>Anche questo punto si scontra con la quotidianità del lavoro giornaliero, ma si può riassumere in:</p>
<p><strong>Mantieni dev/test/prod il piu simili possibili</strong></p>
<p>Se una modifica ci mette mesi a passare dallo sviluppo alla produzione ci possono essere bug o cambi di requisiti che non sono stati approfonditi a sufficienza e si rischia sempre di dimenticare qualcosa.</p>
<p>Prendendo l’abitudine di rilasciare una modifica per far testare a un Q/A e nel mentre richiedere che la PR venga visionata e corretta mitiga il sopraggiungere di problemi futuri e sopratutto che un urgenza si tramuti in catastrofe.</p>
<p>Inoltre, piu una PR o una modifica rimane nel limbo di approvazione più sarà costoso riprendere il filo logico e il tempo dedicato al controllo di bug o miglioramenti sarà inversamente proporzionale.</p>
<h2 id="11-logs">11. Logs</h2>
<p>Stiamo parlando ormai di servizi “remoti” che dialogano fra di loro e quindi anche i log possono essere visti come un servizio sia dal punto di vita di ingestion sia di consultazione.</p>
<p>Nel mio caso usando Python il logger è abbastanza modellabile per permettere di dirottare i log verso altri handlers che non siano lo standard output.
Nello specifico dirottando i log verso ElasticSearch e usando Kibana per la consultazione è possibile avere in un unico posto centralizzato i log di tutti gli applicativi senza dover agire sul servizio.</p>
<h2 id="12admin-processes">12.Admin processes</h2>
<p>Può capitare che per far funzionare un software serva lanciare comand di amministrazione.</p>
<p>Si pensi alle migrazioni di alembic.</p>
<p>E’ necessario che questi comandi siano all’interno della codebase dell’applicativo in modo che l’ambiente in cui vengono lanciati sia quello in cui tutto l’applicativo sta girando. Nella stessa maniera lo stesso comando può essere lanciato direttamente sul server di produzione senza preoccuparsi di trovare un ambiente diverso da quello di sviluppo.</p>
<h2 id="tutto-quello-appena-letto-si-poteva-riassumere-in">Tutto quello appena letto si poteva riassumere in</h2>
<img src="https://c.tenor.com/wddvQsgJKXoAAAAC/tenor.gif" alt="It works on my machine">`,t={title:"Twelve factor",description:"La twelve-factor app è una metodologia di sviluppo orientata alla costruzione di applicazioni software-as-a-service",publishDate:"16 Mar 2024",updatedDate:"16 Mar 2024",tags:[],minutesRead:"5 min read"},s="/home/io/Desktop/ophusdev-blog/src/content/post/twelve-factor.md",l=void 0;function h(){return`
# La metodologia Twelve Factor

Arriva quel momento in cui sei costretto a creare una serie di (micro)servizi, gestirli, deployarli e controllare che tutto funzioni.

Oppure non si parla di servizi ma uno o due applicativi su cui diversi sviluppatori lavorano e magari un sistemista dovrà deployare.

Mi sono imbatutto in questa metodologia di sviluppo software, che abbraccia anche la parte di deploy e monitoraggio del sistema che trovo efficace e vantaggiosa su piu fronti.

La metodologia di cui parlo è https://12factor.net/. Sul sito si può leggere il manifesto completo che loro hanno spiegato meglio di quello che posso fare io.

Io l'ho applicato su servizi Python, quindi gli esempi e i casi d'uso si riferiranno all'ambiente Python, ma essendo una metodologia può essere applicato a discapito del linguaggio.

## 1. Codebase

Per quanto mi riguarda si parla di git. Ma la regola fondamentale è sempre quella di versionare il codice

![commit and run](https://c.tenor.com/KDuKCXhCrRYAAAAC/tenor.gif)

## 2. Dependencies

Riferendosi a Python le dipendenze possono essere definite nel _setup.py_ oppure nel _requirements.txt_.
In questo modo utilizzando _pip_ e il _virtualenv_ è possibile ricreare lo stesso ambiente anche su macchine diverse senza aver il problema che le versioni delle librerie installate siano diverse.

Questo aiuta anche nel replicare un bug o un comportamento non atteso del software in un determinato commit o in un determinato rilascio

## 3. Config

Qui il campo è ampio a seconda della tecnologia che si usa.
Si può passare dai file _.ini_ degli applicativi Windows , al _settings.py_ di Django fino ai file [env.\\*](https://create-react-app.dev/docs/adding-custom-environment-variables#what-other-env-files-can-be-used) di React.

Ultimamente la mia abitudine è quella di caricare la configurazione del servizio in formato _.json_ su S3 e all'avvio dell'applicazione cercare la sua configurazione, parsarla con uno schema marshmallow e istanziare le varie classi (database, logging, redis, ...).

Questo permette di avere una configurazione centrale che può essere usata da diversi sviluppatori senza passarsi file via chat o mail.

Inoltre permette di isolare le configurazioni tra dev, test e produzione con anche gli adeguati permessi per cui uno sviluppatore possa accedere a quella configurazione.

## 4. Backing services

Questo punto dipende molto dall'organizzazione dell'azienda e dalla politica interna.

Di solito il database si tende a tenerlo su una macchina separata, il servizio di posta sta un server dedicato. Alla fine è capace che l'80% dei servizi che servono sono già "remoti". Per i servizi che restano serve un pò di lungimiranza per capire se con un piccolo sforzo possono essere convertiti in servizi e dargli una identità all'interno dell'azienda.

## 5. Build, release, run

Nell'emergenza il copia-incolla direttamente sulla macchina di sviluppo può salvare la giornata.

**Ma se tutto è un emergenza finice che niente è un'emergenza**

Se si decidere di rilasciare un software non è abbastanza che qualcuno si ricordi di averlo fatto.
Un aiuto importante (anche per il tuo io del futuro) è quello di taggare il commit da ci si sta rilasciando usando un numero di versione.

Una best practice è quella di seguire un versionamento semantico che è ben spiegato [qui](https://semver.org/).

## 6. Processes

I servizi dovrebbe girare in modo stateless quindi senza avere dati necessari al funzionamento all'interno del processo.
Rimane onere del servizio dovre salvare i dati che servono al suo funzionamento, ma il salvatggio dovrebbe avvenire su un database (remoto) oppure su uno storage S3. In questo modo se è necessario riavviare un servizio o spostarlo non è necessario migrare (o richiare di perdere) dati utili al funzionamento.

## 7. Port Binding

Rimando al manifesto visto è spiegato molto bene [Port Binding](https://12factor.net/port-binding)

## 8. Concurrency

Rimando al manifesto visto è spiegato molto bene [Concurrency](https://12factor.net/concurrency)

## 9. Disposability

Anche qui è spiegato molto bene sul manifesto [Disposability](https://12factor.net/disposability).

L'unica cosa che è necessario ricordarsi è che ogni punto dipende sempre dallo stato generale dell'organizzazione dell'azienda e/o degli applicativi.

## 10. Dev/prod parity

Anche questo punto si scontra con la quotidianità del lavoro giornaliero, ma si può riassumere in:

**Mantieni dev/test/prod il piu simili possibili**

Se una modifica ci mette mesi a passare dallo sviluppo alla produzione ci possono essere bug o cambi di requisiti che non sono stati approfonditi a sufficienza e si rischia sempre di dimenticare qualcosa.

Prendendo l'abitudine di rilasciare una modifica per far testare a un Q/A e nel mentre richiedere che la PR venga visionata e corretta mitiga il sopraggiungere di problemi futuri e sopratutto che un urgenza si tramuti in catastrofe.

Inoltre, piu una PR o una modifica rimane nel limbo di approvazione più sarà costoso riprendere il filo logico e il tempo dedicato al controllo di bug o miglioramenti sarà inversamente proporzionale.

## 11. Logs

Stiamo parlando ormai di servizi "remoti" che dialogano fra di loro e quindi anche i log possono essere visti come un servizio sia dal punto di vita di ingestion sia di consultazione.

Nel mio caso usando Python il logger è abbastanza modellabile per permettere di dirottare i log verso altri handlers che non siano lo standard output.
Nello specifico dirottando i log verso ElasticSearch e usando Kibana per la consultazione è possibile avere in un unico posto centralizzato i log di tutti gli applicativi senza dover agire sul servizio.

## 12.Admin processes

Può capitare che per far funzionare un software serva lanciare comand di amministrazione.

Si pensi alle migrazioni di alembic.

E' necessario che questi comandi siano all'interno della codebase dell'applicativo in modo che l'ambiente in cui vengono lanciati sia quello in cui tutto l'applicativo sta girando. Nella stessa maniera lo stesso comando può essere lanciato direttamente sul server di produzione senza preoccuparsi di trovare un ambiente diverso da quello di sviluppo.

## Tutto quello appena letto si poteva riassumere in

![It works on my machine](https://c.tenor.com/wddvQsgJKXoAAAAC/tenor.gif)
`}function f(){return i}function z(){return[{depth:1,slug:"la-metodologia-twelve-factor",text:"La metodologia Twelve Factor"},{depth:2,slug:"1-codebase",text:"1. Codebase"},{depth:2,slug:"2-dependencies",text:"2. Dependencies"},{depth:2,slug:"3-config",text:"3. Config"},{depth:2,slug:"4-backing-services",text:"4. Backing services"},{depth:2,slug:"5-build-release-run",text:"5. Build, release, run"},{depth:2,slug:"6-processes",text:"6. Processes"},{depth:2,slug:"7-port-binding",text:"7. Port Binding"},{depth:2,slug:"8-concurrency",text:"8. Concurrency"},{depth:2,slug:"9-disposability",text:"9. Disposability"},{depth:2,slug:"10-devprod-parity",text:"10. Dev/prod parity"},{depth:2,slug:"11-logs",text:"11. Logs"},{depth:2,slug:"12admin-processes",text:"12.Admin processes"},{depth:2,slug:"tutto-quello-appena-letto-si-poteva-riassumere-in",text:"Tutto quello appena letto si poteva riassumere in"}]}const b=a((p,d,c)=>{const{layout:u,...e}=t;return e.file=s,e.url=l,o`${n()}${r(i)}`});export{b as Content,f as compiledContent,b as default,s as file,t as frontmatter,z as getHeadings,h as rawContent,l as url};
