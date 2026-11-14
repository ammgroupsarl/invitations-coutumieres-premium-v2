(()=>{'use strict';
const theme=document.body.dataset.theme;const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const themes=['royal','cinema','violet'];let event,guest,slide=0,photoTimer=null,toastTimer=null,opened=false;
const music=$('background-music'), musicLabel=$('music-label'),gallery=$('vertical-gallery');
const qrUrl=window.AMMQRCode(window.AMM.tableUrl(theme, window.AMM.guest(theme)));
const pdfUrl=window.AMM.pdfUrl(theme, window.AMM.guest(theme));
const toast=(msg)=>{clearTimeout(toastTimer);const t=$('toast');t.textContent=msg;t.hidden=false;toastTimer=setTimeout(()=>t.hidden=true,4500);};
const link=(url,label)=>`<a class="modal-button emphasis" href="${esc(url)}" ${url.startsWith('https://')?'target="_blank" rel="noopener noreferrer"':''}>${esc(label)} ↗</a>`;
const button=(name,label)=>`<button type="button" class="modal-button" data-view="${name}">${esc(label)}</button>`;
const group=items=>`<div class="modal-buttons">${items.join('')}</div>`;
const box=(label,content,sub='')=>`<div class="modal-box"><span class="eyebrow">${esc(label)}</span><strong>${esc(content)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`;
const notice=text=>`<div class="notice">${text}</div>`;
const niceDate=raw=>{try{return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(raw))}catch{return raw}};
const shortDate=raw=>{try{return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(raw))}catch{return raw}};
const cleanPhone=value=>String(value||'').replace(/[^0-9]/g,'');
function render(){document.body.dataset.theme=event.slug;document.title=`${event.bride} & ${event.groom} | Mariage coutumier`;
 $('opening-names').textContent=`${event.bride} & ${event.groom}`;$('opening-guest-name').textContent=guest.full_name;
 $('bride-name').textContent=event.bride;$('groom-name').textContent=event.groom;
 $('hero-motto').textContent=event.motto||'Deux familles, un même bonheur.';
 $('guest-full-name').textContent=guest.full_name;
 $('guest-places').textContent=`${guest.places} place${guest.places>1?'s':''} réservée${guest.places>1?'s':''}`;
 $('hero-date').textContent=shortDate(event.date_iso);$('hero-city').textContent=event.city;
 music.src=event.music_url||'../assets/media/ambiance-originale.wav';music.volume=.26;
 const photos=event.photos?.length?event.photos:[{url:`../assets/media/${event.slug}.webp`,caption:'Notre histoire en images'}];
 const stack=$('gallery-stack');stack.replaceChildren();
 for(const p of photos){const div=document.createElement('div');div.className='gallery-photo';const image=document.createElement('img');image.src=p.url;image.alt=`Photographie de démonstration : ${p.caption||'mariage'}`;image.loading='lazy';image.onerror=()=>{image.onerror=null;image.src=`../assets/media/${event.slug}.webp`;};div.append(image);stack.append(div);}
 $('gallery-total').textContent=String(photos.length).padStart(2,'0');setSlide(0);const countdown=()=>{const s=new Date(event.date_iso).getTime()-Date.now();$('countdown').textContent=s<=0?'Le grand jour est arrivé ♡':`Plus que ${Math.floor(s/86400000)} jours · ${Math.floor((s%86400000)/3600000)} heures`;};countdown();setInterval(countdown,60000);
}
function setSlide(i){const p=event?.photos?.length?event.photos:[{caption:'Notre histoire en images'}];slide=(i+p.length)%p.length;$('gallery-stack').style.transform=`translateY(-${slide*100}%)`;$('gallery-current').textContent=String(slide+1).padStart(2,'0');$('gallery-caption').textContent=p[slide].caption||'Notre histoire en images';}
function startSlides(){clearInterval(photoTimer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&event.photos.length>1){photoTimer=setInterval(()=>{if(!document.hidden)setSlide(slide+1);},4800);}}
$('gallery-prev').onclick=()=>{setSlide(slide-1);startSlides()};$('gallery-next').onclick=()=>{setSlide(slide+1);startSlides()};
let beginY=null;gallery.addEventListener('touchstart',e=>{beginY=e.touches[0].clientY},{passive:true});gallery.addEventListener('touchend',e=>{if(beginY===null)return;const delta=e.changedTouches[0].clientY-beginY;beginY=null;if(Math.abs(delta)>38){setSlide(slide+(delta<0?1:-1));startSlides();}},{passive:true});
gallery.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>30){setSlide(slide+(e.deltaY>0?1:-1));startSlides();}},{passive:true});
gallery.addEventListener('mouseenter',()=>clearInterval(photoTimer));gallery.addEventListener('mouseleave',()=>{if(opened)startSlides();});
function updateMusic(){const on=!music.paused;musicLabel.textContent=on?'Couper':'Musique';$('music-toggle').setAttribute('aria-pressed',String(on))}
$('music-toggle').onclick=()=>{if(music.paused){music.play().then(updateMusic).catch(()=>toast('Lecture bloquée : appuyez à nouveau pour activer la musique.'));}else{music.pause();updateMusic();}};
$('open-invitation').addEventListener('click',()=>{if(opened)return;opened=true;document.body.classList.add('is-opened');$('invitation-page').inert=false;$('opening').classList.add('is-leaving');
 // Called directly inside the user's click: browser playback is usually allowed here.
 music.play().then(updateMusic).catch(()=>{updateMusic();toast('Le navigateur a bloqué le son. Utilisez « Musique » pour l’activer.');});
 startSlides();setTimeout(()=>{$('opening').hidden=true;},850);
});
const modal=$('detail-modal');$('modal-close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
function modalShow(title,content,small='LES DÉTAILS DU GRAND JOUR'){$('modal-title').textContent=title;$('modal-overline').textContent=small;$('modal-inner').innerHTML=`<div class="modal-stack">${content}</div>`;if(!modal.open)modal.showModal();}
function view(type){if(!event||!guest)return;const E=event,G=guest;
 if(type==='invitation')modalShow('Votre invitation',`<p class="modal-statement">Avec la bénédiction de nos familles, nous vous invitons à partager notre mariage coutumier.</p>${box('À l’attention de',G.full_name,`${G.places} place(s) réservée(s)`)}<div class="modal-grid">${box('Le grand jour',niceDate(E.date_iso))}${box('Le lieu',E.venue,E.city)}</div>${group([button('rsvp','Confirmer ma présence'),link(pdfUrl,'Télécharger mon PDF')])}`,'UNE INVITATION PERSONNELLE');
 else if(type==='programme')modalShow('Notre programme',`<p class="modal-text">Une célébration coutumière pour réunir les familles et partager les traditions.</p>${(E.program||[]).map(row=>`<div class="modal-row"><span class="modal-hour">${esc(row.hour)}</span><div><strong>${esc(row.title)}</strong><p>${esc(row.details)}</p></div></div>`).join('')}${group([button('lieu','Le lieu'),button('rsvp','Confirmer')])}`,'LE DÉROULEMENT DU GRAND JOUR');
 else if(type==='galerie')modalShow('Notre album',`<div class="photo-grid">${E.photos.map(photo=>`<img src="${esc(photo.url)}" alt="${esc(photo.caption)}" loading="lazy" onerror="this.onerror=null;this.src='../assets/media/${esc(E.slug)}.webp'">`).join('')}</div>${notice('Photos d’illustration pour les démonstrations. Les mariés doivent autoriser l’usage de leurs propres photos.')}`,'SOUVENIRS EN IMAGES');
 else if(type==='histoire')modalShow('Notre histoire',`<p class="modal-statement">${esc(E.motto)}</p><p class="modal-text">${esc(E.story||'Notre histoire s’écrit avec nos familles et nos traditions.').replaceAll('\n','<br>')}</p><div class="modal-grid">${box('Famille de la mariée',E.family_bride)}${box('Famille du marié',E.family_groom)}</div>`,'DEUX FAMILLES, UNE UNION');
 else if(type==='tenue')modalShow('La tenue du jour',`${box('Dress code coutumier',E.dress||'Tenue traditionnelle élégante')}${notice('Merci de privilégier une tenue élégante et respectueuse des traditions des familles.')}`,'L’ÉLÉGANCE À L’HONNEUR');
 else if(type==='menu')modalShow('Le repas et la réception',`${box('À table',E.menu_text||'Menu à confirmer par l’organisation')}${notice('Les détails du repas peuvent être personnalisés depuis l’espace organisateur.')}`,'PARTAGE & CONVIVIALITÉ');
 else if(type==='lieu')modalShow('Lieu & accès',`${box('Date',niceDate(E.date_iso))}${box('Lieu',E.venue,E.address||E.city)}${E.maps_url?group([link(E.maps_url,'Ouvrir Google Maps')]):notice('L’adresse complète sera communiquée par l’organisation.')}`,'RENDEZ-VOUS À LA CÉRÉMONIE');
 else if(type==='table')modalShow('Votre table',`<div class="modal-box" style="text-align:center"><span class="eyebrow">INVITATION POUR</span><strong>${esc(G.full_name)}</strong><strong style="font-size:40px;color:var(--accent)">${esc(G.table_name||'À confirmer')}</strong><small>${esc(G.zone)} · ${G.places} place(s)</small><div class="heart-qr"><svg viewBox="0 0 245 245" aria-hidden="true"><path d="M122 222 C96 204 20 144 20 84 C20 42 51 19 85 19 C103 19 116 30 122 44 C129 30 142 19 160 19 C194 19 225 42 225 84 C225 144 149 204 122 222 Z" fill="#c81c3d" stroke="#f18092" stroke-width="3"/></svg><img src="${qrUrl}" alt="QR code de table individuel"></div><p class="qr-instruction">Scannez le code au centre du cœur pour afficher votre table.</p></div>${group([link(window.AMM.tableUrl(theme,G),'Voir ma fiche de table'),link(pdfUrl,'Mon PDF')])}${notice('Le QR code ouvre votre fiche de table. Sans serveur, il ne garantit pas le contrôle sécurisé des entrées.')}`,'VOTRE ACCUEIL PERSONNALISÉ');
 else if(type==='pdf')modalShow('Votre PDF',`${box('Invitation au mariage coutumier',`${E.bride} & ${E.groom}`,G.full_name)}${group([link(pdfUrl,'Télécharger mon invitation')])}${notice('Un modèle imprimable s’ouvre : dans le navigateur, choisissez « Enregistrer au format PDF ».')}`,'UN SOUVENIR À GARDER');
 else if(type==='contact'){let markup='';for(const [name,label,number,email] of [['Mariés',E.couple_name,E.couple_whatsapp,E.couple_email],['Organisation',E.organisation_name,E.organisation_whatsapp,E.organisation_email]]){const n=cleanPhone(number);const links=[];if(n){links.push(link(`https://wa.me/${n}`,'Écrire sur WhatsApp'));links.push(`<a class="modal-button" href="tel:+${n}">Appeler</a>`);}if(email&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){links.push(`<a class="modal-button" href="mailto:${encodeURIComponent(email)}">Envoyer un e-mail</a>`);}markup+=`<div class="modal-box"><span class="eyebrow">${name}</span><strong>${esc(label)}</strong>${links.length?group(links):'<small>Coordonnées à configurer dans l’administration.</small>'}</div>`;}modalShow('Nous contacter',markup,'LES MARIÉS & L’ORGANISATION');}
 else if(type==='rsvp'){const status=G.rsvp;modalShow('Votre réponse',`${box('Invitation personnelle',G.full_name,`${G.places} place(s) réservée(s)`)}<form id="rsvp-form" class="modal-stack"><div class="rsvp-options"><label><input type="radio" name="rsvp" value="yes" ${status==='yes'?'checked':''} required> Je serai présent(e)</label><label><input type="radio" name="rsvp" value="no" ${status==='no'?'checked':''}> Je ne pourrai pas venir</label></div><label class="form-label">Un message pour les mariés (facultatif)<textarea name="message" maxlength="500" placeholder="Un petit mot...">${esc(G.message)}</textarea></label><button type="submit" class="modal-button emphasis">Enregistrer ma réponse</button></form>${notice('La réponse est mémorisée seulement sur cet appareil. Pour prévenir l’organisation, envoyez-la via WhatsApp.')}`,'CONFIRMATION PERSONNALISÉE');}
}
document.addEventListener('click',e=>{const control=e.target.closest('[data-view]');if(control)view(control.dataset.view);});
document.addEventListener('submit',e=>{
 if(e.target.id!=='rsvp-form')return;e.preventDefault();
 const d=new FormData(e.target);const rsvp=d.get('rsvp');if(!rsvp)return toast('Choisissez votre réponse.');
 const message=String(d.get('message')||'').slice(0,500);
 try{window.AMM.setRSVP(theme,guest,{rsvp,message});}catch(err){toast('Le navigateur ne permet pas le stockage local.');}
 guest.rsvp=rsvp;guest.message=message;
 const phone=cleanPhone(event.organisation_whatsapp||event.couple_whatsapp);
 const text=`Bonjour, ${guest.full_name} vous confirme ${rsvp==='yes'?'sa présence':'son absence'} au mariage coutumier de ${event.bride} et ${event.groom}. Places : ${guest.places}. ${message}`;
 const url=phone?'https://wa.me/'+phone+'?text='+encodeURIComponent(text):'';
 modalShow('Merci pour votre réponse',`${box(rsvp==='yes'?'Présence notée localement':'Réponse notée localement',guest.full_name,'Cette démonstration ne synchronise pas les réponses entre téléphones.')}${url?group([link(url,'Envoyer ma réponse sur WhatsApp')]):notice('Ajoutez le WhatsApp de l’organisation depuis admin.html pour pouvoir transmettre les confirmations.')}${group([button('table','Voir ma table')])}`,'RÉPONSE DE DÉMONSTRATION');
});
try{
 event=window.AMM.event(theme);guest=window.AMM.guest(theme);
 if(!event||!guest)throw Error('Invitation introuvable');
 const previous=window.AMM.getRSVP(theme,guest);if(previous){guest.rsvp=previous.rsvp;guest.message=previous.message||'';}
 render();$('open-invitation').disabled=false;
}catch(err){$('opening-names').textContent='Invitation indisponible';$('opening-guest-name').textContent=err.message;}
})();
