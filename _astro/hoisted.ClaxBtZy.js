import"./hoisted.DOXhOvny.js";import"./astro/assets-service.UPL31UwL.js";const t=document.getElementById("to-top-btn"),n=document.getElementById("blog-hero");function r(e){e.forEach(o=>{t.dataset.show=(!o.isIntersecting).toString()})}t.addEventListener("click",()=>{document.documentElement.scrollTo({behavior:"smooth",top:0})});const c=new IntersectionObserver(r);c.observe(n);
