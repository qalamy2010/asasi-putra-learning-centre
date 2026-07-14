(function(){
'use strict';

var EXAM_DATE=new Date(2026,10,9); // 09/11/2026, Malaysia format: 9 Nov 2026
var MS_DAY=24*60*60*1000;

function startOfDay(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function daysLeft(){return Math.ceil((startOfDay(EXAM_DATE)-startOfDay(new Date()))/MS_DAY);}
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function examDateLabel(){return '9 November 2026';}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function message(n){
  if(n>30)return 'Masa masih ada, tapi konsisten dari sekarang akan bezakan result nanti.';
  if(n>7)return 'Fasa serius. Fokus ulang topik lemah dan buat mixed challenge setiap hari.';
  if(n>0)return 'Final push. Pilih topik paling lemah, buat latihan pendek dan tidur cukup.';
  if(n===0)return 'Hari exam. Bertenang, baca doa, dan jawab dengan yakin.';
  return 'Exam date sudah berlalu. Progress masih boleh digunakan untuk ulang kaji.';
}
function renderPanel(){
  var home=document.getElementById('home');
  if(!home||!home.classList.contains('on'))return;
  if(home.querySelector('.examCountdownPanel'))return;
  var n=daysLeft();
  var safe=Math.max(0,n);
  var panel=document.createElement('section');
  panel.className='examCountdownPanel';
  panel.innerHTML='<div class="examCountdownCopy"><span class="examCountdownKicker">Exam Countdown</span><h3>'+safe+' hari menuju exam</h3><p>'+escapeHtml(message(n))+'</p><div class="examCountdownMeta"><span>Tarikh exam: '+examDateLabel()+'</span><span>Target: ulang kaji konsisten</span></div></div><div class="examCountdownNumber"><div><b>'+safe+'</b><span>hari lagi</span></div></div>';
  var stat=home.querySelector('.statgrid');
  if(stat)home.insertBefore(panel,stat);else home.appendChild(panel);
}
function renderTopChip(){
  var top=document.getElementById('topStats');
  if(!top)return;
  if(top.querySelector('.examTopChip'))return;
  var chip=document.createElement('span');
  chip.className='chip examTopChip';
  chip.innerHTML='Exam <b>'+Math.max(0,daysLeft())+' hari</b>';
  top.insertBefore(chip,top.firstChild);
}
function renderProgressMini(){
  var progress=document.getElementById('progress');
  if(!progress||!progress.classList.contains('on'))return;
  if(progress.querySelector('.examCountdownPanel'))return;
  var n=daysLeft();
  var safe=Math.max(0,n);
  var panel=document.createElement('section');
  panel.className='examCountdownPanel';
  panel.innerHTML='<div class="examCountdownCopy"><span class="examCountdownKicker">Exam Countdown</span><h3>'+safe+' hari lagi</h3><p>Gunakan progress dashboard ini untuk monitor subject mana yang perlu dikuatkan sebelum '+examDateLabel()+'.</p><div class="examCountdownMeta"><span>Tarikh exam: '+examDateLabel()+'</span></div></div><div class="examCountdownNumber"><div><b>'+safe+'</b><span>hari</span></div></div>';
  var first=progress.firstElementChild;
  if(first)progress.insertBefore(panel,first.nextSibling);else progress.appendChild(panel);
}
function render(){renderPanel();renderTopChip();renderProgressMini();}

var timer=null;
function schedule(){clearTimeout(timer);timer=setTimeout(render,80);}

document.addEventListener('click',schedule,true);
document.addEventListener('change',schedule,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
setInterval(render,1200);
try{new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});}catch(e){}
})();
