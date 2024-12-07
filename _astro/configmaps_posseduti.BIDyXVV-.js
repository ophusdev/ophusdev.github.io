import{c as n,r as o,m as i}from"./render-template.luloOCeF.js";import{u as s}from"./hoisted.CX9BuXzO.js";import"./astro/assets-service.UPL31UwL.js";const e=`<h2 id="provisioning-delle-dashboard-di-grafana">Provisioning delle dashboard di Grafana</h2>
<p>Ho dovuto aggiornare una installazione di Grafana deployata su K8s utilizzando Helm modificando la struttura di alcune dashboard, eliminandone alcune e creandone di nuove ma ho incontrato un problema piuttosto frustrante: ogni volta che aggiornavo Grafana,
le vecchie dashboard venivano ricreate automaticamente.</p>
<h2 id="un-paio-di-informazioni-preliminari">Un paio di informazioni preliminari</h2>
<p>Istanza di Grafana deployata su K8s utilizzando Helm con il provisioning delle dashboard caricate da files locali in modo che tutte le modifiche siano tracciate su un repository git e soprattuto riproducibili su ambienti diversi usando una pipeline bash.</p>
<p>Grafana è configurato con un sidecar che monitor le dashboard definite in specifici ConfigMap. Ogni volta che eseguivo un aggiornamento di Grafana tramite Helm, mi ritrovavo con le vecchie dashboard che venivano ripristinate anche se non esistevano piu fisicamente nel mio repository.</p>
<p>Tra queste dashboard c’erano alcune che avevo già eliminato e alcune che invece cercavo di eliminare con l’attività di oggi.
Questo mi creava abbastanza confusione perchè mi aspettavo che quello che doveva essere cancellato venisse cancellato e non ricomparisse.</p>
<p>Inoltre, dato che stavo cercando di fare un deploy con provisioning di Grafana non era possibile cancellare le dashboard dall UI di Grafana.</p>
<h2 id="piano-a">Piano A</h2>
<p>Il primo passo è stato capire da dove provenissero queste vecchie dashboard.</p>
<p>Avevo aggiornato i miei file di configurazione per rimuovere le vecchie dashboard, ma il problema persisteva.</p>
<p>Accedo direttamente al pod e nella folder <code>/tmp/dashboard</code> anche se cancello i files delle dashboard dopo 30 secondi si ricreano in automatico.</p>
<p>Questo mi ha portato a considerare che la causa potesse risiedere nei ConfigMap che il sidecar di Grafana stava monitorando.</p>
<p>Quindi veloce ricerca su <a href="https://letmegooglethat.com/?q=delete+provisioned+grafana+dashboard+on+k8s" rel="nofollow, noopener, noreferrer" target="_blank">Google</a> portava un sacco di risultati anche poco incoraggianti dato che sembra non possibile cancellare le dashboard se non si cancellano fisicamente i file dalla macchine e se non si agisce a mano sul database sqlite, cosa che tra l’altro non potevo fare poichè il pod k8s non aveva la possibilità di installare alcun pacchetto esterno.</p>
<p>Ho anche provato a compilare sqlite direttamente sul pod scoprendo altri nuovi problemi da risolvere e spendendo energie nella risoluzione di un problema che non dovevo risolvere.</p>
<p>Arriva il momento del piano B</p>
<h2 id="piano-b">Piano B</h2>
<p>15 minuti di pausa dalla scrivania, un pò di merenda e arriva l’illuminazione per il piano C</p>
<h2 id="piano-c">Piano C</h2>
<p>Se vengono ricreate le dashboard da qualche parte devono essere salvate.</p>
<p>Mi sono assicurato che il volume del pod fosse vergine e che non si portasse dietro nessun dato preesistente.
Quindi l’ho cancellato e forzato K8s a creane uno nuovo.</p>
<p>Il problema si ripresenta.</p>
<p>Ottimo, se k8s non storicizza le dashboard sul disco fisico dove storicizza i configmap? Torniamo sulla doc <a href="https://kubernetes.io/docs/concepts/configuration/configmap/" rel="nofollow, noopener, noreferrer" target="_blank">https://kubernetes.io/docs/concepts/configuration/configmap/</a> ed ecco il comando che cercavo</p>
<div class="expressive-code"><link rel="stylesheet" href="/_astro/ec.500gk.css"><script type="module" src="/_astro/ec.sgewm.js"><\/script><figure class="frame is-terminal"><figcaption class="header"><span class="title"></span><span class="sr-only">Terminal window</span></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#50FA7B;--1:#6F42C1">kubectl</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">get</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">configmaps</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="kubectl get configmaps"><div></div></button></div></figure></div>
<p>Bingo! per qualche motivo li c’erano tutte le dashboard che cercavo e che volevo eliminare definitivamente.
Facciamo pulizia con un paio di copia incolla e ripartiamo da zero</p>
<div class="expressive-code"><figure class="frame is-terminal"><figcaption class="header"><span class="title"></span><span class="sr-only">Terminal window</span></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#50FA7B;--1:#6F42C1">kubectl</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">delete</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">configmap</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">&#x3C;name></span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="kubectl delete configmap <name>"><div></div></button></div></figure></div>
<h2 id="deploy-delle-nuove-dashboard">Deploy delle nuove dashboard</h2>
<p>Ho atteso qualche minuto per vedere se le dashboard venissero ricreate ma niente è ricomparso.</p>
<p>Possiamo procedere con l’applicazione delle nuove dashboard che avevo già preparato</p>
<div class="expressive-code"><figure class="frame is-terminal"><figcaption class="header"><span class="title"></span><span class="sr-only">Terminal window</span></figcaption><pre tabindex="0"><code><div class="ec-line"><span style="--0:#50FA7B;--1:#6F42C1">helm</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">upgrade</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">grafana</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">grafana/grafana</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#BD93F9;--1:#005CC5">-f</span><span style="--0:#F8F8F2;--1:#24292E"> </span><span style="--0:#F1FA8C;--1:#032F62">values.yaml</span></div></code></pre><div class="copy"><button title="Copy to clipboard" data-copied="Copied!" data-code="helm upgrade grafana grafana/grafana -f values.yaml"><div></div></button></div></figure></div>
<p>Dashboard operative, ambiente allineato alla struttura del repository e passi riproducibili con un paio di comandi.</p>
<p>Prossima settimana si farà la stessa cosa anche per gli alerts.</p>`,r={title:"Grafana provisioning e i configmaps posseduti",description:"Un piccolo racconto di dashboard Grafana che continuavano ad apparire anche se non dovevano",publishDate:"29 June 2024",updatedDate:"29 June 2024",tags:["grafana","k8s","helm"],minutesRead:"3 min read"},t="/media/io/Dati/linux/ophusdev-blog/src/content/post/configmaps_posseduti.md",l=void 0;function f(){return`
## Provisioning delle dashboard di Grafana

Ho dovuto aggiornare una installazione di Grafana deployata su K8s utilizzando Helm modificando la struttura di alcune dashboard, eliminandone alcune e creandone di nuove ma ho incontrato un problema piuttosto frustrante: ogni volta che aggiornavo Grafana,
le vecchie dashboard venivano ricreate automaticamente.

## Un paio di informazioni preliminari

Istanza di Grafana deployata su K8s utilizzando Helm con il provisioning delle dashboard caricate da files locali in modo che tutte le modifiche siano tracciate su un repository git e soprattuto riproducibili su ambienti diversi usando una pipeline bash.

Grafana è configurato con un sidecar che monitor le dashboard definite in specifici ConfigMap. Ogni volta che eseguivo un aggiornamento di Grafana tramite Helm, mi ritrovavo con le vecchie dashboard che venivano ripristinate anche se non esistevano piu fisicamente nel mio repository.

Tra queste dashboard c'erano alcune che avevo già eliminato e alcune che invece cercavo di eliminare con l'attività di oggi.
Questo mi creava abbastanza confusione perchè mi aspettavo che quello che doveva essere cancellato venisse cancellato e non ricomparisse.

Inoltre, dato che stavo cercando di fare un deploy con provisioning di Grafana non era possibile cancellare le dashboard dall UI di Grafana.

## Piano A

Il primo passo è stato capire da dove provenissero queste vecchie dashboard.

Avevo aggiornato i miei file di configurazione per rimuovere le vecchie dashboard, ma il problema persisteva.

Accedo direttamente al pod e nella folder \`/tmp/dashboard\` anche se cancello i files delle dashboard dopo 30 secondi si ricreano in automatico.

Questo mi ha portato a considerare che la causa potesse risiedere nei ConfigMap che il sidecar di Grafana stava monitorando.

Quindi veloce ricerca su [Google](https://letmegooglethat.com/?q=delete+provisioned+grafana+dashboard+on+k8s) portava un sacco di risultati anche poco incoraggianti dato che sembra non possibile cancellare le dashboard se non si cancellano fisicamente i file dalla macchine e se non si agisce a mano sul database sqlite, cosa che tra l'altro non potevo fare poichè il pod k8s non aveva la possibilità di installare alcun pacchetto esterno.

Ho anche provato a compilare sqlite direttamente sul pod scoprendo altri nuovi problemi da risolvere e spendendo energie nella risoluzione di un problema che non dovevo risolvere.

Arriva il momento del piano B

## Piano B

15 minuti di pausa dalla scrivania, un pò di merenda e arriva l'illuminazione per il piano C

## Piano C

Se vengono ricreate le dashboard da qualche parte devono essere salvate.

Mi sono assicurato che il volume del pod fosse vergine e che non si portasse dietro nessun dato preesistente.
Quindi l'ho cancellato e forzato K8s a creane uno nuovo.

Il problema si ripresenta.

Ottimo, se k8s non storicizza le dashboard sul disco fisico dove storicizza i configmap? Torniamo sulla doc https://kubernetes.io/docs/concepts/configuration/configmap/ ed ecco il comando che cercavo

\`\`\`bash
kubectl get configmaps
\`\`\`

Bingo! per qualche motivo li c'erano tutte le dashboard che cercavo e che volevo eliminare definitivamente.
Facciamo pulizia con un paio di copia incolla e ripartiamo da zero

\`\`\`bash
kubectl delete configmap <name>
\`\`\`

## Deploy delle nuove dashboard

Ho atteso qualche minuto per vedere se le dashboard venissero ricreate ma niente è ricomparso.

Possiamo procedere con l'applicazione delle nuove dashboard che avevo già preparato

\`\`\`bash
helm upgrade grafana grafana/grafana -f values.yaml
\`\`\`

Dashboard operative, ambiente allineato alla struttura del repository e passi riproducibili con un paio di comandi.

Prossima settimana si farà la stessa cosa anche per gli alerts.
`}function g(){return e}function b(){return[{depth:2,slug:"provisioning-delle-dashboard-di-grafana",text:"Provisioning delle dashboard di Grafana"},{depth:2,slug:"un-paio-di-informazioni-preliminari",text:"Un paio di informazioni preliminari"},{depth:2,slug:"piano-a",text:"Piano A"},{depth:2,slug:"piano-b",text:"Piano B"},{depth:2,slug:"piano-c",text:"Piano C"},{depth:2,slug:"deploy-delle-nuove-dashboard",text:"Deploy delle nuove dashboard"}]}const F=n((c,d,p)=>{const{layout:u,...a}=r;return a.file=t,a.url=l,o`${i()}${s(e)}`});export{F as Content,g as compiledContent,F as default,t as file,r as frontmatter,b as getHeadings,f as rawContent,l as url};
