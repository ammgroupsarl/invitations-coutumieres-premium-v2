/* AMMGROUP Digital — données configurables dans le navigateur. AUCUN serveur ni authentification. */
(() => {
  'use strict';
  const KEY = 'ammgroup-invitations-v7';
  const clone = obj => JSON.parse(JSON.stringify(obj));
  function read() {
    try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if(saved && typeof saved === 'object') return saved; } catch (_) {}
    return clone(window.AMMGROUP_DEFAULTS || {});
  }
  function write(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
  function reset() { localStorage.removeItem(KEY); }
  function event(slug) { const db = read(); return db[slug] ? clone(db[slug]) : null; }
  function updateEvent(slug, changes) { const db = read(); if(!db[slug]) throw Error('Modèle inconnu'); db[slug] = {...db[slug], ...changes}; write(db); }
  function encodeGuest(info){
    const obj = {n:String(info.full_name||'').slice(0,110),p:Math.max(1,Math.min(20,Number(info.places)||1)),t:String(info.table_name||'À confirmer').slice(0,60),z:String(info.zone||'').slice(0,60),c:String(info.code||'').slice(0,50)};
    const bytes = new TextEncoder().encode(JSON.stringify(obj)); let s = ''; bytes.forEach(b => s += String.fromCharCode(b));
    return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');
  }
  function decodeGuest(encoded){
    if (!encoded || encoded.length>1500 || !/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
    try {
      const padded=encoded.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(encoded.length/4)*4,'=');
      const bytes=Uint8Array.from(atob(padded), c=>c.charCodeAt(0));
      const obj=JSON.parse(new TextDecoder().decode(bytes));
      if (!obj || typeof obj.n !== 'string' || !obj.n.trim()) return null;
      return {full_name:obj.n.slice(0,110),places:Math.max(1,Math.min(20,Number(obj.p)||1)),table_name:String(obj.t||'À confirmer').slice(0,60),zone:String(obj.z||'').slice(0,60),code:String(obj.c||'').slice(0,50),rsvp:'pending',message:''};
    }catch(e){return null;}
  }
  function guest(slug){
    const ev=event(slug), params=new URLSearchParams(location.search);
    if(!ev) return null;
    const custom=decodeGuest(params.get('guest')); if(custom) return custom;
    const id=params.get('invite');
    if(id && Array.isArray(ev.guests)){const found=ev.guests.find(g=>g.code===id);if(found)return clone(found);}
    return clone(ev.guests?.[0] || {full_name:'Invité(e) de démonstration',places:1,table_name:'Table à confirmer',zone:'',code:'demo'});
  }
  function guestQuery(info){return '?guest='+encodeURIComponent(encodeGuest(info));}
  function getRSVP(slug,info){const key='ammgroup-rsvp-'+slug+'-'+encodeGuest(info);try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
  function setRSVP(slug,info,response){localStorage.setItem('ammgroup-rsvp-'+slug+'-'+encodeGuest(info),JSON.stringify(response));}
  function download(content,name,type='text/plain;charset=utf-8'){
    const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
  }
  function exportPublicData(){
    const db=read();const out={};Object.entries(db).forEach(([k,v])=>{out[k]={...v,guests:window.AMMGROUP_DEFAULTS?.[k]?.guests||[]};});
    download('/* AMMGROUP Digital : paramètres des modèles (sans liste privée réelle) */\nwindow.AMMGROUP_DEFAULTS = '+JSON.stringify(out,null,2)+';\n','data.js','application/javascript');
  }
  const root = new URL('../../', document.currentScript.src);
  function invitationUrl(slug,info){return new URL(slug+'/index.html'+guestQuery(info),root).href;}
  function tableUrl(slug,info){return new URL(slug+'/table.html'+guestQuery(info),root).href;}
  function pdfUrl(slug,info){return new URL('print.html?theme='+encodeURIComponent(slug)+'&guest='+encodeURIComponent(encodeGuest(info)),root).href;}
  window.AMM={KEY,read,write,reset,event,updateEvent,guest,encodeGuest,decodeGuest,guestQuery,getRSVP,setRSVP,download,exportPublicData,invitationUrl,tableUrl,pdfUrl};
})();
