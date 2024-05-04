const e="go-weather.md",o="post",a="go-weather",n=`
# openmeteogo

Nelle ultime settimane mi sono immerso nell'utilizzo di Go per sviluppare una libreria per [open-meteo.com](http://open-meteo.com), ora disponibile su [Github](https://github.com/ophusdev/openmeteogo) che ho nominato openmeteogo.

Come primo approccio a Go, mi sono affidato interamente a [Go by Example](https://gobyexample.com/), cercando di seguire anche la filosofia del Test-Driven Development (TDD).

Devo confessare di aver tralasciato alcuni argomenti (come channels, goroutine, ...) che non erano così rilevanti per il mio progetto, ma su cui probabilmente tornerò in futuro, magari con altri progetti.

Mano a mano che la libreria prendeva forma e integravo le API di open-meteo.com ho deciso di raccogliere i dati meteorologici utilizzando le coordinate geografiche della mia zona e a archiviarli in PostgreSQL, così da poter utilizzare Grafana per creare un dashboard personalizzata.

# Openmeteogo Client

Tempo di creare un container per Postgres sul mio raspberry pi 4 in cui collezionare i dati, era ora di scrivere un client per la mia libreria.

Ho usato sempre Go e creato un progetto command line usando [Cobra](https://github.com/spf13/cobra) e [gorm](https://github.com/go-gorm/gorm) come ORM

Dockerizzata questa nuova cli e fatto partire il nuovo container sempre sul raspberry pi mi è bastato aggiungere un paio di righe nel crontab per vedere il mio postgres popolarsi

\`\`\`bash
    */30 * * * * docker exec home_server-mymeteo-1 sh -c "./mymeteo current-weather 41.902291 12.457257"
    0 */2 * * * docker exec home_server-mymeteo-1 sh -c "./mymeteo hourly-weather 41.902291 12.457257 2"
    0 */4 * * * docker exec home_server-mymeteo-1 sh -c "./mymeteo daily-weather 41.902291 12.457257 4"
    0 */6 * * * docker exec home_server-mymeteo-1 sh -c "./mymeteo current-air-quality 41.902291 12.457257"
    0 */12 * * * docker exec home_server-mymeteo-1 sh -c "./mymeteo hourly-air-quality 41.902291 12.457257 2"
\`\`\`

<br />

# Grafana

Finalmente Grafana aveva qualcosa da mostrare.

Le misurazioni del meteo corrente avevano preso forma
![Meteo attuale](../../assets/go-weather/current_weather.png)

Anche quelle giorno per giorno adesso hanno una dashboard dedicata
![Meteo attuale](../../assets/go-weather/daily_weather.png)

La dashboard delle previsioni orarie mi ha dato qualche noia ma alla fine eccola popolata
![Meteo attuale](../../assets/go-weather/hourly_weather.png)

E per ultima cosa, visto che siamo in stagione, la dashboard delle misurazioni di PM\\* e pollini
![Meteo attuale](../../assets/go-weather/pm_and_pollen.png)
`,t={title:"Una dashboard meteo con Go e Grafana",description:"Sviluppo libreria Go per open-meteo.com",publishDate:new Date(17147736e5),updatedDate:new Date(17147736e5),draft:!1,tags:[]},r={type:"content",filePath:"/home/io/Desktop/ophusdev-blog/src/content/post/go-weather.md",rawData:`
title: "Una dashboard meteo con Go e Grafana"
description: "Sviluppo libreria Go per open-meteo.com"
publishDate: "04 May 2024"
updatedDate: 04 May 2024
tags: []`};export{r as _internal,n as body,o as collection,t as data,e as id,a as slug};
