import"./modulepreload-polyfill-B5Qt9EMX.js";import{h as t,S as c,B as a,t as m,m as u,b as r,d as R,f as v,j as i,C as p,F as H,R as b,T as z,a as j,i as q,e as Q,l as U,k as x,N as G,g as K}from"./menu-BIwDklZK.js";import{y as T,Q as Y,d as s}from"./vendor-D_y76g1R.js";const J=[{label:"bar",color:"var(--data-1)"},{label:"ml/s",color:"var(--data-2)"},{label:"g",color:"var(--data-3)"},{label:"°C",color:"var(--data-4)",dashed:!0}];function V(){return t`
    <svg viewBox="0 0 800 260" preserveAspectRatio="none">
      ${[52,104,156,208].map(l=>t`<line x1="0" x2="800" y1=${l} y2=${l} stroke="var(--line)" stroke-width="1" vector-effect="non-scaling-stroke" />`)}
      <path d="M0,250 C60,250 80,190 140,180 S200,60 280,48 S520,44 800,60" fill="none" stroke="var(--data-1)" stroke-width="2.5" vector-effect="non-scaling-stroke" />
      <path d="M0,250 C40,200 90,170 150,196 S260,170 340,150 S620,132 800,128" fill="none" stroke="var(--data-2)" stroke-width="2" vector-effect="non-scaling-stroke" />
      <path d="M0,255 L170,255 C300,250 500,150 800,36" fill="none" stroke="var(--data-3)" stroke-width="2.5" vector-effect="non-scaling-stroke" />
      <path d="M0,84 C200,80 500,86 800,82" fill="none" stroke="var(--data-4)" stroke-width="1.5" stroke-dasharray="5 4" vector-effect="non-scaling-stroke" />
    </svg>`}const B=new URLSearchParams(location.search),h=T(B.get("theme")||"device"),k=T(B.get("accent")||"studio"),X={studio:null,caffimax:{"--accent":"light-dark(#b4662a, #d9955b)","--accent-contrast":"light-dark(#ffffff, #10202f)"}};function Z(){const l=document.documentElement;h.value==="device"?delete l.dataset.theme:l.dataset.theme=h.value;for(const o of["--accent","--accent-contrast"])l.style.removeProperty(o);for(const[o,d]of Object.entries(X[k.value]||{}))l.style.setProperty(o,d)}const _=["surface-0","surface-1","surface-2","surface-3","line","line-strong","text","text-muted","text-faint","accent","accent-soft","ok","warn","danger","idle","data-1","data-2","data-3","data-4"],ee=["text-xs","text-s","text-m","text-l","text-xl","text-display"];function n({title:l,note:o,children:d}){return t`<section class="gal-sec"><h2>${l}</h2>${o?t`<p>${o}</p>`:null}${d}</section>`}function ae(){Z();const[l,o]=s("brew"),[d,w]=s("b"),[C,S]=s(!0),[A,P]=s(!1),[D,O]=s("Bloom"),[g,M]=s("140"),[N,I]=s("standby"),[L,E]=s("main"),[F,f]=s(!1),[y,$]=s(null),W=!(Number(g)>=100&&Number(g)<=160);return t`
    <div class="gal">
      <div class="gal-top">
        <h1>Studio 2.0 kit</h1>
        <${c} label="Theme" value=${h.value} onChange=${e=>{h.value=e}}
          options=${[{value:"device",label:"Device"},{value:"light",label:"Light"},{value:"dark",label:"Dark"}]} />
        <${c} label="Accent" value=${k.value} onChange=${e=>{k.value=e}}
          options=${[{value:"studio",label:"Studio"},{value:"caffimax",label:"CaffiMax"}]} />
      </div>

      <${n} title="Colour" note="Every colour is a token. An appliance changes the accent and nothing else.">
        <div class="gal-swatches">${_.map(e=>t`<div class="gal-swatch"><i style=${{background:`var(--${e})`}}></i>${e}</div>`)}</div>
      <//>

      <${n} title="Type">
        <div class="gal-type">${ee.map(e=>t`<div><small>${e}</small><span style=${{fontSize:`var(--${e})`,fontWeight:e==="text-display"||e==="text-xl"?600:400}}>Pressure held at 9.0 bar</span></div>`)}</div>
      <//>

      <${n} title="Button">
        <div class="gal-line">
          <${a} variant="primary" onClick=${()=>m("Saved")}>Primary<//>
          <${a}>Default<//>
          <${a} variant="outline">Outline<//>
          <${a} variant="quiet">Quiet<//>
          <${a} variant="danger" onClick=${()=>m("The board refused: not during a shot.","error")}>Danger<//>
          <${a} disabled>Disabled<//>
          <${a} variant="primary" size="l">Large<//>
        </div>
      <//>

      <${n} title="Segmented">
        <div class="gal-line">
          <${c} tone="accent" label="Mode" value=${l} onChange=${o}
            options=${[{value:"brew",label:"Brew"},{value:"steam",label:"Steam"},{value:"water",label:"Water"},{value:"standby",label:"Standby"}]} />
          <${c} label="Side" value=${d} onChange=${w} options=${[{value:"a",label:"System"},{value:"b",label:"Apps"}]} />
        </div>
      <//>

      <${n} title="Toggle and chip">
        <div class="gal-line">
          <${u} label="On" checked=${C} onChange=${S} />
          <${u} label="Off" checked=${A} onChange=${P} />
          <${u} label="Disabled" checked=${!0} disabled />
          <${r} tone="ok">Ready <b>93.1</b>°C<//>
          <${r} tone="warn" pulse>Heating <b>71.4</b>°C<//>
          <${r} tone="accent" pulse>Brewing<//>
          <${r} tone="danger">No water<//>
          <${r}>Demo machine<//>
          <${R} tone="idle" />
        </div>
      <//>

      <${n} title="Field">
        <div class="gal-grid">
          <${v} label="Name">${e=>t`<${x} id=${e} value=${D} onInput=${O} />`}<//>
          <${v} label="Steam temperature" hint="100 to 160" error=${W?"Between 100 and 160.":null}>
            ${e=>t`<${G} id=${e} value=${g} onInput=${M} unit="°C" />`}
          <//>
          <${v} label="At power-on">
            ${e=>t`<${K} id=${e} value=${N} onChange=${I} options=${[{value:"standby",label:"Standby"},{value:"brew",label:"Heat for brewing"}]} />`}
          <//>
          <${v} label="Wi-Fi network">${e=>t`<${x} id=${e} value="" placeholder="Network name" />`}<//>
        </div>
      <//>

      <${n} title="Card, row, stat and facts">
        <div class="gal-stats">
          <${i} label="Brew" value="93.1" unit="°C" />
          <${i} label="Pressure" value="0.0" unit="bar" />
          <${i} label="Flow" value="0.0" unit="ml/s" />
          <${i} label="Scale" value="0.0" unit="g" />
        </div>
        <div class="gal-two">
          <${p} title="Last shot" actions=${t`<${a} variant="outline">Ask about this<//>`}>
            <${H} items=${[["Profile","Bloom"],["Out","36.2 g in 21 s"],["Peak","6.8 bar"]]} />
          <//>
          <${p}>
            <${b} title="CaffiMax 1.0.1 is ready" detail="Installs in about a minute. The machine restarts."><${a} variant="primary">Update<//><//>
            <${b} title="Wake on a schedule" detail="Heat before the first coffee."><${u} label="Wake on a schedule" checked=${C} onChange=${S} /><//>
            <${b} title="Show all of Studio" detail="The editor, files and terminal for this board."><${a}>Show<//><//>
          <//>
        </div>
      <//>

      <${n} title="Tabs">
        <${z} value=${L} onChange=${E} tabs=${[{value:"main",label:"main.py"},{value:"status",label:"tools/status.py"},{value:"skill",label:"SKILL.md"}]} />
      <//>

      <${n} title="Sheet, drawer and toast" note="On a phone the Agent opens as a sheet, and the System / Apps switch lives in a drawer.">
        <div class="gal-line">
          <${a} onClick=${()=>f(!0)}>Open a sheet<//>
          <${a} onClick=${()=>$("left")}>Open the left drawer<//>
          <${a} onClick=${()=>$("right")}>Open the right drawer<//>
          <${a} onClick=${()=>m("Profile saved")}>Show a toast<//>
        </div>
      <//>

      <${n} title="Put together" note="A dashboard made only from the kit.">
        <div class="gal-dash">
          <div class="gal-dash-head">
            <h3>Dashboard</h3>
            <${a} variant="outline">Ask about this<//>
            <${r} tone="ok">Ready <b>93.1</b>°C<//>
          </div>
          <div><${c} tone="accent" label="Mode" value=${l} onChange=${o}
            options=${[{value:"brew",label:"Brew"},{value:"steam",label:"Steam"},{value:"water",label:"Water"},{value:"standby",label:"Standby"}]} /></div>
          <div class="gal-stats">
            <${i} label="Brew" value="93.1" unit="°C" />
            <${i} label="Pressure" value="0.0" unit="bar" />
            <${i} label="Flow" value="0.0" unit="ml/s" />
            <${i} label="Scale" value="0.0" unit="g" />
          </div>
          <${p}><${b} title="Bloom" detail="36 g out · 93 °C"><${a} variant="primary" size="l">Brew<//><//><//>
          <${j} title="Live" legend=${J}><${V} /><//>
        </div>
      <//>

      <${q} open=${F} onClose=${()=>f(!1)} label="Agent">
        <div class="gal-pad">
          <${r} tone="ok">caffimax-4c1e.local<//>
          <p>Why was this one sour?</p>
          <p style=${{color:"var(--text-muted)"}}>It ran fast: 36 g in 21 s, and pressure never held above 7 bar. That points to a grind that's too coarse for this bean.</p>
          <div class="gal-line"><${a} variant="primary">Lengthen pre-infusion<//><${a} onClick=${()=>f(!1)}>Not now<//></div>
        </div>
      <//>
      <${Q} open=${!!y} side=${y||"left"} onClose=${()=>$(null)} label="Menu">
        <div class="gal-pad">
          <${c} label="Side" value=${d} onChange=${w} options=${[{value:"a",label:"System"},{value:"b",label:"Apps"}]} />
          <${a} variant="quiet" onClick=${()=>$(null)}>Close<//>
        </div>
      <//>
      <${U} />
    </div>`}Y(t`<${ae} />`,document.getElementById("gallery"));
