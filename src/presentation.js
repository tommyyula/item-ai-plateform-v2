import { languageNames, localeUI, translations } from "./i18n/dictionaries.js";

export function initializePresentation(){
  const root=document.documentElement;
  const languagePicker=document.getElementById('languagePicker');
  const languageButton=document.getElementById('languageButton');
  const languageMenu=document.getElementById('languageMenu');
  const languageCurrent=document.getElementById('languageCurrent');
  const languageOptions=[...document.querySelectorAll('.language-option')];
  const normalizeI18nText=value=>value.replace(/\s+/g,' ').trim();
  const textBindings=[];
  const textWalker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){
    const parent=node.parentElement;
    if(!parent||['SCRIPT','STYLE','OPTION'].includes(parent.tagName)||!normalizeI18nText(node.nodeValue)) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }});
  while(textWalker.nextNode()){
    const node=textWalker.currentNode;
    const raw=node.nodeValue;
    textBindings.push({node,key:normalizeI18nText(raw),prefix:(raw.match(/^\s*/)||[''])[0],suffix:(raw.match(/\s*$/)||[''])[0]});
  }
  let currentLanguage='en';
  const applyLanguage=language=>{
    currentLanguage=['en','zh','ja'].includes(language)?language:'en';
    const dictionary=translations[currentLanguage]||{};
    textBindings.forEach(({node,key,prefix,suffix})=>{node.nodeValue=prefix+(dictionary[key]||key)+suffix;});
    root.lang=currentLanguage==='zh'?'zh-CN':currentLanguage==='ja'?'ja':'en';
    root.dataset.language=currentLanguage;
    document.title='ITEM Enterprise AI';
    languageCurrent.textContent=languageNames[currentLanguage];
    languageButton.setAttribute('aria-label',localeUI[currentLanguage].selectLanguage+': '+languageNames[currentLanguage]);
    languageButton.title=localeUI[currentLanguage].selectLanguage;
    languageMenu.setAttribute('aria-label',localeUI[currentLanguage].selectLanguage);
    languageOptions.forEach(option=>{
      const selected=option.dataset.language===currentLanguage;
      option.setAttribute('aria-selected',String(selected));
      option.tabIndex=selected?0:-1;
    });
    document.querySelectorAll('.slide-nav.bottom').forEach(nav=>{
      const label=nav.querySelector('.nav-label');
      const button=nav.querySelector('button');
      if(label) label.textContent=localeUI[currentLanguage].next;
      if(button) button.setAttribute('aria-label',localeUI[currentLanguage].nextPage);
    });
    syncThemeUI();
  };
  const themeToggle=document.getElementById('themeToggle');
  const themeIcon=document.getElementById('themeIcon');
  const themeText=document.getElementById('themeText');
  delete root.dataset.theme;
  const syncThemeUI=()=>{
    const dark=root.dataset.theme==='dark';
    themeIcon.textContent=dark?'☾':'☀';
    const ui=localeUI[currentLanguage];
    themeText.textContent=dark?ui.dark:ui.light;
    themeToggle.setAttribute('aria-label',dark?ui.toLight:ui.toDark);
  };
  applyLanguage(currentLanguage);
  const setLanguageMenu=(open,focusSelected=false)=>{
    languageMenu.hidden=!open;
    languageButton.setAttribute('aria-expanded',String(open));
    if(open&&focusSelected){
      const selected=languageOptions.find(option=>option.dataset.language===currentLanguage);
      requestAnimationFrame(()=>selected?.focus());
    }
  };
  languageButton.addEventListener('click',()=>setLanguageMenu(languageMenu.hidden));
  languageButton.addEventListener('keydown',event=>{
    if(['ArrowDown','ArrowUp','Enter',' '].includes(event.key)){
      event.preventDefault();
      setLanguageMenu(true,true);
    }
  });
  languageOptions.forEach(option=>option.addEventListener('click',()=>{
    applyLanguage(option.dataset.language);
    setLanguageMenu(false);
    languageButton.focus();
  }));
  languageMenu.addEventListener('keydown',event=>{
    const focusedIndex=languageOptions.indexOf(document.activeElement);
    let nextIndex=focusedIndex;
    if(event.key==='ArrowDown') nextIndex=(focusedIndex+1)%languageOptions.length;
    else if(event.key==='ArrowUp') nextIndex=(focusedIndex-1+languageOptions.length)%languageOptions.length;
    else if(event.key==='Home') nextIndex=0;
    else if(event.key==='End') nextIndex=languageOptions.length-1;
    else if(event.key==='Escape'){
      event.preventDefault();
      setLanguageMenu(false);
      languageButton.focus();
      return;
    }else return;
    event.preventDefault();
    languageOptions[nextIndex].focus();
  });
  document.addEventListener('click',event=>{
    if(!languagePicker.contains(event.target)) setLanguageMenu(false);
  });
  themeToggle.addEventListener('click',()=>{
    const dark=root.dataset.theme==='dark';
    if(dark) delete root.dataset.theme; else root.dataset.theme='dark';
    syncThemeUI();
  });

  const architectureTabs=[...document.querySelectorAll('.architecture-tab')];
  const architecturePanels=[...document.querySelectorAll('.architecture-panel')];
  const openArchitectureTab=(tabName)=>{
    architectureTabs.forEach(tab=>{
      const selected=tab.dataset.architectureTab===tabName;
      tab.classList.toggle('is-active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    });
    architecturePanels.forEach(panel=>{
      const selected=panel.dataset.architecturePanel===tabName;
      panel.classList.toggle('is-active',selected);
      panel.hidden=!selected;
    });
  };
  architectureTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>openArchitectureTab(tab.dataset.architectureTab));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?architectureTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+architectureTabs.length)%architectureTabs.length;
      architectureTabs[next].focus();
      openArchitectureTab(architectureTabs[next].dataset.architectureTab);
    });
  });
  const architectureVideo=document.querySelector('.architecture-video');
  architectureVideo?.addEventListener('click',()=>{
    const videoId=architectureVideo.dataset.youtubeId;
    if(!videoId) return;
    const title=architectureVideo.querySelector('strong')?.textContent||'Multi-agent collaboration in action';
    const frame=document.createElement('iframe');
    frame.className='architecture-video';
    frame.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(videoId)+'?autoplay=1&rel=0&modestbranding=1';
    frame.title=title;
    frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    frame.allowFullscreen=true;
    architectureVideo.replaceWith(frame);
  });

  const ontologyTabs=[...document.querySelectorAll('.ontology-gallery-tab')];
  const ontologyPanels=[...document.querySelectorAll('.ontology-gallery-panel')];
  const openOntologyShot=(shotName)=>{
    ontologyTabs.forEach(tab=>{
      const selected=tab.dataset.ontologyShot===shotName;
      tab.classList.toggle('is-active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    });
    ontologyPanels.forEach(panel=>{
      const selected=panel.dataset.ontologyPanel===shotName;
      panel.classList.toggle('is-active',selected);
      panel.hidden=!selected;
    });
  };
  ontologyTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>openOntologyShot(tab.dataset.ontologyShot));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?ontologyTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+ontologyTabs.length)%ontologyTabs.length;
      ontologyTabs[next].focus();
      openOntologyShot(ontologyTabs[next].dataset.ontologyShot);
    });
  });
  const ontologyLightbox=document.querySelector('.ontology-lightbox');
  const ontologyLightboxImage=ontologyLightbox?.querySelector('img');
  ontologyPanels.forEach(panel=>panel.addEventListener('click',()=>{
    const source=panel.querySelector('img');
    if(!source||!ontologyLightbox||!ontologyLightboxImage) return;
    ontologyLightboxImage.src=source.currentSrc||source.src;
    ontologyLightboxImage.alt=source.alt;
    ontologyLightbox.showModal();
  }));
  ontologyLightbox?.querySelector('.ontology-lightbox-close')?.addEventListener('click',()=>ontologyLightbox.close());
  ontologyLightbox?.addEventListener('click',event=>{
    if(event.target===ontologyLightbox) ontologyLightbox.close();
  });
  const trainingTabs=[...document.querySelectorAll('.training-module-card')];
  const trainingPanels=[...document.querySelectorAll('.training-module-panel')];
  const openTrainingModule=(module)=>{
    trainingTabs.forEach(tab=>{
      const selected=tab.dataset.trainingModule===module;
      tab.classList.toggle('is-active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    });
    trainingPanels.forEach(panel=>{
      const selected=panel.dataset.trainingPanel===module;
      panel.classList.remove('is-active');
      panel.hidden=!selected;
      if(selected) requestAnimationFrame(()=>panel.classList.add('is-active'));
    });
  };
  trainingTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>openTrainingModule(tab.dataset.trainingModule));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const forward=event.key==='ArrowDown'||event.key==='ArrowRight';
      const next=(index+(forward?1:-1)+trainingTabs.length)%trainingTabs.length;
      trainingTabs[next].focus();
      openTrainingModule(trainingTabs[next].dataset.trainingModule);
    });
  });
  const requestedModule=new URLSearchParams(window.location.search).get('course');
  if(trainingTabs.some(tab=>tab.dataset.trainingModule===requestedModule)) openTrainingModule(requestedModule);

  const sections=[...document.querySelectorAll('main section[id]')];
  const links=[...document.querySelectorAll('.nav a')];
  const previewId=new URLSearchParams(window.location.search).get('preview');
  if(previewId){
    sections.forEach(section=>section.style.display=section.id===previewId?'flex':'none');
    document.documentElement.style.scrollBehavior='auto';
    window.scrollTo(0,0);
  }

  const makeDownIcon = () => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="m18 13-6 6-6-6"></path></svg>';

  const goTo = (index) => {
    if(index < 0 || index >= sections.length) return;
    sections[index].scrollIntoView({behavior:'smooth', block:'start'});
  };

  sections.forEach((section, index) => {
    const bottom = document.createElement('div');
    bottom.className = 'slide-nav bottom' + (index === sections.length - 1 ? ' disabled' : '');
    bottom.innerHTML = '<span class="nav-label">'+localeUI[currentLanguage].next+'</span><button type="button" aria-label="'+localeUI[currentLanguage].nextPage+'">' + makeDownIcon() + '</button>';
    bottom.querySelector('button').addEventListener('click', () => goTo(index + 1));

    section.appendChild(bottom);
  });

  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(l=>l.style.color='');
        const a=document.querySelector('.nav a[href="#'+e.target.id+'"]');
        if(a)a.style.color='#202124';
      }
    });
  }, {threshold:.55});
  sections.forEach(s=>obs.observe(s));

  document.addEventListener('keydown', (event) => {
    if(['ArrowDown','PageDown',' '].includes(event.key)){ event.preventDefault(); const i=sections.findIndex(s=>s.getBoundingClientRect().top >= -10 && s.getBoundingClientRect().top < window.innerHeight * .55); goTo(Math.min(sections.length-1, i+1)); }
    if(['ArrowUp','PageUp'].includes(event.key)){ event.preventDefault(); const i=sections.findIndex(s=>s.getBoundingClientRect().top >= -10 && s.getBoundingClientRect().top < window.innerHeight * .55); goTo(Math.max(0, i-1)); }
  });
}
