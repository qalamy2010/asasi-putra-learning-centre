(function(){
  'use strict';

  var STORE='skorasasi1_mastery_v5';
  var session=null;

  var CHAPTERS={
    math1:{title:'Real Number System',topics:{
      'math1-sets':'Sets','math1-number-sets':'Number Sets','math1-intervals':'Intervals','math1-linear-inequalities':'Linear Inequalities','math1-indices-surds-and-logarithms':'Indices, Surds and Logarithms'}},
    math2:{title:'Complex Numbers',topics:{
      'math2-imaginary-unit':'Imaginary Unit','math2-operations':'Operations','math2-conjugates':'Conjugates','math2-argand-modulus-and-argument':'Argand, Modulus and Argument','math2-polar-form':'Polar Form'}},
    math3:{title:'Sequence',topics:{
      'math3-introduction-to-sequences':'Introduction to Sequences','math3-general-terms':'General Terms','math3-arithmetic-sequence':'Arithmetic Sequence','math3-geometric-sequence':'Geometric Sequence'}},
    math4:{title:'Equations, Inequalities and Absolute Values',topics:{
      'math4-equations':'Equations','math4-quadratic-equations':'Quadratic Equations','math4-inequalities':'Inequalities','math4-absolute-values':'Absolute Values'}}
  };

  function $(id){return document.getElementById(id)}
  function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
  function closest(el,sel){while(el&&el.nodeType===1){if(el.matches&&el.matches(sel))return el;el=el.parentElement}return null}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=a[i];a[i]=a[j];a[j]=x}return a}
  function state(){try{return JSON.parse(localStorage.getItem(STORE))||{}}catch(e){return{}}}
  function save(s){try{localStorage.setItem(STORE,JSON.stringify(s))}catch(e){}}
  function currentChapter(){var el=$('chapterPick');return el?el.value:null}
  function currentTopic(){var el=$('topicPick');return el?el.value:null}
  function isMathChapter(id){return !!(id&&id.indexOf('math')===0&&CHAPTERS[id])}
  function topicTitle(ch,tid){return CHAPTERS[ch]&&CHAPTERS[ch].topics[tid]||'Topic'}
  function choices(correct,wrong){var list=[correct],pool=(wrong||[]).concat(['None of these','Cannot be determined','Only true for positive values','Same as previous answer']);for(var i=0;list.length<4&&i<pool.length;i++){if(pool[i]&&list.indexOf(pool[i])<0)list.push(pool[i])}return shuffle(list.slice(0,4))}
  function q(ch,tid,type,prompt,correct,wrong,explain){var c=choices(correct,wrong);return{chapterId:ch,topicId:tid,type:type,prompt:prompt,choices:c,answer:c.indexOf(correct),explain:explain||('Answer: '+correct)}}
  function generic(ch,tid){var t=topicTitle(ch,tid);return [
    q(ch,tid,'Concept','Before calculating '+t+', what should you identify first?','The relevant definition, condition or formula.',['The longest option','Any formula from another chapter','The final answer only'],'Start from the concept before applying the calculation.'),
    q(ch,tid,'Mistake check','What is a common mistake in '+t+'?','Applying a rule without checking its condition.',['Writing the working clearly','Checking the final answer','Comparing with a nearby topic'],'Most mistakes happen when a rule is used outside its condition.'),
    q(ch,tid,'Method','What should you do after solving a '+t+' question?','Check the result against the original condition.',['Delete all working','Ignore signs and units','Choose the nearest answer'],'Checking catches sign errors, rejected solutions and wrong interval endpoints.'),
    q(ch,tid,'Mastery','A student has mastered '+t+' when they can...','Recall, calculate and explain the reason.',['Recognise the title only','Guess quickly','Avoid mixed questions'],'Mastery means recall plus correct application.'),
    q(ch,tid,'Identify','This topic belongs to which Mathematics chapter?','Chapter '+CHAPTERS[ch].title,['Chemistry I','Biology I','Agriculture Industry'],'This topic is part of '+CHAPTERS[ch].title+'.'),
    q(ch,tid,'Strategy','When stuck in '+t+', what is the best next step?','Write the known rule and substitute values carefully.',['Skip to another answer','Memorise the title','Ignore the negative sign'],'A written rule makes the calculation traceable.')
  ]}

  function calc(ch,tid){var a=[];
    function add(type,prompt,correct,wrong,explain){a.push(q(ch,tid,type,prompt,correct,wrong,explain))}
    if(tid==='math1-sets'){
      add('Calculation','Given A={1,2,3,5} and B={2,4,5,6}, find A ∩ B.','{2,5}',['{1,3,4,6}','{1,2,3,4,5,6}','{2,4,5,6}'],'Intersection means common elements only.');
      add('Calculation','Given A={a,b,c} and B={b,c,d,e}, find A ∪ B.','{a,b,c,d,e}',['{b,c}','{a,d,e}','{a,b,b,c,c,d,e}'],'Union lists all unique elements from both sets.');
      add('Calculation','If U={1,2,3,4,5,6} and A={2,4,6}, find A complement.','{1,3,5}',['{2,4,6}','{1,2,3,4,5,6}','∅'],'Complement means elements in U not in A.');
      add('Calculation','If n(A)=8, n(B)=5 and n(A ∩ B)=3, find n(A ∪ B).','10',['13','16','6'],'n(A ∪ B)=8+5-3=10.');
      add('Calculation','If A={1,3,5,7} and B={2,3,5,8}, how many elements are in A ∩ B?','2',['4','6','1'],'Common elements are 3 and 5.');
    }
    if(tid==='math1-number-sets'){
      add('Calculation','Which set classification is most complete for -12?','Integer, rational and real',['Natural only','Whole and natural','Irrational and real'],'-12 is integer, rational and real.');
      add('Calculation','Which number is irrational?','√7',['0.125','-4','22/7'],'√7 is not a perfect square root.');
      add('Calculation','Convert 0.375 into a fraction.','3/8',['3/5','5/8','37/100'],'0.375=375/1000=3/8.');
      add('Calculation','Which value is rational but not an integer?','-5/2',['-8','√5','0'],'-5/2 is a ratio of integers but not an integer.');
      add('Calculation','Which number is real but irrational?','π',['4/9','-3','0.2'],'π is real and irrational.');
    }
    if(tid==='math1-intervals'){
      add('Calculation','Write -3 < x ≤ 4 in interval notation.','(-3,4]',['[-3,4]','(-3,4)','[-3,4)'],'Open at -3, closed at 4.');
      add('Calculation','Write [2,7) as an inequality.','2 ≤ x < 7',['2 < x ≤ 7','2 < x < 7','2 ≤ x ≤ 7'],'[ includes 2, ) excludes 7.');
      add('Calculation','Which interval represents x ≥ -1?','[-1,∞)',['(-1,∞)','[-1,∞]','(-∞,-1]'],'-1 included and infinity never included.');
      add('Calculation','Find the intersection of [1,6] and (3,8).','(3,6]',['[1,8)','[3,6]','(1,8)'],'Common values are greater than 3 and up to 6 inclusive.');
      add('Calculation','Write x < 5 in interval notation.','(-∞,5)',['(-∞,5]','[5,∞)','(5,∞)'],'All values less than 5, 5 not included.');
    }
    if(tid==='math1-linear-inequalities'){
      add('Calculation','Solve -2x < 6.','x > -3',['x < -3','x > 3','x < 3'],'Divide by -2 and reverse the sign.');
      add('Calculation','Solve 3x + 5 ≤ 14.','x ≤ 3',['x ≥ 3','x ≤ 19/3','x ≥ -3'],'3x≤9 so x≤3.');
      add('Calculation','Solve -4x + 7 > 19.','x < -3',['x > -3','x < 3','x > 3'],'-4x>12, divide by -4 and reverse sign.');
      add('Calculation','Solve 2(x-1) ≥ 10.','x ≥ 6',['x ≤ 6','x ≥ 4','x ≤ 4'],'2x-2≥10, so x≥6.');
      add('Calculation','Solve 5 - x ≤ 2.','x ≥ 3',['x ≤ 3','x ≥ -3','x ≤ -3'],'-x≤-3, divide by -1 and reverse sign.');
      add('Calculation','Solve 7x - 4 > 17.','x > 3',['x < 3','x > 13/7','x < 13/7'],'7x>21, so x>3.');
    }
    if(tid==='math1-indices-surds-and-logarithms'){
      add('Calculation','Simplify 3^5 × 3^2.','3^7',['3^10','9^7','3^3'],'Same base multiplied: add indices.');
      add('Calculation','Simplify 2^6 ÷ 2^4.','4',['2^10','2','16'],'2^(6-4)=2^2=4.');
      add('Calculation','Simplify √48.','4√3',['3√4','16√3','2√12'],'√48=√(16×3)=4√3.');
      add('Calculation','Evaluate log_2 32.','5',['4','16','64'],'2^5=32.');
      add('Calculation','If log_3 x = 4, find x.','81',['12','64','7'],'x=3^4=81.');
      add('Calculation','Simplify log_a(m^3).','3 log_a m',['log_a m + 3','m log_a 3','log_a(3m)'],'Use power law.');
    }
    if(tid==='math2-imaginary-unit'){
      add('Calculation','Simplify √(-49).','7i',['-7i','49i','-7'],'√(-49)=7i.');
      add('Calculation','Find i^6.','-1',['1','i','-i'],'i^6=i^4·i^2=-1.');
      add('Calculation','For z=-3+8i, find Re(z).','-3',['8','-8','3'],'Real part is -3.');
      add('Calculation','For z=5-9i, find Im(z).','-9',['5','9','-5'],'Imaginary part is the coefficient of i.');
      add('Calculation','Simplify √(-25)+√(-9).','8i',['2i','-8i','34i'],'5i+3i=8i.');
    }
    if(tid==='math2-operations'){
      add('Calculation','Simplify (3-5i)+(-3+4i).','-i',['i','6-i','-6+9i'],'Real parts cancel and imaginary parts give -i.');
      add('Calculation','Simplify (2+3i)(4-2i).','14+8i',['2+16i','14-8i','8+i'],'Expand and use i^2=-1.');
      add('Calculation','If 5-3bi=(a-1)+3i, find a and b.','a=6, b=-1',['a=4, b=1','a=6, b=1','a=-6, b=-1'],'Compare real and imaginary parts.');
      add('Calculation','Simplify (1+i)^2.','2i',['1+i','1-i','-2i'],'1+2i+i^2=2i.');
      add('Calculation','Simplify (4-2i)-(1+5i).','3-7i',['3+3i','5-7i','-3+7i'],'Subtract real and imaginary parts.');
    }
    if(tid==='math2-conjugates'){
      add('Calculation','Find the conjugate of -2+5i.','-2-5i',['2+5i','2-5i','-5+2i'],'Change sign of imaginary part.');
      add('Calculation','For z=3+4i, find z times its conjugate.','25',['7','3-4i','9+16i'],'a^2+b^2=25.');
      add('Calculation','Simplify 1/(2+3i).','(2-3i)/13',['(2+3i)/13','(2-3i)/5','2-3i'],'Multiply by conjugate 2-3i.');
      add('Calculation','Simplify (3+i)/(1-i).','1+2i',['2+i','1-2i','2-i'],'Multiply by 1+i, then divide by 2.');
      add('Calculation','If z=6-8i, find z z-bar.','100',['14','28','10'],'6^2+(-8)^2=100.');
    }
    if(tid==='math2-argand-modulus-and-argument'){
      add('Calculation','Where is z=2-5i plotted on Argand diagram?','(2,-5)',['(2,5)','(-5,2)','(-2,5)'],'z=a+bi maps to (a,b).');
      add('Calculation','Find |3+4i|.','5',['7','25','√7'],'√(3^2+4^2)=5.');
      add('Calculation','Find |-5+12i|.','13',['17','7','√119'],'√(25+144)=13.');
      add('Calculation','Which quadrant contains z=-1+√3i?','Quadrant II',['Quadrant I','Quadrant III','Quadrant IV'],'Negative real, positive imaginary.');
      add('Calculation','Find |1-i|.','√2',['2','1','-√2'],'√(1^2+(-1)^2)=√2.');
    }
    if(tid==='math2-polar-form'){
      add('Calculation','For z=2-2i, find r.','2√2',['2','4','√2'],'r=√(2^2+(-2)^2)=2√2.');
      add('Calculation','Convert 2(cos300°+i sin300°) into rectangular form.','1-√3i',['1+√3i','-1+√3i','-1-√3i'],'cos300°=1/2, sin300°=-√3/2.');
      add('Calculation','For z=1+i, find polar modulus r.','√2',['2','1','1/√2'],'r=√2.');
      add('Calculation','For z=-1+i, the argument is in which quadrant?','Quadrant II',['Quadrant I','Quadrant III','Quadrant IV'],'Negative real and positive imaginary.');
      add('Calculation','For z=3+3√3i, find r.','6',['3','3√3','12'],'r=√(9+27)=6.');
    }
    if(tid==='math3-introduction-to-sequences'||tid==='math3-general-terms'){
      add('Calculation','For a_n=n^2+1, find a_4.','17',['16','15','20'],'a_4=4^2+1=17.');
      add('Calculation','For a_n=2n-1, find a_5.','9',['10','7','11'],'a_5=10-1=9.');
      add('Calculation','Which formula matches 1, 4, 9, 16, ...?','a_n=n^2',['a_n=2n','a_n=n+3','a_n=2^n'],'These are square numbers.');
      add('Calculation','Which formula matches 1, 3, 5, 7, ...?','a_n=2n-1',['a_n=2n','a_n=n^2','a_n=n+1'],'Odd numbers use 2n-1.');
      add('Calculation','For a_n=3n+2, find a_6.','20',['18','21','15'],'a_6=18+2=20.');
    }
    if(tid==='math3-arithmetic-sequence'){
      add('Calculation','For arithmetic sequence 2, 5, 8, ..., find a_10.','29',['30','27','32'],'a_10=2+9(3)=29.');
      add('Calculation','Find common difference for 7, 11, 15, 19, ...','4',['3','5','7'],'d=11-7=4.');
      add('Calculation','For a_1=6 and d=-2, find a_8.','-8',['8','-6','-10'],'a_8=6+7(-2)=-8.');
      add('Calculation','Find S_5 for arithmetic sequence 3, 6, 9, 12, 15.','45',['30','40','50'],'Sum all five terms.');
      add('Calculation','If a_1=4 and a_6=19, find d.','3',['4','5','15'],'19=4+5d, so d=3.');
    }
    if(tid==='math3-geometric-sequence'){
      add('Calculation','For geometric sequence 3, 6, 12, ..., find a_6.','96',['48','192','36'],'a_6=3(2^5)=96.');
      add('Calculation','Find common ratio for 81, 27, 9, 3, ...','1/3',['3','-3','1/9'],'r=27/81=1/3.');
      add('Calculation','For a_1=5 and r=2, find a_5.','80',['40','100','160'],'a_5=5(2^4)=80.');
      add('Calculation','Find S_4 for geometric sequence 2, 4, 8, 16.','30',['28','32','24'],'2+4+8+16=30.');
      add('Calculation','If a_1=2 and r=3, find a_4.','54',['18','27','81'],'a_4=2(3^3)=54.');
    }
    if(tid==='math4-equations'){
      add('Calculation','Solve 2x+3=11.','x=4',['x=7','x=3','x=-4'],'2x=8, so x=4.');
      add('Calculation','Solve 5x-7=18.','x=5',['x=11/5','x=25','x=-5'],'5x=25.');
      add('Calculation','Solve 3(x-2)=15.','x=7',['x=5','x=3','x=9'],'x-2=5.');
      add('Calculation','Solve (x/4)+2=6.','x=16',['x=1','x=8','x=24'],'x/4=4.');
      add('Calculation','Solve 7-2x=1.','x=3',['x=-3','x=4','x=2'],'-2x=-6, so x=3.');
    }
    if(tid==='math4-quadratic-equations'){
      add('Calculation','Solve x^2-5x+6=0.','x=2 or x=3',['x=-2 or x=-3','x=1 or x=6','x=-1 or x=-6'],'Factor as (x-2)(x-3)=0.');
      add('Calculation','Solve x^2-9=0.','x=±3',['x=9','x=-9','x=±9'],'x^2=9.');
      add('Calculation','Solve x^2+4x+4=0.','x=-2',['x=2','x=-4','x=0'],'(x+2)^2=0.');
      add('Calculation','For x^2-4x+4=0, find the discriminant.','0',['4','-4','16'],'b^2-4ac=16-16=0.');
      add('Calculation','Solve x^2+x-6=0.','x=2 or x=-3',['x=-2 or x=3','x=1 or x=-6','x=6 or x=-1'],'(x+3)(x-2)=0.');
    }
    if(tid==='math4-inequalities'){
      add('Calculation','Solve 4x-1 > 11.','x > 3',['x < 3','x > 5/2','x < 5/2'],'4x>12.');
      add('Calculation','Solve -3x ≥ 12.','x ≤ -4',['x ≥ -4','x ≤ 4','x ≥ 4'],'Divide by negative and reverse sign.');
      add('Calculation','Solve 2x+1 ≤ 9.','x ≤ 4',['x ≥ 4','x ≤ 5','x ≥ 5'],'2x≤8.');
      add('Calculation','Solve -x+6 < 1.','x > 5',['x < 5','x > -5','x < -5'],'-x<-5, reverse sign.');
      add('Calculation','Solve 3x-2 ≥ 10.','x ≥ 4',['x ≤ 4','x ≥ 8/3','x ≤ 8/3'],'3x≥12.');
    }
    if(tid==='math4-absolute-values'){
      add('Calculation','Solve |x|=7.','x=±7',['x=7 only','x=-7 only','x=0'],'Distance from zero is 7.');
      add('Calculation','Solve |x-2|<3.','-1 < x < 5',['x < -1 or x > 5','-5 < x < 1','x=5 only'],'-3<x-2<3.');
      add('Calculation','Solve |x+1|=4.','x=3 or x=-5',['x=5 or x=-3','x=4 or x=-4','x=3 only'],'x+1=4 or x+1=-4.');
      add('Calculation','Solve |2x|=10.','x=±5',['x=10 only','x=±10','x=0'],'2x=±10.');
      add('Calculation','Solve |x-4|=0.','x=4',['x=0','x=-4','x=±4'],'Only x=4 makes the distance zero.');
    }
    return a;
  }
  function bank(ch,tid){return shuffle(calc(ch,tid).concat(generic(ch,tid)))}
  function allForChapter(ch){var out=[],topics=CHAPTERS[ch].topics;for(var tid in topics)out=out.concat(bank(ch,tid));return out}
  function mathChapters(){return Object.keys(CHAPTERS)}
  function ensureProgress(st,ch,tid){st.progress=st.progress||{};st.progress[ch]=st.progress[ch]||{topics:{},answered:0,correct:0,sessions:0};st.progress[ch].topics[tid]=st.progress[ch].topics[tid]||{attempts:0,correct:0};return st.progress[ch].topics[tid]}
  function scoreTopic(ch,tid){var st=state(),p=ensureProgress(st,ch,tid);return p.attempts?Math.round((p.correct/p.attempts)*100):0}
  function weakTopics(ch){var ids=Object.keys(CHAPTERS[ch].topics);ids.sort(function(a,b){var sa=scoreTopic(ch,a),sb=scoreTopic(ch,b);if(sa!==sb)return sa-sb;var st=state(),pa=ensureProgress(st,ch,a),pb=ensureProgress(st,ch,b);return pa.attempts-pb.attempts});return ids.slice(0,3)}
  function makeSession(items,count,box){session={items:shuffle(items).slice(0,Math.min(count,items.length)),i:0,score:0,selected:null,box:box};draw()}
  function draw(){var box=$(session.box);if(!box)return;if(!session.items.length){box.innerHTML='<div class="empty">No Mathematics questions available.</div>';return}if(session.done){var pct=Math.round(session.score/session.items.length*100);box.innerHTML='<div class="complete"><span class="badge">Math drill complete</span><h2>'+session.score+'/'+session.items.length+' correct</h2><p>Score '+pct+'%. Soalan kira-kira dan progress sudah disimpan.</p><div class="actions"><button class="btn" data-math-retry="'+session.box+'">Retry</button><button class="btn ghost" data-go="progress">View Progress</button></div></div>';return}
    var item=session.items[session.i],answered=session.selected!==null,html='';for(var i=0;i<item.choices.length;i++){html+='<button class="choice '+(answered&&i===item.answer?'ok':'')+' '+(answered&&i===session.selected&&i!==item.answer?'no':'')+'" data-math-answer="'+i+'" '+(answered?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span><b>'+esc(item.choices[i])+'</b></button>'}
    box.innerHTML='<div class="quizMeta"><span class="badge">'+esc(item.type)+'</span><span>Question '+(session.i+1)+'/'+session.items.length+'</span><span>MAT · '+esc(CHAPTERS[item.chapterId].title)+'</span></div><div class="meter"><i style="width:'+Math.round(session.i/session.items.length*100)+'%"></i></div><h2 class="question">'+esc(item.prompt)+'</h2><p class="quizTopic">'+esc(topicTitle(item.chapterId,item.topicId))+'</p><div class="choices">'+html+'</div><div class="feedback '+(answered?'show':'')+'">'+(answered?'<b>'+(session.selected===item.answer?'Correct':'Not yet')+'</b><p>'+esc(item.explain)+'</p>':'')+'</div><div class="actions quizActions"><button class="btn" data-math-next="1" '+(answered?'':'disabled')+'>'+(session.i+1===session.items.length?'Finish':'Next')+'</button></div>'}
  function record(item,ok){var st=state(),p=ensureProgress(st,item.chapterId,item.topicId),cp=st.progress[item.chapterId];p.attempts++;if(ok)p.correct++;cp.answered=(cp.answered||0)+1;if(ok)cp.correct=(cp.correct||0)+1;cp.last=new Date().toISOString();save(st)}
  function startTopic(tid){var ch=currentChapter();if(!isMathChapter(ch))return false;makeSession(bank(ch,tid),10,'quizBox');return true}
  function startWeak(){var ch=currentChapter();if(!isMathChapter(ch))return false;var ids=weakTopics(ch),items=[];for(var i=0;i<ids.length;i++)items=items.concat(bank(ch,ids[i]));makeSession(items,10,'quizBox');return true}
  function startChallenge(){var ch=currentChapter();if(!isMathChapter(ch))return false;var scope=$('scope')?$('scope').value:'current',chapters=[],items=[],i,j;if(scope==='all'||scope==='subject')chapters=mathChapters();else if(scope==='weak'){var ids=weakTopics(ch);for(i=0;i<ids.length;i++)items=items.concat(bank(ch,ids[i]));}else chapters=[ch];for(i=0;i<chapters.length;i++)items=items.concat(allForChapter(chapters[i]));makeSession(items,12,'challengeBox');return true}

  document.addEventListener('click',function(e){var b=closest(e.target,'button');if(!b)return;
    if(b.id==='startQuiz'&&isMathChapter(currentChapter())){e.preventDefault();e.stopImmediatePropagation();startTopic(currentTopic());return}
    if(b.id==='weakDrill'&&isMathChapter(currentChapter())){e.preventDefault();e.stopImmediatePropagation();startWeak();return}
    if(b.id==='startChallenge'&&isMathChapter(currentChapter())){e.preventDefault();e.stopImmediatePropagation();startChallenge();return}
    var practice=b.getAttribute('data-practice');
    if(practice&&practice.indexOf('math')===0){e.preventDefault();e.stopImmediatePropagation();var tab=document.querySelector('[data-view="practice"]');if(tab)tab.click();setTimeout(function(){var pick=$('topicPick');if(pick)pick.value=practice;startTopic(practice)},80);return}
    var ans=b.getAttribute('data-math-answer');
    if(ans!==null&&session){e.preventDefault();e.stopImmediatePropagation();if(session.selected!==null)return;session.selected=Number(ans);var item=session.items[session.i],ok=session.selected===item.answer;if(ok)session.score++;record(item,ok);draw();return}
    if(b.getAttribute('data-math-next')&&session){e.preventDefault();e.stopImmediatePropagation();if(session.i+1>=session.items.length)session.done=true;else{session.i++;session.selected=null}draw();return}
    if(b.getAttribute('data-math-retry')&&session){e.preventDefault();e.stopImmediatePropagation();if(session.box==='challengeBox')startChallenge();else startTopic(currentTopic());return}
  },true);
})();
