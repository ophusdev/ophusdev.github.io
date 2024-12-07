import { d as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_BITFdyQU.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<h2 id=\"qualche-info-generale-sul-setup\">Qualche info generale sul setup</h2>\n<p>Il sito è costruito con Astro 4.0.</p>\n<p>Il sito è hostato sulle Github Pages e dployato usando le Github Actions\nogni volta che viene pushato un commit su master</p>";

				const frontmatter = {"title":"First commit","description":"Setup del sito e deploy","publishDate":"10 Mar 2024","updatedDate":"10 Mar 2024","tags":[],"minutesRead":"1 min read"};
				const file = "/media/io/Dati/linux/ophusdev-blog/src/content/post/first-commit.md";
				const url = undefined;
				function rawContent() {
					return "\n## Qualche info generale sul setup\n\nIl sito è costruito con Astro 4.0.\n\nIl sito è hostato sulle Github Pages e dployato usando le Github Actions\nogni volta che viene pushato un commit su master\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"qualche-info-generale-sul-setup","text":"Qualche info generale sul setup"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
