/* Suivi calories v54 · La Quête du Royaume : sprites pixel et moteur de dessin.
   Dessins originaux. Généré à partir de px-core.js, px-hero.js, px-items-a.js, px-items-b.js. */
/* ============================================================
   Suivi calories · La Quête du Royaume : moteur de dessin pixel
   Chaque sprite est une grille de caractères ; une palette associe
   chaque caractère à une couleur. Les sprites « sym » ne décrivent
   que la moitié gauche : la moitié droite est obtenue par miroir.
   Le rendu se fait dans un canvas à la taille native, puis il est
   agrandi d'un facteur entier sans lissage : les pixels restent nets.
   ============================================================ */
(function(){
  "use strict";
  const W=40, H=48, CX=20;               // toile du héros, axe de symétrie entre x=19 et x=20
  const PX={W,H};
  const BASE_PAL={k:"#1B1424", z:"rgba(0,0,0,.28)", m:"#8A3B3B", w:"#FFFFFF", r:"#F2A0A0"};

  function rowsOf(art){
    if(!art.sym) return art.rows;
    return art.rows.map(r=>r+[...r].reverse().join(""));
  }
  function layerOx(art){ return art.sym ? CX-art.rows[0].length : (art.ox||0); }
  // dessine une couche ; flip : miroir horizontal de la couche entière
  function drawArt(ctx, art, pal, dx, dy, flip){
    if(!art) return;
    const rows=rowsOf(art), ox=(dx!=null?dx:layerOx(art)), oy=(dy!=null?dy:(art.oy||0));
    const w=Math.max(...rows.map(r=>r.length));
    for(let y=0;y<rows.length;y++){
      const r=rows[y];
      for(let x=0;x<r.length;x++){
        const c=r[x]; if(c==="."||c===" ") continue;
        const col=pal[c]!==undefined?pal[c]:BASE_PAL[c]; if(!col) continue;
        ctx.fillStyle=col;
        ctx.fillRect(ox+(flip?(w-1-x):x), oy+y, 1, 1);
      }
    }
  }
  function canvas(w,h){ const c=document.createElement("canvas"); c.width=w; c.height=h; const x=c.getContext("2d"); x.imageSmoothingEnabled=false; return [c,x]; }
  // agrandissement entier sans lissage
  function upscale(src, s){
    const [c,x]=canvas(src.width*s, src.height*s);
    x.imageSmoothingEnabled=false; x.drawImage(src,0,0,c.width,c.height);
    return c;
  }
  PX.canvas=canvas; PX.upscale=upscale; PX.drawArt=drawArt; PX.rowsOf=rowsOf;
  PX.BASE_PAL=BASE_PAL;
  window.PX=PX;
})();

