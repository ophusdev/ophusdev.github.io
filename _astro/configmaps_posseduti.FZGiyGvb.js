const a="configmaps_posseduti.md",e="post",n="configmaps_posseduti",o=`
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
`,i={title:"Grafana provisioning e i configmaps posseduti",description:"Un piccolo racconto di dashboard Grafana continuavano ad apparire anche se non dovevano",publishDate:new Date(1719612e6),updatedDate:new Date(1719612e6),draft:!1,tags:["grafana","k8s","helm"]},s={type:"content",filePath:"/home/io/Documents/code/ophusdev-blog/src/content/post/configmaps_posseduti.md",rawData:`
title: "Grafana provisioning e i configmaps posseduti"
description: "Un piccolo racconto di dashboard Grafana continuavano ad apparire anche se non dovevano"
publishDate: "29 June 2024"
updatedDate: 29 June 2024
tags: ["grafana", "k8s", "helm"]`};export{s as _internal,o as body,e as collection,i as data,a as id,n as slug};
