import { d as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, s as spreadAttributes } from './astro_BITFdyQU.mjs';
import { g as getImage } from './prerender_BQsIGapt.mjs';
import 'clsx';

const Astro__Z1nQwcn = new Proxy({"src":"/_astro/current_weather.DXuqd3rX.png","width":1864,"height":1056,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/current_weather.png";
							}
							globalThis.astroAsset.referencedImages.add("/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/current_weather.png");
							return target[name];
						}
					});

const Astro__OYWO3 = new Proxy({"src":"/_astro/daily_weather.CYgY-JtO.png","width":1864,"height":1056,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/daily_weather.png";
							}
							globalThis.astroAsset.referencedImages.add("/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/daily_weather.png");
							return target[name];
						}
					});

const Astro__Z2YuP8 = new Proxy({"src":"/_astro/hourly_weather.BsL5mwTM.png","width":1864,"height":2804,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/hourly_weather.png";
							}
							globalThis.astroAsset.referencedImages.add("/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/hourly_weather.png");
							return target[name];
						}
					});

const Astro__2bN4a9 = new Proxy({"src":"/_astro/pm_and_pollen.DrfbbC6o.png","width":1864,"height":1816,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/pm_and_pollen.png";
							}
							globalThis.astroAsset.referencedImages.add("/media/io/Dati/linux/ophusdev-blog/src/assets/go-weather/pm_and_pollen.png");
							return target[name];
						}
					});

