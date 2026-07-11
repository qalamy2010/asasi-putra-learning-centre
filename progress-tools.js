(function(){
'use strict';

var MAIN_KEY='skorasasi1_mastery_v5';
var LEGACY_KEYS=['skorasasi1_rescue_progress_v1','skorasasi1ProgressStable','skorasasi1ProgressV2','skorasasi1.v4.1.progress','skorasasi1Progress','realNumberProgress'];
var SEARCH_STATE={subjects:'',learn:'',practice:'',progress:''};
var scheduled=false;

function $(id){return document.getElementById(id);}
function qsa(root,sel){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}
function activeView(){return document.querySelector('.view.on');}
function readState(){try{return JSON.parse(localStorage.getItem(MAIN_KEY))||{};}catch(e){return{};}}
function writeState(s){try{localStorage.setItem(MAIN_KEY,JSON.stringify(s));}catch(e){}}
function norm(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim();}
function contains(el,query){return norm(el.textContent).indexOf(query)>-1;}
function toast(msg){var old=document.querySelector('.reset-toast');if(old)old.remove();var el=document.createElement('div');el.className='reset-toast';el.textContent=msg;document.body.appendChild(el);setTimeout(function(){if(el&&el.parentNode)el.remove();},1800);}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;enhance();});}

function makeBar(key,placeholder,actions,hint){
  var bar=document.createElement('div');
  bar.className='app-tools-bar';
  bar.setAttribute('data-tools',key);
  var val=SEARCH_STATE[key]||'';
  bar.innerHTML='<div class="app-tools-search '+(val?'has-value':'')+'"><input type="search" data-tool-search="'+key+'" placeholder="'+placeholder+'" value="'+escapeAttr(val)+'" autocomplete="off"><button class="app-tools-clear" data-clear-search="'+key+'" aria-label="Clear search">×</button></div><div class="app-tools-actions">'+(actions||'')+'</div>'+(hint?'<div class="app-tools-hint">'+hint+'</div>':'');
  return bar;
}
function escapeAttr(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function placeBar(section,bar){var head=section.querySelector('.sectionHead')||section.querySelector('h2');if(head&&head.parentNode===section)head.insertAdjacentElement('afterend',bar);else section.insertBefore(bar,section.firstChild);}
function ensureEmpty(section,key){var el=section.querySelector('.search-empty[data-empty="'+key+'"]');if(!el){el=document.createElement('div');el.className='search-empty';el.setAttribute('data-empty',key);el.textContent='Tiada hasil dijumpai. Cuba keyword lain seperti subject, chapter atau topic.';section.appendChild(el);}return el;}

function enhanceSubjects(){var section=$('subjects');if(!section||!section.classList.contains('on'))return;if(!section.querySelector('.app-tools-bar[data-tools="subjects"]')){placeBar(section,makeBar('subjects','Search subject or chapter e.g. complex, sequence, mole, crop','', 'Search akan tapis subject card dan chapter dalam page ini.'))}
  applySubjectsSearch();
}
function applySubjectsSearch(){var section=$('subjects');if(!section)return;var query=norm(SEARCH_STATE.subjects),cards=qsa(section,'.subject'),visible=0;
  cards.forEach(function(card){
    var cardText=norm(card.textContent),chapters=qsa(card,'.chapter');
    var cardMatch=!query||cardText.indexOf(query)>-1;
    var chapterHit=false;
    chapters.forEach(function(ch){var hit=!query||contains(ch,query);if(hit)chapterHit=true;ch.classList.toggle('search-dim',query&&cardMatch&&!hit);});
    var show=!query||cardMatch||chapterHit;card.classList.toggle('is-hidden-by-search',!show);if(show)visible++;
  });
  ensureEmpty(section,'subjects').classList.toggle('show',query&&visible===0);
}

function enhanceLearn(){var section=$('learn');if(!section||!section.classList.contains('on'))return;if(!section.querySelector('.app-tools-bar[data-tools="learn"]')){placeBar(section,makeBar('learn','Search topic in this chapter e.g. modulus, arithmetic, dilution','', 'Search ini bantu cari topic dengan cepat dalam chapter semasa.'))}
  applyLearnSearch();
}
function applyLearnSearch(){var section=$('learn');if(!section)return;var query=norm(SEARCH_STATE.learn),items=qsa(section,'.topic'),visible=0;items.forEach(function(item){var hit=!query||contains(item,query);item.classList.toggle('search-dim',query&&!hit);if(hit)visible++;});ensureEmpty(section,'learn').classList.toggle('show',query&&visible===0);}

function enhancePractice(){var section=$('practice');if(!section||!section.classList.contains('on'))return;if(!section.querySelector('.app-tools-bar[data-tools="practice"]')){placeBar(section,makeBar('practice','Search topic drill e.g. quadratic, logs, protein','', 'Search ini tapis senarai topic drill tanpa ganggu quiz sedang berjalan.'))}
  applyPracticeSearch();
}
function applyPracticeSearch(){var section=$('practice');if(!section)return;var query=norm(SEARCH_STATE.practice),items=qsa(section,'.topicCard'),visible=0;items.forEach(function(item){var hit=!query||contains(item,query);item.classList.toggle('is-hidden-by-search',!hit);if(hit)visible++;});ensureEmpty(section,'practice').classList.toggle('show',query&&visible===0);}

function enhanceProgress(){var section=$('progress');if(!section||!section.classList.contains('on'))return;if(!section.querySelector('.app-tools-bar[data-tools="progress"]')){
    var actions='<button class="danger-btn soft" data-reset-progress="chapter">Reset current chapter</button><button class="danger-btn" data-reset-progress="all">Reset all progress</button>';
    placeBar(section,makeBar('progress','Search progress e.g. chemistry, chapter 2, complex, crop',actions,'Reset hanya buang progress yang tersimpan dalam browser/device ini. Content app tidak akan hilang.'));
  }
  applyProgressSearch();
}
function applyProgressSearch(){var section=$('progress');if(!section)return;var query=norm(SEARCH_STATE.progress),rows=qsa(section,'.progressrow'),visible=0;
  rows.forEach(function(row){
    var rowHit=!query||contains(row,query),chapterRows=qsa(row,'.chapterProgress'),chapterVisible=0;
    chapterRows.forEach(function(ch){var hit=!query||contains(ch,query);ch.classList.toggle('is-hidden-by-search',query&&!hit&&!rowHit);if(hit||rowHit)chapterVisible++;});
    var show=!query||rowHit||chapterVisible>0;row.classList.toggle('is-hidden-by-search',!show);if(show)visible++;
  });
  ensureEmpty(section,'progress').classList.toggle('show',query&&visible===0);
}

function openResetModal(mode){
  var state=readState();
  var activeChapter=state.activeChapter||'';
  var label=mode==='all'?'semua progress':'progress current chapter';
  var backdrop=document.createElement('div');
  backdrop.className='reset-modal-backdrop';
  backdrop.innerHTML='<div class="reset-modal" role="dialog" aria-modal="true"><h3>Reset '+label+'?</h3><p>Tindakan ini hanya kosongkan data progress yang disimpan dalam browser ini. Nota, quiz dan chapter content kekal.</p><div class="reset-options">'+(mode==='all'?'<button class="danger-btn" data-confirm-reset="all">Ya, reset semua progress</button>':'<button class="danger-btn" data-confirm-reset="chapter">Ya, reset current chapter</button>')+'</div><div class="modal-row"><button class="btn ghost" data-close-reset>Cancel</button></div></div>';
  document.body.appendChild(backdrop);
  if(mode==='chapter'&&!activeChapter){toast('Current chapter tidak dapat dikesan.');backdrop.remove();}
}
function resetChapter(){var state=readState();if(!state.activeChapter||!state.progress||!state.progress[state.activeChapter]){toast('Tiada progress chapter untuk di-reset.');return;}delete state.progress[state.activeChapter];writeState(state);toast('Progress chapter di-reset.');setTimeout(function(){location.reload();},450);}
function resetAll(){localStorage.removeItem(MAIN_KEY);LEGACY_KEYS.forEach(function(k){localStorage.removeItem(k);});toast('Semua progress di-reset.');setTimeout(function(){location.reload();},450);}

function enhance(){enhanceSubjects();enhanceLearn();enhancePractice();enhanceProgress();}

document.addEventListener('input',function(e){var input=e.target&&e.target.matches&&e.target.matches('[data-tool-search]')?e.target:null;if(!input)return;var key=input.getAttribute('data-tool-search');SEARCH_STATE[key]=input.value||'';var wrap=input.closest('.app-tools-search');if(wrap)wrap.classList.toggle('has-value',!!SEARCH_STATE[key]);if(key==='subjects')applySubjectsSearch();if(key==='learn')applyLearnSearch();if(key==='practice')applyPracticeSearch();if(key==='progress')applyProgressSearch();});
document.addEventListener('click',function(e){var clear=e.target.closest&&e.target.closest('[data-clear-search]');if(clear){var key=clear.getAttribute('data-clear-search');SEARCH_STATE[key]='';var bar=clear.closest('.app-tools-bar'),input=bar&&bar.querySelector('[data-tool-search]');if(input)input.value='';if(key==='subjects')applySubjectsSearch();if(key==='learn')applyLearnSearch();if(key==='practice')applyPracticeSearch();if(key==='progress')applyProgressSearch();return;}
  var reset=e.target.closest&&e.target.closest('[data-reset-progress]');if(reset){openResetModal(reset.getAttribute('data-reset-progress'));return;}
  if(e.target.closest&&e.target.closest('[data-close-reset]')){var m=e.target.closest('.reset-modal-backdrop');if(m)m.remove();return;}
  var confirm=e.target.closest&&e.target.closest('[data-confirm-reset]');if(confirm){var mode=confirm.getAttribute('data-confirm-reset');var modal=confirm.closest('.reset-modal-backdrop');if(modal)modal.remove();if(mode==='all')resetAll();else resetChapter();return;}
  if(e.target.classList&&e.target.classList.contains('reset-modal-backdrop'))e.target.remove();
});

var observer=new MutationObserver(schedule);observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();
