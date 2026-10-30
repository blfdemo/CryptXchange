/* Spot & Futures trading screens (mock live data, canvas chart) */
CX.trade=function(page){
if(page!=='spot'&&page!=='futures')return;
const $=CX.$,$$=CX.$$,F=CX.fmt,fut=page==='futures';
let sym=fut?'ETH':'BTC',tf='1H',candles=[],price=CX.coin(sym).p,orders=[],positions=[],tabO='Open Orders',tabP='Positions',mode=fut?'Limit':'Limit';
const vols={'15m':.004,'1H':.008,'4H':.014,'1D':.025,'1W':.05};
const gen=()=>{const v=vols[tf];let p=price*(1-v*6*(Math.random()-.4)),a=[];for(let i=0;i<90;i++){const o=p,c=o*(1+(Math.random()-.5)*v*2.2),h=Math.max(o,c)*(1+Math.random()*v*.6),l=Math.min(o,c)*(1-Math.random()*v*.6);a.push({o,h,l,c,v:Math.random()*100+20});p=c}const k=price/a[a.length-1].c;a.forEach(x=>{x.o*=k;x.h*=k;x.l*=k;x.c*=k});return a};
const ma=(n,i)=>i<n-1?null:candles.slice(i-n+1,i+1).reduce((t,x)=>t+x.c,0)/n;
const dp=()=>price<1?4:2;
function draw(){const cv=$('#chart'),r=devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;cv.width=w*r;cv.height=h*r;const g=cv.getContext('2d');g.scale(r,r);
 const up=CX.css('--up'),dn=CX.css('--down'),mu=CX.css('--muted'),bd=CX.css('--border');const pw=62,ph=h*.78,n=candles.length,cw=(w-pw)/n;
 const mn=Math.min(...candles.map(x=>x.l)),mx=Math.max(...candles.map(x=>x.h)),Y=v=>8+(mx-v)/(mx-mn)*(ph-16);
 g.font='10px sans-serif';g.fillStyle=mu;g.strokeStyle=bd;g.lineWidth=1;
 for(let i=0;i<=5;i++){const v=mx-(mx-mn)*i/5,y=Y(v);g.beginPath();g.moveTo(0,y);g.lineTo(w-pw,y);g.stroke();g.fillText(F(v,dp()),w-pw+6,y+3)}
 const vm=Math.max(...candles.map(x=>x.v));
 candles.forEach((x,i)=>{const cx=i*cw+cw/2,col=x.c>=x.o?up:dn;g.strokeStyle=col;g.fillStyle=col;g.beginPath();g.moveTo(cx,Y(x.h));g.lineTo(cx,Y(x.l));g.stroke();const y1=Y(x.o),y2=Y(x.c);g.fillRect(cx-cw*.35,Math.min(y1,y2),cw*.7,Math.max(1,Math.abs(y2-y1)));g.globalAlpha=.35;const vh=x.v/vm*(h-ph-10);g.fillRect(cx-cw*.35,h-vh,cw*.7,vh);g.globalAlpha=1});
 [[7,'#f0b90b'],[25,'#a066ff']].forEach(([n,c])=>{g.beginPath();g.strokeStyle=c;g.lineWidth=1.3;let s=false;candles.forEach((x,i)=>{const m=ma(n,i);if(m==null)return;const px=i*cw+cw/2;s?g.lineTo(px,Y(m)):g.moveTo(px,Y(m));s=true});g.stroke()});
 const ly=Y(price);g.setLineDash([4,3]);g.strokeStyle=candles[n-1].c>=candles[n-1].o?up:dn;g.beginPath();g.moveTo(0,ly);g.lineTo(w-pw,ly);g.stroke();g.setLineDash([]);g.fillStyle=g.strokeStyle;g.fillRect(w-pw,ly-9,pw,18);g.fillStyle='#fff';g.fillText(F(price,dp()),w-pw+6,ly+3);
 g.fillStyle='#f0b90b';g.fillText('MA(7)',8,14);g.fillStyle='#a066ff';g.fillText('MA(25)',50,14)}
function obRow(p,a,col,mx){return`<div class="ob-row" data-p="${p}"><span style="color:${col}">${F(p,dp())}</span><span>${a.toFixed(fut?3:5)}</span><span>${F(p*a,fut?2:2)}</span><i class="ob-bar" style="width:${a/mx*100}%;background:${col}"></i></div>`}
function ob(){const st=price*.00018*(price<1?1:1),up=CX.css('--up'),dn=CX.css('--down'),N=fut?9:14;const asks=[],bids=[];for(let i=1;i<=N;i++){asks.push([price+st*i*(1+Math.random()*.5),Math.random()*(fut?9:1.6)+.05]);bids.push([price-st*i*(1+Math.random()*.5),Math.random()*(fut?9:1.6)+.05])}
 asks.reverse();const mx=Math.max(...asks.map(a=>a[1]),...bids.map(a=>a[1]));$('#obAsk').innerHTML=asks.map(a=>obRow(a[0],a[1],dn,mx)).join('');$('#obBid').innerHTML=bids.map(a=>obRow(a[0],a[1],up,mx)).join('');
 const lastUp=candles[candles.length-1].c>=candles[candles.length-1].o;$('#obMid').innerHTML=`<span class="${lastUp?'up':'down'}">${F(price,dp())}</span> <small class="text-muted">≈ $${F(price,dp())}</small>`}
const trades=[];function tr(){const up=Math.random()>.5;trades.unshift([price*(1+(Math.random()-.5)*.0008),Math.random()*(fut?3:1.2)+.01,new Date(Date.UTC(2026,9,30,10,0)+trades.length*1000*Math.random()*5).toISOString().slice(11,19),up]);if(trades.length>30)trades.pop();
 $('#mTrades').innerHTML=trades.map(t=>`<div class="pair-row"><span class="${t[3]?'up':'down'}">${F(t[0],dp())}</span><span class="text-end">${t[1].toFixed(5)}</span><span class="text-end text-muted">${t[2]}</span></div>`).join('')}
function head(){const c=CX.coin(sym);$('#lastPrice').textContent=F(price,dp());$('#lastPrice').className='fs-5 fw-bold '+(c.c>=0?'up':'down');$('#h24c').innerHTML=CX.chg(c.c);
 if($('#h24h')&&!fut){$('#h24h').textContent=F(price*1.018,dp());$('#h24l').textContent=F(price*.982,dp());$('#h24v').textContent=F(c.v/price/10,0)+' '+sym}
 if(fut)$('#mark').textContent=F(price*.9998,dp())}
function setSym(s){sym=s;if($('#pairIcon'))$('#pairIcon').src=CX.coinSrc(s);price=CX.coin(s).p;const c=CX.coin(s);if(fut){$('#pairName').textContent=s+'USDC'}else{$('#pairName').textContent=s+'/USDT';$('#pairFull').textContent=c.n+' price';$$('.u-sym').forEach(x=>x.textContent=s)}
 candles=gen();head();ob();draw();fillPrice()}
function fillPrice(){if(fut){$('#fPrice').value=price.toFixed(dp());calcF()}else $$('.f-price').forEach(i=>{i.value=price.toFixed(dp())})}
/* chart tf */
$('#tfBtns').onclick=e=>{const b=e.target.closest('button');if(!b)return;tf=b.dataset.tf;$$('#tfBtns button').forEach(x=>x.className='btn btn-sm '+(x===b?'btn-soft':'btn-outline-secondary'));candles=gen();draw()};
/* orderbook click */
document.addEventListener('click',e=>{const r=e.target.closest('.ob-row[data-p]');if(r){const p=(+r.dataset.p).toFixed(dp());if(fut){$('#fPrice').value=p;calcF()}else $$('.f-price').forEach(i=>i.value=p)}});
/* tables */
const oCols=()=>[{h:'Date',f:r=>r.date},{h:'Pair',k:'pair'},{h:'Price',cls:'text-end',f:r=>F(r.price,dp())},{h:'Side',f:r=>`<b class="${/Buy|Long/.test(r.side)?'up':'down'}">${r.side}</b>`},{h:'Order Type',k:'type'},{h:'Amount',cls:'text-end',k:'amount'},{h:'Total',cls:'text-end',f:r=>F(r.price*r.amount)},{h:'Action',cls:'text-end',f:(r,i)=>r.st==='Open'?`<button class="btn btn-sm btn-outline-danger" data-i="${i}">Cancel</button>`:CX.badge(r.st)}];
const seed=()=>{const p=CX.coin(sym).p;orders=[{date:'28-05-2026 12:26:44',pair:fut?'ETHUSDC':'BNB/USDT',price:fut?2380:601,side:'Buy',type:'Limit',amount:fut?.5:.3115,st:'Open'},{date:'28-05-2026 12:24:44',pair:fut?'ETHUSDC':'CVX/USDT',price:fut?2495:5.2,side:'Sell',type:'Limit',amount:fut?1:12.5,st:'Open'},{date:'28-06-2026 12:20:44',pair:fut?'ETHUSDC':'PHB/BTC',price:fut?2410:.0004,side:'Buy',type:'Limit',amount:fut?.2:100,st:'Open'}]};seed();
const hist=[{date:'27-05-2026 09:10:12',pair:fut?'ETHUSDC':'BTC/USDT',price:fut?2402:66120,side:'Buy',type:'Market',amount:fut?.4:.05,st:'Filled'},{date:'26-05-2026 18:44:01',pair:fut?'ETHUSDC':'ETH/USDT',price:fut?2455:2461,side:'Sell',type:'Limit',amount:fut?1:.8,st:'Filled'}];
const canc=[{date:'25-05-2026 11:02:33',pair:fut?'ETHUSDC':'SOL/USDT',price:fut?2300:140,side:'Buy',type:'Limit',amount:fut?.3:10,st:'Cancelled'}];
function renderOrd(){if(fut){const t=tabP;if(t==='Positions')CX.table('#posTable',[{h:'Symbol',k:'pair'},{h:'Size',k:'amount'},{h:'Entry Price',cls:'text-end',f:r=>F(r.price,dp())},{h:'Mark Price',cls:'text-end',f:()=>F(price,dp())},{h:'Liq. Price',cls:'text-end',f:r=>F(r.liq,dp())},{h:'Margin',cls:'text-end',f:r=>F(r.margin)+' USDC'},{h:'PNL (ROI%)',cls:'text-end',f:r=>{const p=(price-r.price)*r.amount*(r.side==='Long'?1:-1);return`<span class="${p>=0?'up':'down'}">${p>=0?'+':''}${F(p)}</span>`}},{h:'Side',f:r=>`<b class="${r.side==='Long'?'up':'down'}">${r.side}</b>`},{h:'',cls:'text-end',f:(r,i)=>`<button class="btn btn-sm btn-outline-danger" data-pi="${i}">Close</button>`}],positions,'<i class="bi bi-inbox fs-1 d-block"></i>No Data Found');
 else{const src=t==='Open Orders'?orders.filter(o=>o.st==='Open'):t==='Order History'||t==='Trade History'||t==='Position History'?hist:t==='Transaction History'?hist.map(h=>({...h,type:'Transfer'})):[];CX.table('#posTable',oCols(),src,'<i class="bi bi-inbox fs-1 d-block"></i>No Data Found')}return}
 const t=tabO;const src=t==='Open Orders'?orders.filter(o=>o.st==='Open'):t==='Order History'?[...orders.filter(o=>o.st!=='Open'),...hist]:canc;
 CX.table('#ordTable',oCols(),src,'No orders');}
const tabClick=(sel,cb)=>$(sel).addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',$(sel)).forEach(x=>x.classList.toggle('active',x===b));cb(b)});
document.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b&&b.closest('#ordTable,#posTable')){const open=orders.filter(o=>o.st==='Open');const o=open[+b.dataset.i];if(o){o.st='Cancelled';canc.unshift(o);renderOrd();CX.toast('Order cancelled')}}
 const c=e.target.closest('[data-pi]');if(c){positions.splice(+c.dataset.pi,1);renderOrd();CX.toast('Position closed (demo)')}});
