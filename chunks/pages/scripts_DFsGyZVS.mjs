const scripts = [["/_astro/ec.sgewm.js","function domCopy(text){let n=document.createElement('pre');Object.assign(n.style,{opacity:'0',pointerEvents:'none',position:'absolute',overflow:'hidden',left:'0',top:'0',width:'20px',height:'20px',webkitUserSelect:'auto',userSelect:'all'});n.ariaHidden='true';n.textContent=text;document.body.appendChild(n);let r=document.createRange();r.selectNode(n);let s=getSelection();s.removeAllRanges();s.addRange(r);let ok=false;try{ok=document.execCommand('copy')}finally{s.removeAllRanges();document.body.removeChild(n)}return ok;}async function clickHandler(event){let btn=event.currentTarget;let ok=false;let code=btn.dataset.code.replace(/\\u007f/g,'\\n');try{await navigator.clipboard.writeText(code);ok=true}catch(err){ok=domCopy(code)}if(!ok || btn.parentNode.querySelector('.feedback'))return;let tt=document.createElement('div');tt.classList.add('feedback');tt.append(btn.dataset.copied);btn.before(tt);tt.offsetWidth;requestAnimationFrame(()=>tt.classList.add('show'));let h=()=>!tt || tt.classList.remove('show');let r=()=>{if(!(!tt || parseFloat(getComputedStyle(tt).opacity)>0)){tt.remove();tt=null}};setTimeout(h,1500);setTimeout(r,2500);btn.addEventListener('blur',h);tt.addEventListener('transitioncancel',r);tt.addEventListener('transitionend',r);}let initButtons=n=>!n.querySelectorAll || n.querySelectorAll('.expressive-code .copy button').forEach(btn=>btn.addEventListener('click',clickHandler));initButtons(document);let obs=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>initButtons(n))));obs.observe(document.body,{childList:true,subtree:true});document.addEventListener('astro:page-load',()=>initButtons(document));"]];

const prerender = true;
const GET = ({ url }) => {
  const match = scripts.find(([route]) => url.pathname.endsWith(route));
  if (!match) throw new Error(`No scripts found for route ${url.pathname}`);
  return new Response(match[1], { headers: { "Content-Type": "text/javascript", "Cache-Control": "public,max-age=31536000,immutable" } });
};

export { GET, prerender };
