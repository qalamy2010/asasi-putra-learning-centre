(function(){
'use strict';

var STORE_KEY='skorasasi1_mastery_v5';
var SUBJECTS=[
  {id:'mathematics',code:'MAT',name:'Mathematics',chapters:[
    C('math1',1,'Real Number System',['Sets','Number Sets','Intervals','Linear Inequalities','Indices, Surds and Logarithms']),
    C('math2',2,'Complex Numbers',['Imaginary Unit','Operations','Conjugates','Argand, Modulus and Argument','Polar Form']),
    C('math3',3,'Sequence',['Introduction to Sequences','General Terms','Arithmetic Sequence','Geometric Sequence']),
    C('math4',4,'Equations, Inequalities and Absolute Values',['Equations','Quadratic Equations','Inequalities','Absolute Values'])
  ]},
  {id:'chemistry',code:'ASC0304',name:'Chemistry I',chapters:[
    C('chem1',1,'Matter and Measurement',['Matter and Properties','Classification of Matter','SI Units','Significant Figures']),
    C('chem2',2,'Atomic Mass, Mole Concept and Concentration',['Atomic Mass and Isotopes','Mole Concept','Molarity','Dilution']),
    C('chem3',3,'Chemical Equations and Stoichiometry',['Chemical Equations','Mole Ratio','Limiting Reagent','Yield']),
    C('chem4',4,'Atomic Structure',['Subatomic Particles','Isotopes','Electron Arrangement','Periodic Table Link'])
  ]},
  {id:'biology',code:'ASB0204',name:'Biology I',chapters:[
    C('bio2',2,'Molecules of Life',['Water','Carbohydrates','Lipids','Proteins','Nucleic Acids']),
    C('bio3',3,'Cell Structure and Function',['Cell Theory','Prokaryotic and Eukaryotic Cells','Cell Membrane','Organelles','Cytoskeleton'])
  ]},
  {id:'agriculture',code:'ASA0104',name:'Agriculture Industry',chapters:[
    C('agri1',1,'Introduction and Importance of Agricultural Industry',['Definition of Agriculture','Importance to Country','Agriculture Sectors','Agencies and Roles']),
    C('agri2',2,'Crop Production',['Cropping Pattern','Cropping System','Plant Necessities','Crop Management'])
  ]}
];

function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function C(id,n,title,topics){return{id:id,number:n,title:title,topics:topics.map(function(t){return{id:id+'-'+slug(t),title:t};})};}
function $(id){return document.getElementById(id);}
function load(){try{return JSON.parse(localStorage.getItem(STORE_KEY))||{};}catch(e){return{};}}
function subject(id){for(var i=0;i<SUBJECTS.length;i++)if(SUBJECTS[i].id===id)return SUBJECTS[i];return SUBJECTS[0];}
function chapter(id){for(var i=0;i<SUBJECTS.length;i++){for(var j=0;j<SUBJECTS[i].chapters.length;j++){if(SUBJECTS[i].chapters[j].id===id)return SUBJECTS[i].chapters[j];}}return SUBJECTS[0].chapters[0];}
function chapterSubject(c){for(var i=0;i<SUBJECTS.length;i++){for(var j=0;j<SUBJECTS[i].chapters.length;j++){if(SUBJECTS[i].chapters[j].id===c.id)return SUBJECTS[i];}}return SUBJECTS[0];}
function prog(state,c){state.progress=state.progress||{};state.progress[c.id]=state.progress[c.id]||{topics:{},answered:0,correct:0};for(var i=0;i<c.topics.length;i++){state.progress[c.id].topics[c.topics[i].id]=state.progress[c.id].topics[c.topics[i].id]||{attempts:0,correct:0};}return state.progress[c.id];}
function topicProgress(state,c,t){var r=prog(state,c).topics[t.id]||{attempts:0,correct:0};var acc=r.attempts?Math.round((r.correct/r.attempts)*100):0;var pct=0,label='Not started';if(r.attempts>0){pct=30;label='Attempted';}if(r.attempts>=4&&acc>=65){pct=55;label='Familiar';}if(r.attempts>=8&&acc>=75){pct=78;label='Proficient';}if(r.attempts>=12&&acc>=85){pct=100;label='Mastered';}return{attempts:r.attempts,correct:r.correct,acc:acc,pct:pct,label:label};}
function chapterScore(state,c){var total=0,mastered=0,p=prog(state,c);for(var i=0;i<c.topics.length;i++){var tp=topicProgress(state,c,c.topics[i]);total+=tp.pct;if(tp.label==='Mastered')mastered++;}return{mastery:Math.round(total/c.topics.length),answered:p.answered||0,correct:p.correct||0,accuracy:p.answered?Math.round((p.correct/p.answered)*100):0,mastered:mastered,total:c.topics.length};}
function subjectScore(state,s){if(!s.chapters.length)return{mastery:0,answered:0,accuracy:0};var total=0,answered=0,correct=0;for(var i=0;i<s.chapters.length;i++){var cs=chapterScore(state,s.chapters[i]);total+=cs.mastery;answered+=cs.answered;correct+=cs.correct;}return{mastery:Math.round(total/s.chapters.length),answered:answered,accuracy:answered?Math.round((correct/answered)*100):0};}
function semesterScore(state){var total=0;for(var i=0;i<SUBJECTS.length;i++)total+=subjectScore(state,SUBJECTS[i]).mastery;return Math.round(total/SUBJECTS.length);}
function allAnswered(state){var total=0;for(var i=0;i<SUBJECTS.length;i++)total+=subjectScore(state,SUBJECTS[i]).answered;return total;}
function findWeakTopic(state,c){var weak=c.topics[0];for(var i=0;i<c.topics.length;i++){if(topicProgress(state,c,c.topics[i]).pct<topicProgress(state,c,weak).pct)weak=c.topics[i];}return weak;}
function topSubject(state){var best=SUBJECTS[0];for(var i=0;i<SUBJECTS.length;i++){if(subjectScore(state,SUBJECTS[i]).mastery>subjectScore(state,best).mastery)best=SUBJECTS[i];}return best;}
function data(){var state=load();var s=subject(state.activeSubject||'mathematics');var c=chapter(state.activeChapter||s.chapters[0].id);var cs=chapterScore(state,c);var ss=subjectScore(state,s);return{state:state,subject:s,chapter:c,chapterScore:cs,subjectScore:ss,semester:semesterScore(state),answered:allAnswered(state),weak:findWeakTopic(state,c),best:topSubject(state),date:new Date()};}
function activeProgressView(){var p=$('progress');return p&&p.classList.contains('on');}
function inject(){var p=$('progress');if(!p||$('shareProgressPanel'))return;var head=p.querySelector('.sectionHead')||p.firstElementChild;if(!head)return;var panel=document.createElement('section');panel.id='shareProgressPanel';panel.className='shareProgressPanel';panel.innerHTML='<div><span class="shareKicker">WhatsApp Story Card</span><h3>Share your progress</h3><p>Generate a 9:16 progress card. Best for WhatsApp Story, status or direct share to friends.</p></div><div class="shareActions"><button class="btn dark" id="shareProgressBtn">Share Progress</button><button class="btn ghost" id="previewProgressBtn">Preview Card</button></div>';
head.insertAdjacentElement('afterend',panel);
}
function monitor(){inject();var obs=new MutationObserver(function(){if(activeProgressView())inject();});var p=$('progress');if(p)obs.observe(p,{childList:true,subtree:false});document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('button'):null;if(!b)return;if(b.getAttribute('data-view')==='progress')setTimeout(inject,100);if(b.id==='shareProgressBtn')shareProgress();if(b.id==='previewProgressBtn')previewProgress();if(b.id==='closeSharePreview')closePreview();if(b.id==='downloadProgressCard')downloadProgress();if(b.id==='sharePreviewCard')shareProgress();});window.addEventListener('storage',function(){if(activeProgressView())setTimeout(inject,80);});}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function wrap(ctx,text,x,y,maxWidth,lineHeight,maxLines){var words=String(text).split(/\s+/),line='',lines=[];for(var n=0;n<words.length;n++){var test=line?line+' '+words[n]:words[n];if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=words[n];}else line=test;}if(line)lines.push(line);if(maxLines&&lines.length>maxLines){lines=lines.slice(0,maxLines);var last=lines[lines.length-1];while(ctx.measureText(last+'...').width>maxWidth&&last.length>0)last=last.slice(0,-1);lines[lines.length-1]=last+'...';}for(var i=0;i<lines.length;i++)ctx.fillText(lines[i],x,y+(i*lineHeight));return y+(lines.length*lineHeight);}
function drawPill(ctx,x,y,text,bg,fg){ctx.save();ctx.font='700 28px Inter, Arial, sans-serif';var w=ctx.measureText(text).width+42;roundRect(ctx,x,y,w,52,26);ctx.fillStyle=bg;ctx.fill();ctx.fillStyle=fg;ctx.fillText(text,x+21,y+35);ctx.restore();return w;}
function progressBar(ctx,x,y,w,h,pct,bg,fg){roundRect(ctx,x,y,w,h,h/2);ctx.fillStyle=bg;ctx.fill();roundRect(ctx,x,y,Math.max(h,w*pct/100),h,h/2);ctx.fillStyle=fg;ctx.fill();}
function canvasCard(){var d=data(),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=1080;canvas.height=1920;
var grad=ctx.createLinearGradient(0,0,1080,1920);grad.addColorStop(0,'#f9fff4');grad.addColorStop(.48,'#eef8f1');grad.addColorStop(1,'#dff1e7');ctx.fillStyle=grad;ctx.fillRect(0,0,1080,1920);
ctx.fillStyle='rgba(216,255,84,.50)';ctx.beginPath();ctx.arc(940,120,280,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,168,132,.16)';ctx.beginPath();ctx.arc(90,1780,320,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#101614';ctx.font='900 44px Inter, Arial, sans-serif';ctx.fillText('SkorAsasi1',76,104);ctx.font='600 25px Inter, Arial, sans-serif';ctx.fillStyle='#60736c';ctx.fillText('Semester 1 Learning Centre',76,142);
drawPill(ctx,760,76,'by Perintis Siswa','rgba(16,22,20,.92)','#d8ff54');
roundRect(ctx,76,205,928,1260,56);ctx.fillStyle='rgba(255,255,255,.88)';ctx.fill();ctx.strokeStyle='rgba(11,61,50,.10)';ctx.lineWidth=3;ctx.stroke();
ctx.fillStyle='#0b3d32';ctx.font='800 30px Inter, Arial, sans-serif';ctx.fillText('PROGRESS UPDATE',126,290);ctx.fillStyle='#101614';ctx.font='1000 118px Inter, Arial, sans-serif';wrap(ctx,'I am '+d.semester+'% through my Semester 1 mastery.',126,405,820,120,3);
ctx.fillStyle='#101614';ctx.font='1000 228px Inter, Arial, sans-serif';ctx.fillText(String(d.semester)+'%',126,760);ctx.font='700 31px Inter, Arial, sans-serif';ctx.fillStyle='#60736c';ctx.fillText('Overall semester mastery',134,815);
progressBar(ctx,126,860,828,28,d.semester,'#e1eee7','#00a884');
var cardY=940;roundRect(ctx,126,cardY,828,210,34);ctx.fillStyle='#101614';ctx.fill();ctx.fillStyle='#d8ff54';ctx.font='900 36px Inter, Arial, sans-serif';ctx.fillText('Current Focus',170,1008);ctx.fillStyle='#fff';ctx.font='900 46px Inter, Arial, sans-serif';wrap(ctx,d.subject.code+' · Chapter '+d.chapter.number,170,1066,650,52,1);ctx.fillStyle='rgba(255,255,255,.76)';ctx.font='650 29px Inter, Arial, sans-serif';wrap(ctx,d.chapter.title,170,1114,650,34,2);ctx.fillStyle='#d8ff54';ctx.font='1000 54px Inter, Arial, sans-serif';ctx.fillText(d.chapterScore.mastery+'%',810,1066);
var y=1222;var rows=[['Answered',String(d.answered)],['Accuracy',String(d.chapterScore.accuracy)+'%'],['Mastered topics',d.chapterScore.mastered+'/'+d.chapterScore.total],['Weak topic',d.weak.title]];for(var i=0;i<rows.length;i++){var x=126+(i%2)*414,yy=y+Math.floor(i/2)*116;roundRect(ctx,x,yy,388,86,24);ctx.fillStyle='rgba(240,248,243,.96)';ctx.fill();ctx.fillStyle='#60736c';ctx.font='700 23px Inter, Arial, sans-serif';ctx.fillText(rows[i][0],x+26,yy+32);ctx.fillStyle='#101614';ctx.font='900 32px Inter, Arial, sans-serif';wrap(ctx,rows[i][1],x+26,yy+67,330,35,1);} 
var sy=1535;ctx.fillStyle='#101614';ctx.font='900 38px Inter, Arial, sans-serif';ctx.fillText('Subject Progress',76,sy);for(i=0;i<SUBJECTS.length;i++){var s=SUBJECTS[i],sc=subjectScore(d.state,s),yy=sy+62+(i*72);ctx.fillStyle='#101614';ctx.font='850 25px Inter, Arial, sans-serif';ctx.fillText(s.code,76,yy);progressBar(ctx,250,yy-22,620,24,sc.mastery,'#e1eee7','#00a884');ctx.fillStyle='#0b3d32';ctx.font='900 27px Inter, Arial, sans-serif';ctx.fillText(sc.mastery+'%',900,yy);} 
roundRect(ctx,76,1810,928,70,35);ctx.fillStyle='#101614';ctx.fill();ctx.fillStyle='#d8ff54';ctx.font='800 28px Inter, Arial, sans-serif';ctx.fillText('Keep going. One topic at a time.',126,1855);ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='650 22px Inter, Arial, sans-serif';ctx.fillText((location.origin||'skorasasi1.pages.dev').replace(/^https?:\/\//,''),725,1855);
return canvas;}
function canvasBlob(canvas){return new Promise(function(resolve){canvas.toBlob(resolve,'image/png',0.95);});}
function shareText(){var d=data();return 'Saya baru update progress SkorAsasi1 📚\n\nSemester mastery: '+d.semester+'%\nCurrent focus: '+d.subject.code+' · Chapter '+d.chapter.number+'\nAnswered: '+d.answered+' questions\n\nJom study sama-sama: '+location.href;}
async function shareProgress(){var canvas=canvasCard(),blob=await canvasBlob(canvas);if(!blob){fallbackDownload(canvas);return;}var file=new File([blob],'skorasasi1-progress-story.png',{type:'image/png'});var text=shareText();try{if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({title:'SkorAsasi1 Progress',text:text,files:[file]});return;}if(navigator.share){fallbackDownload(canvas);await navigator.share({title:'SkorAsasi1 Progress',text:text,url:location.href});return;}}catch(err){if(err&&err.name==='AbortError')return;}fallbackDownload(canvas);window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');}
function fallbackDownload(canvas){var link=document.createElement('a');link.download='skorasasi1-progress-story.png';link.href=canvas.toDataURL('image/png');document.body.appendChild(link);link.click();link.remove();}
function previewProgress(){var old=$('sharePreviewOverlay');if(old)old.remove();var canvas=canvasCard();var overlay=document.createElement('div');overlay.id='sharePreviewOverlay';overlay.className='sharePreviewOverlay';overlay.innerHTML='<div class="sharePreviewCard"><div class="sharePreviewHead"><div><span class="shareKicker">Preview 9:16</span><h3>WhatsApp Story Progress Card</h3><p>Share as image on mobile. On desktop, download the PNG and send manually.</p></div><button id="closeSharePreview" class="shareClose" aria-label="Close">×</button></div><img alt="Progress story preview" src="'+canvas.toDataURL('image/png')+'"><div class="sharePreviewActions"><button class="btn dark" id="sharePreviewCard">Share Progress</button><button class="btn ghost" id="downloadProgressCard">Download PNG</button></div></div>';document.body.appendChild(overlay);}
function closePreview(){var x=$('sharePreviewOverlay');if(x)x.remove();}
function downloadProgress(){fallbackDownload(canvasCard());}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',monitor);else monitor();
})();