/* Héros : corps, teints, coiffures, barbe, composition des couches */
(function(){
  "use strict";
  const PX=window.PX;
  // Corps (moitié gauche, 20 colonnes, 48 lignes). s : peau, S : peau ombrée, e : yeux, m : bouche, z : ombre au sol
  const BODY={sym:true, oy:0, rows:[
    "....................","....................","....................","....................",
    "....................","....................","....................","....................",
    "...............kkkkk",
    ".............kkSssss",
    "............kSssssss",
    "............ksssssss",
    "............ksssssss",
    "............ksssssss",
    "............ksssssss",
    "............kssswess",
    "............kssseess",
    "............ksssssss",
    "............ksrsssss",
    "............ksSssssm",
    "............kSssssss",
    ".............kSsssss",
    "..............kkkkkk",
    "...........kkkkkkkkk",
    "...........kssksssss",
    "...........kssksssss",
    "...........kssksssss",
    "...........kssksssss",
    "...........kssksssss",
    "...........kssksssss",
    "...........kssksssss",
    "...........kssksssss",
    "...........kssksssss",
    "..............kssssS",
    "..............kssssS",
    "..............kssssS",
    "..............kssssS",
    "..............kssssS",
    "..............kssssS",
    "..............kssssS",
    ".............ksssssS",
    ".............ksssssS",
    ".............kkkkkkk",
    "....................",
    "...........zzzzzzzzz",
    "....................",
    "....................",
    "...................."
  ]};
  // Mains (dessinées après l'arme pour la tenir)
  const HANDS={sym:true, oy:30, rows:[
    "...........kssk.....",
    "...........kssk.....",
    "...........kkkk....."
  ]};
  // Coiffures : moitié gauche de 9 colonnes (x 11 à 19), à partir de y=5
  // h : cheveux, H : ombre, l : reflet, K : contour des cheveux
  const HAIR={
    court:{n:["Courts","Short"], front:{sym:true, oy:6, rows:[
      "......KKKK",
      "....KKhhhh",
      "...KhhhlhH",
      "..KhhlhhhH",
      "..KhhhhhHh",
      ".KhhhHhhhh",
      ".KhhHhhhHh",
      ".KhH.hhH.h",
      ".KhH..h...",
      ".Kh.......",
      "..K.......",
    ]}},
    meches:{n:["Mèches","Spiky"], front:{sym:true, oy:2, rows:[
      "......K...",
      "......KK.K",
      ".K...KhK.K",
      ".KhK.KhhKh",
      "..KhKhhhhh",
      "..KhhhhlhH",
      "KKhhhlhhhH",
      ".KhhhhhhHh",
      "KhhhhHhhhh",
      ".KhhHhhhHh",
      ".KhH.hhH.h",
      "KhH..Kh...",
      ".Kh.......",
      "..K.......",
    ]}},
    long:{n:["Longs","Long"], back:{sym:true, oy:11, rows:[
      ".KK.........",
      "KhhK........",
      "KhHK........",
      "KhHK........",
      "KhHK........",
      "KhHK........",
      "KhHK........",
      "KhHK........",
      "KhHK........",
      "KhhK........",
      "KhhK........",
      "KhhK........",
      "KhhK........",
      ".KhK........",
      "..K.........",
    ]}, front:{sym:true, oy:6, rows:[
      "......KKKK",
      "....KKhhhh",
      "...KhhhhlH",
      "..KhhhhlhH",
      "..KhhhhhHh",
      ".KhhhhHhhh",
      ".KhhhHhhhh",
      ".Khhhh.hhh",
      ".KhhH.....",
      ".KhhH.....",
      ".KhhH.....",
      ".KhhH.....",
      ".KhhH.....",
      ".KhhH.....",
      "..KK......",
    ]}},
    queue:{n:["Queue","Ponytail"], back:{ox:26, oy:8, rows:[
      "..KKK..",
      ".KhhhK.",
      ".KhHhhK",
      "..KhhhK",
      "..KhHhK",
      "...KhhK",
      "...KhHK",
      "...KhhK",
      "....KhK",
      ".....K.",
    ]}, front:{sym:true, oy:6, rows:[
      "......KKKK",
      "....KKhhhh",
      "...KhhhlhH",
      "..Khhhlhhh",
      "..KhhhhhHh",
      ".KhhhHhhhh",
      ".KhhHhhhhh",
      ".KhH..hhhh",
      ".Kh.......",
      ".K........",
    ]}},
    boucle:{n:["Bouclés","Curly"], front:{sym:true, oy:3, rows:[
      ".......KKK",
      ".....KKhlh",
      "....KhhhhK",
      "...KhlhhKh",
      "..KhhhKhhl",
      ".KhhlhhhhH",
      ".KhhhhhKhh",
      "KhhKhhhhHh",
      "KhlhhHhhhh",
      "KhhhKhhKhh",
      ".KhhhK.hhH",
      "KhhK....h.",
      ".KhK......",
      "KhhK......",
      ".KK.......",
    ]}},
    crete:{n:["Crête","Mohawk"], front:{sym:true, oy:0, rows:[
      "........KK",
      ".......Khh",
      ".......Khl",
      ".......Khh",
      "......KhhH",
      "......KhlH",
      "......KhhH",
      ".....KhhhH",
      ".....KhhhH",
      "....HHKhhH",
      "...H.H.KhH",
      "...H..H.K.",
      "..H.......",
    ]}},
    rase:{n:["Rasé","Buzz cut"], front:{sym:true, oy:8, rows:[
      ".......HHH",
      ".....HH.HH",
      "....H.HH.H",
      "...H.H..H.",
      "...HH.....",
      "...H......",
    ]}},
    chignon:{n:["Chignon","Bun"], front:{sym:true, oy:1, rows:[
      "........KK",
      ".......Khh",
      ".......Khl",
      "........Kh",
      ".......KKK",
      "......KKKK",
      "....KKhhhh",
      "...KhhhhlH",
      "..KhhhhlhH",
      "..KhhhhhHh",
      ".KhhHhhhhh",
      ".KhhhhhHhh",
      ".KhH..hhhh",
      ".Kh.......",
      "..K.......",
    ]}},
  };
  const BEARD={sym:true, oy:16, rows:[
    "Kh......",
    "Kh......",
    "Khh..hh.",
    "KhhK....",
    ".KhhhhhK",
    "..KhhhhH",
    "...KhhhH",
    "....KKKK",
  ]};
  const SKINS=[["#FFE0C8","#E8B896"],["#F5CBA7","#D9A27C"],["#E8B48A","#C68A62"],["#D29A6A","#A86E44"],
               ["#B57A4E","#8C5634"],["#8E5A3A","#6A3E26"],["#6B4129","#4C2C1B"],["#4A2C1C","#33190F"]];
  const HAIRC=[["#2A1D16","#17100C","#4A3628"],["#5A3A22","#3A2414","#8A5E3A"],["#8A5A2E","#5E3A1A","#B98048"],
               ["#D9A441","#A9762A","#F2CF73"],["#F0DC9A","#C9B06A","#FFF4C8"],["#B0402A","#7A2818","#D9684A"],
               ["#9AA0AA","#6E747E","#C9CED6"],["#F2F0EA","#C9C5BC","#FFFFFF"],["#3E6BD6","#27449A","#7FA2F0"],
               ["#D94AA0","#9A2E72","#F28CCB"],["#3FA65A","#26703A","#7AD88E"],["#7A4AD0","#52309A","#A884F0"]];
  const EYES=["#2A3A6A","#3E7A3A","#6A4428","#2E8C9A","#7A2E8C","#1A1A1A"];

  // Lieux de l'épopée (12 × 12)
  const PLACES=[
    {rows:["....kkkk....","...krrrrk...","..krrrrrrk..",".krrrrrrrrk.","kkkkkkkkkkkk",".kwwwwwwwwk.",".kwbbwwbbwk.",".kwbbwwbbwk.",".kwwwddwwwk.",".kwwwddwwwk.",".kkkkkkkkkk.","............"],pal:{r:"#D8402E",w:"#F2E8CC",b:"#4C8CFF",d:"#7A5228"}},
    {rows:[".....kk.....","....kggk....","...kgggGk...","....kggk....","...kgggGk...","..kggggGGk..","...kgggGk...","..kggggGGk..",".kgggggGGGk.",".kkkkkkkkkk.",".....kbk....",".....kkk...."],pal:{g:"#58B04E",G:"#347A38",b:"#7A5228"}},
    {rows:["............","............","kkkkkkkkkkkk","bbBbbbbBbbbb","bBbbsSbbbBbb","bbbbsSbbbbbb","bbBbbbbsSbBb","bbbbbBbsSbbb","bBbbbbbbbbbb","kkkkkkkkkkkk","............","............"],pal:{b:"#4C8CFF",B:"#8FB4FF",s:"#B4BECB",S:"#7D8898"}},
    {rows:[".w...kk...w.","..w..kk..w..","...w.kk.w...","....wkkw....",".....kk.....","....kbbk....","....kbbk....","...kbbbbk...","...kbddbk...","...kbddbk...","...kkkkkk...","............"],pal:{w:"#F2E8CC",b:"#C89A6A",d:"#6E4A26"}},
    {rows:["............","............","......kkk...",".....kgggk..","....kgggggk.","..kkgggggGGk",".kgggkgggGGk","kggggGkgGGGk","kgggggGGGGGk","kGgggGGGGGGk","kkkkkkkkkkkk","............"],pal:{g:"#7AD06A",G:"#3E8A52"}},
    {rows:[".....kk.....","....kyyk....",".....kk.....","....kkkk....","...krrrrk...","..krrrrrrk..","..kwwwwwwk..","..kwwbbwwk..","..kwwbbwwk..","..kwwddwwk..","..kkkkkkkk..","............"],pal:{r:"#6A6678",w:"#E8E4DA",b:"#F2C14E",d:"#6E4A26",y:"#F2C14E"}},
    {rows:[".....kk.....","....kwwk....","...kwwSwk...","..kSwSSSSk..","..kSSSSSSk..",".kSSSSRSSSk.",".kSSSRRSSSk.","kSSSRRRRSSSk","kSSRRRRRRSSk","kRRRRRRRRRRk","kkkkkkkkkkkk","............"],pal:{w:"#FFFFFF",S:"#8E8A9C",R:"#6A6678"}},
    {rows:["...k.kk.k...","...kkkkkk...","...kssssk...","...kssssk...","...ksbbsk...","...ksbbsk...","...kssssk...","...kssssk...","..kssddssk..","..kssddssk..","..kkkkkkkk..","............"],pal:{s:"#B4BECB",b:"#2A2836",d:"#6E4A26"}},
    {rows:["............","kk.kk.kk.kkk","kskkskkskksk","kssssssssssk","kSsssSsssSsk","kssssssssssk","ksssSsssSssk","kssssssssssk","kSsssSsssSsk","kssssssssssk","kkkkkkkkkkkk","............"],pal:{s:"#C9B896",S:"#9A8A68"}},
    {rows:["..r......r..","..rr.....rr.","..k......k..",".kkk....kkk.",".ksk.kk.ksk.",".kskkkkkksk.",".kssssssssk.",".ksbssssbsk.",".kssskksssk.",".ksskddkssk.",".kkkkkkkkkk.","............"],pal:{r:"#D8402E",s:"#C9CED6",b:"#2A2836",d:"#6E4A26"}}
  ];
  PX.place=function(i){ const p=PLACES[i]; const [c,ctx]=PX.canvas(12,12); PX.drawArt(ctx,{rows:p.rows},p.pal,0,0,false); return c; };
  PX.SKINS=SKINS; PX.HAIRC=HAIRC; PX.EYES=EYES; PX.HAIR=HAIR; PX.BODY=BODY; PX.HANDS=HANDS; PX.BEARD=BEARD;
  function lookPal(look){
    const sk=SKINS[look.skin]||SKINS[1], hc=HAIRC[look.hairc]||HAIRC[1];
    return {s:sk[0], S:sk[1], h:hc[0], H:hc[1], l:hc[2], K:"#140E10", e:EYES[look.eyes]||EYES[0]};
  }
  PX.lookPal=lookPal;
  // Compose le héros : look = apparence, eq = {head,chest,legs,feet,weapon} (définitions d'objets)
  PX.hero=function(look, eq){
    const [c,ctx]=PX.canvas(PX.W, PX.H);
    const lp=lookPal(look||{});
    const hair=HAIR[(look&&look.hair)||"court"]||HAIR.court;
    const head=eq.head, hideHair=head && head.hair!=="show";
    const keepBack=!head || head.hair==="show" || head.hair==="back";
    if(hair.back && keepBack) PX.drawArt(ctx, hair.back, lp);
    PX.drawArt(ctx, BODY, lp);
    if(eq.legs) PX.drawArt(ctx, eq.legs.art, eq.legs.pal);
    if(eq.feet) PX.drawArt(ctx, eq.feet.art, eq.feet.pal);
    if(eq.chest) PX.drawArt(ctx, eq.chest.art, eq.chest.pal);
    if(look && look.beard) PX.drawArt(ctx, BEARD, lp);
    if(!hideHair){
      if(head && head.clip!=null){ ctx.save(); ctx.beginPath(); ctx.rect(0, head.clip, PX.W, PX.H); ctx.clip(); PX.drawArt(ctx, hair.front, lp); ctx.restore(); }
      else PX.drawArt(ctx, hair.front, lp);
    }
    if(head) PX.drawArt(ctx, head.art, Object.assign({}, lp, head.pal));
    // arme : dessinée en diagonale « vers le haut à droite » ; tenue dans la main gauche à l'écran, donc retournée
    if(eq.weapon){
      const a=eq.weapon.art, w=Math.max(...a.rows.map(r=>r.length));
      const g=a.grip||[2, a.rows.length-3];
      const dx=12-(w-1-g[0]), dy=31-g[1];
      PX.drawArt(ctx, a, eq.weapon.pal, dx, dy, true);
    }
    const handPal = (eq.chest && eq.chest.gloves) ? Object.assign({}, lp, eq.chest.gloves) : lp;
    PX.drawArt(ctx, HANDS, handPal);
    return c;
  };
  // Icône d'un objet : on dessine la couche seule et on recadre au plus juste
  PX.icon=function(item, look){
    const lp=lookPal(look||{});
    let c,ctx;
    if(item.slot==="weapon"||item.slot==="pet"){
      const a=item.art, w=Math.max(...a.rows.map(r=>r.length));
      [c,ctx]=PX.canvas(w, a.rows.length);
      PX.drawArt(ctx, a, Object.assign({}, lp, item.pal), 0, 0, false);
    } else {
      [c,ctx]=PX.canvas(PX.W, PX.H);
      PX.drawArt(ctx, item.art, Object.assign({}, lp, item.pal));
      if(item.gloves && item.slot==="chest") PX.drawArt(ctx, HANDS, Object.assign({}, lp, item.gloves));
    }
    return PX.crop(c);
  };
  PX.crop=function(src){
    const ctx=src.getContext("2d"), d=ctx.getImageData(0,0,src.width,src.height).data;
    let x0=src.width,y0=src.height,x1=-1,y1=-1;
    for(let y=0;y<src.height;y++) for(let x=0;x<src.width;x++){ if(d[(y*src.width+x)*4+3]>20){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; } }
    if(x1<0) return src;
    const w=x1-x0+1, h=y1-y0+1, [c,cx]=PX.canvas(w,h);
    cx.drawImage(src,x0,y0,w,h,0,0,w,h); return c;
  };
  PX.pet=function(item, frame){
    const a=item.art, w=Math.max(...a.rows.map(r=>r.length));
    const [c,ctx]=PX.canvas(w, a.rows.length+1);
    const pal=item.pal;
    PX.drawArt(ctx, (frame && item.art2) ? item.art2 : a, pal, 0, frame&&!item.art2?1:0, false);
    return c;
  };
})();

