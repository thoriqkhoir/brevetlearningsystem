import{j as e}from"./app-CCDbFHFB.js";import{c as n}from"./utils-jAU0Cazi.js";import{B as c}from"./button-2Sj_NLn7.js";import{D as x,a as l,b as m,c as r,d as p}from"./dropdown-menu-Ca2-YPML.js";import{c as d}from"./createLucideIcon-CMvc5qy_.js";import{C as h}from"./chevrons-up-down-DkuL9-AE.js";import{E as g}from"./eye-off-DYdehe35.js";/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],a=d("ArrowDown",j);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],i=d("ArrowUp",f);function N({column:s,title:o,className:t}){return s.getCanSort()?e.jsx("div",{className:n("flex items-center space-x-2",t),children:e.jsxs(x,{children:[e.jsx(l,{asChild:!0,children:e.jsxs(c,{variant:"ghost",className:"-ml-3 h-8 data-[state=open]:bg-accent",children:[e.jsx("span",{children:o}),s.getIsSorted()==="desc"?e.jsx(a,{}):s.getIsSorted()==="asc"?e.jsx(i,{}):e.jsx(h,{})]})}),e.jsxs(m,{align:"start",children:[e.jsxs(r,{onClick:()=>s.toggleSorting(!1),children:[e.jsx(i,{className:"h-3.5 w-3.5 text-muted-foreground/70"}),"Asc"]}),e.jsxs(r,{onClick:()=>s.toggleSorting(!0),children:[e.jsx(a,{className:"h-3.5 w-3.5 text-muted-foreground/70"}),"Desc"]}),e.jsx(p,{}),e.jsxs(r,{onClick:()=>s.toggleVisibility(!1),children:[e.jsx(g,{className:"h-3.5 w-3.5 text-muted-foreground/70"}),"Hide"]})]})]})}):e.jsx("div",{className:n(t),children:o})}export{N as D};
