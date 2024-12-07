import{c as a,r as n,m as p}from"./render-template.luloOCeF.js";import{u as i}from"./hoisted.CX9BuXzO.js";import"./astro/assets-service.UPL31UwL.js";const e=`<p>Mi sono trovato davanti ad un problema di race condition su Postgres in un processo che doveva importare migliaia di record in parallelo con il risultato che sul database mi ritrovavo con decine di record duplicati.</p>
<p>Le tecnologie coinvolte sono Python3.11, SQLAlchemy 2.0.36 e Postgres 17.2 ma in questo post ricreeremo la situazione con TSQL e un paio di terminali per non avere troppe dipendenze esterne.</p>
<p>Alla fine del post si può trovare il paragrafo con la query tradotta nella sintassi di SQLAlchemy.</p>
<h2 id="iniziamo">Iniziamo</h2>
<p>Avviamo un postgres usando Docker con un semplice <code>docker compose up -d</code></p>
<div class="expressive-code"><link rel="stylesheet" href="/_astro/ec.500gk.css"><script type="module" src="/_astro/ec.sgewm.js"><\/script><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#8BE9FD;--1:#1E7734">services</span><span style="--0:#FF79C6;--1:#24292E">:</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#8BE9FD;--1:#1E7734">postgres</span><span style="--0:#FF79C6;--1:#24292E">:</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    </span><span style="--0:#8BE9FD;--1:#1E7734">image</span><span style="--1:#24292E"><span style="--0:#FF79C6">:</span><span style="--0:#F8F8F2"> </span></span><span style="--0:#F1FA8C;--1:#032F62">postgres:17.2</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    </span><span style="--0:#8BE9FD;--1:#1E7734">ports</span><span style="--0:#FF79C6;--1:#24292E">:</span></div><div class="ec-line"><span style="--1:#24292E"><span style="--0:#F8F8F2">      </span><span style="--0:#FF79C6">-</span><span style="--0:#F8F8F2"> </span></span><span style="--0:#F1FA8C;--1:#032F62">5432:5432</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    </span><span style="--0:#8BE9FD;--1:#1E7734">environment</span><span style="--0:#FF79C6;--1:#24292E">:</span></div><div class="ec-line"><span style="--1:#24292E"><span style="--0:#F8F8F2">      </span><span style="--0:#FF79C6">-</span><span style="--0:#F8F8F2"> </span></span><span style="--0:#F1FA8C;--1:#032F62">POSTGRES_DB=people</span></div><div class="ec-line"><span style="--1:#24292E"><span style="--0:#F8F8F2">      </span><span style="--0:#FF79C6">-</span><span style="--0:#F8F8F2"> </span></span><span style="--0:#F1FA8C;--1:#032F62">POSTGRES_USER=user</span></div><div class="ec-line"><span style="--1:#24292E"><span style="--0:#F8F8F2">      </span><span style="--0:#FF79C6">-</span><span style="--0:#F8F8F2"> </span></span><span style="--0:#F1FA8C;--1:#032F62">POSTGRES_PASSWORD=dev</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="services:  postgres:    image: postgres:17.2    ports:      - 5432:5432    environment:      - POSTGRES_DB=people      - POSTGRES_USER=user      - POSTGRES_PASSWORD=dev"><div></div></button></div></figure></div>
<p>e connettiamoci con una shell</p>
<div class="expressive-code"><figure class="frame is-terminal"><figcaption class="header"><span class="title"></span><span class="sr-only">Terminal window</span></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#50FA7B;--1:#6F42C1">psql</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">postgresql://user:dev@localhost/people</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="psql postgresql://user:dev@localhost/people"><div></div></button></div></figure></div>
<p>Creiamo la tabella per il nostro esperimento</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">CREATE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">TABLE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#50FA7B;--1:#6F42C1">people</span><span style="--0:#F8F8F2;--1:#24292E"> (</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    id </span><span style="--0:#FF79C6;--1:#BF3441">SERIAL</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">NOT NULL</span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    fiscal_code </span><span style="--0:#FF79C6;--1:#BF3441">VARCHAR</span><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">16</span><span style="--0:#F8F8F2;--1:#24292E">) </span><span style="--0:#FF79C6;--1:#BF3441">NOT NULL</span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    first_name </span><span style="--0:#FF79C6;--1:#BF3441">VARCHAR</span><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">255</span><span style="--0:#F8F8F2;--1:#24292E">) </span><span style="--0:#FF79C6;--1:#BF3441">NOT NULL</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">);</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="CREATE TABLE people (    id SERIAL NOT NULL,    fiscal_code VARCHAR(16) NOT NULL,    first_name VARCHAR(255) NOT NULL);"><div></div></button></div></figure></div>
<p>Inseriamo un paio di dati</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">BEGIN</span><span style="--0:#F8F8F2;--1:#24292E">;</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name) </span><span style="--0:#FF79C6;--1:#BF3441">VALUES</span><span style="--0:#F8F8F2;--1:#24292E"> (</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">);</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name) </span><span style="--0:#FF79C6;--1:#BF3441">VALUES</span><span style="--0:#F8F8F2;--1:#24292E"> (</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">BBB</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pluto</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">);</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">COMMIT</span><span style="--0:#F8F8F2;--1:#24292E">;</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="BEGIN;INSERT INTO people (fiscal_code, first_name) VALUES (&#x27;AAA&#x27;, &#x27;Pippo&#x27;);INSERT INTO people (fiscal_code, first_name) VALUES (&#x27;BBB&#x27;, &#x27;Pluto&#x27;);COMMIT;"><div></div></button></div></figure></div>
<p>Controlliamo la nostra tabella</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">SELECT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">*</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">id | fiscal_code | first_name</span></div><div class="ec-line"><span style="--0:#96A1C2;--1:#616972">----+-------------+------------</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#BD93F9;--1:#005CC5">1</span><span style="--0:#F8F8F2;--1:#24292E"> | AAA         | Pippo</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#BD93F9;--1:#005CC5">2</span><span style="--0:#F8F8F2;--1:#24292E"> | BBB         | Pluto</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">2</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">rows</span><span style="--0:#F8F8F2;--1:#24292E">)</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="SELECT * FROM people;id | fiscal_code | first_name----+-------------+------------  1 | AAA         | Pippo  2 | BBB         | Pluto(2 rows)"><div></div></button></div></figure></div>
<h2 id="la-nostra-query">La nostra query</h2>
<p>Adesso usiamo il costrutto INSERT INTO SELECT per inserire un nuovo record senza dover fare prima una query per testare l’esistenza del record e otteniamo che nessuna riga viene inserita poichè esiste già un record identico</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name)</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">SELECT</span></div><div class="ec-line"><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">WHERE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">NOT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">EXISTS</span><span style="--0:#F8F8F2;--1:#24292E"> (</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        </span><span style="--0:#FF79C6;--1:#BF3441">SELECT</span><span style="--0:#F8F8F2;--1:#24292E"> fiscal_code, first_name</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FF79C6;--1:#BF3441">WHERE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">fiscal_code</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FF79C6;--1:#BF3441">AND</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">first_name</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        )</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">RETURNING </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">id</span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">fiscal_code</span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">first_name</span><span style="--0:#F8F8F2;--1:#24292E">;</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="INSERT INTO people (fiscal_code, first_name)SELECT&#x27;AAA&#x27;,&#x27;Pippo&#x27;WHERE NOT EXISTS (        SELECT fiscal_code, first_name            FROM people            WHERE people.fiscal_code = &#x27;AAA&#x27;            AND people.first_name = &#x27;Pippo&#x27;        )RETURNING people.id, people.fiscal_code, people.first_name;"><div></div></button></div></figure></div>
<p>Infatti la risposta che otteniamo dopo l’insert è</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">id | fiscal_code | first_name</span></div><div class="ec-line"><span style="--0:#96A1C2;--1:#616972">----+-------------+------------</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">0</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">rows</span><span style="--0:#F8F8F2;--1:#24292E">)</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#BD93F9;--1:#005CC5">0</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#BD93F9;--1:#005CC5">0</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="id | fiscal_code | first_name----+-------------+------------(0 rows)INSERT 0 0"><div></div></button></div></figure></div>
<p>Puliamo la nostra tabella</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">DELETE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="DELETE FROM people;"><div></div></button></div></figure></div>
<h2 id="simuliamo-una-scrittura-concorrenziale">Simuliamo una scrittura concorrenziale</h2>
<p>Apriamo due nuove shell sul terminale e connettiamoci al database</p>
<p>Per simulare la concorrenza usiamo questo trucco:</p>








































<table><thead><tr><th align="center"><strong>Step</strong></th><th align="center"><strong>Shell di sinistra</strong></th><th align="center"><strong>Shell di destra</strong></th></tr></thead><tbody><tr><td align="center">1</td><td align="center">digitiamo <code>BEGIN;</code></td><td align="center"></td></tr><tr><td align="center">2</td><td align="center"></td><td align="center">digitiamo <code>BEGIN;</code></td></tr><tr><td align="center">3</td><td align="center"><a href="#la-nostra-query">Copiamo ed eseguiamo la nostra query</a></td><td align="center"></td></tr><tr><td align="center">4</td><td align="center"></td><td align="center"><a href="#la-nostra-query">Copiamo ed eseguiamo la nostra query</a></td></tr><tr><td align="center">5</td><td align="center">digitiamo <code>COMMIT</code></td><td align="center"></td></tr><tr><td align="center">6</td><td align="center"></td><td align="center">digitiamo <code>COMMIT</code></td></tr></tbody></table>
<p>Eseguiamo lo step 1 nella shell di sinistra e lo step 2 nella shell di destra</p>
<p>Ora eseguiamo lo step 3 nella shell di sinistra e riceveremo sul terminale la risposta <code>INSERT 0 1</code> ma la transazione non è ancora commitata quindi sul database noi non abbiamo ancora scritto nessun record.</p>
<p>Ora eseguiamo lo step 4 e dato che è postgres a preoccuparsi del lock sul record ed essendo la insert una operazione che esegue il lock prima di effettuare cambiamenti ci aspettiamo che la shell rimanga in attesa che l’altra transazione si chiuda … e invece eseguendo la query anche la seconda shell ci restituisce <code>INSERT 0 1</code></p>
<p>Eseguiamo gli step 5 e 6 per concludere le due transazioni</p>
<p>La <a href="#la-nostra-query">nostra query</a> con il suo where non è bloccante quindi ci porta ad un problema di race condition da cui non siamo protetti nel caso di concorrenzialità e ci troviamo con i record duplicati</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">SELECT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">*</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">id | fiscal_code | first_name</span></div><div class="ec-line"><span style="--0:#96A1C2;--1:#616972">----+-------------+------------</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#BD93F9;--1:#005CC5">3</span><span style="--0:#F8F8F2;--1:#24292E"> | AAA         | Pippo</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#BD93F9;--1:#005CC5">4</span><span style="--0:#F8F8F2;--1:#24292E"> | AAA         | Pippo</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">2</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">rows</span><span style="--0:#F8F8F2;--1:#24292E">)</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="SELECT * FROM people;id | fiscal_code | first_name----+-------------+------------  3 | AAA         | Pippo  4 | AAA         | Pippo(2 rows)"><div></div></button></div></figure></div>
<h2 id="la-soluzione">La soluzione</h2>
<p>Ci viene in aiuto un paragrafo della documentazione di <a href="https://www.postgresql.org/docs/current/sql-insert.html" rel="nofollow, noopener, noreferrer" target="_blank">Postgres</a> che riporta</p>
<blockquote>
<p>INSERT into tables that lack unique indexes will not be blocked by concurrent activity. Tables with unique indexes might block if concurrent sessions perform actions that lock or modify rows matching the unique index values being inserted; the details are covered in Section 62.5. ON CONFLICT can be used to specify an alternative action to raising a unique constraint or exclusion constraint violation error. (See ON CONFLICT Clause below.)</p>
</blockquote>
<p>Dobbiamo creare un indice univoco per fare in modo che Postgres ci permetta di proteggerci da scritture concorrenti</p>
<p>Puliamo di nuovo la tabella con</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">DELETE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="DELETE FROM people;"><div></div></button></div></figure></div>
<p>e creiamo l’indice</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">ALTER</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">TABLE</span><span style="--0:#F8F8F2;--1:#24292E"> ONLY people </span><span style="--0:#FF79C6;--1:#BF3441">ADD</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">CONSTRAINT</span><span style="--0:#F8F8F2;--1:#24292E"> uq_people_fiscal_code_first_name </span><span style="--0:#FF79C6;--1:#BF3441">UNIQUE</span><span style="--0:#F8F8F2;--1:#24292E"> (fiscal_code, first_name);</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name UNIQUE (fiscal_code, first_name);"><div></div></button></div></figure></div>
<p>Adesso, ripetendo i passaggi del paragrafo <a href="#simuliamo-una-scrittura-concorrenziale">Simuliamo una scrittura concorrenziale</a> e otteniamo che nella seconda shell rimarremo in attesa finche dalla prima non effettueremo un rollback
o una commit;</p>
<p>Tutto perfetto ma nella seconda shell otteniamo un messaggio di errore</p>
<blockquote>
<p>ERROR: duplicate key value violates unique constraint “uq_people_fiscal_code_first_name”
DETAIL: Key (fiscal_code, first_name)=(AAA, Pippo) already exists.</p>
</blockquote>
<p>Prima puliamo la tabella</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">DELETE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="DELETE from people;"><div></div></button></div></figure></div>
<p>Serve una piccola modifica alla nostra query aggiungendo la clausola <code>ON CONFLICT DO NOTHING</code> e possiamo riprodurre di nuovo i passaggi del paragrafo <a href="#simuliamo-una-scrittura-concorrenziale">Simuliamo una scrittura concorrenziale</a></p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name)</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">SELECT</span></div><div class="ec-line"><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">WHERE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">NOT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">EXISTS</span><span style="--0:#F8F8F2;--1:#24292E"> (</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        </span><span style="--0:#FF79C6;--1:#BF3441">SELECT</span><span style="--0:#F8F8F2;--1:#24292E"> fiscal_code, first_name</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FF79C6;--1:#BF3441">WHERE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">fiscal_code</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FF79C6;--1:#BF3441">AND</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">first_name</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        )</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">ON</span><span style="--0:#F8F8F2;--1:#24292E"> CONFLICT DO NOTHING</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">RETURNING </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">id</span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">fiscal_code</span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#BD93F9;--1:#005CC5">people</span><span style="--0:#F8F8F2;--1:#24292E">.</span><span style="--0:#BD93F9;--1:#005CC5">first_name</span><span style="--0:#F8F8F2;--1:#24292E">;</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="INSERT INTO people (fiscal_code, first_name)SELECT&#x27;AAA&#x27;,&#x27;Pippo&#x27;WHERE NOT EXISTS (        SELECT fiscal_code, first_name            FROM people            WHERE people.fiscal_code = &#x27;AAA&#x27;            AND people.first_name = &#x27;Pippo&#x27;        )ON CONFLICT DO NOTHINGRETURNING people.id, people.fiscal_code, people.first_name;"><div></div></button></div></figure></div>
<p>Controlliamo il nostro risultato</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">SELECT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">*</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E"> id | fiscal_code | first_name</span></div><div class="ec-line"><span style="--0:#96A1C2;--1:#616972">----+-------------+------------</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#BD93F9;--1:#005CC5">7</span><span style="--0:#F8F8F2;--1:#24292E"> | AAA         | Pippo</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">1</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">row</span><span style="--0:#F8F8F2;--1:#24292E">)</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="SELECT * from people; id | fiscal_code | first_name----+-------------+------------  7 | AAA         | Pippo(1 row)"><div></div></button></div></figure></div>
<h2 id="scenario-bonus">Scenario Bonus</h2>
<p>E se avessimo uno dei campi della tabella che fosse nullable?</p>
<p>Facciamo una prova</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">DROP</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">TABLE</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">CREATE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">TABLE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#50FA7B;--1:#6F42C1">people</span><span style="--0:#F8F8F2;--1:#24292E"> (</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    id </span><span style="--0:#FF79C6;--1:#BF3441">SERIAL</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">NOT null</span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    fiscal_code </span><span style="--0:#FF79C6;--1:#BF3441">VARCHAR</span><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">16</span><span style="--0:#F8F8F2;--1:#24292E">) </span><span style="--0:#FF79C6;--1:#BF3441">NOT null</span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    first_name </span><span style="--0:#FF79C6;--1:#BF3441">VARCHAR</span><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">255</span><span style="--0:#F8F8F2;--1:#24292E">) </span><span style="--0:#FF79C6;--1:#BF3441">NOT null</span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    birth_date </span><span style="--0:#FF79C6;--1:#BF3441">timestamptz</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">NULL</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">);</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">ALTER</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">TABLE</span><span style="--0:#F8F8F2;--1:#24292E"> ONLY people </span><span style="--0:#FF79C6;--1:#BF3441">ADD</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">CONSTRAINT</span><span style="--0:#F8F8F2;--1:#24292E"> uq_people_fiscal_code_first_name_birth_date </span><span style="--0:#FF79C6;--1:#BF3441">UNIQUE</span><span style="--0:#F8F8F2;--1:#24292E"> (fiscal_code, first_name, birth_date);</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="DROP TABLE people;CREATE TABLE people (    id SERIAL NOT null,    fiscal_code VARCHAR(16) NOT null,    first_name VARCHAR(255) NOT null,    birth_date timestamptz NULL);ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name_birth_date UNIQUE (fiscal_code, first_name, birth_date);"><div></div></button></div></figure></div>
<p>Inseriamo due righe</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name, birth_date) </span><span style="--0:#FF79C6;--1:#BF3441">VALUES</span><span style="--0:#F8F8F2;--1:#24292E"> (</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#FF79C6;--1:#BF3441">NULL</span><span style="--0:#F8F8F2;--1:#24292E">);</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name, birth_date) </span><span style="--0:#FF79C6;--1:#BF3441">VALUES</span><span style="--0:#F8F8F2;--1:#24292E"> (</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#FF79C6;--1:#BF3441">NULL</span><span style="--0:#F8F8F2;--1:#24292E">);</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="INSERT INTO people (fiscal_code, first_name, birth_date) VALUES (&#x27;AAA&#x27;, &#x27;Pippo&#x27;, NULL);INSERT INTO people (fiscal_code, first_name, birth_date) VALUES (&#x27;AAA&#x27;, &#x27;Pippo&#x27;, NULL);"><div></div></button></div></figure></div>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">SELECT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">*</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">id | fiscal_code | first_name | birth_date</span></div><div class="ec-line"><span style="--0:#96A1C2;--1:#616972">----+-------------+------------+------------</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#BD93F9;--1:#005CC5">1</span><span style="--0:#F8F8F2;--1:#24292E"> | AAA         | Pippo      |</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">  </span><span style="--0:#BD93F9;--1:#005CC5">2</span><span style="--0:#F8F8F2;--1:#24292E"> | AAA         | Pippo      |</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#BD93F9;--1:#005CC5">2</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">rows</span><span style="--0:#F8F8F2;--1:#24292E">)</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="SELECT * FROM people;id | fiscal_code | first_name | birth_date----+-------------+------------+------------  1 | AAA         | Pippo      |  2 | AAA         | Pippo      |(2 rows)"><div></div></button></div></figure></div>
<p>Il nostro unique constraint non si è attivato.</p>
<p>Questo perchè da Postgres 15 è necessario usare la clausola <code>NULLS NOT DISTINCT</code> che permette a Postgres di evitare di trattare i null come chiavi distinte.</p>
<p>Applichiamo le modifiche</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">DELETE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">FROM</span><span style="--0:#F8F8F2;--1:#24292E"> people;</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">ALTER</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">TABLE</span><span style="--0:#F8F8F2;--1:#24292E"> people </span><span style="--0:#FF79C6;--1:#BF3441">DROP</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">CONSTRAINT</span><span style="--0:#F8F8F2;--1:#24292E"> uq_people_fiscal_code_first_name_birth_date;</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">ALTER</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">TABLE</span><span style="--0:#F8F8F2;--1:#24292E"> ONLY people </span><span style="--0:#FF79C6;--1:#BF3441">ADD</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">CONSTRAINT</span><span style="--0:#F8F8F2;--1:#24292E"> uq_people_fiscal_code_first_name_birth_date </span><span style="--0:#FF79C6;--1:#BF3441">UNIQUE</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">NULLS</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">NOT</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#FF79C6;--1:#BF3441">DISTINCT</span><span style="--0:#F8F8F2;--1:#24292E"> (fiscal_code, first_name, birth_date);</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="DELETE FROM people;ALTER TABLE people DROP CONSTRAINT uq_people_fiscal_code_first_name_birth_date;ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name_birth_date UNIQUE NULLS NOT DISTINCT (fiscal_code, first_name, birth_date);"><div></div></button></div></figure></div>
<p>E questa volta un solo record viene inserito mentre il secondo darà errore</p>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name, birth_date) </span><span style="--0:#FF79C6;--1:#BF3441">VALUES</span><span style="--0:#F8F8F2;--1:#24292E"> (</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#FF79C6;--1:#BF3441">NULL</span><span style="--0:#F8F8F2;--1:#24292E">);</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">INSERT INTO</span><span style="--0:#F8F8F2;--1:#24292E"> people (fiscal_code, first_name, birth_date) </span><span style="--0:#FF79C6;--1:#BF3441">VALUES</span><span style="--0:#F8F8F2;--1:#24292E"> (</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#FF79C6;--1:#BF3441">NULL</span><span style="--0:#F8F8F2;--1:#24292E">);</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="INSERT INTO people (fiscal_code, first_name, birth_date) VALUES (&#x27;AAA&#x27;, &#x27;Pippo&#x27;, NULL);INSERT INTO people (fiscal_code, first_name, birth_date) VALUES (&#x27;AAA&#x27;, &#x27;Pippo&#x27;, NULL);"><div></div></button></div></figure></div>
<h2 id="sqlalchemy-query">SQLAlchemy Query</h2>
<div class="expressive-code"><figure class="frame is-terminal"><figcaption class="header"><span class="title"></span><span class="sr-only">Terminal window</span></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#50FA7B;--1:#6F42C1">virtualenv</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">.venv</span></div><div class="ec-line"><span style="--0:#8BE9FD;--1:#005CC5">.</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">.venv/bin/activate</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#50FA7B;--1:#6F42C1">pip</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">install</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">sqlalchemy==</span><span style="--0:#BD93F9;--1:#005CC5">2.0</span><span style="--0:#F1FA8C;--1:#032F62">.36</span></div><div class="ec-line"><span style="--0:#50FA7B;--1:#6F42C1">pip</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">install</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">psycopg2-binary==</span><span style="--0:#BD93F9;--1:#005CC5">2.9</span><span style="--0:#F1FA8C;--1:#032F62">.10</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="virtualenv .venv. .venv/bin/activatepip install sqlalchemy==2.0.36pip install psycopg2-binary==2.9.10"><div></div></button></div></figure></div>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> sqlalchemy.dialects.postgresql </span><span style="--0:#FF79C6;--1:#BF3441">import</span><span style="--0:#F8F8F2;--1:#24292E"> insert</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> sqlalchemy </span><span style="--0:#FF79C6;--1:#BF3441">import</span><span style="--0:#F8F8F2;--1:#24292E"> create_engine</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> sqlalchemy.orm </span><span style="--0:#FF79C6;--1:#BF3441">import</span><span style="--0:#F8F8F2;--1:#24292E"> DeclarativeBase</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> sqlalchemy.sql.schema </span><span style="--0:#FF79C6;--1:#BF3441">import</span><span style="--0:#F8F8F2;--1:#24292E"> MetaData</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> sqlalchemy </span><span style="--0:#FF79C6;--1:#BF3441">import</span><span style="--0:#F8F8F2;--1:#24292E"> UniqueConstraint</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> sqlalchemy.orm </span><span style="--0:#FF79C6;--1:#BF3441">import</span><span style="--0:#F8F8F2;--1:#24292E"> Mapped, mapped_column</span></div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">from</span><span style="--0:#F8F8F2;--1:#24292E"> sqlalchemy.sql.sqltypes </span><span style="--0:#FF79C6;--1:#BF3441">import</span><span style="--0:#F8F8F2;--1:#24292E"> String</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">session_provider </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> create_engine(</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    </span><span style="--1:#032F62"><span style="--0:#E9F284">"</span><span style="--0:#F1FA8C">postgresql://user:dev@localhost/people</span><span style="--0:#E9F284">"</span></span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    </span><span style="--0:#FFB86C;--0fs:italic;--1:#AE4B07">future</span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#BD93F9;--1:#005CC5">True</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">)</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">metadata_obj </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> MetaData()</span></div><div class="ec-line">
</div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">class</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#8BE9FD;--1:#6F42C1">Base</span><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#8BE9FD;--0fs:italic;--1:#6F42C1">DeclarativeBase</span><span style="--0:#F8F8F2;--1:#24292E">):</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    metadata </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> metadata_obj</span></div><div class="ec-line">
</div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">class</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#8BE9FD;--1:#6F42C1">Person</span><span style="--0:#F8F8F2;--1:#24292E">(</span><span style="--0:#8BE9FD;--0fs:italic;--1:#6F42C1">Base</span><span style="--0:#F8F8F2;--1:#24292E">):</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    __tablename__ </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--1:#032F62"><span style="--0:#E9F284">"</span><span style="--0:#F1FA8C">people</span><span style="--0:#E9F284">"</span></span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    __table_args__ </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> (UniqueConstraint(</span><span style="--1:#032F62"><span style="--0:#E9F284">"</span><span style="--0:#F1FA8C">fiscal_code</span><span style="--0:#E9F284">"</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">"</span><span style="--0:#F1FA8C">first_name</span><span style="--0:#E9F284">"</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--0:#FFB86C;--0fs:italic;--1:#AE4B07">name</span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--1:#032F62"><span style="--0:#E9F284">"</span><span style="--0:#F1FA8C">uq_people_fiscal_code_first_name</span><span style="--0:#E9F284">"</span></span><span style="--0:#F8F8F2;--1:#24292E">),)</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    </span><span style="--0:#8BE9FD;--1:#005CC5">id</span><span style="--0:#F8F8F2;--1:#24292E">: Mapped[</span><span style="--0:#8BE9FD;--0fs:italic;--1:#005CC5">int</span><span style="--0:#F8F8F2;--1:#24292E">] </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> mapped_column(</span><span style="--0:#FFB86C;--0fs:italic;--1:#AE4B07">primary_key</span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#BD93F9;--1:#005CC5">True</span><span style="--0:#F8F8F2;--1:#24292E">)</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    fiscal_code: Mapped[</span><span style="--0:#8BE9FD;--0fs:italic;--1:#005CC5">str</span><span style="--0:#F8F8F2;--1:#24292E">] </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> mapped_column(String(</span><span style="--0:#BD93F9;--1:#005CC5">16</span><span style="--0:#F8F8F2;--1:#24292E">))</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    first_name: Mapped[</span><span style="--0:#8BE9FD;--0fs:italic;--1:#005CC5">str</span><span style="--0:#F8F8F2;--1:#24292E">] </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> mapped_column(String(</span><span style="--0:#BD93F9;--1:#005CC5">255</span><span style="--0:#F8F8F2;--1:#24292E">))</span></div><div class="ec-line">
</div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#FF79C6;--1:#BF3441">with</span><span style="--0:#F8F8F2;--1:#24292E"> session_provider.begin() </span><span style="--0:#FF79C6;--1:#BF3441">as</span><span style="--0:#F8F8F2;--1:#24292E"> db_session:</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    record </span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E"> (</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        insert(Person)</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        .values(</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FFB86C;--0fs:italic;--1:#AE4B07">fiscal_code</span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">AAA</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">            </span><span style="--0:#FFB86C;--0fs:italic;--1:#AE4B07">first_name</span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--1:#032F62"><span style="--0:#E9F284">'</span><span style="--0:#F1FA8C">Pippo</span><span style="--0:#E9F284">'</span></span><span style="--0:#F8F8F2;--1:#24292E">,</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        )</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        .on_conflict_do_nothing(</span><span style="--0:#FFB86C;--0fs:italic;--1:#AE4B07">index_elements</span><span style="--0:#FF79C6;--1:#BF3441">=</span><span style="--0:#F8F8F2;--1:#24292E">[</span><span style="--1:#032F62"><span style="--0:#E9F284">"</span><span style="--0:#F1FA8C">fiscal_code</span><span style="--0:#E9F284">"</span></span><span style="--0:#F8F8F2;--1:#24292E">, </span><span style="--1:#032F62"><span style="--0:#E9F284">"</span><span style="--0:#F1FA8C">first_name</span><span style="--0:#E9F284">"</span></span><span style="--0:#F8F8F2;--1:#24292E">])</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">        .returning(Person)</span></div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    )</span></div><div class="ec-line">
</div><div class="ec-line"><span style="--0:#F8F8F2;--1:#24292E">    </span><span style="--0:#8BE9FD;--1:#005CC5">print</span><span style="--0:#F8F8F2;--1:#24292E">(db_session.execute(record).scalar_one_or_none())</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="from sqlalchemy.dialects.postgresql import insertfrom sqlalchemy import create_enginefrom sqlalchemy.orm import DeclarativeBasefrom sqlalchemy.sql.schema import MetaDatafrom sqlalchemy import UniqueConstraintfrom sqlalchemy.orm import Mapped, mapped_columnfrom sqlalchemy.sql.sqltypes import Stringsession_provider = create_engine(    &#x22;postgresql://user:dev@localhost/people&#x22;,    future=True)metadata_obj = MetaData()class Base(DeclarativeBase):    metadata = metadata_objclass Person(Base):    __tablename__ = &#x22;people&#x22;    __table_args__ = (UniqueConstraint(&#x22;fiscal_code&#x22;, &#x22;first_name&#x22;, name=&#x22;uq_people_fiscal_code_first_name&#x22;),)    id: Mapped[int] = mapped_column(primary_key=True)    fiscal_code: Mapped[str] = mapped_column(String(16))    first_name: Mapped[str] = mapped_column(String(255))with session_provider.begin() as db_session:    record = (        insert(Person)        .values(            fiscal_code=&#x27;AAA&#x27;,            first_name=&#x27;Pippo&#x27;,        )        .on_conflict_do_nothing(index_elements=[&#x22;fiscal_code&#x22;, &#x22;first_name&#x22;])        .returning(Person)    )    print(db_session.execute(record).scalar_one_or_none())"><div></div></button></div></figure></div>`,l={title:"Postgres: Race Condition, Unique Constraints and Handling Concurrency",description:"Come gestire le ace conditions e gli unique constraints in Postgres, utilizzando ON CONFLICT DO NOTHING per prevenire record duplicati",publishDate:"07 Dec 2024",updatedDate:"07 Dec 2024",tags:["postgres","python","race condition"],minutesRead:"5 min read"},t="/media/io/Dati/linux/ophusdev-blog/src/content/post/postgres-race-condition-and-unique-constraint.md",F=void 0;function u(){return`
Mi sono trovato davanti ad un problema di race condition su Postgres in un processo che doveva importare migliaia di record in parallelo con il risultato che sul database mi ritrovavo con decine di record duplicati.

Le tecnologie coinvolte sono Python3.11, SQLAlchemy 2.0.36 e Postgres 17.2 ma in questo post ricreeremo la situazione con TSQL e un paio di terminali per non avere troppe dipendenze esterne.

Alla fine del post si può trovare il paragrafo con la query tradotta nella sintassi di SQLAlchemy.

## Iniziamo

Avviamo un postgres usando Docker con un semplice \`docker compose up -d\`

\`\`\`yaml
services:
  postgres:
    image: postgres:17.2
    ports:
      - 5432:5432
    environment:
      - POSTGRES_DB=people
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=dev
\`\`\`

e connettiamoci con una shell

\`\`\`bash
psql postgresql://user:dev@localhost/people
\`\`\`

Creiamo la tabella per il nostro esperimento

\`\`\`sql
CREATE TABLE people (
    id SERIAL NOT NULL,
    fiscal_code VARCHAR(16) NOT NULL,
    first_name VARCHAR(255) NOT NULL
);
\`\`\`

Inseriamo un paio di dati

\`\`\`sql
BEGIN;
INSERT INTO people (fiscal_code, first_name) VALUES ('AAA', 'Pippo');
INSERT INTO people (fiscal_code, first_name) VALUES ('BBB', 'Pluto');
COMMIT;
\`\`\`

Controlliamo la nostra tabella

\`\`\`sql
SELECT * FROM people;

id | fiscal_code | first_name
----+-------------+------------
  1 | AAA         | Pippo
  2 | BBB         | Pluto
(2 rows)
\`\`\`

## La nostra query

Adesso usiamo il costrutto INSERT INTO SELECT per inserire un nuovo record senza dover fare prima una query per testare l'esistenza del record e otteniamo che nessuna riga viene inserita poichè esiste già un record identico

\`\`\`sql
INSERT INTO people (fiscal_code, first_name)
SELECT
'AAA',
'Pippo'
WHERE NOT EXISTS (
        SELECT fiscal_code, first_name
            FROM people
            WHERE people.fiscal_code = 'AAA'
            AND people.first_name = 'Pippo'
        )
RETURNING people.id, people.fiscal_code, people.first_name;
\`\`\`

Infatti la risposta che otteniamo dopo l'insert è

\`\`\`sql
id | fiscal_code | first_name
----+-------------+------------
(0 rows)

INSERT 0 0
\`\`\`

Puliamo la nostra tabella

\`\`\`sql
DELETE FROM people;
\`\`\`

## Simuliamo una scrittura concorrenziale

Apriamo due nuove shell sul terminale e connettiamoci al database

Per simulare la concorrenza usiamo questo trucco:

| **Step** |                  **Shell di sinistra**                   |                   **Shell di destra**                    |
| :------: | :------------------------------------------------------: | :------------------------------------------------------: |
|    1     |                    digitiamo \`BEGIN;\`                    |                                                          |
|    2     |                                                          |                    digitiamo \`BEGIN;\`                    |
|    3     | [Copiamo ed eseguiamo la nostra query](#la-nostra-query) |                                                          |
|    4     |                                                          | [Copiamo ed eseguiamo la nostra query](#la-nostra-query) |
|    5     |                    digitiamo \`COMMIT\`                    |                                                          |
|    6     |                                                          |                    digitiamo \`COMMIT\`                    |

Eseguiamo lo step 1 nella shell di sinistra e lo step 2 nella shell di destra

Ora eseguiamo lo step 3 nella shell di sinistra e riceveremo sul terminale la risposta \`INSERT 0 1\` ma la transazione non è ancora commitata quindi sul database noi non abbiamo ancora scritto nessun record.

Ora eseguiamo lo step 4 e dato che è postgres a preoccuparsi del lock sul record ed essendo la insert una operazione che esegue il lock prima di effettuare cambiamenti ci aspettiamo che la shell rimanga in attesa che l'altra transazione si chiuda ... e invece eseguendo la query anche la seconda shell ci restituisce \`INSERT 0 1\`

Eseguiamo gli step 5 e 6 per concludere le due transazioni

La [nostra query](#la-nostra-query) con il suo where non è bloccante quindi ci porta ad un problema di race condition da cui non siamo protetti nel caso di concorrenzialità e ci troviamo con i record duplicati

\`\`\`sql
SELECT * FROM people;

id | fiscal_code | first_name
----+-------------+------------
  3 | AAA         | Pippo
  4 | AAA         | Pippo
(2 rows)

\`\`\`

## La soluzione

Ci viene in aiuto un paragrafo della documentazione di [Postgres](https://www.postgresql.org/docs/current/sql-insert.html) che riporta

> INSERT into tables that lack unique indexes will not be blocked by concurrent activity. Tables with unique indexes might block if concurrent sessions perform actions that lock or modify rows matching the unique index values being inserted; the details are covered in Section 62.5. ON CONFLICT can be used to specify an alternative action to raising a unique constraint or exclusion constraint violation error. (See ON CONFLICT Clause below.)

Dobbiamo creare un indice univoco per fare in modo che Postgres ci permetta di proteggerci da scritture concorrenti

Puliamo di nuovo la tabella con

\`\`\`sql
DELETE FROM people;
\`\`\`

e creiamo l'indice

\`\`\`sql
ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name UNIQUE (fiscal_code, first_name);
\`\`\`

Adesso, ripetendo i passaggi del paragrafo [Simuliamo una scrittura concorrenziale](#simuliamo-una-scrittura-concorrenziale) e otteniamo che nella seconda shell rimarremo in attesa finche dalla prima non effettueremo un rollback
o una commit;

Tutto perfetto ma nella seconda shell otteniamo un messaggio di errore

> ERROR: duplicate key value violates unique constraint "uq_people_fiscal_code_first_name"
> DETAIL: Key (fiscal_code, first_name)=(AAA, Pippo) already exists.

Prima puliamo la tabella

\`\`\`sql
DELETE from people;
\`\`\`

Serve una piccola modifica alla nostra query aggiungendo la clausola \`ON CONFLICT DO NOTHING\` e possiamo riprodurre di nuovo i passaggi del paragrafo [Simuliamo una scrittura concorrenziale](#simuliamo-una-scrittura-concorrenziale)

\`\`\`sql
INSERT INTO people (fiscal_code, first_name)
SELECT
'AAA',
'Pippo'
WHERE NOT EXISTS (
        SELECT fiscal_code, first_name
            FROM people
            WHERE people.fiscal_code = 'AAA'
            AND people.first_name = 'Pippo'
        )
ON CONFLICT DO NOTHING
RETURNING people.id, people.fiscal_code, people.first_name;
\`\`\`

Controlliamo il nostro risultato

\`\`\`sql
SELECT * from people;

 id | fiscal_code | first_name
----+-------------+------------
  7 | AAA         | Pippo
(1 row)
\`\`\`

## Scenario Bonus

E se avessimo uno dei campi della tabella che fosse nullable?

Facciamo una prova

\`\`\`sql
DROP TABLE people;

CREATE TABLE people (
    id SERIAL NOT null,
    fiscal_code VARCHAR(16) NOT null,
    first_name VARCHAR(255) NOT null,
    birth_date timestamptz NULL
);

ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name_birth_date UNIQUE (fiscal_code, first_name, birth_date);

\`\`\`

Inseriamo due righe

\`\`\`sql
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
\`\`\`

\`\`\`sql
SELECT * FROM people;

id | fiscal_code | first_name | birth_date
----+-------------+------------+------------
  1 | AAA         | Pippo      |
  2 | AAA         | Pippo      |
(2 rows)
\`\`\`

Il nostro unique constraint non si è attivato.

Questo perchè da Postgres 15 è necessario usare la clausola \`NULLS NOT DISTINCT\` che permette a Postgres di evitare di trattare i null come chiavi distinte.

Applichiamo le modifiche

\`\`\`sql
DELETE FROM people;

ALTER TABLE people DROP CONSTRAINT uq_people_fiscal_code_first_name_birth_date;

ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name_birth_date UNIQUE NULLS NOT DISTINCT (fiscal_code, first_name, birth_date);
\`\`\`

E questa volta un solo record viene inserito mentre il secondo darà errore

\`\`\`sql
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
\`\`\`

## SQLAlchemy Query

\`\`\`bash
virtualenv .venv
. .venv/bin/activate

pip install sqlalchemy==2.0.36
pip install psycopg2-binary==2.9.10
\`\`\`

\`\`\`python
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql.schema import MetaData
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import String

session_provider = create_engine(
    "postgresql://user:dev@localhost/people",
    future=True
)

metadata_obj = MetaData()


class Base(DeclarativeBase):
    metadata = metadata_obj


class Person(Base):
    __tablename__ = "people"
    __table_args__ = (UniqueConstraint("fiscal_code", "first_name", name="uq_people_fiscal_code_first_name"),)

    id: Mapped[int] = mapped_column(primary_key=True)

    fiscal_code: Mapped[str] = mapped_column(String(16))
    first_name: Mapped[str] = mapped_column(String(255))


with session_provider.begin() as db_session:
    record = (
        insert(Person)
        .values(
            fiscal_code='AAA',
            first_name='Pippo',
        )
        .on_conflict_do_nothing(index_elements=["fiscal_code", "first_name"])
        .returning(Person)
    )

    print(db_session.execute(record).scalar_one_or_none())
\`\`\`
`}function m(){return e}function C(){return[{depth:2,slug:"iniziamo",text:"Iniziamo"},{depth:2,slug:"la-nostra-query",text:"La nostra query"},{depth:2,slug:"simuliamo-una-scrittura-concorrenziale",text:"Simuliamo una scrittura concorrenziale"},{depth:2,slug:"la-soluzione",text:"La soluzione"},{depth:2,slug:"scenario-bonus",text:"Scenario Bonus"},{depth:2,slug:"sqlalchemy-query",text:"SQLAlchemy Query"}]}const f=a((o,c,d)=>{const{layout:r,...s}=l;return s.file=t,s.url=F,n`${p()}${i(e)}`});export{f as Content,m as compiledContent,f as default,t as file,l as frontmatter,C as getHeadings,u as rawContent,F as url};
