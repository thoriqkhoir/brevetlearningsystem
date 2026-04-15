import{j as e}from"./app-CMYhhKgO.js";import{a as n}from"./index-BI04LgUm.js";import{B as s}from"./button-SspX7Pmj.js";import{D as o,b as a,e as d,d as c,f as l}from"./dropdown-menu-CQ7h3Ypo.js";import{c as p}from"./createLucideIcon-D-fEVEk4.js";/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]],h=p("Settings2",x);function y({table:t}){return e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsxs(s,{variant:"outline",className:"ml-auto hidden h-8 lg:flex",children:[e.jsx(h,{}),"Filter"]})}),e.jsxs(a,{children:[e.jsx(d,{children:"Filter columns"}),e.jsx(c,{}),t.getAllColumns().filter(r=>typeof r.accessorFn<"u"&&r.getCanHide()).map(r=>e.jsx(l,{className:"capitalize",checked:r.getIsVisible(),onCheckedChange:i=>r.toggleVisibility(!!i),children:r.id},r.id))]})]})}export{y as D};
