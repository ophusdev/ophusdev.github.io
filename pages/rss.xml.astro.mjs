export { renderers } from '../renderers.mjs';
export { onRequest } from '../_empty-middleware.mjs';

const page = () => import('../chunks/prerender_BQsIGapt.mjs').then(n => n.r);

export { page };