/* ---------- spot specifics ---------- */
if(!fut){
 const pl=()=>{const s=$('#pairSearch').value.toLowerCase();$('#pairList').innerHTML=CX.coins.filter(c=>c.s!=='USDT'&&c.s.toLowerCase().includes(s)).map(c=>`<div class="pair-row" data-s="${c.s}"><b>${c.s}<span class="text-muted fw-normal">/USDT</span></b><span class="text-end">${F(c.p)}</span><span class="text-end">${CX.chg(c.c)}</span></div>`).join('')};pl();$('#pairSearch').oninput=pl;
 $('#pairList').onclick=e=>{const r=e.target.closest('[data-s]');if(r)setSym(r.dataset.s)};
 $('#movers').innerHTML=[['PHB/BTC','-6.84%','New 24h Low','down'],['CVX/USDT','-4.46%','New 24h High','down'],['AVAX/USDT','+3.12%','New 7d High','up'],['SOL/USDT','+3.18%','New 24h High','up']].map(m=>`<div class="d-flex justify-content-between py-1 border-bottom"><div><b>${m[0]}</b><div class="text-muted" style="font-size:.7rem">12:51:02</div></div><div class="text-end"><span class="${m[3]}">${m[1]}</span><div class="text-muted" style="font-size:.7rem">${m[2]}</div></div></div>`).join('');
 tabClick('#spotTabs',b=>{mode=b.dataset.t;$$('.priceRow').forEach(r=>r.classList.toggle('d-none',mode==='Market'));$$('.stopRow').forEach(r=>r.classList.toggle('d-none',mode!=='Stop-limit'))});
 tabClick('#mtTabs',()=>{});tabClick('#ordTabs',b=>{tabO=b.textContent;renderOrd()});
 $$('.spotForm').forEach(f=>{const p=f.querySelector('.f-price'),a=f.querySelector('.f-amt'),rg=f.querySelector('.f-rng'),side=f.dataset.side;
  const tot=()=>{const pr=mode==='Market'?price:+p.value;f.querySelector('.f-tot').textContent=F(pr*(+a.value||0))};
  p.oninput=tot;a.oninput=tot;rg.oninput=()=>{const pr=mode==='Market'?price:(+p.value||price);const bal=side==='Buy'?12480.5/pr:.4821;a.value=(bal*rg.value/100).toFixed(5);tot()};
  f.onsubmit=e=>{e.preventDefault();
   const o={date:'30-10-2026 10:'+String(Math.floor(Math.random()*59)).padStart(2,'0')+':12',pair:sym+'/USDT',price:mode==='Market'?price:+p.value,side,type:mode,amount:+a.value,st:'Open'};orders.unshift(o);tabO='Open Orders';$$('#ordTabs button').forEach((b,i)=>b.classList.toggle('active',i===0));renderOrd();f.classList.remove('was-validated');a.value='';rg.value=0;tot();CX.toast(`${side} ${mode} order placed (demo)`)}});
}
/* ---------- futures specifics ---------- */
if(fut){
 const calcF=()=>{const lev=parseInt($('#lev').value),p=mode==='Market'?price:+$('#fPrice').value||price,s=+$('#fSize').value||0;$('#fMargin').textContent=F(p*s/lev)+' USDC';$('#fLiq').textContent=s?F(p*(1-.9/lev),dp()):'--'};window.calcF=calcF;
 $('#fSize').oninput=calcF;$('#fPrice').oninput=calcF;$('#lev').onchange=calcF;$('#fRng').oninput=()=>{$('#fSize').value=(12480.5*parseInt($('#lev').value)/price*$('#fRng').value/100*.5).toFixed(3);calcF()};
 tabClick('#futTabs',b=>{mode=b.dataset.t;$('#fPriceRow').style.display=mode==='Market'?'none':'';$('#trigRow').style.display=mode==='Conditional'?'':'none'});
 tabClick('#marginMode',()=>{});$$('#marginMode button').forEach(b=>b.onclick=()=>{$$('#marginMode button').forEach(x=>x.classList.toggle('active',x===b))});
 tabClick('#chTabs',()=>{});tabClick('#posTabs',b=>{tabP=b.textContent;renderOrd()});
 $('[data-quiz]').onclick=()=>CX.modal('Futures Quiz','<p class="mb-2"><b>Q1.</b> With 20x leverage, a 5% move against your position can lead to:</p><div class="form-check"><input class="form-check-input" type="radio" name="q" checked> <label class="form-check-label">Liquidation of your margin</label></div><div class="form-check"><input class="form-check-input" type="radio" name="q"> <label class="form-check-label">A small fee</label></div>','Submit',()=>CX.toast('Quiz completed – futures unlocked (demo)'));
 $('#futForm').onsubmit=e=>e.preventDefault();
 $$('#futForm [data-side]').forEach(b=>b.onclick=e=>{e.preventDefault();const f=$('#futForm');
  const lev=parseInt($('#lev').value),p=mode==='Market'?price:+$('#fPrice').value,s=+$('#fSize').value,side=b.dataset.side;f.classList.remove('was-validated');
  if(mode==='Market'){positions.unshift({pair:'ETHUSDC',amount:s,price:p,margin:p*s/lev,liq:side==='Long'?p*(1-.9/lev):p*(1+.9/lev),side});tabP='Positions';$$('#posTabs button').forEach((x,i)=>x.classList.toggle('active',i===0))}
  else{orders.unshift({date:'30-10-2026 10:30:00',pair:'ETHUSDC',price:p,side,type:mode,amount:s,st:'Open'});tabP='Open Orders';$$('#posTabs button').forEach(x=>x.classList.toggle('active',x.textContent==='Open Orders'))}
  renderOrd();CX.toast(`${side} ${mode} order placed (demo)`);$('#fSize').value='';calcF()});
}
/* init + live ticks */
candles=gen();head();ob();tr();draw();fillPrice();renderOrd();
for(let i=0;i<12;i++)tr();
setInterval(()=>{const l=candles[candles.length-1];price=Math.max(price*(1+(Math.random()-.5)*.0012),0.0001);l.c=price;l.h=Math.max(l.h,price);l.l=Math.min(l.l,price);if(Math.random()<.08){candles.push({o:price,h:price,l:price,c:price,v:30});candles.shift()}head();ob();tr();draw();if(fut&&tabP==='Positions'&&positions.length)renderOrd()},1500);
window.addEventListener('resize',draw);document.addEventListener('cxtheme',draw);
};
