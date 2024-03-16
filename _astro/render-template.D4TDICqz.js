import{H as g,i as b,m,e as S,a as v,b as A}from"./hoisted.BkfrAwNe.js";const u={name:"InvalidComponentArgs",title:"Invalid component arguments.",message:t=>`Invalid arguments passed to${t?` <${t}>`:""} component.`,hint:"Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."};function R(t){return t.replace(/\r\n|\r(?!\n)|\n/g,`
`)}function d(t,e){if(!e||e.line===void 0||e.column===void 0)return"";const s=R(t).split(`
`).map(i=>i.replace(/\t/g,"  ")),r=[];for(let i=-2;i<=2;i++)s[e.line+i]&&r.push(e.line+i);let n=0;for(const i of r){let a=`> ${i}`;a.length>n&&(n=a.length)}let o="";for(const i of r){const a=i===e.line-1;o+=a?"> ":"  ",o+=`${i+1} | ${s[i]}
`,a&&(o+=`${Array.from({length:n}).join(" ")}  | ${Array.from({length:e.column}).join(" ")}^
`)}return o}class C extends Error{loc;title;hint;frame;type="AstroError";constructor(e,s){const{name:r,title:n,message:o,stack:i,location:a,hint:h,frame:w}=e;super(o,s),this.title=n,this.name=r,o&&(this.message=o),this.stack=i||this.stack,this.loc=a,this.hint=h,this.frame=w}setLocation(e){this.loc=e}setName(e){this.name=e}setMessage(e){this.message=e}setHint(e){this.hint=e}setFrame(e,s){this.frame=d(e,s)}static is(e){return e.type==="AstroError"}}function T(t){return!(t.length!==3||!t[0]||typeof t[0]!="object")}function l(t,e,s){const r=e?.split("/").pop()?.replace(".astro","")??"",n=(...o)=>{if(!T(o))throw new C({...u,message:u.message(r)});return t(...o)};return Object.defineProperty(n,"name",{value:r,writable:!1}),n.isAstroComponentFactory=!0,n.moduleId=e,n.propagation=s,n}function I(t){return l(t.factory,t.moduleId,t.propagation)}function M(t,e,s){return typeof t=="function"?l(t,e,s):I(t)}const P=Symbol.for("astro:render");function F(t){return Object.defineProperty(t,P,{value:!0})}function p(t){const e=[],s={write:n=>e.push(n)},r=t(s);return{async renderToFinalDestination(n){for(const o of e)n.write(o);s.write=o=>n.write(o),await r}}}function*x(){yield F({type:"maybe-head"})}const c=Symbol.for("astro:slot-string");class L extends g{instructions;[c];constructor(e,s){super(e),this.instructions=s,this[c]=!0}}async function f(t,e){if(e=await e,e instanceof L)t.write(e);else if(b(e))t.write(e);else if(Array.isArray(e)){const s=e.map(r=>p(n=>f(n,r)));for(const r of s)r&&await r.renderToFinalDestination(t)}else if(typeof e=="function")await f(t,e());else if(typeof e=="string")t.write(m(S(e)));else if(!(!e&&e!==0))if(v(e))await e.render(t);else if(k(e))await e.render(t);else if($(e))await e.render(t);else if(ArrayBuffer.isView(e))t.write(e);else if(typeof e=="object"&&(Symbol.asyncIterator in e||Symbol.iterator in e))for await(const s of e)await f(t,s);else t.write(e)}const H=Symbol.for("astro.componentInstance");function $(t){return typeof t=="object"&&!!t[H]}const y=Symbol.for("astro.renderTemplateResult");class j{[y]=!0;htmlParts;expressions;error;constructor(e,s){this.htmlParts=e,this.error=void 0,this.expressions=s.map(r=>A(r)?Promise.resolve(r).catch(n=>{if(!this.error)throw this.error=n,n}):r)}async render(e){const s=this.expressions.map(r=>p(n=>{if(r||r===0)return f(n,r)}));for(let r=0;r<this.htmlParts.length;r++){const n=this.htmlParts[r],o=s[r];e.write(m(n)),o&&await o.renderToFinalDestination(e)}}}function k(t){return typeof t=="object"&&!!t[y]}function E(t,...e){return new j(t,e)}export{M as c,x as m,E as r};