const images = async function(html) {
					const imageSources = {};
					{
											const regex = new RegExp('__ASTRO_IMAGE_="([^"]*' + "\\.\\./\\.\\./assets/go-weather/current_weather\\.png" + '[^"]*)"', 'g');
											let match;
											let occurrenceCounter = 0;
											while ((match = regex.exec(html)) !== null) {
													const matchKey = "../../assets/go-weather/current_weather.png" + '_' + occurrenceCounter;
													const imageProps = JSON.parse(match[1].replace(/&#x22;/g, '"'));
													const { src, ...props } = imageProps;

													imageSources[matchKey] = await getImage({src: Astro__Z1nQwcn, ...props});
													occurrenceCounter++;
											}
									}
{
											const regex = new RegExp('__ASTRO_IMAGE_="([^"]*' + "\\.\\./\\.\\./assets/go-weather/daily_weather\\.png" + '[^"]*)"', 'g');
											let match;
											let occurrenceCounter = 0;
											while ((match = regex.exec(html)) !== null) {
													const matchKey = "../../assets/go-weather/daily_weather.png" + '_' + occurrenceCounter;
													const imageProps = JSON.parse(match[1].replace(/&#x22;/g, '"'));
													const { src, ...props } = imageProps;

													imageSources[matchKey] = await getImage({src: Astro__OYWO3, ...props});
													occurrenceCounter++;
											}
									}
{
											const regex = new RegExp('__ASTRO_IMAGE_="([^"]*' + "\\.\\./\\.\\./assets/go-weather/hourly_weather\\.png" + '[^"]*)"', 'g');
											let match;
											let occurrenceCounter = 0;
											while ((match = regex.exec(html)) !== null) {
													const matchKey = "../../assets/go-weather/hourly_weather.png" + '_' + occurrenceCounter;
													const imageProps = JSON.parse(match[1].replace(/&#x22;/g, '"'));
													const { src, ...props } = imageProps;

													imageSources[matchKey] = await getImage({src: Astro__Z2YuP8, ...props});
													occurrenceCounter++;
											}
									}
{
											const regex = new RegExp('__ASTRO_IMAGE_="([^"]*' + "\\.\\./\\.\\./assets/go-weather/pm_and_pollen\\.png" + '[^"]*)"', 'g');
											let match;
											let occurrenceCounter = 0;
											while ((match = regex.exec(html)) !== null) {
													const matchKey = "../../assets/go-weather/pm_and_pollen.png" + '_' + occurrenceCounter;
													const imageProps = JSON.parse(match[1].replace(/&#x22;/g, '"'));
													const { src, ...props } = imageProps;

													imageSources[matchKey] = await getImage({src: Astro__2bN4a9, ...props});
													occurrenceCounter++;
											}
									}
					return imageSources;
			};

			async function updateImageReferences(html) {
				return images(html).then((imageSources) => {
						return html.replaceAll(/__ASTRO_IMAGE_="([^"]+)"/gm, (full, imagePath) => {
								const decodedImagePath = JSON.parse(imagePath.replace(/&#x22;/g, '"'));
		
								// Use the 'index' property for each image occurrence
								const srcKey = decodedImagePath.src + '_' + decodedImagePath.index;
		
								if (imageSources[srcKey].srcSet && imageSources[srcKey].srcSet.values.length > 0) {
										imageSources[srcKey].attributes.srcset = imageSources[srcKey].srcSet.attribute;
								}
		
								const { index, ...attributesWithoutIndex } = imageSources[srcKey].attributes;
		
								return spreadAttributes({
										src: imageSources[srcKey].src,
										...attributesWithoutIndex,
								});
						});
				});
		}
		

		// NOTE: This causes a top-level await to appear in the user's code, which can break very easily due to a Rollup
	  // bug and certain adapters not supporting it correctly. See: https://github.com/rollup/rollup/issues/4708
	  // Tread carefully!
			const html = await updateImageReferences("<h2 id=\"openmeteogo\">Openmeteogo</h2>\n<p>Nelle ultime settimane mi sono immerso nell’utilizzo di Go per sviluppare una libreria per <a href=\"http://open-meteo.com\" rel=\"nofollow, noopener, noreferrer\" target=\"_blank\">open-meteo.com</a>, ora disponibile su <a href=\"https://github.com/ophusdev/openmeteogo\" rel=\"nofollow, noopener, noreferrer\" target=\"_blank\">Github</a> che ho nominato openmeteogo.</p>\n<p>Come primo approccio a Go, mi sono affidato interamente a <a href=\"https://gobyexample.com/\" rel=\"nofollow, noopener, noreferrer\" target=\"_blank\">Go by Example</a>, cercando di seguire anche la filosofia del Test-Driven Development (TDD).</p>\n<p>Devo confessare di aver tralasciato alcuni argomenti (come channels, goroutine, …) che non erano così rilevanti per il mio progetto, ma su cui probabilmente tornerò in futuro, magari con altri progetti.</p>\n<p>Mano a mano che la libreria prendeva forma e integravo le API di open-meteo.com ho deciso di raccogliere i dati meteorologici utilizzando le coordinate geografiche della mia zona e a archiviarli in PostgreSQL, così da poter utilizzare Grafana per creare un dashboard personalizzata.</p>\n<h2 id=\"openmeteogo-client\">Openmeteogo Client</h2>\n<p>Tempo di creare un container per Postgres sul mio raspberry pi 4 in cui collezionare i dati, era ora di scrivere un client per la mia libreria.</p>\n<p>Ho usato sempre Go e creato un progetto command line usando <a href=\"https://github.com/spf13/cobra\" rel=\"nofollow, noopener, noreferrer\" target=\"_blank\">Cobra</a> e <a href=\"https://github.com/go-gorm/gorm\" rel=\"nofollow, noopener, noreferrer\" target=\"_blank\">gorm</a> come ORM</p>\n<p>Dockerizzata questa nuova cli e fatto partire il nuovo container sempre sul raspberry pi mi è bastato aggiungere un paio di righe nel crontab per vedere il mio postgres popolarsi</p>\n<div class=\"expressive-code\"><link rel=\"stylesheet\" href=\"/_astro/ec.500gk.css\"><script type=\"module\" src=\"/_astro/ec.sgewm.js\"></script><figure class=\"frame is-terminal\"><figcaption class=\"header\"><span class=\"title\"></span><span class=\"sr-only\">Terminal window</span></figcaption><pre tabindex=\"0\"><code><div class=\"ec-line\"><span style=\"--0:#F8F8F2;--1:#24292E\">    </span><span style=\"--0:#50FA7B;--1:#6F42C1\">*/30</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">docker</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">exec</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">home_server-mymeteo-1</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">sh</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--1:#005CC5\">-c</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--1:#032F62\"><span style=\"--0:#E9F284\">\"</span><span style=\"--0:#F1FA8C\">./mymeteo current-weather 41.902291 12.457257</span><span style=\"--0:#E9F284\">\"</span></span></div><div class=\"ec-line\"><span style=\"--0:#F8F8F2;--1:#24292E\">    </span><span style=\"--0:#50FA7B;--1:#6F42C1\">0</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F1FA8C;--1:#032F62\">/2</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">docker</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">exec</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">home_server-mymeteo-1</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">sh</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--1:#005CC5\">-c</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--1:#032F62\"><span style=\"--0:#E9F284\">\"</span><span style=\"--0:#F1FA8C\">./mymeteo hourly-weather 41.902291 12.457257 2</span><span style=\"--0:#E9F284\">\"</span></span></div><div class=\"ec-line\"><span style=\"--0:#F8F8F2;--1:#24292E\">    </span><span style=\"--0:#50FA7B;--1:#6F42C1\">0</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F1FA8C;--1:#032F62\">/4</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">docker</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">exec</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">home_server-mymeteo-1</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">sh</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--1:#005CC5\">-c</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--1:#032F62\"><span style=\"--0:#E9F284\">\"</span><span style=\"--0:#F1FA8C\">./mymeteo daily-weather 41.902291 12.457257 4</span><span style=\"--0:#E9F284\">\"</span></span></div><div class=\"ec-line\"><span style=\"--0:#F8F8F2;--1:#24292E\">    </span><span style=\"--0:#50FA7B;--1:#6F42C1\">0</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F1FA8C;--1:#032F62\">/6</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">docker</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">exec</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">home_server-mymeteo-1</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">sh</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--1:#005CC5\">-c</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--1:#032F62\"><span style=\"--0:#E9F284\">\"</span><span style=\"--0:#F1FA8C\">./mymeteo current-air-quality 41.902291 12.457257</span><span style=\"--0:#E9F284\">\"</span></span></div><div class=\"ec-line\"><span style=\"--0:#F8F8F2;--1:#24292E\">    </span><span style=\"--0:#50FA7B;--1:#6F42C1\">0</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F1FA8C;--1:#032F62\">/12</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--0fs:italic;--1:#005CC5\">*</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">docker</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">exec</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">home_server-mymeteo-1</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#F1FA8C;--1:#032F62\">sh</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--0:#BD93F9;--1:#005CC5\">-c</span><span style=\"--0:#F8F8F2;--1:#24292E\"> </span><span style=\"--1:#032F62\"><span style=\"--0:#E9F284\">\"</span><span style=\"--0:#F1FA8C\">./mymeteo hourly-air-quality 41.902291 12.457257 2</span><span style=\"--0:#E9F284\">\"</span></span></div></code></pre><div class=\"copy\"><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"*/30 * * * * docker exec home_server-mymeteo-1 sh -c &#x22;./mymeteo current-weather 41.902291 12.457257&#x22;    0 */2 * * * docker exec home_server-mymeteo-1 sh -c &#x22;./mymeteo hourly-weather 41.902291 12.457257 2&#x22;    0 */4 * * * docker exec home_server-mymeteo-1 sh -c &#x22;./mymeteo daily-weather 41.902291 12.457257 4&#x22;    0 */6 * * * docker exec home_server-mymeteo-1 sh -c &#x22;./mymeteo current-air-quality 41.902291 12.457257&#x22;    0 */12 * * * docker exec home_server-mymeteo-1 sh -c &#x22;./mymeteo hourly-air-quality 41.902291 12.457257 2&#x22;\"><div></div></button></div></figure></div>\n<br>\n<h2 id=\"grafana\">Grafana</h2>\n<p>Finalmente Grafana aveva qualcosa da mostrare.</p>\n<p>Le misurazioni del meteo corrente avevano preso forma\n<img __ASTRO_IMAGE_=\"{&#x22;src&#x22;:&#x22;../../assets/go-weather/current_weather.png&#x22;,&#x22;alt&#x22;:&#x22;Meteo attuale&#x22;,&#x22;index&#x22;:0}\"></p>\n<p>Anche quelle giorno per giorno adesso hanno una dashboard dedicata\n<img __ASTRO_IMAGE_=\"{&#x22;src&#x22;:&#x22;../../assets/go-weather/daily_weather.png&#x22;,&#x22;alt&#x22;:&#x22;Meteo attuale&#x22;,&#x22;index&#x22;:0}\"></p>\n<p>La dashboard delle previsioni orarie mi ha dato qualche noia ma alla fine eccola popolata\n<img __ASTRO_IMAGE_=\"{&#x22;src&#x22;:&#x22;../../assets/go-weather/hourly_weather.png&#x22;,&#x22;alt&#x22;:&#x22;Meteo attuale&#x22;,&#x22;index&#x22;:0}\"></p>\n<p>E per ultima cosa, visto che siamo in stagione, la dashboard delle misurazioni di PM* e pollini\n<img __ASTRO_IMAGE_=\"{&#x22;src&#x22;:&#x22;../../assets/go-weather/pm_and_pollen.png&#x22;,&#x22;alt&#x22;:&#x22;Meteo attuale&#x22;,&#x22;index&#x22;:0}\"></p>");
	

				const frontmatter = {"title":"Una dashboard meteo con Go e Grafana","description":"Sviluppo libreria Go per open-meteo.com","publishDate":"04 May 2024","updatedDate":"04 May 2024","tags":["go","grafana"],"minutesRead":"2 min read"};
				const file = "/media/io/Dati/linux/ophusdev-blog/src/content/post/go-weather.md";
				const url = undefined;
				function rawContent() {
					return "\n## Openmeteogo\n\nNelle ultime settimane mi sono immerso nell'utilizzo di Go per sviluppare una libreria per [open-meteo.com](http://open-meteo.com), ora disponibile su [Github](https://github.com/ophusdev/openmeteogo) che ho nominato openmeteogo.\n\nCome primo approccio a Go, mi sono affidato interamente a [Go by Example](https://gobyexample.com/), cercando di seguire anche la filosofia del Test-Driven Development (TDD).\n\nDevo confessare di aver tralasciato alcuni argomenti (come channels, goroutine, ...) che non erano così rilevanti per il mio progetto, ma su cui probabilmente tornerò in futuro, magari con altri progetti.\n\nMano a mano che la libreria prendeva forma e integravo le API di open-meteo.com ho deciso di raccogliere i dati meteorologici utilizzando le coordinate geografiche della mia zona e a archiviarli in PostgreSQL, così da poter utilizzare Grafana per creare un dashboard personalizzata.\n\n## Openmeteogo Client\n\nTempo di creare un container per Postgres sul mio raspberry pi 4 in cui collezionare i dati, era ora di scrivere un client per la mia libreria.\n\nHo usato sempre Go e creato un progetto command line usando [Cobra](https://github.com/spf13/cobra) e [gorm](https://github.com/go-gorm/gorm) come ORM\n\nDockerizzata questa nuova cli e fatto partire il nuovo container sempre sul raspberry pi mi è bastato aggiungere un paio di righe nel crontab per vedere il mio postgres popolarsi\n\n```bash\n    */30 * * * * docker exec home_server-mymeteo-1 sh -c \"./mymeteo current-weather 41.902291 12.457257\"\n    0 */2 * * * docker exec home_server-mymeteo-1 sh -c \"./mymeteo hourly-weather 41.902291 12.457257 2\"\n    0 */4 * * * docker exec home_server-mymeteo-1 sh -c \"./mymeteo daily-weather 41.902291 12.457257 4\"\n    0 */6 * * * docker exec home_server-mymeteo-1 sh -c \"./mymeteo current-air-quality 41.902291 12.457257\"\n    0 */12 * * * docker exec home_server-mymeteo-1 sh -c \"./mymeteo hourly-air-quality 41.902291 12.457257 2\"\n```\n\n<br />\n\n## Grafana\n\nFinalmente Grafana aveva qualcosa da mostrare.\n\nLe misurazioni del meteo corrente avevano preso forma\n![Meteo attuale](../../assets/go-weather/current_weather.png)\n\nAnche quelle giorno per giorno adesso hanno una dashboard dedicata\n![Meteo attuale](../../assets/go-weather/daily_weather.png)\n\nLa dashboard delle previsioni orarie mi ha dato qualche noia ma alla fine eccola popolata\n![Meteo attuale](../../assets/go-weather/hourly_weather.png)\n\nE per ultima cosa, visto che siamo in stagione, la dashboard delle misurazioni di PM\\* e pollini\n![Meteo attuale](../../assets/go-weather/pm_and_pollen.png)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"openmeteogo","text":"Openmeteogo"},{"depth":2,"slug":"openmeteogo-client","text":"Openmeteogo Client"},{"depth":2,"slug":"grafana","text":"Grafana"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
