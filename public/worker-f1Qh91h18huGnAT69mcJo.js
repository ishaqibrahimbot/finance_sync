(()=>{"use strict";var e=[,(e,t,r)=>{r.r(t),r.d(t,{util:()=>o});const o=()=>{console.log("Starting utils")}}],t={};function r(o){var n=t[o];if(void 0!==n)return n.exports;var s=t[o]={exports:{}};return e[o](s,s.exports,r),s.exports}r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};r.r(o),(0,r(1).util)(),self.addEventListener("fetch",(async e=>{"/api/share"===new URL(e.request.url).pathname&&"POST"===e.request.method&&e.respondWith(async function(e){console.log("HANDLING POST FROM '/api/share'");const t=e.clone(),r=await t.formData(),o=r.get("prompt"),n=r.get("image");return console.log("PROMPT: ",o),o?Response.redirect(`/?prompt=${encodeURIComponent(o)}`):n&&n.size/1e6>=4.5?Response.redirect(`/?message=${encodeURIComponent("Sorry, we don't support direct share of images greater than 4.5Mb. Please upload it here instead.")}`):fetch(e)}(e.request))}))})();