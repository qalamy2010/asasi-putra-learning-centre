(function(){
'use strict';

var STORE_KEY='skorasasi1_mastery_v5';
var APP_URL='https://skorasasi1.pages.dev';

var SUBJECTS=[
  {id:'mathematics',code:'MAT',name:'Mathematics',chapters:[
    C('math1',['Sets','Number Sets','Intervals','Linear Inequalities','Indices, Surds and Logarithms']),
    C('math2',['Imaginary Unit','Operations','Conjugates','Argand, Modulus and Argument','Polar Form']),
    C('math3',['Introduction to Sequences','General Terms','Arithmetic Sequence','Geometric Sequence']),
    C('math4',['Equations','Quadratic Equations','Inequalities','Absolute Values'])
  ]},
  {id:'chemistry',code:'ASC0304',name:'Chemistry I',chapters:[
    C('chem1',['Matter and Properties','Classification of Matter','SI Units','Significant Figures']),
    C('chem2',['Atomic Mass and Isotopes','Mole Concept','Molarity','Dilution']),
    C('chem3',['Chemical Equations','Mole Ratio','Limiting Reagent','Yield']),
    C('chem4',['Subatomic Particles','Isotopes','Electron Arrangement','Periodic Table Link'])
  ]},
  {id:'biology',code:'ASB0204',name:'Biology I',chapters:[
    C('bio2',['Water','Carbohydrates','Lipids','Proteins','Nucleic Acids']),
    C('bio3',['Cell Theory','Prokaryotic and Eukaryotic Cells','Cell Membrane','Organelles','Cytoskeleton'])
  ]},
  {id:'agriculture',code:'ASA0104',name:'Agriculture Industry',chapters:[
    C('agri1',['Definition of Agriculture','Importance to Country','Agriculture Sectors','Agencies and Roles']),
    C('agri2',['Cropping Pattern','Cropping System','Plant Necessities','Crop Management'])
  ]}
];

function C(id,topicTitles){return{id:id,topics:topicTitles.map(function(t){return{id:id+'-'+slug(t),title:t};})};}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function $(id){return document.getElementById(id);}
function load(){try{return JSON.parse(localStorage.getItem(STORE_KEY))||{};}catch(e){return{};}}
function progressForChapter(state,c){var p=state.progress&&state.progress[c.id]?state.progress[c.id]:{topics:{}};var total=0;
  c.topics.forEach(function(t){var r=p.topics&&p.topics[t.id]?p.topics[t.id]:{attempts:0,correct:0};var acc=r.attempts?Math.round((r.correct/r.attempts)*100):0;var pct=0;if(r.attempts>0)pct=30;if(r.attempts>=4&&acc>=65)pct=55;if(r.attempts>=8&&acc>=75)pct=78;if(r.attempts>=12&&acc>=85)pct=100;total+=pct;});
  return c.topics.length?Math.round(total/c.topics.length):0;
}
function subjectScore(state,s){if(!s.chapters.length)return 0;var total=0;s.chapters.forEach(function(c){total+=progressForChapter(state,c);});return Math.round(total/s.chapters.length);}
function snapshot(){var state=load();var subjects=SUBJECTS.map(function(s){return{code:s.code,name:s.name,score:subjectScore(state,s)};});var semester=Math.round(subjects.reduce(function(a,b){return a+b.score;},0)/subjects.length);return{semester:semester,subjects:subjects,date:new Date()};}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function drawText(ctx,text,x,y,maxWidth,lineHeight){var words=String(text).split(' '),line='',lines=[];for(var i=0;i<words.length;i++){var test=line?line+' '+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=words[i];}else{line=test;}}lines.push(line);lines.forEach(function(l,idx){ctx.fillText(l,x,y+(idx*lineHeight));});return y+(lines.length*lineHeight);}
function drawProgressCard(){var data=snapshot();var canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;var ctx=canvas.getContext('2d');
  var bg=ctx.createLinearGradient(0,0,1080,1920);bg.addColorStop(0,'#fbfff7');bg.addColorStop(.58,'#eef8f1');bg.addColorStop(1,'#dceee5');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1920);
  ctx.fillStyle='rgba(216,255,84,.70)';ctx.beginPath();ctx.arc(910,130,310,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,168,132,.16)';ctx.beginPath();ctx.arc(85,1760,360,0,Math.PI*2);ctx.fill();

  // outer card
  roundRect(ctx,72,96,936,1728,72);ctx.fillStyle='rgba(255,255,255,.78)';ctx.fill();ctx.strokeStyle='rgba(11,61,50,.12)';ctx.lineWidth=2;ctx.stroke();

  // header
  ctx.fillStyle='#101614';ctx.font='900 54px Inter, system-ui, sans-serif';ctx.fillText('SkorAsasi1',126,190);
  ctx.fillStyle='#62736c';ctx.font='700 28px Inter, system-ui, sans-serif';ctx.fillText('Semester 1 Learning Progress',126,234);
  ctx.fillStyle='#0b3d32';roundRect(ctx,778,146,146,58,29);ctx.fillStyle='rgba(216,255,84,.85)';ctx.fill();ctx.fillStyle='#0b3d32';ctx.font='900 24px Inter, system-ui, sans-serif';ctx.textAlign='center';ctx.fillText('UPM',851,184);ctx.textAlign='left';

  // main progress panel
  roundRect(ctx,126,330,828,535,56);var dark=ctx.createLinearGradient(126,330,954,865);dark.addColorStop(0,'#071611');dark.addColorStop(.72,'#0b3d32');dark.addColorStop(1,'#1a6b50');ctx.fillStyle=dark;ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.72)';ctx.font='800 32px Inter, system-ui, sans-serif';ctx.fillText('SEMESTER PROGRESS',178,420);
  ctx.fillStyle='#d8ff54';ctx.font='950 180px Inter, system-ui, sans-serif';ctx.fillText(data.semester+'%',178,620);
  ctx.fillStyle='rgba(255,255,255,.82)';ctx.font='700 34px Inter, system-ui, sans-serif';drawText(ctx,'One semester. One step at a time.',178,690,660,44);
  // big bar
  roundRect(ctx,178,775,724,30,15);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();roundRect(ctx,178,775,clamp(724*data.semester/100,0,724),30,15);var lime=ctx.createLinearGradient(178,775,902,805);lime.addColorStop(0,'#00a884');lime.addColorStop(1,'#d8ff54');ctx.fillStyle=lime;ctx.fill();

  // subjects
  ctx.fillStyle='#101614';ctx.font='950 48px Inter, system-ui, sans-serif';ctx.fillText('Subject Progress',126,980);
  ctx.fillStyle='#62736c';ctx.font='700 26px Inter, system-ui, sans-serif';ctx.fillText('Current mastery by subject',126,1022);

  var y=1100;data.subjects.forEach(function(s){
    roundRect(ctx,126,y,828,150,34);ctx.fillStyle='rgba(255,255,255,.92)';ctx.fill();ctx.strokeStyle='rgba(11,61,50,.10)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#101614';ctx.font='900 34px Inter, system-ui, sans-serif';ctx.fillText(s.name,176,y+52);
    ctx.fillStyle='#62736c';ctx.font='800 22px Inter, system-ui, sans-serif';ctx.fillText(s.code,176,y+84);
    ctx.fillStyle='#0b3d32';ctx.font='950 38px Inter, system-ui, sans-serif';ctx.textAlign='right';ctx.fillText(s.score+'%',904,y+60);ctx.textAlign='left';
    roundRect(ctx,176,y+108,728,18,9);ctx.fillStyle='#e3eee8';ctx.fill();roundRect(ctx,176,y+108,clamp(728*s.score/100,0,728),18,9);var g=ctx.createLinearGradient(176,y+108,904,y+126);g.addColorStop(0,'#00a884');g.addColorStop(1,'#d8ff54');ctx.fillStyle=g;ctx.fill();
    y+=178;
  });

  // footer
  ctx.fillStyle='#101614';roundRect(ctx,126,1660,828,90,45);ctx.fill();ctx.fillStyle='#d8ff54';ctx.font='900 32px Inter, system-ui, sans-serif';ctx.fillText('by Perintis Siswa',176,1716);ctx.fillStyle='rgba(255,255,255,.68)';ctx.font='700 22px Inter, system-ui, sans-serif';ctx.textAlign='right';ctx.fillText('Leading and grow with iman',904,1716);ctx.textAlign='left';
  ctx.fillStyle='#62736c';ctx.font='700 22px Inter, system-ui, sans-serif';ctx.fillText('skorasasi1.pages.dev',126,1792);
  return canvas;
}
function canvasToBlob(canvas){return new Promise(function(resolve){canvas.toBlob(resolve,'image/png',.95);});}
function download(canvas){var a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='skorasasi1-progress-story.png';document.body.appendChild(a);a.click();a.remove();}
function openWhatsappText(){var data=snapshot();var text='Saya sedang track progress belajar dengan SkorAsasi1.%0A%0ASemester progress: '+data.semester+'%25%0A'+APP_URL+'%0A%0Aby Perintis Siswa';window.open('https://wa.me/?text='+text,'_blank');}
function toast(msg){var old=document.querySelector('.shareToast');if(old)old.remove();var el=document.createElement('div');el.className='shareToast';el.textContent=msg;document.body.appendChild(el);setTimeout(function(){el.remove();},2600);}
async function shareProgress(){var canvas=drawProgressCard();var blob=await canvasToBlob(canvas);var file=new File([blob],'skorasasi1-progress-story.png',{type:'image/png'});var text='My SkorAsasi1 semester progress — by Perintis Siswa';
  if(navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){try{await navigator.share({files:[file],title:'SkorAsasi1 Progress',text:text});return;}catch(e){if(e&&e.name==='AbortError')return;}}
  download(canvas);openWhatsappText();toast('Image downloaded. WhatsApp opened with caption.');
}
async function preview(){var canvas=drawProgressCard();var url=canvas.toDataURL('image/png');var old=document.querySelector('.sharePreviewOverlay');if(old)old.remove();var overlay=document.createElement('div');overlay.className='sharePreviewOverlay';overlay.innerHTML='<div class="sharePreviewCard"><div class="sharePreviewHead"><div><h3>Preview Progress Story</h3><p>Minimal 9:16 card untuk WhatsApp Status.</p></div><button class="shareClose" aria-label="Close">×</button></div><img alt="SkorAsasi1 progress story preview" src="'+url+'"><div class="sharePreviewActions"><button class="btn dark" data-share-progress-now>Share Progress</button><button class="btn ghost" data-download-progress>Download PNG</button></div></div>';document.body.appendChild(overlay);}
function panel(){return '<div class="shareProgressPanel" data-share-progress-panel><div><span class="shareKicker">WhatsApp Story</span><h3>Share your progress</h3><p>Minimal card: semester progress, subject progress, by Perintis Siswa.</p></div><div class="shareActions"><button class="btn dark" data-share-progress-now>Share Progress</button><button class="btn ghost" data-preview-progress>Preview Card</button></div></div>';}
function inject(){var progress=document.getElementById('progress');if(!progress||!progress.classList.contains('on'))return;if(progress.querySelector('[data-share-progress-panel]'))return;progress.insertAdjacentHTML('afterbegin',panel());}
var mo=new MutationObserver(inject);mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});setInterval(inject,1200);inject();
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-share-progress-now')){shareProgress();return;}if(b.hasAttribute('data-preview-progress')){preview();return;}if(b.hasAttribute('data-download-progress')){download(drawProgressCard());toast('Progress card downloaded.');return;}if(b.classList.contains('shareClose')){var overlay=document.querySelector('.sharePreviewOverlay');if(overlay)overlay.remove();return;}if(e.target.classList&&e.target.classList.contains('sharePreviewOverlay'))e.target.remove();});
})();
