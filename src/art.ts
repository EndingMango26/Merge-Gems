/** Clean vector redraws. Observed and provisional appearances are listed in docs/asset-inventory.md.
 * No artwork from the original application's bundle is redistributed.
 */
type Palette = [string, string, string, string];
const blue: Palette = ['#cef9ff','#34d8ed','#087fc6','#06477a'];
const red: Palette = ['#ffacb3','#ff4c68','#cf1640','#790c2e'];
const pink: Palette = ['#ffe0ff','#ef6ade','#b623c2','#64147e'];
const green: Palette = ['#d8ffe0','#67db92','#17a565','#086d51'];
const orange: Palette = ['#fff9ad','#ffd339','#f29311','#a94b0a'];
const purple: Palette = ['#ffe0ff','#c97bff','#7d39cb','#391d78'];
const silver: Palette = ['#ffffff','#cddae5','#8a9bad','#4e586c'];
const gold: Palette = ['#fff9b7','#ffe049','#f7a911','#aa5d0c'];
const outline = '#222735';
function svg(body: string, cls = 'gem-art', attrs = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false" ${attrs}>${body}</svg>`;
}
function star(cx: number, cy: number, r: number, points = 5): string {
  return Array.from({length:points*2},(_,i)=>{const a=-Math.PI/2+i*Math.PI/points,d=i%2?r*.47:r;return `${cx+Math.cos(a)*d},${cy+Math.sin(a)*d}`;}).join(' ');
}
function sparkle(x: number,y:number,r=5):string { return `<path d="M${x} ${y-r}Q${x+1} ${y-1} ${x+r} ${y}Q${x+1} ${y+1} ${x} ${y+r}Q${x-1} ${y+1} ${x-r} ${y}Q${x-1} ${y-1} ${x} ${y-r}" fill="white"/>`; }
function metal(frame: 'silver'|'gold',body: string):string { const color=frame==='gold'?gold:silver;return `<g stroke="${color[3]}" stroke-width="11" stroke-linejoin="round">${body}</g><g stroke="${color[1]}" stroke-width="7" stroke-linejoin="round">${body}</g>`; }
function polygonGem(vertices:number[][],p:Palette,frame?:'silver'|'gold'):string {
 const points=vertices.map(v=>v.join(',')).join(' '),cx=60,cy=59;
 const inner=vertices.map(([x,y])=>[cx+(x-cx)*.62,cy+(y-cy)*.62]);
 let body=frame?metal(frame,`<polygon points="${points}" fill="${p[2]}"/>`):'';
 body+=`<polygon points="${points}" fill="${p[2]}" stroke="${outline}" stroke-width="2.5" stroke-linejoin="round"/>`;
 body+=vertices.map(([x,y],i)=>{const j=(i+1)%vertices.length;return `<polygon points="${x},${y} ${vertices[j].join(',')} ${inner[j].join(',')} ${inner[i].join(',')}" fill="${p[i<vertices.length/2?i%2:2+i%2]}"/>`;}).join('');
 body+=`<polygon points="${inner.map(v=>v.join(',')).join(' ')}" fill="${p[1]}"/><path d="M${vertices[0].join(' ')}L${vertices[1].join(' ')}L${inner[1].join(' ')}" fill="${p[0]}"/>`;
 return body;
}
function regularGem(n:number,p:Palette,rotation=-90,frame?:'silver'|'gold'):string {return polygonGem(Array.from({length:n},(_,i)=>[60+43*Math.cos((rotation+i*360/n)*Math.PI/180),59+43*Math.sin((rotation+i*360/n)*Math.PI/180)]),p,frame);}
function silverRock(x:number,y:number,s:number):string{return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-20 23L-27 7L-20-16L-3-26L15-22L27 2L20 24L0 28Z" fill="#90b7c7" stroke="#243c4b" stroke-width="2.4" stroke-linejoin="round"/><path d="M-20-16L-3-26L15-22L6-9L-11-6Z" fill="#d4eaf1"/><path d="M-11-6L6-9L3 24L-17 22Z" fill="#74a2b5"/><path d="M6-9L15-22L27 2L20 24L3 24Z" fill="#a9d4e5"/><path d="M-20-16L-11-6L-17 22L-27 7Z" fill="#477388"/></g>`;}
function bars(n:number):string {
 const bar=`<path d="M14 57L23 29L76 9L105 26L108 50L50 82L17 69Z" fill="#f09a0b" stroke="#75400b" stroke-width="2.4" stroke-linejoin="round"/><path d="M23 29L76 9L105 26L49 53Z" fill="#ffd83b"/><path d="M49 53L105 26L108 50L50 82Z" fill="#ffbd1b"/><path d="M23 29L49 53L50 82L17 69L14 57Z" fill="#ed9106"/><path d="M24 30L49 52L102 27L51 56L21 34Z" fill="#fffbc6"/>`;
 return n===1?`<g transform="translate(3 5)">${bar}</g>`:n===2?`<g transform="translate(-8 29) scale(.75)">${bar}</g><g transform="translate(30 12) scale(.75)">${bar}</g>`:`<g transform="translate(-7 38) scale(.73)">${bar}</g><g transform="translate(33 23) scale(.73)">${bar}</g><g transform="translate(6 0) scale(.83)">${bar}</g>`;
}
function sapphire(rank:number):string {
 if(rank===2)return `<path d="M35 8L104 31L104 82L65 112L19 88L13 36Z" fill="#c6cdd2" stroke="#353a45" stroke-width="3"/><path d="M36 18L94 37L94 77L63 99L28 81L23 40Z" fill="#0683c6" stroke="#384456" stroke-width="2"/><path d="M36 18L61 32L94 37L64 50L23 40Z" fill="#d1fbff"/><path d="M23 40L64 50L63 99L28 81Z" fill="#29cfe8"/><path d="M64 50L94 37L94 77L63 99Z" fill="#0884bd"/><path d="M63 99L47 64L64 50Z" fill="#1aa7dd"/><path d="M63 19Q46 9 49 28Q51 40 63 36Q72 31 64 26Q58 24 59 29M20 48Q9 52 23 64Q35 71 37 59Q35 49 29 54M100 83Q108 94 93 100Q78 103 82 88Q87 79 93 86" stroke="#656675" fill="#eef1f3" stroke-width="2.3"/>`;
 const path='M23 13Q18 12 18 23L28 102Q30 112 40 104L103 45Q112 37 101 32Z';
 let body=rank?metal(rank===2?'gold':'silver',`<path d="${path}" fill="#82bdd9"/>`):'';
 body+=`<path d="${path}" fill="#0a85ca" stroke="#152b4e" stroke-width="2.8"/><path d="M23 15L100 35L44 46Z" fill="#dcfaff"/><path d="M23 15L44 46L32 103Z" fill="#0865a9"/><path d="M44 46L100 35L35 102Z" fill="#29d0e4"/><path d="M44 46L66 54L35 102Z" fill="#00a8d6"/>`;
 if(rank) for(const [x,y,a] of [[21,17,-35],[100,38,85],[33,102,190]]) body+=`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-8-5Q8-11 9 0Q9 10-1 9Q-8 8-4 2Q0-3 3 0" stroke="${rank===2?'#8d5d17':'#5a5963'}" stroke-width="3" fill="${rank===2?'#ffdf71':'#edf0f2'}"/></g>`;
 return body;
}
function drop(p:Palette,frame?:'silver'|'gold'):string {const path='M60 10C48 30 23 52 23 75A37 34 0 0 0 97 75C97 52 72 30 60 10Z';return (frame?metal(frame,`<path d="${path}" fill="${p[2]}"/>`):'')+`<path d="${path}" fill="${p[2]}" stroke="${outline}" stroke-width="2.5"/><path d="M60 13L38 74L60 101L85 75Z" fill="${p[1]}"/><path d="M60 13L38 74L26 75Q27 53 60 13Z" fill="${p[0]}"/><path d="M60 13L85 75L60 101Q94 99 95 75Z" fill="${p[3]}"/><path d="M38 74L60 101L26 75Z" fill="${p[2]}"/>`;}
function heart(p:Palette,frame?:'silver'|'gold'):string{const path='M60 29C42-2 7 16 13 43C16 65 41 89 60 108C79 89 104 65 107 43C113 16 78-2 60 29Z';return (frame?metal(frame,`<path d="${path}" fill="${p[2]}"/>`):'')+`<path d="${path}" fill="${p[2]}" stroke="${outline}" stroke-width="2.5"/><path d="M60 32L30 28L18 42L60 100L99 42L89 28Z" fill="${p[1]}"/><path d="M60 32L30 28L18 42L15 30Q22 4 45 19Z" fill="${p[0]}"/><path d="M60 32L99 42L89 28Q78 11 65 30Z" fill="${p[0]}"/><path d="M60 32L60 100L99 42Z" fill="${p[3]}"/>`;}
function pyramid(p:Palette):string{return `<path d="M17 83L60 8L105 80L64 109Z" fill="${p[3]}" stroke="${outline}" stroke-width="2.5"/><path d="M17 83L60 8L64 109Z" fill="${p[1]}"/><path d="M60 8L105 80L64 109Z" fill="${p[2]}"/><path d="M60 8L49 54L23 80Z" fill="${p[0]}"/><path d="M17 83L64 109L105 80L105 93L65 119L16 94Z" fill="#b7bfcb" stroke="${outline}" stroke-width="2.5"/><path d="M17 83L64 109L105 80L96 79L64 100L25 79Z" fill="#e9ecf5"/>`;}
function moonRock(p:Palette,extra=false):string {let body=`<path d="M18 82L62 16L94 66L80 98L57 106Z" fill="${p[2]}" stroke="${outline}" stroke-width="2.5"/><path d="M18 82L62 16L57 106Z" fill="${p[1]}"/><path d="M62 16L94 66L80 98L57 106Z" fill="${p[3]}"/><path d="M24 79L62 16L55 82Z" fill="${p[0]}" opacity=".4"/>`;if(extra)body+=`<g transform="translate(48 53) scale(.48)">${moonRock(p)}</g>`;return body;}
function cube(p:Palette,variant:number):string {return `<path d="M15 35L61 11L106 38L106 87L61 110L15 83Z" fill="${p[2]}" stroke="${outline}" stroke-width="3"/><path d="M15 35L61 11L106 38L60 62Z" fill="${p[0]}"/><path d="M15 35L60 62L61 110L15 83Z" fill="${p[1]}"/><path d="M60 62L106 38L106 87L61 110Z" fill="${p[3]}"/><path d="M21 41L55 60M64 18L100 39" stroke="white" stroke-width="3" opacity=".55"/>${Array.from({length:Math.min(variant,4)},(_,i)=>sparkle(25+i*19,70+(i%2)*18,4)).join('')}`;}
function crystalCluster(p:Palette,variant:number):string{let out='';for(let i=0;i<3;i++)out+=`<g transform="translate(${i===0?-11:i===1?18:2} ${i===2?-10:19}) scale(${i===2?.8:.58})">${polygonGem([[61,8],[89,24],[100,64],[72,106],[29,85],[21,37]],p,variant>2?(variant===4?'gold':'silver'):undefined)}</g>`;return out;}
function royal(p:Palette,ultimate=false):string {return regularGem(6,p,-90,ultimate?'gold':'silver')+`<path d="M24 83L18 65L38 75L60 58L82 75L102 65L96 91L60 109Z" fill="#f3b824" stroke="#684c20" stroke-width="2.3"/><path d="M24 83L60 97L96 82M31 94L60 105L90 93" stroke="#fff4b0" stroke-width="3"/><path d="M54 88L60 79L68 88L60 98Z" fill="${p[2]}" stroke="#7d4d1e"/>${sparkle(60,11,7)}`;}

/** Rank is zero-based; aliases gem/gemland, moon/moonland, aztec/aztecland accepted. */
export function gemSvg(worldId:string,rawRank:number):string {
 const rank=Number.isFinite(rawRank)?Math.max(0,Math.min(38,Math.floor(rawRank))):0;
 const world=worldId.toLowerCase().replace('land','');let art='';
 if(world==='gem'||!['moon','aztec','gold'].includes(world)){
  if(rank===0)art=`<path d="M31 80L35 49L62 37L89 49L96 80L74 94L48 93Z" fill="#8e9da0" stroke="#303f49" stroke-width="2.5"/><path d="M35 49L62 37L89 49L68 62L44 60Z" fill="#d1d9d8"/><path d="M68 62L89 49L96 80L74 94Z" fill="#6b7f84"/>`;
  else if(rank<3)art=(rank===2?silverRock(60,40,.73):'')+silverRock(37,75,.62)+silverRock(79,71,.69)+silverRock(65,94,.27);
  else if(rank<6)art=bars(rank-2);
  else if(rank<9)art=sapphire(rank-6);
  else if(rank<12)art=`<g transform="rotate(15 60 60)">${regularGem(8,red,-112.5,rank===10?'silver':rank===11?'gold':undefined)}</g>`;
  else if(rank===12)art=`<g transform="translate(-8 10) scale(1.13 .87)">${regularGem(10,green)}</g>`;
  else if(rank===13)art=regularGem(7,purple);
  else if(rank===14)art=regularGem(7,purple,-90,'silver');
  else if(rank===15)art=regularGem(8,orange,-112.5);
  else if(rank===16)art=`<g transform="translate(11 -8) scale(.82 1.15)">${regularGem(10,orange,-90,'silver')}</g>`;
  else if(rank===17)art=regularGem(8,red,-112.5,'gold');
  else if(rank<21)art=drop(blue,rank===19?'silver':rank===20?'gold':undefined);
  else if(rank<24)art=heart(rank===21?red:rank===22?pink:purple);
  else if(rank<27)art=regularGem(5,pink,-90,rank===25?'silver':rank===26?'gold':undefined);
  else if(rank<30)art=regularGem(6,blue,-90,rank===28?'silver':rank===29?'gold':undefined);
  else if(rank<33)art=regularGem(8,['#f8ffd2','#c1c85f','#718842','#3e5434'],-112.5,rank===31?'silver':rank===32?'gold':undefined);
  else if(rank<36){const points=star(60,60,49).split(' ').map(v=>v.split(',').map(Number));art=polygonGem(points,blue,rank===34?'silver':rank===35?'gold':undefined);}
  else art=royal(rank===38?blue:purple,rank>36);
 }else if(world==='moon'){
  if(rank<3)art=moonRock(rank===0?green:rank===1?['#ffb8bf','#ef7d69','#bd5b4e','#73652c']:purple,rank>0);
  else if(rank<5)art=rank===3?pyramid(pink):`<g transform="translate(-4 -3) scale(.82)">${pyramid(pink)}</g><g transform="translate(58 57) scale(.48)">${pyramid(pink)}</g>`;
  else if(rank<10)art=cube(blue,rank-5);
  else if(rank<15)art=crystalCluster(green,rank-10);
  else if(rank<20)art=polygonGem([[55,7],[84,21],[98,82],[56,112],[25,79],[37,35]],purple,rank===18?'silver':rank===19?'gold':undefined);
  else if(rank<25)art=crystalCluster(blue,rank-20);
  else if(rank<30)art=polygonGem([[60,6],[83,29],[93,103],[28,105],[38,34]],pink,rank===28?'silver':rank===29?'gold':undefined);
  else if(rank<35)art=polygonGem([[60,5],[80,24],[87,105],[33,105],[40,24]],green,rank===33?'silver':rank===34?'gold':undefined);
  else art=royal(purple,rank>35);
 }else if(world==='aztec'){
  if(rank<3)art=moonRock(['#f0e6bd','#b6a177','#74634d','#423c32'],rank>0);
  else if(rank<5)art=pyramid(orange);
  else if(rank<10)art=regularGem(rank===9?8:6,green,-90,rank>7?'gold':undefined);
  else if(rank<15)art=heart(pink,rank>12?'gold':undefined);
  else if(rank<20)art=polygonGem([[21,90],[34,45],[24,24],[48,33],[69,16],[97,39],[89,98],[62,110]],rank<18?red:green,rank>17?'gold':undefined);
  else if(rank<25)art=polygonGem([[15,57],[42,43],[59,9],[74,44],[109,26],[89,69],[75,99],[44,107],[28,88]],blue,rank>22?'gold':undefined);
  else if(rank<30)art=royal(green,rank>27);
  else if(rank<34)art=regularGem(8,silver,-112.5,rank>31?'gold':undefined)+`<path d="M38 52L49 46L54 56L45 65ZM68 46L83 53L75 66L65 56Z" fill="#273b42"/><path d="M43 84H79M48 79V90M58 79V93M68 79V91" stroke="#273b42" stroke-width="3"/>`;
  else art=polygonGem(star(60,60,51,12).split(' ').map(v=>v.split(',').map(Number)),orange,rank>35?'gold':undefined)+regularGem(8,red,-112.5);
 }else art=rank<3?moonRock(gold,rank>0):rank<6?bars(rank-2):rank<20?regularGem(5+rank%4,gold,-90,rank%3===2?'silver':undefined):royal(gold,rank>30);
 // Scale each observed family to the fraction of its tile seen in designer1.
 // Stones are intentionally smaller. Unknown families use a provisional scale.
 const scale = world==='gem' ? [1,1.28,1.38,1.15,1.25,1.28][rank] ?? 1.2 : 1.2;
 return svg(`<ellipse cx="60" cy="105" rx="34" ry="8" fill="#131423" opacity=".18"/><g transform="translate(60 60) scale(${scale}) translate(-60 -60)">${art}${rank>25?sparkle(96,17,6):''}</g>`, 'gem-art',`data-world="${['gem','moon','aztec','gold'].includes(world)?world:'gem'}" data-rank="${rank}"`);
}

export function crateSvg(worldId='gemland'):string {
 const moon=worldId.toLowerCase().startsWith('moon');
 return svg(`<g transform="translate(60 60) scale(1.35) translate(-60 -60)"><path d="M22 52L32 19H88L100 53L88 105H33Z" fill="#874c3d" stroke="#552d33" stroke-width="2.5"/><path d="M22 52L32 19H88L100 53Z" fill="#ffc451"/><path d="M60 20H87L98 52H60L52 42V28Z" fill="#e9a02a"/><path d="M22 53H100L88 105H33Z" fill="#874b3e"/><path d="M38 69Q38 63 46 63H76Q84 63 84 69V88Q84 94 77 94H46Q38 94 38 88Z" stroke="#c48b76" stroke-width="3"/>${moon?'<path d="M49 73L61 67L74 74L61 82ZM49 75V85L59 92V83M64 83V92L75 85V76" fill="#c48b76"/>':'<path d="M47 76L52 69H70L76 76L61 89ZM47 76H76M53 69L57 76L61 89L66 76L70 69" stroke="#c48b76" stroke-width="2"/>'}<path d="M33 105H88L83 112H37Z" fill="#4c4650" opacity=".6"/></g>`,'crate-art');
}

export function iconSvg(name:string):string {
 const body:Record<string,string>={
 settings:'<path d="M51 14H69L72 26L82 32L94 28L104 45L94 54V66L104 75L94 92L82 88L72 94L69 106H51L48 94L38 88L26 92L16 75L26 66V54L16 45L26 28L38 32L48 26Z" fill="currentColor"/><circle cx="60" cy="60" r="20" fill="#405960"/>',
 shop:'<path d="M27 19H94M29 31H91L105 55Q96 67 86 57Q76 67 66 57Q56 67 46 57Q35 67 23 57ZM32 66V104H89V66M51 104V79H73V104" stroke="currentColor" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>',
 medal:'<path d="M34 70L22 108L44 99L57 112L61 81M65 80L76 112L88 98L108 107L94 67" fill="currentColor"/><circle cx="61" cy="47" r="33" stroke="currentColor" stroke-width="7"/><polygon points="60,23 67,39 85,41 71,53 76,71 60,61 45,71 49,53 35,41 53,39" fill="currentColor"/>',
 star:`<polygon points="${star(60,60,51)}" fill="#ffda22" stroke="#c28312" stroke-width="4"/>`,
 coin:'<circle cx="60" cy="60" r="49" fill="#ffa900" stroke="#d97c00" stroke-width="3"/><circle cx="60" cy="60" r="39" fill="#ffdc23" stroke="#ffe99a" stroke-width="3"/><path d="M35 53L44 40H76L85 53L60 81ZM35 53H85M45 40L53 53L60 81L68 53L76 40" stroke="#f69d00" stroke-width="4" stroke-linejoin="round"/>',
 mooncoin:regularGem(5,purple),
 azteccoin:regularGem(6,green),
 close:'<path d="M32 32L88 88M88 32L32 88" stroke="currentColor" stroke-width="13" stroke-linecap="round"/>',
 check:'<path d="M24 63L48 86L97 34" stroke="currentColor" stroke-width="14" stroke-linejoin="round"/>',
 lock:'<rect x="28" y="52" width="64" height="54" rx="9" fill="currentColor"/><path d="M41 51V35A19 19 0 0 1 79 35V51" stroke="currentColor" stroke-width="10"/><circle cx="60" cy="75" r="7" fill="#405960"/><path d="M60 75V89" stroke="#405960" stroke-width="6"/>',
 worlds:'<circle cx="60" cy="60" r="45" stroke="currentColor" stroke-width="7"/><ellipse cx="60" cy="60" rx="20" ry="45" stroke="currentColor" stroke-width="6"/><path d="M17 46H103M17 76H103" stroke="currentColor" stroke-width="6"/>',
 collection:'<path d="M21 24H50Q61 24 61 35Q61 24 72 24H101V98H73Q61 98 61 109Q61 98 49 98H21Z" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/><path d="M61 35V107M32 43H47M32 57H47M75 43H90M75 57H90" stroke="currentColor" stroke-width="5"/>',
 back:'<path d="M76 24L40 60L76 96" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>',
 download:'<path d="M60 17V80M36 57L60 81L84 57M22 86V104H98V86" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/>',
 upload:'<path d="M60 82V19M36 43L60 19L84 43M22 86V104H98V86" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/>',
 sound:'<path d="M18 47H36L61 25V96L36 75H18Z" fill="currentColor"/><path d="M74 41Q99 60 74 80M86 27Q121 60 86 96" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>',
 info:'<circle cx="60" cy="60" r="46" stroke="currentColor" stroke-width="7"/><path d="M60 53V88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><circle cx="60" cy="34" r="6" fill="currentColor"/>',
 reset:'<path d="M34 32A40 40 0 1 1 21 63M34 32V12M34 32H13" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/>',
 };
 if(name==='box'||name==='crate')return crateSvg();
 return svg(body[name]??body.info,'icon-art');
}

/** Names for callers that use achievement/area vocabulary. */
export const achievementSvg=()=>iconSvg('medal');
export const worldSvg=()=>iconSvg('worlds');
export function giftSvg():string {return svg('<path d="M23 51H98V105H23Z" fill="#146080" stroke="#17465b" stroke-width="2"/><path d="M17 40H104V61H17Z" fill="#258bc0" stroke="#17465b" stroke-width="2"/><path d="M52 39H70V105H52Z" fill="#ffc500"/><path d="M60 40C9 41 20-6 44 13L60 37C93-15 122 38 60 40Z" fill="#ffe800" stroke="#d89406" stroke-width="2"/><path d="M60 40L27 25L32 45L49 52ZM60 40L94 24L90 46L73 53Z" fill="#ffc800"/>','gift-art');}
