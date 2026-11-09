import{m as s,i as a,n as z,o as w,q as e,j as m}from"./css-values-DwC5g3T9.js";import{i as C,p as j,d as T,a as R,b as A,c as H,e as _,g as L,f as F,h as I,j as P,k as M,l as N,m as O,n as W,o as Y,S as y,q as D,r as E,s as q,t as G,u as V,v as X,w as J,x as K,y as Z,z as Q,A as U,B as p,C as tt,D as it,E as nt,F as et,G as ot,H as ct,I as lt,J as at,K as st,L as rt,M as dt,N as bt,O as $t}from"./common-BOr4h7L2.js";const kt=t=>{var n;if(!((n=t.label)!=null&&n.enabled))return"";const i={"--wptb-btn-label-bg":t.label.background,color:t.label.color};return`
    <div class="wptb-btn-block-label"${e(i)}>
      <div>
        ${t.label.text||""}
      </div>
    </div>
  `},gt=t=>{var v,k,u,B,f,S,h;const i={...a(t.margin,"margin"),justifyContent:t.alignment},n={...a(t.padding,"padding"),borderRadius:z(t.borderRadius),"--wptb-btn-bg":t.background,"--wptb-btn-color":t.color,"--wptb-btn-hover-bg":(v=t.hover)==null?void 0:v.background,"--wptb-btn-hover-color":(k=t.hover)==null?void 0:k.color,"--wptb-btn-hover-scale":(u=t.hover)==null?void 0:u.scale},o={fontSize:t.fontSize??T.fontSize},l=t.fullWidth?{width:"100%"}:{},{tag:c,attrs:r}=w({...t.link,style:l,id:t.id}),$=[`wptb-btn-block-size-${t.size}`,(B=t.label)!=null&&B.enabled?"wptb-btn-block-has-label":""].filter(Boolean).join(" "),b=(f=t.icon)==null?void 0:f.size,d=["wptb-btn-block-btn",`wptb-btn-block-align-${t.contentAlignment??"center"}`,((S=t.icon)==null?void 0:S.position)==="right"?"wptb-btn-block-icon-right":""].filter(Boolean).join(" "),g=(h=t.icon)!=null&&h.svg?`<div class="wptb-btn-block-icon"${e({width:b,height:b})}>${t.icon.svg}</div>`:"";return`
    <div class="wptb-btn-block ${$}"${e(i)}>
      <${c} ${r}>
          <div class="${d}"${e(n)}>
            <p${e(o)}>${t.text}</p>
            ${g}
            ${kt(t)}
          </div>
      </${c}>
    </div>
  `};s({name:"button",parse:j,render:gt,isBlock:C});const vt=t=>{const i={...a(t.margin,"margin"),...a(t.padding,"padding")};return`<div class="wptb-custom-html-block"${e(i)}>${t.html}</div>`};s({name:"custom-html",render:vt,isBlock:A,parse:R});const mt=t=>{const i={...a(t.margin,"margin"),...a(t.padding,"padding")},n=L(t),o=[e(n).trim(),`src="${m(t.src)}"`,`alt="${m(t.alt)}"`,...Object.entries(t.attrs||{}).map(([b,d])=>`${b}="${m(d)}"`)].filter(Boolean).join(" "),{tag:l,attrs:c}=w({...t.link,className:"wptb-image-block-link"}),r=t.src?`<img ${o} />`:"";return`
    <div class="${`wptb-image-block wptb-image-block-align-${t.alignment||"center"}`}"${e(i)}>
      <${l} ${c}>${r}</${l}>
    </div>
  `};s({name:"image",render:mt,isBlock:_,parse:H});const wt=(t,i)=>{const{padding:n,margin:o}=t,l={...a(n,"padding"),...a(o,"margin")};return`<div class="wptb-list-block"${e(l)}><ul>${i||""}</ul></div>`};s({name:"list",parse:I,render:wt,isBlock:F});const ut=(t,i,n,o=0)=>{var g,v,k;const l=(v=(g=t.tooltip)==null?void 0:g.text)==null?void 0:v.trim(),c=n[0],r={marginBottom:c.itemSpacing},$={color:t.color??c.color,fontSize:c.fontSize},b=P(t,c).join(" "),d=l?`<div class="wptb-block-tooltip wptb-block-tooltip-${((k=t.tooltip)==null?void 0:k.position)||"top"}">${l}</div>`:"";return`
    <li class="wptb-list-item-block"${e(r)}>
      <div class="${b}" data-list-style-type-index="${o+1}."${e($)}>
        <div class="wptb-list-item-block-text-content">${t.text||""}</div>
      </div>
      ${d}
    </li>
  `};s({name:"list-item",render:ut});const Bt=t=>{const i={...a(t.margin,"margin"),...a(t.padding,"padding")};return`<div class="wptb-shortcode-block"${e(i)}>${t.shortcode}</div>`};s({name:"shortcode",parse:N,render:Bt,isBlock:M});let x=0;const ft=(t,i,n,o)=>{x++;const l=Math.max(0,Math.min(i-t,1))*150,c=m(n),r=`wptb_star_rating_filter-${x}-${t}`;return`<svg height="${o}" width="${o}" viewBox="-10 -10 170 170"><defs><mask id="${r}"><rect height="150" width="${l}" y="0" x="0" fill="#fff"/></mask></defs><path fill="none" stroke-width="5" d="${y}" stroke="${c}"/><path mask="url(#${r})" fill="${c}" stroke-width="5" d="${y}" stroke="${c}"/></svg>`},St=t=>{const i={...a(t.margin,"margin"),...a(t.padding,"padding")},n=t.value||0,o=t.fontSize||"15px",l={fontSize:o,lineHeight:o,height:o,color:t.color||""},c=t.max||0,r=t.starColor||"#000000",$=t.starSize||"20px",b=Y(t).join(" "),d=Array(c).fill(0).map((v,k)=>ft(k,n,r,$)).join(""),g=t.showRating?`<div class="wptb-star-rating-block-value"${e(l)}>${+n.toFixed(2)}/${c}</div>`:"";return`
    <div class="${b}"${e(i)}>
      <div class="wptb-star-rating-block-stars">${d}${g}</div>
    </div>`};s({name:"star-rating",parse:W,render:St,isBlock:O});const ht=t=>{const i={color:t.color,fontSize:t.fontSize,fontFamily:t.fontFamily,"--wptb-link-color":t.linkColor,...a(t.padding,"padding"),...a(t.margin,"margin")},n=t.linkColor?" wptb-has-link-color":"",o=q(t.tag),l=o||"div",c=o?` data-tag="${o}"`:"";return`
    <div class="wptb-text-block${n}"${c}${e(i)}>
      <${l}>${t.text||""}</${l}>
    </div>
  `};s({name:"text",parse:E,render:ht,isBlock:D});const yt=t=>`<div class="${X(t).join(" ")}"${e(J(t))}>
    <div class="wptb-badge-block-text"${e(K(t))}>${t.text||""}</div>
  </div>`;s({name:"badge",parse:V,render:yt,isBlock:G});const xt=t=>{const{size:i,center:n,radius:o,circumference:l,offset:c,color:r,fontSize:$,label:b}=U(t),d=m(r);return`
  <div class="wptb-circle-rating-block"${e(p(t))}>
    <svg width="${i}" height="${i}" viewBox="0 0 ${i} ${i}">
      <circle class="wptb-circle-rating-block-face" cx="${n}" cy="${n}" r="${o}"/>
      <circle class="wptb-circle-rating-block-track" cx="${n}" cy="${n}" r="${o}"/>
      <circle class="wptb-circle-rating-block-arc" cx="${n}" cy="${n}" r="${o}" stroke="${d}" stroke-dasharray="${l}" stroke-dashoffset="${c}" transform="rotate(-90 ${n} ${n})"/>
      <text class="wptb-circle-rating-block-value" x="50%" y="50%" fill="${d}" font-size="${$}">${b}</text>
    </svg>
  </div>
  `};s({name:"circle-rating",parse:Q,render:xt,isBlock:Z});const zt=(t,i)=>`
  <div class="${nt(t).join(" ")}"${e(et(t))}>
    ${i||""}
  </div>
  `;s({name:"icon",parse:it,render:zt,isBlock:tt});const Ct=t=>{const{tag:i,attrs:n}=w(t.link??{});return`
  <div class="wptb-icon-block-item"${e({fill:t.color})}>
    <${i} ${n}>${t.icon.svg??""}</${i}>
  </div>`};s({name:"icon-item",render:Ct});const jt=t=>`
    <div class="wptb-progress-bar-block"${e(lt(t))}>
      <div class="wptb-progress-bar-block-track"><div class="wptb-progress-bar-block-fill"></div></div>
      <div class="wptb-progress-bar-block-value">${t.value}%</div>
    </div>
  `;s({name:"progress-bar",parse:ct,render:jt,isBlock:ot});const Tt=t=>{const{variant:i}=t,n={width:i.width,top:i.positionY,left:i.positionX,color:t.color,fontSize:t.fontSize};return`<div class="wptb-ribbon-block wptb-ribbon-block-bookmark"${e(n)}>
    <div class="wptb-ribbon-block-bookmark-text"${e({background:t.background})}>${t.text||""}</div>
    <svg preserveAspectRatio="none" viewBox="0 0 64 40" fill="none"${e({color:t.background})}><path d="M0 40V0H64V38.5714L32.5 19.6429L0 40Z" fill="currentColor"/></svg>
  </div>`},Rt=t=>{const{variant:i}=t,n={color:t.color,fontSize:t.fontSize};return`<div class="wptb-ribbon-block wptb-ribbon-block-corner wptb-ribbon-block-corner-${i.side}"${e(n)}>
    <div class="wptb-ribbon-block-corner-inner">
      <div class="wptb-ribbon-block-corner-text"${e({background:t.background})}>${t.text||""}</div>
    </div>
  </div>`},At=t=>{const{variant:i}=t,n={color:t.color,fontSize:t.fontSize,top:i.positionY,left:i.positionX,background:t.background,borderColor:t.borderColor||t.background};return`<div class="wptb-ribbon-block wptb-ribbon-block-rectangle"${e(n)}>
    <div>${t.text||""}</div>
  </div>`},Ht=t=>{const{variant:i}=t,n={color:t.color,fontSize:t.fontSize,top:i.positionY},o={background:t.background,borderColor:t.borderColor||t.background};return`<div class="wptb-ribbon-block wptb-ribbon-block-side wptb-ribbon-block-side-${i.side}"${e(n)}>
    <div class="wptb-ribbon-block-side-text"${e(o)}>
      <div>${t.text||""}</div>
    </div>
    <div class="wptb-ribbon-block-side-shadow"${e({background:t.background})}></div>
  </div>`},_t=t=>{const{variant:i}=t,n={color:t.color,fontSize:t.fontSize,top:i.positionY},o={background:t.background,fill:t.color};return`<div class="wptb-ribbon-block wptb-ribbon-block-icon wptb-ribbon-block-icon-${i.side}"${e(n)}>
    <div class="wptb-ribbon-block-icon-icon"${e(o)} data-wptb-animation="${m(i.animation)}">${i.icon.svg??""}</div>
      <div class="wptb-ribbon-block-icon-text-container">
        <div class="wptb-ribbon-block-icon-text"${e({background:t.background})}>${t.text||""}</div>
        <div class="wptb-ribbon-block-icon-triangle"${e({background:t.background})}></div>
      </div>
  </div>`},Lt=t=>{switch(t.type){case"corner":return Rt(t);case"rectangle":return At(t);case"side":return Ht(t);case"icon":return _t(t);case"bookmark":default:return Tt(t)}};s({name:"ribbon",parse:st,render:Lt,isBlock:at});const Ft=(t,i)=>{const n={...a(t.padding,"padding"),...a(t.margin,"margin"),color:t.color,fontSize:t.fontSize};return`<ul class="wptb-styled-list-block ${`wptb-styled-list-block-align-${t.alignment||"left"}`}"${e(n)}>${i||""}</ul>`};s({name:"styled-list",parse:dt,render:Ft,isBlock:rt});const It=(t,i)=>t?`<div class="wptb-block-tooltip wptb-block-tooltip-${i}">${t}</div>`:"",Pt=(t,i,n)=>{var d,g,v,k;const o=n[0];if(!o)return"";const l={marginBottom:o.itemSpacing,gap:o.icon.spacing},c={width:o.icon.size,minWidth:o.icon.size,height:o.icon.size,fill:((d=t.icon)==null?void 0:d.color)??o.icon.color},r={color:t.color??o.color},$=It((g=t.tooltip)==null?void 0:g.text,((v=t.tooltip)==null?void 0:v.position)||"top"),b=((k=t.icon)==null?void 0:k.svg)??o.icon.svg;return`
    <li class="wptb-styled-list-item-block"${e(l)}>
      <div class="wptb-styled-list-item-icon"${e(c)}>${b}</div>
      <div class="wptb-styled-list-item-text"${e(r)}>${t.text||""}</div>
      ${$}
    </li>
  `};s({name:"styled-list-item",render:Pt});const Mt=t=>{const i={fill:t.icon.color,fontSize:t.fontSize,...a(t.margin,"margin"),...a(t.padding,"padding"),gap:t.icon.spacing,"--wptb-icon-size":t.icon.size,color:t.color};return`<div class="${["wptb-text-icon-block",`wptb-text-icon-block-align-${t.alignment||"center"}`,t.icon.position==="right"?"wptb-text-icon-block-icon-right":""].filter(Boolean).join(" ")}"${e(i)}><div class="wptb-text-icon-block-icon">${t.icon.svg??""}</div><div class="wptb-text-icon-block-text">${t.text||""}</div></div>`};s({name:"text-icon",parse:$t,render:Mt,isBlock:bt});const Nt={registerFBlock:s};window.WPTB_FRONTEND=Nt;
