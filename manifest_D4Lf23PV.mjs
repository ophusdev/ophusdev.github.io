import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import './chunks/astro_BITFdyQU.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    })
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"","routes":[{"file":"file:///media/io/Dati/linux/ophusdev-blog/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///media/io/Dati/linux/ophusdev-blog/dist/404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///media/io/Dati/linux/ophusdev-blog/dist/about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///media/io/Dati/linux/ophusdev-blog/dist/rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///media/io/Dati/linux/ophusdev-blog/dist/tags/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tags","isIndex":true,"type":"page","pattern":"^\\/tags\\/?$","segments":[[{"content":"tags","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tags/index.astro","pathname":"/tags","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BG5lM7_G.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_astro/ec.500gk.css","pattern":"^\\/_astro\\/ec\\.500gk\\.css$","segments":[[{"content":"_astro","dynamic":false,"spread":false}],[{"content":"ec.500gk.css","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro-expressive-code/routes/styles.ts","pathname":"/_astro/ec.500gk.css","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BG5lM7_G.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_astro/ec.sgewm.js","pattern":"^\\/_astro\\/ec\\.sgewm\\.js$","segments":[[{"content":"_astro","dynamic":false,"spread":false}],[{"content":"ec.sgewm.js","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro-expressive-code/routes/scripts.ts","pathname":"/_astro/ec.sgewm.js","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://ophusdev.github.io","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/utils/post.ts",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/utils/index.ts",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/components/FormattedDate.astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/components/blog/Hero.astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/layouts/BlogPost.astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/posts/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/posts/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/components/blog/PostPreview.astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/posts/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/posts/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/tags/[tag]/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/tags/[tag]/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/components/blog/webmentions/index.astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/og-image/[slug].png.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/og-image/[slug].png@_@ts",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/tags/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/tags/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/media/io/Dati/linux/ophusdev-blog/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/media/io/Dati/linux/ophusdev-blog/src/pages/about.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro-expressive-code/routes/styles@_@ts":"pages/_astro/ec.500gk.css.astro.mjs","\u0000@astro-page:node_modules/astro-expressive-code/routes/scripts@_@ts":"pages/_astro/ec.sgewm.js.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/og-image/[slug].png@_@ts":"pages/og-image/_slug_.astro.mjs","\u0000@astro-page:src/pages/posts/[slug]@_@astro":"pages/posts/_slug_.astro.mjs","\u0000@astro-page:src/pages/posts/[...page]@_@astro":"pages/posts/_---page_.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/tags/index@_@astro":"pages/tags.astro.mjs","\u0000@astro-page:src/pages/tags/[tag]/[...page]@_@astro":"pages/tags/_tag_/_---page_.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/node_modules/astro-expressive-code/routes/scripts.ts":"chunks/pages/scripts_DFsGyZVS.mjs","/node_modules/astro-expressive-code/routes/styles.ts":"chunks/pages/styles_DFBWuCKD.mjs","\u0000@astrojs-manifest":"manifest_D4Lf23PV.mjs","/media/io/Dati/linux/ophusdev-blog/src/content/post/configmaps_posseduti.md?astroContentCollectionEntry=true":"_astro/configmaps_posseduti.C9Vl5ZHC.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/digital-reset.md?astroContentCollectionEntry=true":"_astro/digital-reset.B09aJ-IU.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/first-commit.md?astroContentCollectionEntry=true":"_astro/first-commit.B2K7LbS4.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/go-weather.md?astroContentCollectionEntry=true":"_astro/go-weather.DIy7krKC.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/postgres-race-condition-and-unique-constraint.md?astroContentCollectionEntry=true":"_astro/postgres-race-condition-and-unique-constraint.B3PCa0wh.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/twelve-factor.md?astroContentCollectionEntry=true":"_astro/twelve-factor.B2ga1lXd.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/configmaps_posseduti.md?astroPropagatedAssets":"_astro/configmaps_posseduti.BzzYB0ye.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/digital-reset.md?astroPropagatedAssets":"_astro/digital-reset.DThRZdyr.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/first-commit.md?astroPropagatedAssets":"_astro/first-commit.Bq-jVTeq.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/go-weather.md?astroPropagatedAssets":"_astro/go-weather.nBhz78UZ.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/postgres-race-condition-and-unique-constraint.md?astroPropagatedAssets":"_astro/postgres-race-condition-and-unique-constraint.Dq9g8PGK.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/twelve-factor.md?astroPropagatedAssets":"_astro/twelve-factor.B3Oj3ODL.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/configmaps_posseduti.md":"_astro/configmaps_posseduti.BIDyXVV-.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/digital-reset.md":"_astro/digital-reset.CkRn10u3.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/first-commit.md":"_astro/first-commit.DCT_ZS3t.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/go-weather.md":"_astro/go-weather.BwFZGUHz.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/postgres-race-condition-and-unique-constraint.md":"_astro/postgres-race-condition-and-unique-constraint.Cd32toe8.js","/media/io/Dati/linux/ophusdev-blog/src/content/post/twelve-factor.md":"_astro/twelve-factor.DEMn1w2H.js","/astro/hoisted.js?q=1":"_astro/hoisted.CX9BuXzO.js","astro:scripts/page.js":"_astro/page.BG5lM7_G.js","/astro/hoisted.js?q=0":"_astro/hoisted.-qp7XOvm.js","/media/io/Dati/linux/ophusdev-blog/node_modules/@pagefind/default-ui/npm_dist/mjs/ui-core.mjs":"_astro/ui-core.6Kl4khJz.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/page.BG5lM7_G.js","/file:///media/io/Dati/linux/ophusdev-blog/dist/index.html","/file:///media/io/Dati/linux/ophusdev-blog/dist/404.html","/file:///media/io/Dati/linux/ophusdev-blog/dist/about/index.html","/file:///media/io/Dati/linux/ophusdev-blog/dist/rss.xml","/file:///media/io/Dati/linux/ophusdev-blog/dist/tags/index.html"],"buildFormat":"directory"});

export { manifest };
