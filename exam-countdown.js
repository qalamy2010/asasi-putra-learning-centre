(function(){
'use strict';

var EXAM_DATE=new Date(2026,10,9,0,0,0); // 09/11/2026, Malaysia format: 9 Nov 2026
var STORY_W=1080;
var STORY_H=1920;
var APP_LINK='https://skorasasi1.pages.dev';
var timer=null;

function $(s,root){return(root||document).querySelector(s)}
function $all(s,root){return Array.prototype.slice.call((root||document).querySelectorAll(s))}
function pad(n){return String(Math.max(0,Math.floor(n))).padStart(2,'0')}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
function examDateLabel(){return '9 November 2026'}
function now(){return new Date()}
function left(){
  var ms=EXAM_DATE-now();
  var done=ms<=0;
  ms=Math.max(0,ms);
  var totalSeconds=Math.floor(ms/1000);
  var days=Math.floor(totalSeconds/86400);
  var hours=Math.floor((totalSeconds%86400)/3600);
  var minutes=Math.floor((totalSeconds%3600)/60);
  var seconds=totalSeconds%60;
  return{ms:ms,done:done,days:days,hours:hours,minutes:minutes,seconds:seconds,totalSeconds:totalSeconds};
}
function message(t){
  if(t.done)return 'Exam date sudah bermula. Bertenang, baca doa dan jawab dengan yakin.';
  if(t.days>30)return 'Masa masih ada, tapi konsisten dari sekarang akan bezakan result nanti.';
  if(t.days>7)return 'Fasa serius. Fokus ulang topik lemah dan buat mixed challenge setiap hari.';
  return 'Final push. Pilih topik paling lemah, buat latihan pendek dan tidur cukup.';
}
function unit(label,value){return '<div class="examTimeUnit"><b>'+escapeHtml(value)+'</b><span>'+escapeHtml(label)+'</span></div>'}
function panelHtml(kind){
  var t=left();
  var title=t.done?'Hari exam sudah tiba':t.days+' hari menuju exam';
  var compact=kind==='mini';
  return '<div class="examCountdownCopy"><span class="examCountdownKicker">Live Exam Countdown</span><h3 data-exam-title>'+escapeHtml(title)+'</h3><p data-exam-message>'+escapeHtml(message(t))+'</p><div class="examCountdownMeta"><span>Tarikh exam: '+examDateLabel()+'</span><span>Target: ulang kaji konsisten</span></div></div><div class="examCountdownLive"><div class="examCountdownUnits" data-exam-units>'+unit('hari',t.days)+unit('jam',pad(t.hours))+unit('minit',pad(t.minutes))+unit('saat',pad(t.seconds))+'</div><div class="examShareActions"><button class="btn dark" data-share-exam>Share Countdown</button><button class="btn ghost" data-preview-exam>Preview Story</button></div>'+(compact?'<small>9:16 WhatsApp Story card</small>':'')+'</div>';
}
function ensurePanel(){
  var home=document.getElementById('home');
  if(home&&home.classList.contains('on')&&!home.querySelector('.examCountdownPanel')){
    var panel=document.createElement('section');
    panel.className='examCountdownPanel examCountdownMain';
    panel.innerHTML=panelHtml('main');
    var stat=home.querySelector('.statgrid');
    if(stat)home.insertBefore(panel,stat);else home.appendChild(panel);
  }
  var progress=document.getElementById('progress');
  if(progress&&progress.classList.contains('on')&&!progress.querySelector('.examCountdownPanel')){
    var mini=document.createElement('section');
    mini.className='examCountdownPanel examCountdownMini';
    mini.innerHTML=panelHtml('mini');
    var first=progress.firstElementChild;
    if(first)progress.insertBefore(mini,first.nextSibling);else progress.appendChild(mini);
  }
}
function updatePanels(){
  var t=left();
  $all('.examCountdownPanel').forEach(function(panel){
    var title=$('[data-exam-title]',panel);
    var msg=$('[data-exam-message]',panel);
    var units=$('[data-exam-units]',panel);
    if(title)title.textContent=t.done?'Hari exam sudah tiba':t.days+' hari menuju exam';
    if(msg)msg.textContent=message(t);
    if(units)units.innerHTML=unit('hari',t.days)+unit('jam',pad(t.hours))+unit('minit',pad(t.minutes))+unit('saat',pad(t.seconds));
  });
}
function updateTopChip(){
  var top=document.getElementById('topStats');
  if(!top)return;
  var chip=top.querySelector('.examTopChip');
  if(!chip){
    chip=document.createElement('span');
    chip.className='chip examTopChip';
    top.insertBefore(chip,top.firstChild);
  }
  var t=left();
  chip.innerHTML='Exam <b>'+t.days+'h '+pad(t.hours)+'j '+pad(t.minutes)+'m</b>';
}
function render(){ensurePanel();updatePanels();updateTopChip()}
function schedule(){clearTimeout(timer);timer=setTimeout(render,60)}

function roundRect(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines){
  var words=String(text).split(' '),line='',lines=[];
  for(var i=0;i<words.length;i++){
    var test=line?line+' '+words[i]:words[i];
    if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=words[i]}else line=test;
  }
  if(line)lines.push(line);
  if(maxLines&&lines.length>maxLines){lines=lines.slice(0,maxLines);lines[maxLines-1]=lines[maxLines-1].replace(/\s+$/,'')+'…'}
  for(i=0;i<lines.length;i++)ctx.fillText(lines[i],x,y+(i*lineHeight));
  return y+(lines.length*lineHeight);
}
function drawProgressBar(ctx,x,y,w,h,pct){
  ctx.fillStyle='rgba(255,255,255,.16)';roundRect(ctx,x,y,w,h,h/2);ctx.fill();
  var fw=Math.max(h,Math.min(w,w*pct));
  var g=ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,'#00a884');g.addColorStop(1,'#d8ff54');
  ctx.fillStyle=g;roundRect(ctx,x,y,fw,h,h/2);ctx.fill();
}
function makeCountdownCanvas(){
  var canvas=document.createElement('canvas');canvas.width=STORY_W;canvas.height=STORY_H;
  var ctx=canvas.getContext('2d');var t=left();
  var bg=ctx.createLinearGradient(0,0,STORY_W,STORY_H);bg.addColorStop(0,'#f9fdf8');bg.addColorStop(.55,'#eef7f2');bg.addColorStop(1,'#e7f3eb');ctx.fillStyle=bg;ctx.fillRect(0,0,STORY_W,STORY_H);
  var glow=ctx.createRadialGradient(910,130,10,910,130,520);glow.addColorStop(0,'rgba(216,255,84,.62)');glow.addColorStop(1,'rgba(216,255,84,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,STORY_W,STORY_H);
  var glow2=ctx.createRadialGradient(120,1650,10,120,1650,650);glow2.addColorStop(0,'rgba(0,168,132,.22)');glow2.addColorStop(1,'rgba(0,168,132,0)');ctx.fillStyle=glow2;ctx.fillRect(0,0,STORY_W,STORY_H);

  ctx.fillStyle='#101614';ctx.font='900 42px Inter, Arial, sans-serif';ctx.fillText('SkorAsasi1',82,124);
  ctx.fillStyle='#62736c';ctx.font='700 28px Inter, Arial, sans-serif';ctx.fillText('Semester 1 Learning Centre',82,162);
  ctx.fillStyle='#0b3d32';roundRect(ctx,82,218,310,54,27);ctx.fill();ctx.fillStyle='#d8ff54';ctx.font='900 24px Inter, Arial, sans-serif';ctx.fillText('EXAM COUNTDOWN',112,253);

  ctx.fillStyle='#101614';ctx.font='900 82px Inter, Arial, sans-serif';wrapText(ctx,'9 November 2026',82,380,840,88,2);
  ctx.fillStyle='#62736c';ctx.font='700 34px Inter, Arial, sans-serif';ctx.fillText('Tarikh exam semakin dekat. Keep going.',82,540);

  ctx.save();ctx.shadowColor='rgba(11,61,50,.18)';ctx.shadowBlur=46;ctx.shadowOffsetY=22;ctx.fillStyle='#101614';roundRect(ctx,82,640,916,520,46);ctx.fill();ctx.restore();
  var accent=ctx.createLinearGradient(82,640,998,1160);accent.addColorStop(0,'rgba(0,168,132,.42)');accent.addColorStop(1,'rgba(216,255,84,.35)');ctx.fillStyle=accent;roundRect(ctx,82,640,916,520,46);ctx.fill();
  ctx.fillStyle='#ffffff';ctx.font='900 250px Inter, Arial, sans-serif';ctx.textAlign='center';ctx.fillText(String(t.days),540,900);ctx.font='900 48px Inter, Arial, sans-serif';ctx.fillStyle='rgba(255,255,255,.82)';ctx.fillText('HARI LAGI',540,970);ctx.textAlign='left';

  var y=1235;var labels=[['Jam',pad(t.hours)],['Minit',pad(t.minutes)],['Saat',pad(t.seconds)]];var boxW=286;for(var i=0;i<labels.length;i++){var x=82+i*(boxW+29);ctx.fillStyle='#ffffff';roundRect(ctx,x,y,boxW,180,34);ctx.fill();ctx.fillStyle='#101614';ctx.font='900 78px Inter, Arial, sans-serif';ctx.textAlign='center';ctx.fillText(labels[i][1],x+boxW/2,y+92);ctx.fillStyle='#62736c';ctx.font='900 26px Inter, Arial, sans-serif';ctx.fillText(labels[i][0],x+boxW/2,y+132);ctx.textAlign='left'}

  ctx.fillStyle='#101614';ctx.font='900 44px Inter, Arial, sans-serif';ctx.fillText('Study progress starts today.',82,1510);
  ctx.fillStyle='#62736c';ctx.font='700 30px Inter, Arial, sans-serif';wrapText(ctx,'Share this countdown as a reminder to revise consistently before exam week.',82,1564,880,42,3);
  drawProgressBar(ctx,82,1710,916,18,Math.max(.04,Math.min(1,1-(t.totalSeconds/(118*86400)))));
  ctx.fillStyle='#0b3d32';ctx.font='900 32px Inter, Arial, sans-serif';ctx.fillText('by Perintis Siswa',82,1810);
  ctx.fillStyle='#62736c';ctx.font='700 24px Inter, Arial, sans-serif';ctx.fillText('Leading and grow with iman',82,1848);
  return canvas;
}
function canvasToBlob(canvas){return new Promise(function(resolve){canvas.toBlob(resolve,'image/png',.95)})}
function downloadBlob(blob){
  var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='skorasasi1-exam-countdown.png';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1200);
}
function toast(text){
  var old=document.querySelector('.shareToast');if(old)old.remove();var el=document.createElement('div');el.className='shareToast';el.textContent=text;document.body.appendChild(el);setTimeout(function(){el.remove()},3000);
}
function shareText(){
  var t=left();
  return 'Exam countdown SkorAsasi1: '+t.days+' hari '+pad(t.hours)+' jam '+pad(t.minutes)+' minit lagi menuju 9 November 2026.\n\nJom skor Asasi: '+APP_LINK;
}
async function shareCountdown(){
  var canvas=makeCountdownCanvas();var blob=await canvasToBlob(canvas);var file=new File([blob],'skorasasi1-exam-countdown.png',{type:'image/png'});
  var text=shareText();
  try{
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({title:'SkorAsasi1 Exam Countdown',text:text,url:APP_LINK,files:[file]});
      return;
    }
    if(navigator.share){await navigator.share({title:'SkorAsasi1 Exam Countdown',text:text,url:APP_LINK});downloadBlob(blob);return;}
  }catch(e){if(e&&e.name==='AbortError')return;}
  downloadBlob(blob);
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
  toast('Image downloaded. Upload ke WhatsApp Status.');
}
function previewCountdown(){
  var canvas=makeCountdownCanvas();var img=canvas.toDataURL('image/png');
  var overlay=document.createElement('div');overlay.className='sharePreviewOverlay';overlay.innerHTML='<div class="sharePreviewCard"><div class="sharePreviewHead"><div><h3>Preview WhatsApp Story</h3><p>9:16 countdown card untuk status.</p></div><button class="shareClose" data-close-exam-preview>×</button></div><img src="'+img+'" alt="SkorAsasi1 exam countdown preview"><div class="sharePreviewActions"><button class="btn dark" data-share-exam>Share Countdown</button><button class="btn ghost" data-close-exam-preview>Close</button></div></div>';
  document.body.appendChild(overlay);
}

document.addEventListener('click',function(e){
  var target=e.target;
  if(target&&target.closest&&target.closest('[data-share-exam]')){e.preventDefault();shareCountdown();return;}
  if(target&&target.closest&&target.closest('[data-preview-exam]')){e.preventDefault();previewCountdown();return;}
  if(target&&target.closest&&target.closest('[data-close-exam-preview]')){e.preventDefault();var o=document.querySelector('.sharePreviewOverlay');if(o)o.remove();return;}
},true);
document.addEventListener('change',schedule,true);
document.addEventListener('click',schedule,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
setInterval(render,1000);
try{new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});}catch(e){}
})();