/* Objets portés : casques, plastrons, jambes, bottes. Moitiés gauches (sym) sauf mention. */
(function(){
  "use strict";
  // Rampes de couleurs : [clair, base, ombre, sombre]
  const M={
    iron:["#EEF2F7","#B4BECB","#7D8898","#4A5262"], steel:["#F4F7FB","#C6D0DC","#8D99AA","#525C6E"],
    gold:["#FFF3B0","#F2C14E","#C98A1E","#7A4E12"], leather:["#E2AD72","#B07440","#7E4E28","#4A2C16"],
    wood:["#D9AE6E","#A8773F","#7A5228","#4A3018"], linen:["#F2E8CC","#D6C49A","#A99068","#6E5A3A"],
    red:["#FF8A78","#D8402E","#9A2A20","#561410"], blue:["#8FB4FF","#4672D8","#2C4A9A","#172856"],
    navy:["#6E8CE0","#2E3E8A","#1E2A60","#101838"], forest:["#7FC48A","#3E8A52","#255C36","#123020"],
    leaf:["#A8E68A","#58B04E","#347A38","#1A4220"], purple:["#D2A8FF","#9A62E0","#653CA0","#341E5A"],
    ice:["#FFFFFF","#C8EEFF","#82C4E8","#3E6E9A"], lava:["#FFE68A","#FFA03C","#E0501E","#6A1E12"],
    obsid:["#5E5470","#3A3248","#241E30","#120E18"], bone:["#FBF6E4","#E0D3AE","#B0A074","#665838"],
    coral:["#FFC2B8","#FF7F6E","#D2504A","#7A2428"], teal:["#A8FFF0","#2FCFBE","#1A9088","#0E4E4C"],
    night:["#7A68E0","#43329E","#2A1E6A","#140E36"], pink:["#FFD0EE","#F07CC8","#B8429A","#5E1A4E"],
    yellow:["#FFF6A0","#FFE04A","#D9A420","#7A5A0E"], black:["#5A5668","#3A3646","#24212E","#121018"],
    copper:["#FFC79A","#D9864A","#A0562A","#5A2A14"], white:["#FFFFFF","#EEF0F4","#C2C8D2","#6E7684"],
    straw:["#FFF0A8","#E8C860","#B8943A","#6E5420"], ochre:["#FFE2A0","#E8B85A","#B8863A","#6E4E20"],
    grey:["#8E8A9C","#6A6678","#4A4658","#2A2836"], olive:["#C8D48A","#8E9A48","#5E682A","#2E3412"],
    bark:["#C89A6A","#8A5E36","#5E3E22","#3A2614"], cyan:["#B8FFFF","#49E0F0","#1F9DB8","#0E4E5E"],
    scale:["#B8FFD0","#3EC27A","#1E7A4E","#0E3E2A"], drag:["#FF8A6A","#C8242A","#7A1018","#3E0810"],
    sand:["#FFF0C8","#F2D27A","#C9A040","#7A5A20"], acid:["#E6FF9A","#9AE03A","#5A9A20","#2E4E10"]
  };
  function P(pri,sec,ext){
    const o={};
    if(pri){ o.a=pri[0]; o.b=pri[1]; o.c=pri[2]; o.d=pri[3]; }
    if(sec){ o.f=sec[0]; o.g=sec[1]; o.i=sec[2]; o.j=sec[3]; }
    return Object.assign(o, ext||{});
  }
  const L=[];
  function add(slot,id,fr,en,lvl,price,art,pal,more){ L.push(Object.assign({slot,id,n:[fr,en],lvl,price,art,pal},more||{})); }
  window.PX_M=M; window.PX_P=P;

  /* =========================== CASQUES =========================== */
  add("head","h_bonnet","Bonnet de laine","Wool beanie",1,40,{sym:true,oy:3,rows:[
    "......kkk",
    ".....kfff",
    ".....kfgf",
    "....kkkkk",
    "...kabbbb",
    "..kabbcbb",
    "..kabcbbb",
    ".kabbbbcb",
    ".kbbcbbbb",
    ".kbcbbcbb",
    "kfgfgfgfg",
    "kgfgfgfgf",
  ]},P(M.red,["#FFF4DC","#E0CFA8"]),{hair:"show",clip:15});

  add("head","h_paille","Chapeau de paille","Straw hat",3,80,{sym:true,oy:4,rows:[
    ".......kkkkk",
    "......kabbbb",
    ".....kabbcbb",
    ".....kabcbbb",
    ".....kbbbbbc",
    ".....kffffff",
    ".....kgggggg",
    "...kkkbbbbbb",
    ".kkabbbbcbbb",
    "kabbcbbcbbcb",
    "kcbcbcbcbcbc",
    ".k.d.k......",
  ]},P(M.straw,["#D8402E","#9A2A20"]),{hair:"show",clip:15});

  add("head","h_capuche","Capuche de bandit","Bandit hood",5,120,{sym:true,oy:5,rows:[
    "......kkkkk",
    "....kkabbbb",
    "...kabbbbbb",
    "..kabbbbcbb",
    "..kabbbcbbb",
    ".kabbbcbbbb",
    ".kabbcbbbbc",
    ".kbbcbbbccc",
    ".kbcbkkkkkk",
    ".kbcbk.....",
    ".kbcbk.....",
    ".kbcbk.....",
    ".kbcbkfffff",
    ".kbcbkfgfff",
    ".kbcbkffgff",
    "kabcbkfffgf",
    "kbcbbkfgfff",
    "kkkkkkkkkkk",
  ]},P(["#7E7A8C","#4A4658","#34313F","#1E1C26"],["#E8604E","#A8302A"]),{hair:"hide"});

  add("head","h_calotte","Calotte de cuir","Leather cap",8,160,{sym:true,oy:6,rows:[
    "......kkk",
    "....kkabb",
    "...kabbbb",
    "..kabbfbb",
    "..kabbbbb",
    ".kabcbbbb",
    ".kbbbfbbc",
    ".kddddddd",
    ".kbbk....",
    ".kbfk....",
    ".kbbk....",
    ".kbbk....",
    "..kk.....",
  ]},P(M.leather,["#FFC79A"]),{hair:"show",clip:14});

  add("head","h_nasal","Casque à nasal","Nasal helm",10,240,{sym:true,oy:1,rows:[
    "........k",
    ".......kf",
    "......kfg",
    "......kgg",
    "......kgi",
    "....kkkki",
    "...kaabbb",
    "..kaabbbb",
    "..kabbbbc",
    ".kabbbbbc",
    ".kabbbbcc",
    ".kbbbbbcc",
    ".kddddddd",
    ".kdcdcdcd",
    ".kd.....b",
    ".kd.....b",
    "..k.....b",
    "........k",
  ]},P(M.iron,M.blue),{hair:"hide"});

  add("head","h_turban","Turban du désert","Desert turban",13,340,{sym:true,oy:3,rows:[
    ".......kkk",
    ".....kkabb",
    "....kabbbb",
    "...kabbcbb",
    "..kabcbbbk",
    ".kabcbbbkf",
    ".kbcbbbkfg",
    ".kbbcbbbki",
    "kbcbbcbbbk",
    "kcbbbcbbcb",
    "kbcbcbcbcb",
    "kddddddddd",
    ".k........",
    "..........",
    "...knnnnnn",
    "...knonnnn",
    "...knnnonn",
    "....knnnno",
    ".....kkkkk",
  ]},P(M.ochre,M.teal,{n:"#F6EAD0",o:"#D8C8A4"}),{hair:"hide"});

  add("head","h_mage","Chapeau de mage","Wizard hat",16,460,{sym:true,oy:0,rows:[
    "...........k",
    "..........kb",
    "..........ka",
    ".........kab",
    ".........kbb",
    "........kabb",
    "........kbbf",
    ".......kabff",
    ".......kbbbf",
    "......kabbbc",
    "......kabbcc",
    "......kggggg",
    "......kiiiii",
    "..kkkkkbbbbb",
    "kkabbbbbbcbb",
  ]},P(M.blue,M.gold),{hair:"show",clip:15});

  add("head","h_garde","Heaume de garde","Guard's great helm",18,600,{sym:true,oy:0,rows:[
    "........k",
    ".......kf",
    "......kfg",
    "......kgg",
    ".....kfgi",
    ".....kggi",
    "...kkkkki",
    "..kaabbbb",
    ".kaabbbbb",
    ".kabbbbbc",
    ".kabbbbbc",
    ".kabbbbcc",
    ".kbbbbbbc",
    ".kbbbbbbc",
    ".kddddddd",
    ".kbkkkkkk",
    ".kbkkkkkk",
    ".kbbbbbbc",
    ".kbbkbkbc",
    ".kbbkbkbc",
    ".kbbbbbbc",
    ".kcbbbbcc",
    "..kkkkkkk",
  ]},P(M.steel,M.red),{hair:"hide"});

  add("head","h_druide","Coiffe de druide","Druid antlers",20,850,{sym:true,oy:0,rows:[
    "k...k.......",
    "kb..kb......",
    ".kb.kb..k...",
    "..kbbk.kb...",
    "...kbbkbk...",
    "....kbbbk...",
    ".....kbbk...",
    "......kbk...",
    "......kcbkkk",
    ".....kgfgkfg",
    "....kgigfgig",
    "....kigigfgi",
    ".....k.k.k.k",
  ]},P(M.bone,M.leaf),{hair:"show",clip:12});

  add("head","h_corsaire","Tricorne du corsaire","Corsair tricorn",25,1150,{sym:true,oy:3,rows:[
    "..........kk",
    "kk......kkbb",
    "kgkk..kkbbbb",
    "kbggkkbbbbbb",
    ".kbbgbbbbbbb",
    ".kbbbbbbbbnn",
    "..kbbbbbbbkn",
    "..kbbbbbbbno",
    "...kbbbbbbbb",
    "...kgggggggg",
    "....kkkkkkkk",
  ]},P(M.black,M.gold,{n:"#FBF6E4",o:"#B0A074"}),{hair:"show",clip:14});

  add("head","h_orage","Masque de l'orage","Storm mask",30,1500,{sym:true,oy:0,rows:[
    "........kk",
    ".......kgf",
    "......kgfk",
    ".......kgf",
    "......kgfk",
    "....kkkkgk",
    "...kaabbbb",
    "..kabbbbbb",
    ".kabbbcbbb",
    ".kabbcbbbb",
    ".kbbcbbbbc",
    ".kbcbbbbcc",
    ".kbbbbbbcc",
    ".kdddddddd",
    ".kdkkkkkkk",
    ".kdkkkgfkk",
    ".kdkkkkkkk",
    "..kd......",
    "..kd......",
    "...k......",
  ]},P(M.purple,M.yellow),{hair:"hide"});

  add("head","h_corail","Couronne de corail","Coral crown",35,2200,{sym:true,oy:1,rows:[
    "......k...k",
    ".....kg..kg",
    "..k..kgk.kg",
    ".kg..kgk.kf",
    ".kgk.kfgkkg",
    "..kgkkgfgkg",
    "..kggkgigkg",
    "...kgigigkk",
    "...kbbbbbbb",
    "...kanbanba",
    "...kbcbcbcb",
    "...kkkkkkkk",
  ]},P(M.teal,M.coral,{n:"#FFFFFF"}),{hair:"show",clip:12});

  add("head","h_ombre","Heaume du seigneur des ombres","Shadow lord helm",40,3000,{sym:true,oy:0,rows:[
    "k...........",
    "kgk.........",
    "kggk........",
    ".kggk.......",
    ".kgigk......",
    "..kggik..kkk",
    "...kgiikkabb",
    "....kgikabbb",
    ".....kkabbbb",
    ".....kabbbcb",
    "....kabbbcbb",
    "....kbbbcbbb",
    "....kbbcbbbb",
    "....kbbbbbbc",
    "....kdbkkkkk",
    "....kdkknokk",
    "....kdkkkkkk",
    "....kdbbbbbc",
    "....kbbkbbbc",
    "....kbbbbbcc",
    ".....kbbbbcc",
    "......kkkkkk",
  ]},P(M.black,["#FF6A5A","#C8242A","#7A1018"],{n:"#FF3B3B",o:"#FFD0C0"}),{hair:"hide"});

  add("head","h_aube","Heaume ailé de l'aube","Dawn winged helm",45,4000,{sym:true,oy:2,rows:[
    "n...........",
    "kn..........",
    "kon.........",
    "koon....kkkk",
    ".koon.kkaabb",
    ".kpoonkaabbb",
    "..kpookabbbf",
    "..kppokabbbc",
    "...kpokabbcb",
    "...kkkkbbcbb",
    ".....kbbbbbb",
    ".....kdddddd",
    ".....kb.....",
    ".....kb.....",
    "......k.....",
  ]},P(M.gold,null,{n:"#FFFFFF",o:"#E8ECF2",p:"#B8C0CC",f:"#49E0F0"}),{hair:"hide"});

  add("head","h_cosmos","Couronne cosmique","Cosmic crown",50,7000,{sym:true,oy:0,rows:[
    "..........k",
    ".........kn",
    ".........ko",
    "....k...kab",
    "...kn..kabb",
    "...kokkkabb",
    "..kabkabbbo",
    "..kabbbabnb",
    "..kabnbbbbb",
    ".kbbobbbbbo",
    ".kcpcccpccc",
    ".kkkkkkkkkk",
  ]},P(M.night,M.gold,{n:"#FFFFFF",o:"#FFE9A8",p:"#9EC8FF"}),{hair:"show",clip:12});

  /* =========================== PLASTRONS =========================== */
  add("chest","c_tunique","Tunique de lin","Linen tunic",1,0,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kabkabbkk",
    ".kabkabbbc",
    ".kabkabbbb",
    ".kbbkabbbb",
    ".kbckbbbbb",
    ".kkkkbbbbc",
    "....kbbbbb",
    "....kffffn",
    "....kbbbbc",
    "....kbcbbc",
    "....kkkkkk",
  ]},P(M.linen,["#6B4A2A"],{n:"#E8C860"}),{starter:true});

  add("chest","c_bucheron","Chemise de bûcheron","Lumberjack shirt",3,60,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kbdkbbdkk",
    ".kddkddddb",
    ".kbdkbbdbb",
    ".kbdkbbdbb",
    ".kddkddddd",
    ".kkkkbbdbb",
    "....kbbdbb",
    "....kddddd",
    "....kbbdbb",
    "....kkkkkk",
  ]},P(["#FF8A78","#D8402E","#9A2A20","#2A1E22"]));

  add("chest","c_chasseur","Gilet de chasseur","Hunter's vest",5,110,{sym:true,oy:23,rows:[
    ".kfgfgkkkk",
    "kfgfgfkbbn",
    ".knokbbbon",
    ".knokbbcbn",
    ".knokbbbon",
    ".knokbcbbo",
    ".kkkkbbbbn",
    "....kbcbbo",
    "....kddddd",
    "....kbbbbn",
    "....kkkkkk",
  ]},P(M.forest,["#F4EED8","#C9B896","#8E7A5A"],{n:"#F2E8CC",o:"#D6C49A",d:"#4A2C16"}));

  add("chest","c_brigandine","Brigandine de cuir","Leather brigandine",8,160,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kabkabbkk",
    ".kabkafbfb",
    ".kbbkbbbbb",
    ".kbckafbfb",
    ".kbckbbbbb",
    ".kkkkafbfb",
    "....kbbbbb",
    "....kddddg",
    "....kbcbcb",
    "....kkkkkk",
  ]},P(M.leather,["#FFC79A","#F2C14E"]));

  add("chest","c_mailles","Cotte de mailles","Chainmail",10,240,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kbckbckkk",
    ".kcbkcbnfg",
    ".kbckbcnfg",
    ".kcbkcbngf",
    ".kbckbcnfg",
    ".kkkkcbnfg",
    "....kbcnfg",
    "....kddddd",
    "....kcbngf",
    "....kbcnfi",
    "....kkkkkk",
  ]},P(["#EEF2F7","#B4BECB","#7D8898","#4A3018"],M.blue,{n:"#F2C14E"}));

  add("chest","c_mage","Robe d'apprenti mage","Apprentice robe",13,340,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kabkabbkn",
    ".kabkabbbn",
    ".kabkaobbn",
    ".kbbkbbbon",
    ".kbckbobbn",
    ".kkkkbbbbn",
    "....kbbbbn",
    "....koooon",
    "....kbbbbn",
    "....kbbbcn",
    "....kbbbcn",
    "...kbbbcbn",
    "...kbbcbbn",
    "...kkkkkkk",
  ]},P(M.navy,null,{n:"#E8ECF2",o:"#B8C0CC"}));

  add("chest","c_cuirasse","Cuirasse de fer","Iron cuirass",16,460,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kfgkaabbb",
    ".kfgkabbbb",
    ".kfgkabbnn",
    ".kggkbbbno",
    ".kfgkbbbbb",
    ".kkkkcbbbc",
    "....kcbbbc",
    "....kddddd",
    "....kfgfgf",
    "....kgfgfg",
    "....kkkkkk",
  ]},P(["#EEF2F7","#B4BECB","#7D8898","#4A2C16"],["#B07440","#7E4E28"],{n:"#F2C14E",o:"#C98A1E"}));

  add("chest","c_corsaire","Veste de corsaire","Corsair coat",18,600,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kabkabbff",
    ".kabkabbfg",
    ".kabkabngf",
    ".kbbkbbbcb",
    ".kbbkbbnbc",
    ".kkkkbbbcb",
    "....kbbncb",
    "....kddddd",
    "....kbbk..",
    "....kbbk..",
    "...kbbbk..",
    "...kbbck..",
    "...kkkk...",
  ]},P(M.red,["#FFFFFF","#D8DEE8"],{n:"#F2C14E",d:"#2A1E22"}));

  add("chest","c_plates","Armure de plates","Plate armour",20,850,{sym:true,oy:22,rows:[
    "..kkkk....",
    ".kaabbkkkk",
    "kabbbbkaab",
    "kbbbcbkabb",
    "kbcccbkbbb",
    ".kkkkkkbbn",
    ".kabkcbbbc",
    ".kkkkcbbbc",
    "....kccccc",
    "....knnnnn",
    "....kbcbcb",
    "....kcbcbc",
    "....kkkkkk",
  ]},P(M.steel,null,{n:"#F2C14E"}),{gloves:{s:"#C6D0DC",S:"#8D99AA"}});

  add("chest","c_champignon","Armure champignon","Mushroom armour",25,1150,{sym:true,oy:21,rows:[
    "..kkk.....",
    ".kabbk....",
    "kanbbnbkkk",
    "kbbbbcbkgg",
    ".kkkkkkgfg",
    ".kookgggig",
    ".kookgfggi",
    ".kookggigg",
    ".kkkkgfggg",
    "....kggigf",
    "....kiiiii",
    "....kgfggg",
    "....kkkkkk",
  ]},P(M.purple,M.acid,{n:"#FFFFFF",o:"#F2E8CC"}));

  add("chest","c_ecailles","Cuirasse d'écailles de wyverne","Wyvern scale mail",30,1500,{sym:true,oy:22,rows:[
    "..k.......",
    ".kkkkkkkkk",
    ".kabkabcab",
    ".kbckbcfbc",
    ".kabkcabcg",
    ".kbckbcbfb",
    ".kabkabcab",
    ".kkkkbcgbc",
    "....kcabca",
    "....kddddd",
    "....kbcbcb",
    "....kcbcbc",
    "....kkkkkk",
  ]},P(M.scale,["#6AE0FF","#B07AFF"]));

  add("chest","c_obsidienne","Carapace d'obsidienne","Obsidian carapace",35,2200,{sym:true,oy:21,rows:[
    "..kk......",
    ".kak......",
    ".kkkkkkkkk",
    ".kabkabbbc",
    ".kbbkbgibb",
    ".kbckbbgbc",
    ".kbikbcbgf",
    ".kbbkbigbf",
    ".kkkkbbigb",
    "....kbbbic",
    "....kddddd",
    "....kbibcb",
    "....kcbbgb",
    "....kkkkkk",
  ]},P(M.obsid,M.lava));

  add("chest","c_cristal","Plastron de cristal","Crystal breastplate",40,3000,{sym:true,oy:22,rows:[
    "..kfk.....",
    ".kfgikkkkk",
    ".kgikabfgb",
    ".kiikbfgbc",
    ".kgikfgbca",
    ".kiikgbcab",
    ".kgikbcabf",
    ".kkkkcabfg",
    "....kabfgi",
    "....kddddd",
    "....kfgbca",
    "....kgbcab",
    "....kkkkkk",
  ]},P(M.pink,M.cyan),{gloves:{s:"#49E0F0",S:"#1F9DB8"}});

  add("chest","c_solaire","Armure solaire","Solar armour",45,4000,{sym:true,oy:22,rows:[
    "..k.......",
    ".kgkkkkkkk",
    ".kfgkabgbb",
    ".kfgkbgbbg",
    ".kfgkbbgnn",
    ".kggkgggnn",
    ".kfgkbbgbg",
    ".kkkkbgbbg",
    "....kbbbbb",
    "....kgggfg",
    "....kbcbcb",
    "....kcbcbc",
    "....kkkkkk",
  ]},P(["#FFFFFF","#F3F0E6","#CFC8B4","#7A7260"],M.gold,{n:"#FF9A3C"}),{gloves:{s:"#F2C14E",S:"#C98A1E"}});

  add("chest","c_dragon","Armure du dragon ancestral","Ancestral dragon armour",50,7000,{sym:true,oy:17,rows:[
    "k.............",
    "kok...........",
    "knok..........",
    "knnok.........",
    ".knnok........",
    ".knnnok.......",
    "..knnokkkkkkkk",
    ".....kabkabcbg",
    ".....kbckbcbcg",
    ".....kabkabcgf",
    ".....kbckbcbgf",
    ".....kabkabcbg",
    ".....kkkkbcbcg",
    "........kabcbg",
    "........kiiiii",
    "........kbcbcg",
    "........kcbcbg",
    "........kkkkkk",
  ]},P(M.drag,M.gold,{n:"#FF6A5A",o:"#A8202A"}),{gloves:{s:"#C8242A",S:"#7A1018"}});

  /* =========================== JAMBES =========================== */
  add("legs","l_braies","Braies de toile","Linen breeches",1,0,{sym:true,oy:33,rows:[
    "kbbbbc","kbbbbc","kabbbc","kbffbc","kbbbbc","kbbbcc","kbbbbc",
  ]},P(M.linen,["#A8773F"]),{starter:true});
  add("legs","l_jardinier","Pantalon de jardinier","Gardener's trousers",3,60,{sym:true,oy:33,rows:[
    "kbbbbc","kbbbbc","kabbbc","kbffbc","kbbbbc","kaaaaa","kbbbbb",
  ]},P(M.blue,["#D8402E"]));
  add("legs","l_kilt","Kilt","Kilt",5,110,{sym:true,oy:33,rows:[
    "kfgfdfg","kdddddd","kfgfdfg","kfgfdfg","kkkkkkk",".knnnno",".kooono",
  ]},P(["#7FC48A","#3E8A52","#255C36","#123020"],["#3E8A52","#2C4A9A"],{n:"#F2E8CC",o:"#D6C49A"}));
  add("legs","l_cuir","Chausses de cuir lacées","Laced leather hose",8,160,{sym:true,oy:33,rows:[
    "kbbbbc","kbnbbc","kbbbbc","kbnbbc","kbbbbc","kbnbbc","kbbbcc",
  ]},P(M.leather,null,{n:"#F2E8CC"}));
  add("legs","l_mailles","Jambières de mailles","Mail chausses",10,240,{sym:true,oy:33,rows:[
    "kbcbcc","kcbcbc","kbcbcc","kffffc","kcbcbc","kbcbcc","kcbcbc",
  ]},P(M.iron,["#B07440"]));
  add("legs","l_sarouel","Sarouel du désert","Desert harem pants",13,340,{sym:true,oy:32,rows:[
    "..kffffg",".kabbbbc","kabbbbcb","kabbbcbc","kbbbbcbc","kbbbcbbc","..kbbbcc","...kdddd",
  ]},P(M.ochre,M.teal));
  add("legs","l_fer","Cuissards de fer","Iron cuisses",16,460,{sym:true,oy:33,rows:[
    ".kabbbc",".kabbbc",".kbbbcc","kaaabbc",".kbbbcc",".kabbbc",".kbbbcc",
  ]},P(M.iron));
  add("legs","l_chevalier","Jambières de chevalier","Knight's greaves",18,600,{sym:true,oy:33,rows:[
    "kabfgg","kabfgf","kbbfgg","kaafgf","kbbfgg","kabigi","kbbbcc",
  ]},P(M.steel,M.red));
  add("legs","l_ecorce","Jambières d'écorce","Bark leggings",20,850,{sym:true,oy:33,rows:[
    "kbcbbc","kbcfgb","kbbcbc","kfgbcb","kbcbbc","kcbbgf","kbbcbc",
  ]},P(M.bark,M.leaf));
  add("legs","l_os","Jambières d'os","Bone leggings",25,1150,{sym:true,oy:33,rows:[
    "kiiiii","kabbai","kibbii","kbgbai","kabbai","kiiiii","kibbii",
  ]},P(M.bone,["#8CFFB0","#3ED07A","#2A2E2A"]));
  add("legs","l_tempete","Jambières de tempête","Storm leggings",30,1500,{sym:true,oy:33,rows:[
    "kbbbbc","kbgbbc","kbbgbc","kbgfbc","kgbbbc","kbgbbc","kbbgcc",
  ]},P(M.purple,M.yellow));
  add("legs","l_lave","Grèves de lave","Lava greaves",35,2200,{sym:true,oy:33,rows:[
    "kbbbgc","kbcbgb","kbbigb","kcbbgf","kbcbig","kbbgfb","kcbigc",
  ]},P(M.obsid,M.lava));
  add("legs","l_givre","Jambières de givre","Frost leggings",40,3000,{sym:true,oy:33,rows:[
    "kabbbc","kabbcc","kbbbcb","kaabbc","kbbcbc","kabbcc","kdcdcd",
  ]},P(M.ice));
  add("legs","l_aurore","Jambières de l'aurore boréale","Aurora leggings",45,4000,{sym:true,oy:33,rows:[
    "kfffgg","kgfggi","kggiig","kgiiij","kiijii","kijjji","kjjjjj",
  ]},P(null,["#6AFFB0","#3ED0A0","#5A7AFF","#A060FF"]));
  add("legs","l_titan","Grèves dorées du titan","Titan's golden greaves",50,7000,{sym:true,oy:33,rows:[
    ".kabbbc",".kabfbc",".kbbbcc","kaagabc",".kbbbcc",".kanbbc",".kbbbcc",
  ]},P(M.gold,["#49E0F0","#F06BD0"],{n:"#FFFFFF"}));

  /* =========================== BOTTES =========================== */
  add("feet","b_sandales","Sandales de corde","Rope sandals",1,0,{sym:true,oy:40,rows:[
    ".a.a.a.",".aaaaa.","kdddddk",
  ]},{a:"#C89A5C",d:"#6E4A26"},{starter:true});
  add("feet","b_souliers","Souliers de cuir","Leather shoes",2,50,{sym:true,oy:40,rows:[
    "kabbbbk","kbbbbck","kdddddk",
  ]},P(M.leather));
  add("feet","b_sabots","Sabots peints","Painted clogs",4,90,{sym:true,oy:39,rows:[
    ".kkkkk.","kafgbbk","kbbbbbk","kdddddk",
  ]},P(M.wood,["#D8402E","#FFE04A"]));
  add("feet","b_peche","Bottes de pêcheur","Fisherman's boots",7,150,{sym:true,oy:35,rows:[
    "kaaaaak","kbbbbck","kbbbbck","kbbbbck","kbbbbck","kbbbbck","kbbbbck","kdddddk",
  ]},P(M.olive));
  add("feet","b_coureur","Bottes de coureur","Runner's boots",10,240,{sym:true,oy:38,rows:[
    "kbbbbck","kbobobk","kbbbbck","kbbbbbk","knnnnnk",
  ]},P(["#F2C894","#D09A5A","#9A6A34","#5A3A1A"],null,{n:"#FFFFFF",o:"#F2E8CC"}));
  add("feet","b_solerets","Solerets de fer","Iron sabatons",13,340,{sym:true,oy:38,rows:[
    "kabbbck","kccccck","kabbbck","kccccck","kdddddk",
  ]},P(M.iron));
  add("feet","b_babouches","Babouches du sultan","Sultan's slippers",16,460,{sym:true,oy:38,rows:[
    "kg.....","kgk....","kfbbbgk","kbbbbbk","kgggggk",
  ]},P(M.red,M.gold));
  add("feet","b_fourrure","Bottes de fourrure","Fur boots",18,600,{sym:true,oy:37,rows:[
    ".kaabaab","kabababa",".kcbcbcb",".kbbbbbc",".kbbbbbc",".kdddddd",
  ]},P(["#FFFFFF","#E2E2E8","#B4B4C0","#6E6E7E"]));
  add("feet","b_racines","Bottes-racines","Root boots",20,850,{sym:true,oy:38,rows:[
    "kbcbbfk","kbbcbbk","kcbgibk","kbbbcbk","cdcdcdc","c.c..c.",
  ]},P(M.bark,["#58B04E","#FF7FC8","#FFE04A"]));
  add("feet","b_chevalier","Bottes de chevalier","Knight's boots",25,1150,{sym:true,oy:37,rows:[
    ".kaabbbk",".kbbbbck",".kbbbbck",".kbbbbck","gkbbbbck","fkdddddk",
  ]},P(M.black,M.gold));
  add("feet","b_braise","Bottes de braise","Ember boots",30,1500,{sym:true,oy:38,rows:[
    "kbbbbck","kbgbbck","kbbbgck","kbibbck","kgigigk",
  ]},P(M.obsid,M.lava));
  add("feet","b_ailees","Bottes ailées","Winged boots",35,2200,{sym:true,oy:37,rows:[
    ".n.kaabbk","onkabbbck","ookbbbbck",".okbbbbck","..kbbbbck","..kdddddk",
  ]},P(M.white,null,{n:"#FFFFFF",o:"#CFE0FF"}));
  add("feet","b_foudre","Bottes de foudre","Thunder boots",40,3000,{sym:true,oy:38,rows:[
    "f.kabbck",".gkbbbck","..kbgbck","g.kbbbck",".fkdddck",
  ]},P(["#B8D0FF","#6A8ED8","#3E5AA0","#1E2E5A"],M.yellow));
  add("feet","b_corail","Bottes de corail","Coral boots",45,4000,{sym:true,oy:37,rows:[
    ".g..g..","kgbbgbk","kbbnbck","kabbbck","kbbbbck","knbnbnk",
  ]},P(M.teal,M.coral,{n:"#FFFFFF"}));
  add("feet","b_nuages","Bottes du marcheur de nuages","Cloudwalker boots",50,7000,{sym:true,oy:38,rows:[
    "..kaffgfk","..kfgffgk","..kffgffk","..kgggggk",".nnonnonn","nopnnonpo",".popnoopp","..pp.pp..",
  ]},P(M.white,M.pink,{n:"#FFFFFF",o:"#E8F0FF",p:"#C8D8F0"}));

  window.PX_ITEMS=(window.PX_ITEMS||[]).concat(L);
})();

