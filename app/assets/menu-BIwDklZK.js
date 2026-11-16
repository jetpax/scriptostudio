import{h as v,e as p,P as b,A as f,X as m,y as h}from"./vendor-D_y76g1R.js";const i=v.bind(p);function u(...t){return t.filter(Boolean).join(" ")}function T({variant:t="default",size:a="m",class:s,children:l,...e}){return i`<button type="button" class=${u("ui-button",s)} data-variant=${t} data-size=${a} ...${e}>${l}</button>`}function S({options:t,value:a,onChange:s,tone:l="plain",label:e,class:n}){return i`
    <div class=${u("ui-segmented",n)} role="radiogroup" aria-label=${e} data-tone=${l}>
      ${t.map($=>i`
        <button type="button" role="radio" aria-checked=${$.value===a} disabled=${$.disabled}
          onClick=${()=>$.value!==a&&s&&s($.value)}>${$.label}</button>
      `)}
    </div>`}function D({checked:t,onChange:a,label:s,disabled:l,class:e}){return i`
    <button type="button" role="switch" class=${u("ui-toggle",e)} aria-checked=${!!t} aria-label=${s} disabled=${l}
      onClick=${()=>a&&a(!t)}><i></i></button>`}function F({label:t,hint:a,error:s,children:l,class:e}){const n=b(),$=Array.isArray(l)?l[0]:l;return i`
    <div class=${u("ui-field",e)} data-invalid=${!!s}>
      <label for=${n}>${t}</label>
      ${typeof $=="function"?$(n):$}
      ${s?i`<small class="ui-field-error">${s}</small>`:a?i`<small>${a}</small>`:null}
    </div>`}function L({value:t,onInput:a,class:s,...l}){return i`<input class=${u("ui-input",s)} type="text" value=${t} onInput=${e=>a&&a(e.target.value)} ...${l} />`}function A({value:t,onInput:a,unit:s,class:l,...e}){return i`
    <span class=${u("ui-input ui-input-unit",l)}>
      <input type="text" inputmode="decimal" value=${t} onInput=${n=>a&&a(n.target.value)} ...${e} />
      ${s?i`<i>${s}</i>`:null}
    </span>`}function B({value:t,onChange:a,options:s,class:l,...e}){return i`
    <select class=${u("ui-input ui-select",l)} value=${t} onChange=${n=>a&&a(n.target.value)} ...${e}>
      ${s.map(n=>i`<option value=${n.value} selected=${n.value===t}>${n.label}</option>`)}
    </select>`}function y({tone:t="ok",pulse:a}){return i`<span class="ui-dot" data-tone=${t} data-pulse=${!!a}></span>`}function E({tone:t,pulse:a,children:s,class:l,...e}){return i`<span class=${u("ui-chip",l)} ...${e}>${t?i`<${y} tone=${t} pulse=${a} />`:null}${s}</span>`}function g({title:t,actions:a,children:s,class:l,...e}){return i`
    <section class=${u("ui-card",l)} ...${e}>
      ${t||a?i`<header><h3>${t}</h3>${a?i`<div class="ui-card-actions">${a}</div>`:null}</header>`:null}
      ${s}
    </section>`}function j({title:t,detail:a,children:s}){return i`
    <div class="ui-row">
      <div class="ui-row-text"><b>${t}</b>${a?i`<span>${a}</span>`:null}</div>
      <div class="ui-row-control">${s}</div>
    </div>`}function I({label:t,value:a,unit:s}){return i`<div class="ui-stat"><small>${t}</small><span><b>${a}</b>${s?i`<i>${s}</i>`:null}</span></div>`}function N({items:t}){return i`<dl class="ui-facts">${t.map(([a,s])=>i`<dt>${a}</dt><dd>${s}</dd>`)}</dl>`}function R({tabs:t,value:a,onChange:s,class:l}){return i`
    <div class=${u("ui-tabs",l)} role="tablist">
      ${t.map(e=>i`
        <button type="button" role="tab" aria-selected=${e.value===a} onClick=${()=>s&&s(e.value)}>${e.label}</button>
      `)}
    </div>`}function c({open:t,onClose:a,kind:s,side:l,label:e,children:n,class:$}){return f(()=>{if(!t)return;const r=o=>{o.key==="Escape"&&a&&a()};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[t,a]),t?m(i`
    <div class="ui-scrim" onClick=${r=>{r.target===r.currentTarget&&a&&a()}}>
      <div class=${u("ui-"+s,$)} data-side=${l} role="dialog" aria-modal="true" aria-label=${e}>
        ${s==="sheet"?i`<div class="ui-sheet-grab" onClick=${a}></div>`:null}
        ${n}
      </div>
    </div>`,document.body):null}function z({title:t,actions:a,children:s,...l}){return i`
    <${c} kind="dialog" label=${t} ...${l}>
      ${t?i`<h3>${t}</h3>`:null}
      <div class="ui-dialog-body">${s}</div>
      ${a?i`<div class="ui-dialog-actions">${a}</div>`:null}
    <//>`}function C(t){return i`<${c} kind="sheet" ...${t} />`}function K({side:t="left",...a}){return i`<${c} kind="drawer" side=${t} ...${a} />`}const d=h([]);let k=1;function O(t,a="ok"){const s=k++;d.value=[...d.value,{id:s,text:t,kind:a}],setTimeout(()=>{d.value=d.value.filter(l=>l.id!==s)},a==="error"?6e3:2500)}function P(){return i`<div class="ui-toasts" aria-live="polite">${d.value.map(t=>i`<div key=${t.id} class="ui-toast" data-kind=${t.kind}>${t.text}</div>`)}</div>`}function w({items:t}){return i`<span class="ui-legend">${t.map(a=>i`<span><i style=${{background:a.color}} data-dashed=${!!a.dashed}></i>${a.label}</span>`)}</span>`}function X({title:t,legend:a,actions:s,children:l,class:e}){return i`
    <${g} class=${u("ui-chart-frame",e)} title=${i`${t}${a?i`<${w} items=${a} />`:null}`} actions=${s}>
      <div class="ui-chart-plot">${l}</div>
    <//>`}export{T as B,g as C,z as D,N as F,w as L,A as N,j as R,S,R as T,X as a,E as b,u as c,y as d,K as e,F as f,B as g,i as h,C as i,I as j,L as k,P as l,D as m,O as t};