/* Armes (tracées) et familiers (dessinés à la main). Contour automatique. */
(function(){
  "use strict";
  const M=window.PX_M, P=window.PX_P;
  const L=[];
  function add(slot,id,fr,en,lvl,price,art,pal,more){ L.push(Object.assign({slot,id,n:[fr,en],lvl,price,art,pal},more||{})); }

  // ---------- petit atelier de tracé ----------
  function grid(w,h){ return Array.from({length:h},()=>Array(w).fill(".")); }
  function put(g,x,y,c){ x=Math.round(x); y=Math.round(y); if(y>=0&&y<g.length&&x>=0&&x<g[0].length) g[y][x]=c; }
  function line(g,x0,y0,x1,y1,c){
    x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
    const dx=Math.abs(x1-x0), dy=-Math.abs(y1-y0), sx=x0<x1?1:-1, sy=y0<y1?1:-1; let e=dx+dy;
    for(;;){ put(g,x0,y0,c); if(x0===x1&&y0===y1) break; const e2=2*e; if(e2>=dy){e+=dy;x0+=sx;} if(e2<=dx){e+=dx;y0+=sy;} }
  }
  // ligne diagonale épaisse : une sous-ligne par caractère, décalées d'un pixel en x
  function band(g,x0,y0,x1,y1,chars){ chars.forEach((c,i)=>{ if(c) line(g,x0+i,y0,x1+i,y1,c); }); }
  function disc(g,cx,cy,r,c){ for(let y=-r;y<=r;y++) for(let x=-r;x<=r;x++) if(x*x+y*y<=r*r+r*0.8) put(g,cx+x,cy+y,c); }
  function ring(g,cx,cy,r,c){ for(let y=-r;y<=r;y++) for(let x=-r;x<=r;x++){ const d=x*x+y*y; if(d<=r*r+r*0.8 && d>=(r-1)*(r-1)-0.5) put(g,cx+x,cy+y,c); } }
  function bez(g,p0,p1,p2,chars){
    for(let i=0;i<=60;i++){ const t=i/60, u=1-t;
      const x=u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0], y=u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1];
      chars.forEach((c,k)=>{ if(c) put(g,x+k,y,c); }); }
  }
  // contour : tout pixel vide touchant (4-voisinage) un pixel plein devient « k »
  function outline(g){
    const h=g.length,w=g[0].length, o=g.map(r=>r.slice());
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){ if(g[y][x]!==".") continue;
      if((y>0&&g[y-1][x]!=="."&&g[y-1][x]!=="k")||(y<h-1&&g[y+1][x]!=="."&&g[y+1][x]!=="k")||
         (x>0&&g[y][x-1]!=="."&&g[y][x-1]!=="k")||(x<w-1&&g[y][x+1]!=="."&&g[y][x+1]!=="k")) o[y][x]="k"; }
    return o.map(r=>r.join(""));
  }
  function art(w,h,draw,grip,noOutline){ const g=grid(w,h); draw(g); return {rows: noOutline?g.map(r=>r.join("")):outline(g), grip}; }
  // épée générique : lame de (bx,by) à (tx,ty), garde perpendiculaire, poignée et pommeau
  function sword(g,o){
    band(g,o.bx,o.by,o.tx,o.ty,o.blade);                    // lame sur trois sous-lignes
    if(o.guard) band(g,o.gx-2,o.gy-2,o.gx+2,o.gy+2,[o.guard]); // garde : diagonale ↘ perpendiculaire
    if(o.handle) band(g,o.hx0,o.hy0,o.hx1,o.hy1,o.handle);
    if(o.pommel) disc(g,o.px,o.py,o.pr||0,o.pommel);
  }

  /* =========================== ARMES =========================== */
  add("weapon","w_baton","Bâton de marche","Walking staff",1,0,art(18,18,g=>{
    band(g,2,16,14,4,["a","b"]); disc(g,15,3,1,"c"); put(g,15,2,"a");
  },[6,12]),P(M.wood),{starter:true});

  add("weapon","w_bois","Épée en bois","Wooden sword",1,40,art(18,18,g=>{
    sword(g,{bx:6,by:11,tx:14,ty:3,blade:["a","b","c"],gx:5,gy:12,guard:"c",hx0:3,hy0:14,hx1:4,hy1:13,handle:["f","g"],px:2,py:15,pr:0,pommel:"c"});
    put(g,15,2,"a");
  },[4,13]),P(M.wood,["#F2E8CC","#C9B896"]));

  add("weapon","w_poele","Poêle à frire","Frying pan",3,80,art(18,18,g=>{
    disc(g,12,5,4,"b"); ring(g,12,5,4,"c"); put(g,10,3,"a"); put(g,11,3,"a"); put(g,10,4,"a");
    band(g,2,15,8,9,["f","g"]); put(g,8,9,"d"); put(g,9,9,"d");
  },[4,13]),P(M.black,M.wood));

  add("weapon","w_dague","Dague","Dagger",6,130,art(14,14,g=>{
    sword(g,{bx:5,by:8,tx:11,ty:2,blade:["a","b","c"],gx:4,gy:9,guard:"d",hx0:2,hy0:11,hx1:3,hy1:10,handle:["f","g"],px:1,py:12,pr:0,pommel:"d"});
  },[3,10]),P(M.steel,M.red,{d:"#C98A1E"}));

  add("weapon","w_arc","Arc court","Short bow",9,190,art(18,18,g=>{
    line(g,14,2,2,14,"n");
    bez(g,[14,1],[2,1],[1,14],["a","b"]);
  },[5,5]),P(M.wood,null,{n:"#F2E8CC"}));

  add("weapon","w_fleau","Fléau d'armes","Flail",12,300,art(18,18,g=>{
    band(g,2,16,6,12,["f","g"]); put(g,7,11,"d");
    [[8,10],[9,9],[10,8],[11,7]].forEach(([x,y],i)=>put(g,x,y,i%2?"c":"a"));
    disc(g,13,5,2,"b"); put(g,12,4,"a");
    [[13,1],[13,9],[9,5],[17,5],[10,2],[16,2],[16,8]].forEach(([x,y])=>put(g,x,y,"d"));
  },[4,14]),P(M.iron,M.wood,{d:"#4A5262"}));

  add("weapon","w_hache","Hache double","Double axe",15,420,art(18,18,g=>{
    band(g,2,16,13,5,["f","g"]);
    band(g,8,2,13,7,["a","b","b","c"]); band(g,12,6,15,9,["a","b","c"]);
    put(g,8,1,"a"); put(g,16,10,"c");
  },[5,13]),P(M.steel,M.wood));

  add("weapon","w_epee","Épée longue","Longsword",18,600,art(19,19,g=>{
    sword(g,{bx:6,by:12,tx:16,ty:2,blade:["a","b","c"],gx:5,gy:13,guard:"g",hx0:2,hy0:16,hx1:4,hy1:14,handle:["n","o"],px:1,py:17,pr:0,pommel:"g"});
    put(g,5,13,"r"); put(g,3,11,"f"); put(g,7,15,"f"); put(g,17,1,"a");
  },[3,15]),P(M.steel,M.gold,{n:"#7E4E28",o:"#4A2C16",r:"#E8304A"}));

  add("weapon","w_feuille","Lame-feuille du druide","Druid leaf blade",20,850,art(19,19,g=>{
    for(let t=0;t<=10;t++){ const w=Math.round(Math.sin(t/10*Math.PI)*2.6); const cx=6+t, cy=12-t;
      for(let k=-w;k<=w;k++){ put(g,cx+k,cy,"b"); } }
    band(g,6,12,16,2,["a"]); put(g,17,1,"b");
    band(g,3,15,5,13,["f","g"]); put(g,4,12,"i"); put(g,6,14,"i"); put(g,2,16,"i");
  },[4,14]),P(M.leaf,M.wood,{i:"#58B04E"}));

  add("weapon","w_espadon","Sabre-espadon","Swordfish sabre",25,1150,art(20,20,g=>{
    for(let t=0;t<=9;t++){ const w=Math.round(Math.sin((t+1)/11*Math.PI)*2.2); const cx=5+t, cy=13-t;
      for(let k=-w;k<=w;k++) put(g,cx+k,cy,k<0?"a":"b"); }
    line(g,14,4,18,0,"n"); put(g,13,3,"w"); put(g,13,4,"d");
    put(g,8,7,"c"); put(g,7,7,"c"); put(g,8,6,"c"); put(g,6,8,"c");
    put(g,3,13,"c"); put(g,2,12,"c"); put(g,4,15,"c"); put(g,5,16,"c");
    band(g,1,18,3,16,["f","g"]);
  },[2,17]),P(["#9EE0FF","#3E8ED8","#2A5AA0","#14305E"],M.leather,{n:"#E8ECF2"}));

  add("weapon","w_trident","Trident de corail","Coral trident",30,1500,art(20,20,g=>{
    band(g,1,19,12,8,["f","g"]);
    band(g,10,6,14,10,["f"]); band(g,12,8,16,4,["f","g"]);
    line(g,10,6,12,2,"g"); line(g,14,10,18,8,"g"); put(g,12,1,"n"); put(g,19,7,"n"); put(g,17,3,"n");
    put(g,6,13,"b"); put(g,7,13,"b"); put(g,5,14,"b");
  },[4,16]),P(M.teal,M.coral,{n:"#FFFFFF"}));

  add("weapon","w_cle","Clé-épée de l'horloger","Clockmaker's key-sword",35,2200,art(20,20,g=>{
    ring(g,4,15,3,"b"); put(g,4,15,"o"); [[4,11],[8,15],[4,19],[0,15],[1,12],[7,12],[7,18],[1,18]].forEach(([x,y])=>put(g,x,y,"c"));
    band(g,7,12,16,3,["a","b","c"]);
    put(g,13,8,"b"); put(g,14,9,"b"); put(g,15,8,"b"); put(g,16,7,"c"); put(g,15,10,"c");
    disc(g,11,14,1,"n"); put(g,11,14,"o");
  },[6,13]),P(M.copper,null,{n:"#F2C14E",o:"#5A2A14"}));

  add("weapon","w_faux","Faux du nécromancien","Necromancer's scythe",40,3000,art(20,20,g=>{
    band(g,2,18,12,8,["a","b"]);
    bez(g,[12,7],[9,0],[1,2],["c","d"]);
    disc(g,12,7,1,"n"); put(g,12,7,"o");
    [[3,1],[5,0],[8,0],[1,4],[10,1]].forEach(([x,y],i)=>put(g,x,y,i%2?"f":"g"));
    put(g,14,5,"g"); put(g,15,6,"f");
  },[5,15]),P(M.bone,["#C8FFD8","#3ED07A"],{c:"#B8C0CC",d:"#4A5262",n:"#FBF6E4",o:"#3ED07A"}));

  add("weapon","w_haltere","Haltère du titan","Titan's dumbbell",45,4000,art(20,20,g=>{
    band(g,4,15,15,4,["c","d"]);
    band(g,13,0,18,5,["a","b","b"]); band(g,12,2,16,6,["b","c"]);
    band(g,1,11,6,16,["a","b","b"]); band(g,0,13,4,17,["b","c"]);
    put(g,9,10,"f"); put(g,10,9,"f"); put(g,10,10,"g");
  },[9,10]),P(M.gold,["#E8ECF2","#B8C0CC"],{c:"#8D99AA",d:"#525C6E"}));

  add("weapon","w_temps","Lame du temps","Blade of time",50,7000,art(20,20,g=>{
    band(g,7,12,17,2,["n","p","q"]); put(g,18,1,"n");
    disc(g,5,14,2,"g"); put(g,5,13,"p"); put(g,5,15,"q"); put(g,4,14,"n"); put(g,6,14,"n");
    band(g,1,19,3,17,["f","i"]);
    [[11,4],[14,6],[9,3],[16,8]].forEach(([x,y])=>put(g,x,y,"q"));
  },[2,18]),P(null,M.gold,{n:"#FFFFFF",p:"#FFE9A8",q:"#E8C860",f:"#7A4E12",i:"#4A3018"}));

  /* =========================== FAMILIERS =========================== */
  function pet(rows){ const g=rows.map(r=>r.split("")); return {rows:outline(g)}; }
  add("pet","p_poussin","Poussin","Chick",1,40,pet([
    "....................","....................","....................","....................",
    "....................","....................","....................","....................",
    "........aaa.........",
    ".......abbba........",
    "......abebbba.......",
    "....ooabbbbbba......",
    ".....oabbbbbbba.....",
    "......abbcbbbba.....",
    "......abccbbbba.....",
    ".......abbbbba......",
    "........bbbbb.......",
    ".........o..o.......",
    "........oo.oo.......",
    "....................",
  ]),{a:"#FFF6B0",b:"#FFD84A",c:"#E0A82A",o:"#FF9A3C",e:"#1B1424"});

  add("pet","p_chien","Chien de berger","Sheepdog",3,0,pet([
    "....................","....................","....................","....................",
    "....................","....................",
    "....bb..............",
    "...bbbb.............",
    "..bbebbb............",
    ".nbbbwwb............",
    "..wwwwwb.........b..",
    "...wwwwbbbbbbbb..bb.",
    "....wwbbbbbbbbbbbb..",
    "....wwwbbbbbbbbbb...",
    ".....wwbbbbcbbbb....",
    ".....wwb.bbc.bbb....",
    ".....ww..ww..ww.....",
    ".....ww..ww..ww.....",
    "....................","....................",
  ]),{b:"#8A5A2E",c:"#5E3A1A",w:"#F4EED8",e:"#1B1424",n:"#1B1424"},{gift:3});

  add("pet","p_lapin","Lapin blanc","White rabbit",5,100,pet([
    "....................","....................","....................","....................",
    "......ww.ww.........",
    "......wp.wp.........",
    "......wp.wp.........",
    "......wp.wp.........",
    ".....wwwwww.........",
    "....wewwwwww........",
    "...pwwwwwwww........",
    "....wwwwwwwwwww.....",
    ".....wwwwwwwwwww....",
    "......wwwcwwwwwww...",
    "......wwwwcwwwwwwww.",
    ".......wwwwwwwwwww..",
    "........ww...ww.....",
    "....................","....................","....................",
  ]),{w:"#FFFFFF",c:"#D8DEE8",p:"#F2A0B8",e:"#C8242A"});

  add("pet","p_chat","Chat roux","Ginger cat",8,180,pet([
    "....................","....................","....................",
    "...b...b............",
    "...bb.bb............",
    "...bbbbb..........b.",
    "..bebbeb..........bb",
    "..bbbnbb...........b",
    "...bwwb...........bb",
    "....bbbbbbbbbbb..bb.",
    "....bcbcbcbcbcbbbb..",
    "....bbcbbcbbcbbbb...",
    "....bbbbbbbbbbbbb...",
    "....bbb.bbb.bbbb....",
    "....ww..ww..ww......",
    "....................","....................","....................","....................","....................",
  ]),{b:"#F0923A",c:"#B85E1E",w:"#FFF4DC",e:"#3EA05A",n:"#F2A0B8"});

  add("pet","p_corbeau","Corbeau","Raven",11,280,pet([
    "....................","....................","....................","....................",
    "....................",
    ".......bbb..........",
    "......bbebb.........",
    "....oobbbbb.........",
    ".......bbbbb........",
    ".......bbbbbb.......",
    "......bbccbbbb......",
    "......bbcccbbbb.....",
    ".......bbccbbbbbb...",
    "........bbbbbbbbbbb.",
    "..........bb...bbbb.",
    "..........o.o.......",
    ".........oo.oo......",
    "....................","....................","....................",
  ]),{b:"#2A2A3E",c:"#3E5A9A",o:"#8A8A9A",e:"#E8304A"});

  add("pet","p_renard","Renard roux","Red fox",14,400,pet([
    "....................","....................","....................","....................",
    "....b...b...........",
    "....bb.bb...........",
    "...bbbbbb...........",
    "..bbebbbb...........",
    ".wwbbbbbb...........",
    "nwwwwbbb.........bb.",
    "..wwwbbbbbbbbbb.bbbb",
    "....wwbbbbbbbbbbbbbw",
    "....wwbbbbbbbbbbbbww",
    ".....wbbbbbbbbbb.ww.",
    ".....bbb.bbb.bbb....",
    ".....dd..dd..dd.....",
    "....................","....................","....................","....................",
  ]),{b:"#E8742A",w:"#FFF4E8",d:"#3A2214",e:"#1B1424",n:"#1B1424"});

  add("pet","p_hibou","Hibou","Owl",17,550,pet([
    "....................","....................","....................",
    "....b......b........",
    "....bb....bb........",
    "....bbbbbbbb........",
    "...bwwbbbbwwb.......",
    "...wweebwweeb.......",
    "...bwwbobwwbb.......",
    "...bbbbobbbbbb......",
    "...bcacacacabb......",
    "...bacacacacbb......",
    "...bcacacacabb......",
    "...bbacacacbbb......",
    "....bbbbbbbbb.......",
    ".....oo...oo........",
    "....................","....................","....................","....................",
  ]),{b:"#8A5E36",a:"#E2C08A",c:"#C8A06A",w:"#FFF4DC",e:"#1B1424",o:"#F2C14E"});

  add("pet","p_loup","Loup gris","Grey wolf",20,850,pet([
    "....................","....................","....................",
    "....b..b............",
    "...bb.bb............",
    "...bbbbbb...........",
    "..bbebbbbb..........",
    "nbbbbbbbbb..........",
    "..wwbbbbbbb.......b.",
    "...wwwbbbbbbbbbbbbbb",
    "....wwbbbbbbbbbbbbbb",
    "....wbbbbbcbbbbbbb.b",
    ".....bbbbbcbbbbbb...",
    ".....bbb..bbb.bbb...",
    ".....bb...bb...bb...",
    ".....dd...dd...dd...",
    "....................","....................","....................","....................",
  ]),{b:"#8E8A9C",c:"#6A6678",w:"#E8ECF2",d:"#2A2836",e:"#F2C14E",n:"#1B1424"});

  add("pet","p_cerf","Cerf blanc","White stag",24,1100,pet([
    ".a.a................",
    ".aaa.a..............",
    "..a.aa..............",
    "...aa...............",
    "...ww...............",
    "..wwww..............",
    ".wewwww.............",
    "nwwwwww.............",
    "...wwwww............",
    "....wwwwwwwwwwww....",
    "....wwwwwwwwwwwww...",
    "....wwwcwwwwwwww....",
    ".....wwcwwwwwww.....",
    ".....ww.ww..ww.ww...",
    ".....ww.ww..ww.ww...",
    ".....ww.ww..ww.ww...",
    ".....dd.dd..dd.dd...",
    "....................","....................","....................",
  ]),{w:"#F4F6FA",c:"#C8D0DC",a:"#E0E8FF",d:"#6E7684",e:"#1B1424",n:"#1B1424"});

  add("pet","p_follet","Feu follet","Will-o'-the-wisp",27,1400,pet([
    "....................","....................","....................",
    ".........a..........",
    "........aba.........",
    ".......abbba........",
    "......abbbbba.......",
    ".....abwbbwbba......",
    ".....abebbebba......",
    ".....abbbbbbba...c..",
    "......abbbbba...c...",
    ".......abbba..cc....",
    "........aaa.cc......",
    "..........cc..c.....",
    ".........c....c.....",
    "....................","....................","....................","....................","....................",
  ]),{a:"#B8F0FF",b:"#4CA8FF",c:"#2E6ED8",e:"#14204A"},{noOutline:true});

  add("pet","p_champi","Champignon animé","Living mushroom",30,1700,pet([
    "....................","....................","....................","....................",
    "......rrrrrr........",
    "....rrwrrrrwrr......",
    "...rrrrrrwrrrrr.....",
    "..rwrrrrrrrrrwrr....",
    "..rrrrrwrrrrrrrr....",
    "...ccccccccccccc....",
    ".....aaaaaaaa.......",
    ".....aeaaaaea.......",
    ".....aaaamaaa.......",
    "....faaaaaaaaf......",
    ".....aaaaaaaa.......",
    "......bb..bb........",
    "......bb..bb........",
    "....................","....................","....................",
  ]),{r:"#9A62E0",w:"#FFFFFF",c:"#653CA0",a:"#F2E8CC",b:"#C9B896",e:"#1B1424",m:"#8A3B3B",f:"#C8FF6A"});

  add("pet","p_fee","Fée des sources","Spring fairy",34,2100,pet([
    "....................","....................",
    "...n.......n........",
    "..nnn.....nnn.......",
    "..nonn.hh.nnon......",
    "...nonhhhhnon.......",
    "....nnhsshnn........",
    ".....nhsehn.........",
    "......sssss.........",
    ".....ggggggg........",
    "....g.gggg.g........",
    "......gggg..........",
    ".....ggggggg........",
    "......s...s.........",
    ".......p.......p....",
    "...p..........p.....",
    "....................","....................","....................","....................",
  ]),{n:"#C8F4FF",o:"#7FD8FF",h:"#FFE04A",s:"#FFE0C8",e:"#2E6ED8",g:"#49E0B0",p:"#B8FFFF"},{noOutline:false});

  add("pet","p_dragonneau","Dragonneau","Baby dragon",38,2800,pet([
    "....................","....................",
    "......aa............",
    "....a.aaa...........",
    "...aaaaaa.....nn....",
    "..aeaaaaa....nnnn...",
    "ooaaaaaaa...nnonnn..",
    "..aaaaaaaa.nnoonnn..",
    "...cccaaaaannonnn...",
    "....ccaaaaaaaaaa....",
    ".....aaaaaaaaaaaa...",
    ".....aaccccaaaaaaa..",
    ".....acccccaaaaaaaa.",
    "......cccaaaa....aa.",
    "......aa...aa.....a.",
    ".....ddd..ddd.......",
    "....................","....................","....................","....................",
  ]),{a:"#4FB04E",c:"#E8D27A",n:"#FF8A6A",o:"#C8242A",d:"#2A4A20",e:"#FFE04A"});

  add("pet","p_licorne","Licorne","Unicorn",43,3800,pet([
    "..y.................",
    "...y................",
    "....y...............",
    "....ww..............",
    "...wwwwr............",
    "..wewwwro...........",
    "nwwwwwwog...........",
    "...wwwwwgb..........",
    "....wwwwwwwwwwwwr...",
    "....wwwwwwwwwwwwwo..",
    "....wwwwwwwwwwwww.g.",
    ".....wwcwwwwwwwww.b.",
    ".....ww.ww..ww.ww...",
    ".....ww.ww..ww.ww...",
    ".....dd.dd..dd.dd...",
    "....................","....................","....................","....................","....................",
  ]),{w:"#FFFFFF",c:"#D8DEE8",y:"#FFE04A",r:"#FF6A8A",o:"#FFB03C",g:"#5AD06A",b:"#4C8CFF",d:"#B8A0E0",e:"#7A4AD0",n:"#F2A0B8"});

  add("pet","p_phenix","Phénix","Phoenix",50,7000,pet([
    "........y...........",
    ".......yo...........",
    "......ooo...........",
    ".....oaaoo..........",
    "....aeaaaa..........",
    "..yyaaaaaa..........",
    ".....aaaaaa.........",
    "....raaaaaaa........",
    "...rraaaaaaaa.......",
    "..rrooaaaaaaaaoo....",
    ".rrooyaaaaaaaaooyy..",
    "rroyy..aaaaaaa.yyoy.",
    ".ry.....aaaaaa..yoy.",
    ".........oo.ooyy.oyy",
    ".........o...yoo..y.",
    "............yoyo....",
    "...........yo..y....",
    "....................","....................","....................",
  ]),{a:"#FF6A3C",o:"#FFA03C",y:"#FFE04A",r:"#C8242A",e:"#1B1424"});

  window.PX_ITEMS=(window.PX_ITEMS||[]).concat(L);
})();
