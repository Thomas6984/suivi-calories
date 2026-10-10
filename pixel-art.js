/* Suivi calories v55 · La Quête du Royaume : sprites pixel, objets légendaires et effets animés.
   Dessins originaux. Généré à partir de px-core.js, px-hero.js, px-items-a.js, px-items-b.js, px-items-d.js, px-items-e.js, px-items-f.js, px-items-c.js, px-fx.js. */
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
  // Une seule couche du héros, à sa place exacte (sert de masque aux effets d'élément)
  PX.heroLayer=function(look, eq, slot){
    const [c,ctx]=PX.canvas(PX.W, PX.H), it=eq[slot]; if(!it) return c;
    if(slot==="weapon"){
      const a=it.art, w=Math.max(...a.rows.map(r=>r.length)), g=a.grip||[2, a.rows.length-3];
      PX.drawArt(ctx, a, it.pal, 12-(w-1-g[0]), 31-g[1], true);
    } else PX.drawArt(ctx, it.art, slot==="head" ? Object.assign({}, lookPal(look||{}), it.pal) : it.pal);
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

/* v55 · Armes légendaires : feu, glace, spectre, plasma, foudre, océan, dragon, néant.
   Dessinées par champs de distance : chaque pixel connaît sa position le long de la lame (u)
   et son écart à l'axe (v), ce qui donne des ombrages nets et des formes travaillées. */
(function(){
  "use strict";
  const P=window.PX_P;
  const L=[];
  function add(slot,id,fr,en,lvl,price,art,pal,more){ L.push(Object.assign({slot,id,n:[fr,en],lvl,price,art,pal},more||{})); }
  function grid(w,h){ return Array.from({length:h},()=>Array(w).fill(".")); }
  function put(g,x,y,c){ x=Math.round(x); y=Math.round(y); if(y>=0&&y<g.length&&x>=0&&x<g[0].length) g[y][x]=c; }
  function outline(g){
    const h=g.length,w=g[0].length, o=g.map(r=>r.slice());
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){ if(g[y][x]!==".") continue;
      if((y>0&&g[y-1][x]!==".")||(y<h-1&&g[y+1][x]!==".")||(x>0&&g[y][x-1]!==".")||(x<w-1&&g[y][x+1]!==".")) o[y][x]="k"; }
    return o.map(r=>r.join(""));
  }
  function art(w,h,draw,grip){ const g=grid(w,h); draw(g); return {rows:outline(g), grip}; }
  // segment épais : u ∈ [0,1] le long de l'axe, v écart signé (v<0 : côté éclairé, en haut à gauche)
  function seg(g,x0,y0,x1,y1,wf,cf){
    const dx=x1-x0, dy=y1-y0, Ln=Math.hypot(dx,dy), ux=dx/Ln, uy=dy/Ln;
    for(let y=0;y<g.length;y++) for(let x=0;x<g[0].length;x++){
      const px=x-x0, py=y-y0, u=(px*ux+py*uy)/Ln; if(u<-.04||u>1.04) continue;
      const v=px*(-uy)+py*ux, w=wf(Math.max(0,Math.min(1,u))); if(w<=0||Math.abs(v)>w) continue;
      const c=cf(Math.max(0,Math.min(1,u)),v,w,x,y); if(c) g[y][x]=c; }
  }
  function disc(g,cx,cy,r,c){ for(let y=-r;y<=r;y++) for(let x=-r;x<=r;x++) if(x*x+y*y<=r*r+r*0.8) put(g,cx+x,cy+y,c); }
  function bez(g,p0,p1,p2,w,cf){
    for(let i=0;i<=80;i++){ const t=i/80, u=1-t, x=u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0], y=u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1];
      const ww=typeof w==="function"?w(t):w; for(let yy=Math.floor(y-ww);yy<=Math.ceil(y+ww);yy++) for(let xx=Math.floor(x-ww);xx<=Math.ceil(x+ww);xx++){
        if(Math.hypot(xx-x,yy-y)<=ww+.15){ const c=cf(t,xx,yy); if(c) put(g,xx,yy,c); } } }
  }
  const stripes=(n,a,b)=>(u)=>((u*n)|0)%2?a:b;

  /* =========================== ARMES =========================== */
  // Épée des flammes éternelles : lame ondulée en fusion, garde d'obsidienne à cornes
  add("weapon","w_flamme","Épée des flammes éternelles","Blade of eternal flames",22,950,art(20,20,g=>{
    seg(g,6,13,18,1,u=>u>.8?(1-u)/.2*1.8+.25:1.75+.6*Math.sin(u*16+.6),(u,v,w)=>{ const r=Math.abs(v)/w;
      if(r<.3) return u>.85?"a":"n"; if(v<0) return r>.72?"b":"a"; return r>.7?"d":"c"; });
    seg(g,3,10,9,16,u=>.95-.25*Math.abs(u-.5),(u,v)=>v<-.2?"f":"g");
    put(g,2,9,"i"); put(g,2,8,"i"); put(g,1,7,"j"); put(g,10,17,"i"); put(g,11,17,"i"); put(g,12,16,"j");
    put(g,6,13,"o"); put(g,5,12,"o"); put(g,7,14,"o");
    seg(g,5,14,2,17,()=>.75,stripes(5,"f","g"));
    disc(g,1,18,1,"j"); put(g,1,18,"o");
  },[3,16]),P(["#FFE08A","#FFB040","#E0501E","#8A1E12"],["#B07A5A","#5A4038","#3A2A2A","#1E1418"],{n:"#FFFBE0",o:"#FF4A2A"}),{fx:"fire",lore:["Forgée dans le cœur d'un volcan, sa lame ne refroidit jamais.","Forged in a volcano's heart, its blade never cools."]});

  // Lame de givre de Niflheim : cristal facetté, garde en stalactites
  add("weapon","w_givre","Lame de givre de Niflheim","Niflheim frost blade",27,1300,art(20,20,g=>{
    seg(g,6,13,18,1,u=>u>.7?(1-u)/.3*2.1+.2:2.1-((u*9)%1>.55?.55:0),(u,v,w)=>{ const r=Math.abs(v)/w;
      if(Math.abs(v)<.45) return "n"; if(v<0) return r>.7?"b":"a"; return r>.7?"d":"c"; });
    seg(g,3,10,9,16,()=>.8,(u,v)=>v<0?"b":"c");
    [[2,8],[1,7],[3,8],[10,16],[11,15],[11,17]].forEach(([x,y],i)=>put(g,x,y,i%3===1?"a":"b"));
    put(g,6,13,"o");
    seg(g,5,14,2,17,()=>.75,stripes(5,"f","g"));
    put(g,1,18,"b"); put(g,1,17,"a"); put(g,2,18,"c");
  },[3,16]),P(["#FFFFFF","#C8EEFF","#82C4E8","#3E6E9A"],["#4A6EA8","#2A4270","#1A2A4A","#0E1830"],{n:"#E6FAFF",o:"#49E0F0"}),{fx:"ice",lore:["Taillée dans la glace du monde d'en bas, elle gèle l'air qu'elle tranche.","Cut from the ice of the underworld, it freezes the air it cuts."]});

  // Glaive spectral : hampe d'os, crâne, lame courbe translucide
  add("weapon","w_spectre","Glaive spectral","Spectral glaive",32,1800,art(20,20,g=>{
    seg(g,1,19,11,9,()=>.7,stripes(7,"f","g"));
    bez(g,[11,9],[13,1],[19,1],t=>1.6*(1-t)+.35,(t,x,y)=>{ const d=(x-12)+(y-9); return d<-6?"a":d<-3?"b":"c"; });
    seg(g,10,8,19,1,u=>.3,()=>"d");
    disc(g,10,10,1,"n"); put(g,9,10,"k"); put(g,10,9,"m"); put(g,11,11,"o");
    put(g,6,14,"o"); put(g,4,16,"o");
  },[3,17]),P(["#E0FFF6","#7AF5D0","#3EC2A0","#1E6A68"],["#8A6EE0","#5A3EA8","#3A2470","#1E1240"],{n:"#F0F0E0",m:"#B8B4A0",o:"#7AF5D0"}),{fx:"spectral",lore:["Les âmes qu'elle libère montent en volutes vers la lune.","The souls it frees rise in wisps toward the moon."]});

  // Sabre à plasma : poignée chromée, faisceau d'énergie
  add("weapon","w_plasma","Sabre à plasma","Plasma saber",36,2500,art(20,20,g=>{
    seg(g,7,12,18,1,u=>u>.92?(1-u)/.08*1.35+.3:1.35,(u,v,w)=>{ const r=Math.abs(v)/w; return r<.35?"n":r<.75?"a":"b"; });
    seg(g,2,17,6,13,()=>1.15,(u,v)=>v<-.35?"f":v<.35?"g":"i");
    seg(g,5,11,9,15,()=>.7,(u,v)=>v<0?"f":"i");
    put(g,3,16,"o"); put(g,4,15,"p"); put(g,5,14,"o"); put(g,1,18,"j"); put(g,2,18,"i");
  },[3,16]),P(["#A8FFF0","#49E0F0","#1F9DB8","#0E4E5E"],["#F4F7FB","#B4BECB","#6A7486","#3A4252"],{n:"#FFFFFF",o:"#49E0F0",p:"#FF4AD8"}),{fx:"tech",lore:["Arme des chevaliers des étoiles : un faisceau tenu par un champ magnétique.","Weapon of the star knights: a beam held by a magnetic field."]});

  // Marteau du tonnerre : manche gainé, tête d'acier céleste, rune d'éclair
  add("weapon","w_foudre","Marteau du tonnerre","Thunder hammer",41,3300,art(20,20,g=>{
    seg(g,2,18,11,9,()=>.75,stripes(6,"f","g"));
    seg(g,9,2,17,10,u=>2.9-(u<.12||u>.88?.8:0),(u,v,w)=>{ const r=v/w; if(u<.14||u>.86) return "i"; return r<-.55?"a":r<.15?"b":r<.6?"c":"d"; });
    [[11,5],[12,6],[13,6],[13,7],[14,8]].forEach(([x,y])=>put(g,x,y,"n"));
    put(g,12,4,"o"); put(g,15,7,"o");
    disc(g,1,19,1,"i"); put(g,10,10,"i"); put(g,9,11,"i");
  },[4,16]),P(["#E6F2FF","#8FA6D8","#4A5E98","#232E58"],["#6E4A2E","#4A2E1A","#D9A420","#7A5A0E"],{n:"#FFF6A0",o:"#FFFFFF"}),{fx:"storm",lore:["Chaque coup appelle un éclair du ciel.","Every strike calls lightning from the sky."]});

  // Trident de Poséidon : or marin, pointes barbelées, perle des abysses
  add("weapon","w_poseidon","Trident de Poséidon","Poseidon's trident",46,4500,art(20,20,g=>{
    seg(g,1,19,12,8,()=>.7,(u,v)=>v<0?"a":"c");
    seg(g,9,5,15,11,()=>.85,(u,v)=>v<0?"a":"b");
    seg(g,12,8,19,1,u=>u>.75?(1-u)/.25*.95+.2:.75,(u,v)=>v<0?"a":"b");
    seg(g,9,5,13,1,u=>u>.6?(1-u)/.4*.8+.15:.7,(u,v)=>v<0?"a":"c");
    seg(g,15,11,19,7,u=>u>.6?(1-u)/.4*.8+.15:.7,(u,v)=>v<0?"b":"c");
    put(g,11,3,"b"); put(g,17,9,"c"); put(g,16,4,"b");
    disc(g,12,8,1,"n"); put(g,12,8,"o"); put(g,11,7,"w");
    [[5,15],[7,13]].forEach(([x,y])=>put(g,x,y,"n"));
  },[4,16]),P(["#FFF3B0","#F2C14E","#C98A1E","#7A4E12"],null,{n:"#2FCFBE",o:"#A8FFF0"}),{fx:"water",lore:["Il soulève les vagues et fend les récifs.","It raises the waves and splits the reefs."]});

  // Lame du Dragon-Soleil (mythique) : lame large or et sang, garde en ailes de dragon
  add("weapon","w_dragon","Lame du Dragon-Soleil","Sun Dragon blade",50,9000,art(20,20,g=>{
    seg(g,6,13,18,1,u=>u>.78?(1-u)/.22*2.3+.25:2.3,(u,v,w,x,y)=>{ const r=v/w;
      if(Math.abs(v)<.5) return ((x+y)%3===0)?"o":"n"; return r<-.6?"a":r<0?"b":r<.6?"c":"d"; });
    bez(g,[6,13],[1,11],[1,6],t=>.85-t*.5,(t)=>t<.5?"c":"d");
    bez(g,[6,13],[8,18],[13,18],t=>.85-t*.5,(t)=>t<.5?"c":"d");
    put(g,1,5,"f"); put(g,14,18,"f");
    disc(g,6,13,1,"g"); put(g,6,13,"e"); put(g,5,12,"f");
    seg(g,5,14,2,17,()=>.75,stripes(5,"g","i"));
    disc(g,1,18,1,"g"); put(g,1,18,"e");
  },[3,16]),P(["#FFF3B0","#F2C14E","#C8242A","#6A0E14"],["#FFF3B0","#C98A1E","#7A4E12","#3A2408"],{n:"#FF8A3C",o:"#FFE08A",e:"#FF2A3A"}),{fx:"fire",lore:["Le dernier dragon solaire a scellé son souffle dans cette lame.","The last sun dragon sealed its breath inside this blade."]});

  // Faucheuse d'étoiles (mythique) : lame de néant constellée, hampe d'argent
  add("weapon","w_neant","Faucheuse d'étoiles","Star reaper",50,12000,art(20,20,g=>{
    seg(g,1,19,13,7,()=>.7,(u,v)=>v<0?"f":"i");
    bez(g,[13,7],[11,0],[2,2],t=>1.9*(1-t)+.3,(t,x,y)=>{ const h=(x*7+y*13)%11; return h===0?"n":h===5?"o":(y<3?"b":"c"); });
    bez(g,[13,7],[11,1],[3,2],()=>.35,()=>"a");
    disc(g,13,7,1,"g"); put(g,13,7,"o"); put(g,12,6,"n");
    [[7,13],[9,11]].forEach(([x,y])=>put(g,x,y,"o"));
  },[4,16]),P(["#FF9AF0","#3A1E6A","#1E0E3E","#0E0620"],["#F4F7FB","#C6D0DC","#7D8898","#3A4252"],{n:"#FFFFFF",o:"#B58CFF"}),{fx:"cosmic",lore:["Sa lame est un morceau de ciel nocturne ; elle moissonne les étoiles mortes.","Its blade is a shard of night sky; it reaps dead stars."]});

  window.PX_ITEMS=(window.PX_ITEMS||[]).concat(L);
  window.PX_ART={grid,put,outline,art,seg,disc,bez,stripes};
})();

/* v55 · Familiers légendaires : créatures mythologiques et machines des étoiles. Généré par pets/gen.py. */
(function(){
  "use strict";
  const A=window.PX_ART, L=[];
  function pet(rows){ return {rows:A.outline(rows.map(r=>r.split("")))}; }
  L.push({slot:"pet",id:"p_dragon",n:["Dragon ancestral", "Ancestral dragon"],lvl:50,price:10000,art:pet([
    ".............................",
    "................a........c...",
    "................acaaaaaoo....",
    "...........nnn..ccccggggi....",
    "..........nn...ccggcccgg.....",
    "........mnm....ccggggcccc....",
    ".......mnm.....ccggggggiccc..",
    ".aaaaddbbaa....ccggggiiiiicc.",
    ".dbbbdebbbbd...cggggiiiiii...",
    ".abbbbbbbbbba..cgggiiiiii.c..",
    ".cbbbbbbbbbbdaocgiiiiiigg.c..",
    ".dwdwddbcbbbbbbciiigi..iiccc.",
    ".w.ccccc.fbbbbdbiiii.........",
    ".........ffbbbbbbbb.......aa.",
    "..........ffbbbbbbbaa.....ab.",
    "..........affbbbbbbbba....ab.",
    ".........cbbffbbbbbbbbd..abc.",
    "..........ffjffffffbbbbadac..",
    "..........jfffjfjfjbbbbbab...",
    "..........abfffffffbbccbbc...",
    "..........abb.....abb..cc....",
    "..........ccc.....ccc........",
    "..........ccc....cccc........",
    "..........w.w.....w.w........",
    "............................."]),pal:{"a": "#FF8A6A", "b": "#C8242A", "c": "#7A1018", "d": "#3E0810", "f": "#FFE08A", "j": "#E0A82A", "g": "#FF9A3C", "i": "#D8501E", "o": "#FFC870", "e": "#FFE04A", "n": "#F6EED8", "m": "#B8A888", "w": "#FFFFFF"},fx:"fire",lore:["Le premier dragon du royaume. Il couve encore le feu du monde.", "The realm's first dragon. It still broods over the world's fire."]});
  L.push({slot:"pet",id:"p_drone",n:["Drone éclaireur", "Scout drone"],lvl:26,price:1250,art:pet([
    ".......................",
    "..............r........",
    "..............d........",
    ".gggggg.......d.gggggg.",
    "....c........d.....c...",
    ".....c....aaad....c....",
    ".....c..aabbbbaa..c....",
    "......cabnnbbbbbac.....",
    "..ccccabwoonbbddbcccc..",
    "..caccabopoobbbbbcacc..",
    "..cccccbnoonbbpbbcccc..",
    "..cocc.cbnnbbbbbcccoc..",
    "........ccbbbdddd......",
    ".........ddddd.........",
    ".......................",
    "...........oo..........",
    "...........p...........",
    "......................."]),pal:{"a": "#F4F7FB", "b": "#C6D0DC", "c": "#8D99AA", "d": "#525C6E", "g": "#6A7486", "n": "#1B2236", "o": "#49E0F0", "p": "#A8FFF0", "r": "#FF4A6A", "w": "#FFFFFF"},fx:"tech",lore:["Il cartographie le royaume depuis le ciel et ne dort jamais.", "It maps the realm from the sky and never sleeps."]});
  L.push({slot:"pet",id:"p_kitsune",n:["Kitsune à neuf queues", "Nine-tailed kitsune"],lvl:31,price:1800,art:pet([
    "..............................",
    ".....................ww.......",
    ".....a.............fwww.......",
    ".....a...a........fgww..www...",
    ".....ra.rb........fggi.fwww...",
    ".....rb.ar.......fgggffgww....",
    ".....ababb.......fggfgwwwi....",
    "....abbrrb.......fgfffwww.www.",
    "...abdebbr......fggfggwfffwww.",
    ".cdbbbbbbb......fgfgggfgggww..",
    "..cccccbbb......fgfgffggggi...",
    ".......cbba.a...ifgfgggggi....",
    "........abrabaaabffggggii.....",
    ".......abbbrbbbbbbifffffffwww.",
    ".......abbbbbbbbbbigggggggwww.",
    ".......cbbbcbbbbbcciigggggii..",
    "........abccbccbbcc..iiiii....",
    "........ab.cc..abcc...........",
    "........ab.c...abcc...........",
    "........cc.....cc.............",
    "........cc.....cc.............",
    ".............................."]),pal:{"a": "#FFFFFF", "b": "#E8F4F8", "c": "#A8C8D8", "d": "#3A4A6A", "f": "#A8FFE8", "g": "#7AF5D0", "i": "#3EC2A0", "r": "#FF4A6A", "e": "#FFE04A", "w": "#FFFFFF"},fx:"spectral",lore:["Esprit renard du folklore japonais : chaque queue est un siècle de sagesse.", "Fox spirit of Japanese folklore: each tail is a century of wisdom."]});
  L.push({slot:"pet",id:"p_griffon",n:["Griffon royal", "Royal griffin"],lvl:37,price:2600,art:pet([
    "............................",
    "................ggwg.ii.....",
    "..............iffgiiiiw.....",
    "..............iffiii.gggwg..",
    ".........mm...igfggggggg....",
    "......nnnnm...iffggg...iiiw.",
    ".....nddnnnm.fffgiiiiiiiiii.",
    "..yyynennnn..iffiii.........",
    ".yyyynnnnnn..ifgggggggggggw.",
    "..oyymnnnnnn.iffiiiii.......",
    "..do..mnnnnnnigiiiiiiiiiw...",
    ".......mnnnnnifggggggg...dd.",
    "........mnnnnniiiiiggw...dd.",
    ".........mnnnnnabbw.....c...",
    "..........mnnnnnbbbaaa.c....",
    "..........nmnnnnbbbbbba.....",
    "..........annnnnbbbbbbb.....",
    "..........yynnnbbbbbbbbc....",
    "..........yybobccbbbbbb.....",
    "..........yycocccbcbbbc.....",
    "..........yy.o.ccc.abb......",
    "...............cc..ccc......",
    ".........d.dd.d.............",
    "............................"]),pal:{"a": "#F2D8A0", "b": "#D9A860", "c": "#A8743A", "d": "#5E3E1A", "f": "#FFF3C8", "g": "#E8C060", "i": "#B8862E", "n": "#FFFFFF", "m": "#D0D6E4", "y": "#FFD04A", "o": "#C98A1E", "e": "#1B1424", "w": "#FFFFFF"},fx:"holy",lore:["Moitié aigle, moitié lion : il garde les trésors des dieux.", "Half eagle, half lion: it guards the treasures of the gods."]});
  L.push({slot:"pet",id:"p_wyverne",n:["Wyverne de givre", "Frost wyvern"],lvl:41,price:3400,art:pet([
    ".............................",
    "................a........c...",
    "................acaaaaaoo....",
    "...........nnn..ccccggggi....",
    "..........nn...ccggcccgg.....",
    "........mnmn...ccggggcccc....",
    ".......mnm.n...ccggggggiccc..",
    ".aaaaddbbaan.n.ccggggiiiiicc.",
    ".dbbbdebbbbd.n.cggggiiiiii...",
    ".abbbbbbbbbban.cgggiiiiii.c..",
    ".cbbbbbbbbbbdaocgiiiiiigg.c..",
    ".dwdwddbcbbbbbbciiigi..iiccc.",
    ".w.ccccc.fbbbbdbiiii.........",
    ".........ffbbbbobbb...n...aa.",
    "..........ffbbbbnbbaa.n...ab.",
    "..........affnbbbbbbban..nab.",
    ".........cbbffbbbbbbbbd..nbc.",
    "..........ffjffffffbbbbadac..",
    "..........jfffjfjfjbbbbbab...",
    "............fffffffbbccbbc...",
    "..................abb..cc....",
    "..................ccc........",
    ".................cccc........",
    "..................w.w........",
    "............................."]),pal:{"a": "#FFFFFF", "b": "#9ADFFF", "c": "#4A90C8", "d": "#1E4A7A", "f": "#E6FAFF", "j": "#B8E4F8", "g": "#C8EEFF", "i": "#82C4E8", "o": "#FFFFFF", "e": "#49E0F0", "n": "#FFFFFF", "m": "#C8EEFF", "w": "#FFFFFF"},fx:"ice",lore:["Ses ailes soufflent le blizzard des cimes.", "Its wings blow the blizzard of the peaks."]});
  L.push({slot:"pet",id:"p_cerbere",n:["Cerbère", "Cerberus"],lvl:45,price:4200,art:pet([
    "...............................",
    ".............d.................",
    ".............o.................",
    ".......d.....ad.............p..",
    "......ao...aabd............opo.",
    "......adaaebebbd............o..",
    "....aabbdbbbbbbd...........oo..",
    ".aaaeebbbdwdbbbgg..........oo..",
    ".dbbbbbbbd..dbngd..p.p....ao...",
    ".rwrwdbbdgad.dbbdpoooo...abc...",
    "......dgobbbd.dbooaa..o.abc....",
    ".......addbbbadabdbbaaaabc.....",
    ".....aabbdddbbddddbbbbbbb......",
    "..aaaeebbbaaaadbbbbbbbbbba.....",
    "..dbbbbbbbbbbbdbbbbbbbbbbb.....",
    "..rwrwdbbbgddddbbbbbbbbbbc.....",
    ".......dgnd.abbbbbbbbbbbb......",
    "............abbbbbccbbbbb......",
    "............abbbbb..abbbb......",
    "............abbbbb..abbbb......",
    "............cccccc..ccccc......",
    "............d.d.d...d.d.dd.....",
    "..............................."]),pal:{"a": "#7A7690", "b": "#4A4658", "c": "#2E2A3A", "d": "#141020", "e": "#FF4A2A", "r": "#8A1E1E", "o": "#FF8A3C", "p": "#FFE08A", "g": "#C98A1E", "n": "#E8ECF2", "w": "#FFFFFF"},fx:"fire",lore:["Le chien à trois têtes qui garde les portes des Enfers.", "The three-headed hound guarding the gates of the Underworld."]});
  L.push({slot:"pet",id:"p_pegase",n:["Pégase", "Pegasus"],lvl:48,price:4800,art:pet([
    "..............................",
    "................nnng..mm......",
    ".......a......nnnnmmmmgm......",
    ".......a......mnnmmmm.nnnng...",
    ".......af.....mnmnnnnnnnnn....",
    "....aaabpf....mnnnnnn...mmmm..",
    "...abebbbfp...mnnmmmmmmmmmmg..",
    ".cabbbbbbgf..nnnmmmm..........",
    "..dccccbbbfp.nnnnnnnnnnnnng...",
    ".......abbgf.mnmmmm.....nnn...",
    ".......cbbbfpmnnmmmmmmmmg.....",
    "........abb.fmnnnnnnn..m......",
    "........cbbaabbbbbbbba........",
    ".........abbbbbbbbbbbbaf......",
    ".........abbbbbbbbbbbbbff.....",
    ".........cbbbbbbbbbbbbbfff....",
    "..........abbbbbbbbbbbc.fffff.",
    "..........acbbccccbccb........",
    "..........a.ab....a..a........",
    "..........a.ab....a..a........",
    "..........a.ab....a..a........",
    ".........ab.ab....aa.a........",
    ".........yy.yy....yy.yy.......",
    ".............................."]),pal:{"a": "#FFFFFF", "b": "#EEF0F8", "c": "#C2C8DC", "d": "#5A6080", "f": "#8A6EE0", "g": "#B58CFF", "p": "#FFD0EE", "n": "#FFFFFF", "m": "#C8DCFF", "y": "#F2C14E", "e": "#2A1E6A"},fx:"cosmic",lore:["Le cheval ailé devenu constellation.", "The winged horse that became a constellation."]});
  L.push({slot:"pet",id:"p_mecha",n:["Dragon cybernétique", "Cyber dragon"],lvl:50,price:12000,art:pet([
    ".............................",
    "................a........c...",
    "................acaaaaaoo....",
    "...........nnn..ccccggggi....",
    "..........nn...ccggcccgg.....",
    "........mnm....ccggggcccc....",
    ".......mnm.....ccggggggiccc..",
    ".aaaaddbbaa....ccggggiiiiicc.",
    ".dbbbdebbbbd...cggggiiiiii...",
    ".abobbbbobbba..cgggiiiiii.c..",
    ".cbbbbbbbbbbdaocgiiiiiigg.c..",
    ".dwdwddbcbbbbbbciiigi..iiccc.",
    ".w.ccccc.fbbbbdbiiii.........",
    ".........ffbbbbdbbb.......aa.",
    "..........ffobbdbobaa.....ab.",
    "..........affdddddddba....ab.",
    ".........cbbffbdbbbbbbd..abc.",
    "..........ffjffffffobbbadac..",
    "..........jofojojojbbbbbab...",
    "..........abfffffffbbccbbc...",
    "..........abb.....abb..cc....",
    "..........ccc.....ccc........",
    "..........ccc....cccc........",
    "..........w.w.....w.w........",
    "............................."]),pal:{"a": "#F4F7FB", "b": "#A8B4C4", "c": "#6A7486", "d": "#2A3040", "f": "#3A4252", "j": "#525C6E", "g": "#49E0F0", "i": "#1F9DB8", "o": "#A8FFF0", "e": "#FF4AD8", "n": "#49E0F0", "m": "#1F9DB8", "w": "#FFFFFF"},fx:"tech",lore:["Forgé dans une station orbitale, il crache du plasma.", "Forged on an orbital station, it breathes plasma."]});
  window.PX_ITEMS=(window.PX_ITEMS||[]).concat(L);
})();

/* v55 · Équipement légendaire : casques, plastrons, jambières, bottes élémentaires. Moitiés gauches (sym). */
(function(){
  "use strict";
  const M=window.PX_M, P=window.PX_P, L=[];
  function add(slot,id,fr,en,lvl,price,art,pal,more){ L.push(Object.assign({slot,id,n:[fr,en],lvl,price,art,pal},more||{})); }

  /* =========================== CASQUES =========================== */
  add("head","h_salamandre","Heaume de la salamandre","Salamander helm",23,1000,{sym:true,oy:0,rows:[
    "...........p",
    "..........pp",
    "....p.....po",
    "....po...poo",
    ".....op..pon",
    ".....onkkonn",
    "......kabonn",
    ".....kabbbnc",
    "....kabbcbbb",
    "...kabbbbbcb",
    "...kbbcbbbbb",
    "..kbbbbbedbb",
    "..kbcbbbbcbb",
    "..kgggfggggg",
    "..kbbk......",
    "..kbbk......",
    "..kbcbk.....",
    "..kbbbk.....",
    "...kbbk.....",
    "...kbk......",
    "....k.......",
  ]},P(M.drag,M.gold,{p:"#FFE08A",o:"#FF8A3C",n:"#D8301A",e:"#FFE04A",d:"#1B1424",f:"#FF3A2A"}),{hair:"hide",fx:"fire",lore:["La salamandre vit dans le feu sans jamais brûler.","The salamander lives in fire and never burns."]});

  add("head","h_givre","Couronne de givre","Frost crown",28,1400,{sym:true,oy:0,rows:[
    "...........a",
    "..........ab",
    ".......a..ab",
    ".......ab.ab",
    "....a..ab.bc",
    "....ab.abcbc",
    "....abcabcbc",
    "...kbbbbbbbb",
    "...kcnccnccn",
    "...kdddddddd",
  ]},P(M.ice,null,{n:"#49E0F0"}),{hair:"show",clip:10,fx:"ice",lore:["Ses pointes de glace ne fondent jamais, même au soleil d'été.","Its ice spikes never melt, even in summer sun."]});

  add("head","h_liche","Capuche du roi-liche","Lich king's hood",33,1900,{sym:true,oy:2,rows:[
    "......p..p.p",
    "......f..f.f",
    ".....kffkfgf",
    "....kbbbbbbb",
    "...kabbbbbbb",
    "..kabbbbbbbb",
    "..kabbbbbbbb",
    ".kabbbbbbbbb",
    ".kabbbcccccc",
    ".kabbcdddddd",
    ".kabbcdddddd",
    ".kabbcdoodd.",
    ".kabbcdddddd",
    ".kabbcdddddd",
    ".kabbbcddddd",
    "..kabbbcdddd",
    "..kabbbbcccc",
    "...kabbbbbbb",
    "...kabbbbbbb",
    "....kkkkkkkk",
  ].map(r=>r.replace(/\.$/,"d"))},P(["#7A68B0","#3A2E5E","#241A40","#0A0614"],["#C8CCD8","#8A90A4"],{g:"#7AF5D0",o:"#A8FFE8",p:"#E8ECF2"}),{hair:"hide",fx:"spectral",lore:["Sous la capuche, seuls brillent deux yeux d'outre-tombe.","Under the hood, only two eyes from beyond the grave shine."]});

  add("head","h_pilote","Casque de pilote stellaire","Star pilot helmet",38,2700,{sym:true,oy:4,rows:[
    "..r....kkkkk",
    "..g..kkaaaab",
    "..g.kaaabbbb",
    "..gkaabbbbbb",
    "...kabbbbbbb",
    "..kabbbbbbbb",
    "..kabbbbbbbb",
    "..kabbbbnnnn",
    "..kabbkooooo",
    "..kabkoppooo",
    "..kabkoopooo",
    "..kabkoooooo",
    "..kabkoooooo",
    "..kabbkooooo",
    "..kcbbbkkkkk",
    "..kcbbbbbbbb",
    "...kccbbbbbb",
    "....kkkccccc",
    ".......kkkkk",
  ]},P(M.white,null,{n:"#49E0F0",o:"#1F9DB8",p:"#C8FFFF",g:"#8D99AA",r:"#FF4A6A"}),{hair:"hide",fx:"tech",lore:["Visière anti-rayonnement, radio intégrée, réserve d'oxygène : prêt pour le vide.","Radiation visor, built-in radio, oxygen supply: ready for the void."]});

  add("head","h_anubis","Masque d'Anubis","Mask of Anubis",44,3800,{sym:true,oy:0,rows:[
    ".....k......",
    ".....kk.....",
    ".....kgk....",
    ".....kggk...",
    ".....kgbk...",
    ".....kgbbk..",
    ".....kbbbkkk",
    "....kbbbbbbb",
    "...kfgfgbbbb",
    "..kfgfgbbbbb",
    "..kgfgbbbbbb",
    ".kfgfkbeebbb",
    ".kgfgkbbddbb",
    ".kfgfkbbbbbb",
    ".kgfgkbbbbcb",
    ".kfgfkbbbbbc",
    ".kgfgkbbbbcc",
    ".kfgfkkbbbcc",
    ".kgfgk.kbbcc",
    ".kfgfk..kbcn",
    ".kgfgk...kkk",
    ".kfgfk......",
    "..kkk.......",
  ]},P(M.black,["#5E8CFF","#F2C14E"],{e:"#FFE04A",d:"#F2C14E",n:"#121018"}),{hair:"hide",fx:"shadow",lore:["Le dieu à tête de chacal pèse les cœurs aux portes de l'au-delà.","The jackal-headed god weighs hearts at the gates of the afterlife."]});

  add("head","h_phenix","Couronne du phénix","Phoenix crown",50,9000,{sym:true,oy:0,rows:[
    "...........p",
    "o.........po",
    "on........po",
    "pon.......on",
    ".pon..a..pon",
    ".pnoa.ba.onn",
    "..pnbabbabnn",
    "...kbbrbbrbb",
    "...kcbbbbbbb",
    "...kdddddddd",
  ]},P(M.gold,null,{p:"#FFE08A",o:"#FF8A3C",n:"#D8301A",r:"#FF2A4A"}),{hair:"show",clip:10,fx:"fire",lore:["Le phénix renaît de ses cendres : celui qui la porte se relève toujours.","The phoenix rises from its ashes: whoever wears it always gets back up."]});

  /* =========================== PLASTRONS =========================== */
  add("chest","c_magma","Cuirasse de magma","Magma cuirass",23,1000,{sym:true,oy:22,rows:[
    ".n..n.....",
    ".kbnbkkkkk",
    "kbbbibkbbb",
    "kbibbbkbib",
    "kbcicbkbbi",
    ".kkkkkkibg",
    ".kbikcbbig",
    ".kkkkcbibg",
    "....kbbbii",
    "....kjjjjo",
    "....kbibbb",
    "....kbbcib",
    "....kkkkkk",
  ]},{b:"#3A3248",c:"#241E30",i:"#FF8A3C",g:"#FFE08A",n:"#FF5A1E",j:"#120E18",o:"#FF3A2A"},{gloves:{s:"#3A3248",S:"#241E30"},fx:"fire",lore:["Des plaques d'obsidienne soudées par la lave encore vive.","Obsidian plates welded by still-living lava."]});

  add("chest","c_givre","Armure de givre éternel","Everfrost armour",28,1400,{sym:true,oy:22,rows:[
    ".a..a.....",
    ".kabakkkkk",
    "kaabbbkabb",
    "kabbbckabb",
    "kbcccckbbn",
    ".kkkkkkbnf",
    ".kabkcbbbn",
    ".kkkkcbbbc",
    "....kcbbcc",
    "....kdddnd",
    "....kbbcbb",
    "....kbcbbc",
    "....kkkkkk",
  ]},P(M.ice,null,{n:"#FFFFFF",f:"#49E0F0"}),{gloves:{s:"#C8EEFF",S:"#82C4E8"},fx:"ice",lore:["Un flocon de cristal bat en son centre comme un cœur.","A crystal snowflake beats at its centre like a heart."]});

  add("chest","c_spectre","Linceul spectral","Spectral shroud",33,1900,{sym:true,oy:23,rows:[
    ".kkkkkkkkk",
    ".kabkfbbgb",
    ".kabkabbbg",
    ".kabkabbgb",
    ".kbbkabbbb",
    ".kbckbbgbb",
    ".kfkkbbbbg",
    "..f.kbgbbb",
    "....knnnnn",
    "....kbbgbb",
    "....kbbbbg",
    "....kbgbkb",
    "....kf.kbf",
    ".....k..kk",
  ]},{a:"#7AF5D0",b:"#2E8A7E",c:"#1E5A58",g:"#A8FFE8",f:"#6A4EC0",n:"#F0F0E0"},{gloves:{s:"#E0F0EC",S:"#A8C8C0"},fx:"spectral",lore:["Tissé avec la brume des cimetières, il flotte sans vent.","Woven from graveyard mist, it floats without wind."]});

  add("chest","c_exo","Exo-armure à plasma","Plasma exo-armour",38,2700,{sym:true,oy:22,rows:[
    "..kkkk....",
    ".kaabbkkkk",
    "kabbbbkaab",
    "kbobbbkabo",
    "kbcccbkbon",
    ".kkkkkkbnp",
    ".kaokcbbon",
    ".kkkkcbbbo",
    "....kcdddd",
    "....kdoood",
    "....kabbbb",
    "....kbcbcd",
    "....kkkkkk",
  ]},P(M.white,null,{o:"#49E0F0",n:"#A8FFF0",p:"#FFFFFF"}),{gloves:{s:"#8D99AA",S:"#525C6E"},fx:"tech",lore:["Un cœur à fusion alimente chaque mouvement.","A fusion core powers every move."]});

  add("chest","c_egide","Égide d'Athéna","Aegis of Athena",44,3800,{sym:true,oy:22,rows:[
    "..kkkk....",
    ".kaabbkkkk",
    "kabbbbkaab",
    "kbbbcbkabb",
    "kbcccbkbgg",
    ".kkkkkkbgn",
    ".kffkcbgnr",
    ".kkkkcbbgn",
    "....kccccc",
    "....kdddod",
    "....kfffff",
    "....kfifif",
    "....kkkkkk",
  ]},P(M.gold,null,{f:"#FFFFFF",i:"#C8CCD8",g:"#3EA850",n:"#F0E6C8",r:"#C8242A",o:"#2C5AD8"}),{gloves:{s:"#F2C14E",S:"#C98A1E"},fx:"holy",lore:["Le bouclier-cuirasse de la déesse, orné du visage de Méduse.","The goddess's shield-breastplate, bearing Medusa's face."]});

  add("chest","c_neant","Armure du néant stellaire","Starvoid armour",50,10000,{sym:true,oy:21,rows:[
    ".o..o.....",
    ".kokkk....",
    "kabbbbkkkk",
    "kbnbbbkbbn",
    "kbbcbnkbbb",
    "kbcccbkbfb",
    ".kkkkkkfgb",
    ".kbnkcbgfn",
    ".kkkkcbbgf",
    "....kbnbbg",
    "....kooooo",
    "....kbbnbb",
    "....kbbbnb",
    "....kkkkkk",
  ]},{a:"#6A4AB0",b:"#1E0E3E",c:"#120828",n:"#FFFFFF",f:"#F07CC8",g:"#8A5AE0",o:"#B58CFF"},{gloves:{s:"#2A1A50",S:"#1E0E3E"},fx:"cosmic",lore:["On y voit tourner des galaxies entières.","Whole galaxies can be seen turning inside it."]});

  /* =========================== JAMBES =========================== */
  add("legs","l_spectre","Jambières spectrales","Spectral leggings",31,1750,{sym:true,oy:33,rows:[
    "kbbbgc","kbgbbc","kbbbbg","kgbbbc","kbbgbc","kfbfbc","kfbfbf",
  ]},{b:"#2E8A7E",c:"#1E5A58",g:"#A8FFE8",f:"#6A4EC0"},{fx:"spectral"});
  add("legs","l_exo","Jambières cybernétiques","Cybernetic leggings",39,2900,{sym:true,oy:33,rows:[
    "kabbbc","kaoobc","kabbbc","kcdddc","kabbbc","kaobbc","kddddd",
  ]},P(M.white,null,{o:"#49E0F0"}),{fx:"tech"});
  add("legs","l_olympe","Jambières de l'Olympe","Olympian greaves",47,4600,{sym:true,oy:33,rows:[
    "kfffff","kfigif","kabbbc","kabgbc","kabbbc","kabnbc","kbbbcc",
  ]},P(M.gold,null,{f:"#FFFFFF",i:"#C8CCD8",g:"#58B04E",n:"#FFFFFF"}),{fx:"holy"});
  add("legs","l_neant","Grèves du néant","Void greaves",50,8000,{sym:true,oy:33,rows:[
    "kbbnbo","kbfbbo","kgbbno","kbbgbo","knbbfo","kbgbbo","kbbbno",
  ]},{b:"#1E0E3E",n:"#FFFFFF",f:"#F07CC8",g:"#8A5AE0",o:"#B58CFF"},{fx:"cosmic"});

  /* =========================== BOTTES =========================== */
  add("feet","b_givre","Bottes de givre","Frost boots",27,1300,{sym:true,oy:37,rows:[
    "..a.a..",".kabbak","kabbbck","kabnbck","kbbbbck","kdcdcdk",
  ]},P(M.ice,null,{n:"#49E0F0"}),{fx:"ice"});
  add("feet","b_spectre","Bottes du marcheur spectral","Spectral walker boots",32,1850,{sym:true,oy:38,rows:[
    "kbbbbck","kbgbbck","kbbbgck","kbbbbck","kfgfgfk","f.g.f..",
  ]},{b:"#2E8A7E",c:"#1E5A58",g:"#A8FFE8",f:"#6A4EC0"},{fx:"spectral"});
  add("feet","b_antigrav","Bottes antigravité","Antigravity boots",39,2900,{sym:true,oy:38,rows:[
    "kaabbck","kaoobck","kabbbck","kdddddk",".ooooo.",".p.p.p.",
  ]},P(M.white,null,{o:"#49E0F0",p:"#A8FFF0"}),{fx:"tech"});
  add("feet","b_comete","Bottes de comète","Comet boots",50,8000,{sym:true,oy:37,rows:[
    "n.kabbk","onkbbbk",".okbnbk","..kbbbk","..kgggk",".popop.",
  ]},{a:"#6A4AB0",b:"#1E0E3E",n:"#FFFFFF",g:"#8A5AE0",o:"#B58CFF",p:"#F07CC8"},{fx:"cosmic"});

  window.PX_ITEMS=(window.PX_ITEMS||[]).concat(L);
})();

/* Éléments des objets existants : chaque objet épique ou plus porte un effet. */
(function(){
  "use strict";
  const FXE={h_mage:"cosmic",h_druide:"nature",h_orage:"storm",h_corail:"water",h_ombre:"shadow",h_aube:"holy",h_cosmos:"cosmic",
    c_champignon:"nature",c_ecailles:"nature",c_obsidienne:"fire",c_cristal:"ice",c_solaire:"holy",c_dragon:"fire",
    l_ecorce:"nature",l_os:"spectral",l_tempete:"storm",l_lave:"fire",l_givre:"ice",l_aurore:"cosmic",l_titan:"holy",
    b_racines:"nature",b_braise:"fire",b_ailees:"holy",b_foudre:"storm",b_corail:"water",b_nuages:"holy",
    w_feuille:"nature",w_espadon:"water",w_trident:"water",w_cle:"tech",w_faux:"spectral",w_haltere:"holy",w_temps:"cosmic",
    p_follet:"spectral",p_champi:"nature",p_fee:"nature",p_dragonneau:"fire",p_licorne:"holy",p_phenix:"fire"};
  (window.PX_ITEMS||[]).forEach(i=>{ if(FXE[i.id]) i.fx=FXE[i.id]; });
})();

/* ============================================================
   Effets pixel : auras de rareté, rayons, éclats, particules élémentaires.
   Tout est dessiné en pixels logiques (même taille que les pixels des sprites),
   puis agrandi sans lissage par le CSS (image-rendering: pixelated).
   Une seule boucle d'animation (14 images/s) anime toutes les toiles visibles.
   ============================================================ */
(function(){
  "use strict";
  const PX=window.PX; if(!PX) return;
  const FPS=14, MAXP=160;
  const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+0.5)/16);
  const R=Math.random, rnd=(a,b)=>a+R()*(b-a), pick=a=>a[(R()*a.length)|0];
  const RANK={commun:0,rare:1,epique:2,legendaire:3,mythique:4};
  const RCOL={rare:["#FFFFFF","#BFE0FF","#5EA7FF","#2C5AA8"],epique:["#FFFFFF","#E2C8FF","#B58CFF","#6A3EC0"],
    legendaire:["#FFFFFF","#FFE9A0","#F2C14E","#C98A1E"],mythique:["#FFFFFF","#FFB0D8","#FF5A6E","#8A2A6E"]};
  // teinte « mythique » : va-et-vient violet → magenta → rouge → orange → or (jamais de vert)
  const hue=(f,o)=>{ const t=((f*6+(o||0))%280+280)%280; return "hsl("+((290+(t<140?t:280-t))%360)+",100%,66%)"; };
  const isOutline=(d,i)=>d[i+3]>20 && d[i]<40 && d[i+1]<34 && d[i+2]<48;   // contour sombre (#1B1424, #070A1C…)

  // ---------- calque de pixels en mémoire ----------
  // Les effets écrivent des milliers de pixels par image : on les compose dans un tableau
  // (fusion alpha « par-dessus ») au lieu d'appeler le canvas pixel par pixel.
  const COLC=new Map();
  function rgbOf(s){
    let v=COLC.get(s); if(v) return v;
    if(s[0]==="#") v=[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
    else { const m=/hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/.exec(s)||[0,0,0,100];
      const h=+m[1]/360, sa=+m[2]/100, l=+m[3]/100, q=l<.5?l*(1+sa):l+sa-l*sa, p=2*l-q;
      const f=t=>{ t=(t+1)%1; return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p; };
      v=[Math.round(f(h+1/3)*255),Math.round(f(h)*255),Math.round(f(h-1/3)*255)]; }
    if(COLC.size>4000) COLC.clear(); COLC.set(s,v); return v;
  }
  function PCtx(W,H){ this.W=W; this.H=H; this.d=new Float32Array(W*H*4); this.fillStyle="#000000"; this.globalAlpha=1; this._fs=null; this._c=null; }
  PCtx.prototype.clear=function(){ this.d.fill(0); };
  PCtx.prototype.fillRect=function(x,y,w,h){
    const a=this.globalAlpha; if(!(a>0)) return; if(this.fillStyle!==this._fs){ this._fs=this.fillStyle; this._c=rgbOf(this._fs); }
    const c=this._c, W=this.W, H=this.H, d=this.d; x=Math.floor(x); y=Math.floor(y);
    const x1=Math.min(W,x+w), y1=Math.min(H,y+h); if(x<0) x=0; if(y<0) y=0;
    for(let yy=y;yy<y1;yy++) for(let xx=x;xx<x1;xx++){ const i=(yy*W+xx)*4, da=d[i+3];
      if(a>=1||da<=0){ d[i]=c[0]; d[i+1]=c[1]; d[i+2]=c[2]; d[i+3]=a>=1?1:a; continue; }
      const na=a+da*(1-a), k=da*(1-a); d[i]=(c[0]*a+d[i]*k)/na; d[i+1]=(c[1]*a+d[i+1]*k)/na; d[i+2]=(c[2]*a+d[i+2]*k)/na; d[i+3]=na; }
  };
  // géométrie mise en cache : pixels d'un disque, avec distance et angle au centre
  function geo(fx,cx,cy,rad){
    const key=cx+","+cy+","+rad; fx._geo=fx._geo||{}; let g=fx._geo[key]; if(g) return g;
    const xs=[],ys=[],ds=[],as=[];
    for(let y=Math.max(0,Math.floor(cy-rad));y<=Math.min(fx.H-1,Math.ceil(cy+rad));y++) for(let x=Math.max(0,Math.floor(cx-rad));x<=Math.min(fx.W-1,Math.ceil(cx+rad));x++){
      const dx=x+.5-cx, dy=y+.5-cy, d=Math.hypot(dx,dy)/rad; if(d>=1) continue; xs.push(x); ys.push(y); ds.push(d); as.push(Math.atan2(dy,dx)); }
    g={xs,ys,ds,as}; fx._geo[key]=g; return g;
  }

  // ---------- primitives ----------
  function dot(c,x,y,col,a){ x=Math.round(x); y=Math.round(y); c.globalAlpha=a==null?1:a; c.fillStyle=col; c.fillRect(x,y,1,1); }
  function plus(c,x,y,r,core,arm,a){ x=Math.round(x); y=Math.round(y); c.globalAlpha=a==null?1:a; c.fillStyle=arm;
    for(let k=1;k<=r;k++){ c.fillRect(x+k,y,1,1); c.fillRect(x-k,y,1,1); c.fillRect(x,y+k,1,1); c.fillRect(x,y-k,1,1); }
    if(r>=2){ c.fillRect(x+1,y+1,1,1); c.fillRect(x-1,y-1,1,1); c.fillRect(x+1,y-1,1,1); c.fillRect(x-1,y+1,1,1); }
    c.fillStyle=core; c.fillRect(x,y,1,1); }
  // halo tramé : plus dense au centre, en motif de Bayer (pas de flou)
  function glow(fx,c,cx,cy,rad,col,str,a){
    const g=geo(fx,cx,cy,rad); c.fillStyle=col;
    for(let k=0;k<g.xs.length;k++){ const x=g.xs[k], y=g.ys[k], v=(1-g.ds[k])*str; const lv=v>.62?3:v>.38?2:v>.16?1:((x+y)&1)&&v>.06?.5:0; if(!lv) continue;
      c.globalAlpha=Math.min(1,a*lv/2); c.fillRect(x,y,1,1); }
  }
  const LUTS={}; function lut(sh){ if(LUTS[sh]) return LUTS[sh]; const t=new Float32Array(256); for(let i=0;i<256;i++) t[i]=Math.pow(.5+.5*Math.cos(i/256*Math.PI*2),sh); return LUTS[sh]=t; }
  // rayons tournants tramés
  function rays(fx,c,cx,cy,rad,n,rot,col,a,sharp){
    const g=geo(fx,cx,cy,rad); c.fillStyle=col; sharp=sharp||6; const T=lut(sharp), K=256/(Math.PI*2);
    for(let k=0;k<g.xs.length;k++){ const d=g.ds[k]; if(d<.15) continue; const x=g.xs[k], y=g.ys[k];
      const v=T[((n*(g.as[k]-rot)*K)%256+256)&255]*(1.15-d);
      const lv=v>.55?2:v>.3?1:(v>.14&&((x+y)&1))?.6:0; if(!lv) continue; c.globalAlpha=a*lv/2; c.fillRect(x,y,1,1); }
  }
  function ringAt(fx,c,cx,cy,r,col,a){ c.globalAlpha=a; c.fillStyle=col; const n=Math.max(8,Math.round(r*7));
    let lx=-99,ly=-99; for(let i=0;i<n;i++){ const t=i/n*Math.PI*2, x=Math.round(cx+Math.cos(t)*r), y=Math.round(cy+Math.sin(t)*r*.8); if(x===lx&&y===ly) continue; lx=x; ly=y; c.fillRect(x,y,1,1); } }

  // ---------- éléments ----------
  const FIRE=["#FFFBE0","#FFE08A","#FFB040","#FF6A1E","#D8301A","#7A1410"];
  const ramp=(cols,t)=>cols[Math.min(cols.length-1,Math.floor(t*cols.length))];
  function spawnN(rate){ let n=Math.floor(rate); if(R()<rate-n) n++; return n; }
  function P(fx,o){ if(fx.parts.length>=MAXP) return; fx.parts.push(Object.assign({vx:0,vy:0,age:0,life:10,kind:"dot",layer:"front",ph:R()*6.28},o)); }
  const EL={
    fire:{n:["Feu","Fire"],glow:"#FF6A1E",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#FF5A1A",.55+.2*Math.sin(fx.f*.9),.32); },
      spawn(fx,s){ for(let k=spawnN(2.4*s.I);k--;){ const p=(s.top.length&&R()<.65)?pick(s.top):pick(s.pts); if(!p) return;
        P(fx,{x:p.x+rnd(-.4,.4),y:p.y+fx.by-.6,vx:rnd(-.1,.1),vy:-rnd(.35,.85),life:(rnd(5,12))|0,kind:"fire"}); } },
      front(fx,s,c){ for(const p of s.top){ if(R()<.4){ dot(c,p.x,p.y-1+fx.by,R()<.5?"#FFE08A":"#FFB040",1); if(R()<.35) dot(c,p.x,p.y-2+fx.by,"#FF6A1E",1); } } }
    },
    ice:{n:["Glace","Ice"],glow:"#9ADFFF",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#9ADFFF",.5,.3); },
      spawn(fx,s){ if(R()<.55*s.I){ const b=s.bb; P(fx,{x:rnd(b[0]-4,b[2]+4),y:rnd(b[1]-5,b[1]+2),vy:rnd(.12,.26),life:(rnd(16,30))|0,kind:R()<.4?"flake":"dot",cols:["#FFFFFF","#E6F8FF","#C8EEFF","#82C4E8"],
          upd(p){ p.vx=Math.sin(p.age*.25+p.ph)*.16; }}); } },
      front(fx,s,c){ for(let k=0;k<2;k++) if(R()<.55){ const p=pick(s.edge); if(p) dot(c,p.x,p.y+fx.by,"#FFFFFF",1); }
        if(R()<.06*s.I){ const p=pick(s.edge); if(p) P(fx,{x:p.x,y:p.y+fx.by,life:7,kind:"twinkle",cols:["#FFFFFF","#C8EEFF"]}); } }
    },
    spectral:{n:["Spectral","Spectral"],glow:"#7AF5D0",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#3EC2A0",.45,.28);
        const dx=Math.round(Math.sin(fx.f*.32)*1.6), dy=Math.round(Math.cos(fx.f*.21)*1.2)-1; c.globalAlpha=.32; c.fillStyle="#7AF5D0";
        for(const p of s.pts){ if(BAYER[((p.y&3)*4)+(p.x&3)]<.7) c.fillRect(p.x+dx,p.y+dy+fx.by,1,1); } },
      spawn(fx,s){ for(let k=spawnN(1.0*s.I);k--;){ const p=pick(s.pts); if(!p) return;
        P(fx,{x:p.x,y:p.y+fx.by,x0:p.x,vy:-rnd(.15,.35),life:(rnd(14,26))|0,kind:"wisp",cols:["#F0FFFA","#A8FFE8","#7AF5D0","#3EC2A0","#8A6EE0","#5A3EA8"],
          upd(q){ q.x=q.x0+Math.sin(q.age*.4+q.ph)*1.3; }}); } },
    },
    storm:{n:["Foudre","Storm"],glow:"#7FC8FF",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#5EA7FF",(fx.bolts.length?.9:.45),.3); },
      spawn(fx,s){
        if(R()<.2*s.I && s.edge.length){ const a=pick(s.edge), ang=R()*6.28, len=rnd(5,10); const pts=[]; let x=a.x, y=a.y+fx.by;
          const tx=x+Math.cos(ang)*len, ty=y+Math.sin(ang)*len, steps=Math.round(len);
          for(let i=0;i<=steps;i++){ const t=i/steps; pts.push([Math.round(x+(tx-x)*t+(i%2?rnd(-1.2,1.2):0)), Math.round(y+(ty-y)*t+(i%2?rnd(-1.2,1.2):0))]); }
          fx.bolts.push({pts,age:0,life:3});
          for(let k=0;k<3;k++) P(fx,{x:tx,y:ty,vx:rnd(-.8,.8),vy:rnd(-.8,.8),life:(rnd(3,6))|0,cols:["#FFFFFF","#FFF6A0","#9AD8FF"]}); }
        if(R()<.4*s.I){ const p=pick(s.edge); if(p) P(fx,{x:p.x,y:p.y+fx.by,vx:rnd(-.6,.6),vy:rnd(-.6,.3),life:(rnd(2,5))|0,cols:["#FFFFFF","#FFF6A0"]}); } }
    },
    cosmic:{n:["Cosmique","Cosmic"],glow:"#B58CFF",
      back(fx,s,c){ const f=fx.f, rad=s.r+5, cx=s.cx, cy=s.cy+fx.by;
        for(let y=Math.max(0,Math.floor(cy-rad));y<Math.min(fx.H,cy+rad);y++) for(let x=Math.max(0,Math.floor(cx-rad));x<Math.min(fx.W,cx+rad);x++){
          const d=Math.hypot(x-cx,y-cy)/rad; if(d>1) continue; const n=Math.sin(x*.55+f*.07)*Math.cos(y*.5-f*.05)+Math.sin((x+y)*.28+f*.04)*(1-d);
          if(n>.55 && BAYER[(y&3)*4+(x&3)]<.6){ c.globalAlpha=.42; c.fillStyle=n>1.05?"#F07CC8":"#6A3EC0"; c.fillRect(x,y,1,1); } }
        for(const st of fx.starsOf(s)){ const v=Math.sin(f*.35+st.ph); if(v>.75) plus(c,st.x,st.y,1,"#FFFFFF","#B58CFF",.9); else if(v>-.2) dot(c,st.x,st.y,v>.3?"#FFFFFF":"#8A7AE0",.9); }
        comets(fx,s,c,false); },
      front(fx,s,c){ comets(fx,s,c,true); },
      spawn(fx,s){ if(R()<.5*s.I){ const p=pick(s.pts); if(p) P(fx,{x:p.x,y:p.y+fx.by,vx:rnd(-.25,.25),vy:rnd(-.3,.1),life:(rnd(10,18))|0,cols:["#FFFFFF","#FFD0EE","#B58CFF","#6A3EC0"]}); } }
    },
    holy:{n:["Sacré","Holy"],glow:"#FFE08A",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#FFE08A",.5,.3);
        const b=s.bb; for(let k=0;k<3;k++){ const x=Math.round(b[0]+(b[2]-b[0])*(.2+.3*k)+Math.sin(fx.f*.05+k*2)*2), v=.5+.5*Math.sin(fx.f*.18+k*2.1);
          c.globalAlpha=.22+.25*v; c.fillStyle="#FFF6C8"; for(let y=0;y<Math.min(fx.H,b[3]+2);y++) if(BAYER[(y&3)*4+(x&3)]<.35+.5*v*(y/(b[3]+2))) c.fillRect(x,y,1,1); } },
      spawn(fx,s){ if(R()<.7*s.I){ const p=pick(s.pts); if(p) P(fx,{x:p.x+rnd(-2,2),y:p.y+fx.by,vy:-rnd(.15,.3),life:(rnd(14,24))|0,cols:["#FFFFFF","#FFF6C8","#FFE08A","#F2C14E"]}); }
        if(R()<.08*s.I){ const p=pick(s.edge); if(p) P(fx,{x:p.x,y:p.y+fx.by,life:8,kind:"twinkle",cols:["#FFFFFF","#FFE08A"]}); } }
    },
    nature:{n:["Nature","Nature"],glow:"#7FE07A",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#58B04E",.45,.28); },
      spawn(fx,s){ if(R()<.35*s.I){ const b=s.bb; const col=pick([["#A8E68A","#58B04E"],["#58B04E","#347A38"],["#FFE04A","#D9A420"]]);
          P(fx,{x:rnd(b[0]-2,b[2]+2),y:rnd(b[1]-3,b[1]+3),vy:rnd(.12,.24),life:(rnd(18,30))|0,kind:"leaf",col,upd(p){ p.vx=Math.sin(p.age*.3+p.ph)*.22; }}); }
        if(R()<.45*s.I){ const p=pick(s.pts); if(p) P(fx,{x:p.x,y:p.y+fx.by,vy:-rnd(.12,.25),vx:rnd(-.1,.1),life:(rnd(10,18))|0,cols:["#FFFFFF","#FFF6A0","#E6FF9A","#9AE03A"]}); } }
    },
    tech:{n:["Techno","Tech"],glow:"#49E0F0",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#1F9DB8",.55,.32); },
      front(fx,s,c){ const b=s.bb, h=b[3]-b[1]+8, row=b[1]-4+(fx.f*.8%h|0);
        for(const p of s.pts){ const y=p.y; if(y===row) dot(c,p.x,y+fx.by,"#C8FFFF",.8); else if(y===row-1) dot(c,p.x,y+fx.by,"#49E0F0",.45); }
        if(fx.glitch>0){ fx.glitch--; const r0=fx.gRow; for(const p of s.pts){ if(p.y>=r0&&p.y<r0+3){ dot(c,p.x+1,p.y+fx.by,"#FF4AD8",.55); dot(c,p.x-1,p.y+fx.by,"#49E0F0",.55); } } }
        else if(R()<.05){ fx.glitch=2; fx.gRow=Math.round(rnd(b[1],b[3])); } },
      spawn(fx,s){ for(let k=spawnN(.8*s.I);k--;){ const p=pick(s.pts); if(!p) return; P(fx,{x:p.x+rnd(-1,1),y:p.y+fx.by,vy:-rnd(.2,.45),life:(rnd(8,16))|0,kind:"bit",cols:["#FFFFFF","#A8FFF0","#49E0F0","#1F9DB8"]}); } }
    },
    water:{n:["Eau","Water"],glow:"#5EC8F0",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+4,"#2A7AC0",.55,.32); const f=fx.f, rad=s.r+4;
        c.globalAlpha=.3; c.fillStyle="#8FD8FF";
        for(let y=Math.max(0,Math.floor(s.cy-rad));y<Math.min(fx.H,s.cy+rad);y++) for(let x=Math.max(0,Math.floor(s.cx-rad));x<Math.min(fx.W,s.cx+rad);x++){
          if(Math.hypot(x-s.cx,y-s.cy)>rad) continue; if(Math.sin(x*.9+f*.22)+Math.sin(y*.8-f*.17+x*.3)>1.45) c.fillRect(x,y+fx.by,1,1); } },
      spawn(fx,s){ if(R()<.5*s.I){ const p=pick(s.pts); if(p) P(fx,{x:p.x,y:p.y+fx.by,vy:-rnd(.15,.32),life:(rnd(14,24))|0,kind:R()<.45?"bubble":"dot",cols:["#FFFFFF","#C8F4FF","#5EC8F0","#2A7AC0"],upd(q){ q.vx=Math.sin(q.age*.35+q.ph)*.15; }}); }
        if(R()<.18*s.I){ const p=pick(s.pts); if(p) P(fx,{x:p.x,y:p.y+fx.by,vy:rnd(.3,.5),life:(rnd(6,10))|0,cols:["#C8F4FF","#5EC8F0"]}); } }
    },
    shadow:{n:["Ombre","Shadow"],glow:"#6A3EC0",
      back(fx,s,c){ glow(fx,c,s.cx,s.cy+fx.by,s.r+5,"#6A3EC0",.5,.3); glow(fx,c,s.cx,s.cy+fx.by,s.r+2,"#0A0414",.6,.45); },
      spawn(fx,s){ for(let k=spawnN(.8*s.I);k--;){ const p=pick(s.pts); if(!p) return; P(fx,{x:p.x,y:p.y+fx.by,vx:rnd(-.12,.12),vy:-rnd(.12,.3),life:(rnd(12,22))|0,kind:"smoke",cols:["#7A52B8","#4A2E7A","#2E1A50","#180C2C"]}); }
        if(R()<.025*s.I){ const b=s.bb; P(fx,{x:rnd(b[0]-3,b[2]+1),y:rnd(b[1],b[3]),life:7,kind:"eyes",cols:["#FF3A4A"]}); } }
    }
  };
  function comets(fx,s,c,front){
    for(let k=0;k<2;k++){ const dir=k?1:-1, rx=s.r+3, ry=(s.r+3)*.45;
      for(let t=4;t>=0;t--){ const a=fx.f*.16*dir+k*Math.PI-t*.12*dir, sn=Math.sin(a); if((sn>0)!==front) continue;
        const x=s.cx+Math.cos(a)*rx, y=s.cy+fx.by+sn*ry; dot(c,x,y,t===0?"#FFFFFF":t===1?"#FFE08A":t<3?"#F07CC8":"#6A3EC0",t===0?1:.9-t*.15); } }
  }

  // ---------- 3D : voxels pixelisés ----------
  // Chaque pixel du sprite devient une colonne de voxels ; l'épaisseur grandit vers l'intérieur de la forme
  // (bords fins, cœur épais : un volume arrondi). Rendu par tampon de profondeur dans une petite image (2 px par voxel),
  // agrandie sans lissage : la 3D garde son grain pixel.
  const LIGHT=(()=>{ const v=[-0.45,-0.62,0.64], n=Math.hypot(v[0],v[1],v[2]); return v.map(x=>x/n); })();
  const AMB=.46, DIF=.62;
  const FACE=[ {n:[0,0,1],e1:[1,0,0],e2:[0,1,0]}, {n:[0,0,-1],e1:[1,0,0],e2:[0,1,0]},
    {n:[-1,0,0],e1:[0,1,0],e2:[0,0,1]}, {n:[1,0,0],e1:[0,1,0],e2:[0,0,1]},
    {n:[0,-1,0],e1:[1,0,0],e2:[0,0,1]}, {n:[0,1,0],e1:[1,0,0],e2:[0,0,1]} ];
  function voxModel(cv, o){
    const w=cv.width, h=cv.height, d=cv.getContext("2d",{willReadFrequently:true}).getImageData(0,0,w,h).data;
    const N=w*h, A=new Uint8Array(N), D=new Float32Array(N), H=new Float32Array(N), C=new Int32Array(N);
    for(let i=0;i<N;i++){ if(d[i*4+3]>200){ A[i]=1; D[i]=1e9; C[i]=(255<<24)|(d[i*4+2]<<16)|(d[i*4+1]<<8)|d[i*4]; } }
    const at=(x,y)=>(x<0||y<0||x>=w||y>=h)?0:D[y*w+x];
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const i=y*w+x; if(A[i]) D[i]=Math.min(D[i],at(x-1,y)+1,at(x,y-1)+1,at(x-1,y-1)+1.4,at(x+1,y-1)+1.4); }
    for(let y=h-1;y>=0;y--) for(let x=w-1;x>=0;x--){ const i=y*w+x; if(A[i]) D[i]=Math.min(D[i],at(x+1,y)+1,at(x,y+1)+1,at(x+1,y+1)+1.4,at(x-1,y+1)+1.4); }
    for(let i=0;i<N;i++) if(A[i]) H[i]=Math.min(o.maxH, o.base+(D[i]-1)*o.k);
    const F=[], hh=(x,y)=>(x<0||y<0||x>=w||y>=h)?0:H[y*w+x];
    const side=(t,x,y,hz,hn,c)=>{ if(hn>=hz) return; if(hn<=0){ F.push(t,x,y,-hz,2*hz,c); return; } F.push(t,x,y,hn,hz-hn,c,t,x,y,-hz,hz-hn,c); };
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const i=y*w+x; if(!A[i]) continue; const hz=H[i], c=C[i];
      F.push(0,x,y,hz,1,c, 1,x,y,-hz,1,c);
      side(2,x,y,hz,hh(x-1,y),c); side(3,x,y,hz,hh(x+1,y),c); side(4,x,y,hz,hh(x,y-1),c); side(5,x,y,hz,hh(x,y+1),c); }
    return {w,h,H,F:new Float64Array(F), cx:o.cx!=null?o.cx:w/2, cy:o.cy!=null?o.cy:h/2};
  }
  function rotV(R3,x,y,z){ const x1=x*R3.cy+z*R3.sy, z1=-x*R3.sy+z*R3.cy; return [x1, y*R3.cp-z1*R3.sp, y*R3.sp+z1*R3.cp]; }
  function voxRender(fx){
    const M=fx.M, R3=fx.R3, Q=fx.Q, W2=fx.W*Q, H2=fx.H*Q, img=fx.img32, zb=fx.zb;
    img.fill(0); zb.fill(-1e9);
    R3.cy=Math.cos(R3.yaw); R3.sy=Math.sin(R3.yaw); R3.cp=Math.cos(R3.pitch); R3.sp=Math.sin(R3.pitch);
    const n0=[0,-R3.sp,R3.cp], ref=AMB+DIF*Math.max(0,n0[0]*LIGHT[0]+n0[1]*LIGHT[1]+n0[2]*LIGHT[2]);
    const vis=[], sh=[], E1=[], E2=[];
    for(let t=0;t<6;t++){ const n=rotV(R3,...FACE[t].n); vis[t]=n[2]>0.03;
      sh[t]=Math.min(1.3,(AMB+DIF*Math.max(0,n[0]*LIGHT[0]+n[1]*LIGHT[1]+n[2]*LIGHT[2]))/ref); E1[t]=rotV(R3,...FACE[t].e1); E2[t]=rotV(R3,...FACE[t].e2); }
    const F=M.F, L=F.length, ccx=M.cx, ccy=M.cy, ox=fx.ox, oy=fx.oy+fx.vb;
    for(let k=0;k<L;k+=6){ const t=F[k]; if(!vis[t]) continue;
      let x=F[k+1], y=F[k+2]; const z=F[k+3], len=t<2?1:F[k+4], col=F[k+5];
      if(t===3) x+=1; else if(t===5) y+=1;
      const p=rotV(R3,x-ccx,y-ccy,z), sx=(ox+ccx+p[0])*Q, sy=(oy+ccy+p[1])*Q, sz=p[2];
      const a=E1[t], b=E2[t], ax=a[0]*Q, ay=a[1]*Q, bx=b[0]*Q*len, byy=b[1]*Q*len, bz=b[2]*len;
      const det=ax*byy-ay*bx; if(det>-1e-3&&det<1e-3) continue;
      const xs=[sx,sx+ax,sx+bx,sx+ax+bx], ys=[sy,sy+ay,sy+byy,sy+ay+byy];
      const x0=Math.max(0,Math.floor(Math.min(xs[0],xs[1],xs[2],xs[3]))), x1=Math.min(W2-1,Math.ceil(Math.max(xs[0],xs[1],xs[2],xs[3])));
      const y0=Math.max(0,Math.floor(Math.min(ys[0],ys[1],ys[2],ys[3]))), y1=Math.min(H2-1,Math.ceil(Math.max(ys[0],ys[1],ys[2],ys[3])));
      const s=sh[t], r=Math.min(255,(col&255)*s)|0, g=Math.min(255,((col>>8)&255)*s)|0, bl=Math.min(255,((col>>16)&255)*s)|0, cc=(255<<24)|(bl<<16)|(g<<8)|r;
      for(let py=y0;py<=y1;py++){ const dy=py+.5-sy; for(let px=x0;px<=x1;px++){ const dx=px+.5-sx;
        const u=(dx*byy-dy*bx)/det; if(u<0||u>=1) continue; const v=(ax*dy-ay*dx)/det; if(v<0||v>=1) continue;
        const zz=sz+u*a[2]+v*bz, i=py*W2+px; if(zz>zb[i]){ zb[i]=zz; img[i]=cc; } } }
    }
  }

  // ---------- instance ----------
  function Fx(o){
    this.cv=o.front; this.ctx=o.front.getContext("2d"); this.bcv=o.back||null; this.bctx=o.back?o.back.getContext("2d"):null;
    this.W=o.W; this.H=o.H; this.f=0; this.parts=[]; this.bolts=[]; this.vis=true; this.by=0; this.vb=0; this.glitch=0;
    this.Q=(o.vox&&o.sprite)?(o.vox.Q||2):1;
    this.cv.width=o.W*this.Q; this.cv.height=o.H*this.Q; if(this.bcv){ this.bcv.width=o.W; this.bcv.height=o.H; }
    this.ctx.imageSmoothingEnabled=false;
    this.sprite=o.sprite||null; this.ox=o.ox||0; this.oy=o.oy||0; this.bob=!!o.bob; this.hero=!!o.hero;
    this.rank=RANK[o.rarity]||0;
    this.sil=new Uint8Array(o.W*o.H); this.inner=[]; this.bb=[1e9,1e9,-1e9,-1e9];
    if(o.silFrom||this.sprite) this.silhouette(o.silFrom||this.sprite, this.ox, this.oy);
    this.rings();
    const b=this.bb; this.cx=(b[0]+b[2]+1)/2; this.cy=(b[1]+b[3]+1)/2; this.rad=Math.max(b[2]-b[0],b[3]-b[1])/2+(o.radPad||6);
    if(this.Q>1){ const v=o.vox;
      this.M=voxModel(this.sprite,{maxH:v.maxH||2,base:v.base!=null?v.base:.5,k:v.k||.6,cx:v.cx,cy:v.cy});
      this.R3={yaw:v.yaw0||0,pitch:v.pitch!=null?v.pitch:-.2}; this.motion=v.motion||null; this.ta=v.phase!=null?v.phase:R()*20; this.drag=0; this.dragging=false;
      const W2=o.W*this.Q, H2=o.H*this.Q; this.fcv=document.createElement("canvas"); this.fcv.width=W2; this.fcv.height=H2; this.fctx=this.fcv.getContext("2d");
      this.imgData=this.fctx.createImageData(W2,H2); this.img32=new Int32Array(this.imgData.data.buffer); this.zb=new Float32Array(W2*H2);
      this.outData=this.ctx.createImageData(W2,H2); this.out32=new Int32Array(this.outData.data.buffer);
      this.bob3=this.bob; this.bob=false; this.pb=new PCtx(o.W,o.H); this.pf=new PCtx(o.W,o.H); }
    this.src=(o.sources||[]).map(s=>this.source(s)).filter(s=>s.pts.length);
    this._stars=null;
  }
  // angle du moment : balancement ou rotation complète, plus ce que le doigt a tourné
  Fx.prototype.angle=function(){
    const m=this.motion; if(!this.dragging) this.ta+=1/FPS;
    let a=0; if(m){ a = m.spin ? this.ta*m.spin : Math.sin(this.ta*(m.speed||.8))*(m.amp||.4);
      if(m.piro){ const u=((this.ta+m.piro*3)%9)/1.8; if(u<1) a+=Math.PI*2*(u<.5?2*u*u:1-2*(1-u)*(1-u)); } }   // pirouette de temps en temps
    this.R3.yaw=a+this.drag;
  };
  // silhouette, intérieur et anneaux recalculés depuis l'image 3D du moment (à la résolution des pixels logiques)
  Fx.prototype.sil3d=function(){
    const W=this.W,H=this.H,Q=this.Q,W2=W*Q,I=this.img32,S=this.sil; S.fill(0); const inner=[], bb=[1e9,1e9,-1e9,-1e9];
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ let any=0, inn=0;
      for(let j=0;j<Q;j++) for(let i=0;i<Q;i++){ const c=I[(y*Q+j)*W2+x*Q+i]; if(c){ any=1; if(((c&255)>=40)||(((c>>8)&255)>=34)||(((c>>16)&255)>=48)) inn=1; } }
      if(any){ S[y*W+x]=1; if(x<bb[0])bb[0]=x; if(y<bb[1])bb[1]=y; if(x>bb[2])bb[2]=x; if(y>bb[3])bb[3]=y; } if(inn) inner.push({x,y}); }
    this.inner=inner; if(bb[2]>=0) this.bb=bb; this.rings();
  };
  // points d'émission : chaque point garde sa place sur la surface avant du volume et suit la rotation
  Fx.prototype.reproj=function(){
    const M=this.M, R3=this.R3, ox=this.ox, oy=this.oy+this.vb;
    for(const s of this.src) for(const arr of [s.pts,s.edge,s.top]) for(const p of arr){
      if(p.mx===undefined) continue; const q=rotV(R3,p.mx-M.cx,p.my-M.cy,p.mz); p.x=Math.round(ox+M.cx+q[0]-.5); p.y=Math.round(oy+M.cy+q[1]-.5); }
  };
  Fx.prototype.silhouette=function(cv,ox,oy){
    const d=cv.getContext("2d",{willReadFrequently:true}).getImageData(0,0,cv.width,cv.height).data, W=this.W, H=this.H;
    for(let y=0;y<cv.height;y++) for(let x=0;x<cv.width;x++){ const i=(y*cv.width+x)*4; if(d[i+3]<=20) continue; const X=x+ox, Y=y+oy; if(X<0||Y<0||X>=W||Y>=H) continue;
      this.sil[Y*W+X]=1; if(!isOutline(d,i)) this.inner.push({x:X,y:Y}); const b=this.bb; if(X<b[0])b[0]=X; if(Y<b[1])b[1]=Y; if(X>b[2])b[2]=X; if(Y>b[3])b[3]=Y; }
    if(this.bb[2]<0) this.bb=[0,0,W-1,H-1];
  };
  Fx.prototype.rings=function(){
    const W=this.W,H=this.H,S=this.sil, r1=new Uint8Array(W*H); this.ring1=[]; this.ring2=[];
    const nb=(x,y,A)=>(x>0&&A[y*W+x-1])||(x<W-1&&A[y*W+x+1])||(y>0&&A[(y-1)*W+x])||(y<H-1&&A[(y+1)*W+x]);
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ if(S[y*W+x]) continue; if(nb(x,y,S)){ r1[y*W+x]=1; this.ring1.push({x,y}); } }
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const i=y*W+x; if(S[i]||r1[i]) continue; if(nb(x,y,r1)) this.ring2.push({x,y}); }
  };
  // source d'effet élémentaire : pixels émetteurs (hors contour), bords, sommets
  Fx.prototype.source=function(s){
    const cv=s.mask||this.sprite, ox=s.mask?(s.ox||0):this.ox, oy=s.mask?(s.oy||0):this.oy;
    const d=cv.getContext("2d",{willReadFrequently:true}).getImageData(0,0,cv.width,cv.height).data, w=cv.width, h=cv.height;
    const op=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&d[(y*w+x)*4+3]>20;
    const pts=[], edge=[], top=[], bb=[1e9,1e9,-1e9,-1e9];
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const i=(y*w+x)*4; if(d[i+3]<=20) continue; const X=x+ox, Y=y+oy;
      if(X<0||Y<0||X>=this.W||Y>=this.H) continue;
      if(X<bb[0])bb[0]=X; if(Y<bb[1])bb[1]=Y; if(X>bb[2])bb[2]=X; if(Y>bb[3])bb[3]=Y;
      const M=this.M, mx=X-this.ox, my=Y-this.oy, mz=(M&&mx>=0&&my>=0&&mx<M.w&&my<M.h)?M.H[my*M.w+mx]:0;
      const pt=(yy)=>M?{x:X,y:yy,mx:mx+.5,my:yy-this.oy+.5,mz:mz}:{x:X,y:yy};
      if(!op(x-1,y)||!op(x+1,y)||!op(x,y-1)||!op(x,y+1)) edge.push(pt(Y));
      if(isOutline(d,i)) continue; pts.push(pt(Y));
      let up=y-1; while(up>=0 && op(x,up) && isOutline(d,(up*w+x)*4)) up--; if(up<0||!op(x,up)) top.push(pt(Y-(y-1-up))); }
    const cx=(bb[0]+bb[2]+1)/2, cy=(bb[1]+bb[3]+1)/2, r=Math.max(bb[2]-bb[0],bb[3]-bb[1])/2;
    return {el:s.el, I:s.I||1, pts, edge, top, bb, cx, cy, r};
  };
  Fx.prototype.starsOf=function(s){
    if(!s._stars){ s._stars=[]; for(let k=0;k<11;k++){ const a=R()*6.28, d=s.r+rnd(1,6); s._stars.push({x:Math.round(s.cx+Math.cos(a)*d), y:Math.round(s.cy+Math.sin(a)*d*.85), ph:R()*6.28}); } }
    return s._stars;
  };
  Fx.prototype.step=function(){
    const f=++this.f;
    if(this.bob) this.by=(Math.floor(f/8)%2)?-1:0;
    if(this.M){ if(this.bob3) this.vb=(Math.floor(f/8)%2)?-1:0; this.angle();
      if(!this.half || (f&1) || this.dragging){ voxRender(this); this.sil3d(); this.reproj(); } }   // tuiles : le volume tourne lentement, une image sur deux suffit
    for(const s of this.src){ const E=EL[s.el]; if(E&&E.spawn) E.spawn(this,s); }
    rarSpawn(this);
    const P=this.parts; for(let i=P.length-1;i>=0;i--){ const p=P[i]; if(++p.age>=p.life){ P.splice(i,1); continue; } if(p.upd) p.upd(p,this); p.x+=p.vx; p.y+=p.vy; if(p.kind==="fire") p.vx+=rnd(-.06,.06); }
    for(let i=this.bolts.length-1;i>=0;i--){ if(++this.bolts[i].age>=this.bolts[i].life) this.bolts.splice(i,1); }
  };
  Fx.prototype.draw=function(){
    if(this.M) return this.draw3d();
    const W=this.W,H=this.H, c=this.ctx, b=this.bctx||c, Q=this.Q;
    c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,W*Q,H*Q); c.setTransform(Q,0,0,Q,0,0);
    if(this.bctx) b.clearRect(0,0,W,H);
    rarBack(this,b);
    for(const s of this.src){ const E=EL[s.el]; if(E&&E.back) E.back(this,s,b); }
    drawParts(this,b,"back");
    if(this.M){ this.fctx.putImageData(this.imgData,0,0); c.save(); c.setTransform(1,0,0,1,0,0); c.globalAlpha=1; c.drawImage(this.fcv,0,0); c.restore(); }
    else if(this.sprite){ c.globalAlpha=1; c.drawImage(this.sprite,this.ox,this.oy+this.by); }
    rarFront(this,c);
    for(const s of this.src){ const E=EL[s.el]; if(E&&E.front) E.front(this,s,c); }
    drawParts(this,c,"front");
    for(const bo of this.bolts){ const a=bo.age; for(const [x,y] of bo.pts){
      const halo=a===0?"#9AD8FF":"#5EA7FF"; c.globalAlpha=a===0?.85:.5; c.fillStyle=halo; c.fillRect(x+1,y,1,1); c.fillRect(x-1,y,1,1); c.fillRect(x,y-1,1,1); c.fillRect(x,y+1,1,1); }
      for(const [x,y] of bo.pts) dot(c,x,y,a===0?"#FFFFFF":a===1?"#CFEFFF":"#5EA7FF",a<2?1:.6); }
    c.globalAlpha=1; if(this.bctx) b.globalAlpha=1;
  };

  // image 3D : aura et effets arrière, volume, effets avant, composés pixel par pixel puis posés d'un coup
  Fx.prototype.draw3d=function(){
    const pb=this.pb, pf=this.pf; pb.clear(); pf.clear();
    rarBack(this,pb); for(const s of this.src){ const E=EL[s.el]; if(E&&E.back) E.back(this,s,pb); } drawParts(this,pb,"back");
    rarFront(this,pf); for(const s of this.src){ const E=EL[s.el]; if(E&&E.front) E.front(this,s,pf); } drawParts(this,pf,"front");
    for(const bo of this.bolts){ const a=bo.age; for(const [x,y] of bo.pts){
      pf.globalAlpha=a===0?.85:.5; pf.fillStyle=a===0?"#9AD8FF":"#5EA7FF"; pf.fillRect(x+1,y,1,1); pf.fillRect(x-1,y,1,1); pf.fillRect(x,y-1,1,1); pf.fillRect(x,y+1,1,1); }
      for(const [x,y] of bo.pts) dot(pf,x,y,a===0?"#FFFFFF":a===1?"#CFEFFF":"#5EA7FF",a<2?1:.6); }
    const W=this.W, H=this.H, Q=this.Q, W2=W*Q, S=this.img32, O=this.out32, B=pb.d, F=pf.d;
    for(let ly=0;ly<H;ly++) for(let lx=0;lx<W;lx++){ const li=(ly*W+lx)*4, fa=F[li+3], ba=B[li+3];
      // fond seul (arrière + avant), calculé une fois par pixel logique
      let bg=0;
      if(ba>0||fa>0){ let r=B[li], g=B[li+1], b=B[li+2], a=ba;
        if(fa>0){ const na=fa+a*(1-fa), k=a*(1-fa); r=(F[li]*fa+r*k)/na; g=(F[li+1]*fa+g*k)/na; b=(F[li+2]*fa+b*k)/na; a=na; }
        bg=((a*255)<<24)|((b&255)<<16)|((g&255)<<8)|(r&255); }
      for(let j=0;j<Q;j++){ let o=(ly*Q+j)*W2+lx*Q; for(let i=0;i<Q;i++,o++){ const sp=S[o];
        if(!sp){ O[o]=bg; continue; }
        if(!(fa>0)){ O[o]=sp; continue; }
        { const k=1-fa; O[o]=(255<<24)|(((F[li+2]*fa+((sp>>16)&255)*k)&255)<<16)|(((F[li+1]*fa+((sp>>8)&255)*k)&255)<<8)|((F[li]*fa+(sp&255)*k)&255); } } } }
    this.ctx.putImageData(this.outData,0,0);
  };

  // ---------- rareté ----------
  function rarSpawn(fx){
    const k=fx.rank; if(!k) return; const C=RCOL[["","rare","epique","legendaire","mythique"][k]];
    const tw=fx.hero?[0,0,0,.08,.12][k]:[0,.07,.11,.16,.22][k]; if(R()<tw){ const p=R()<.5?pick(fx.ring1):pick(fx.inner); if(p) P(fx,{x:p.x,y:p.y+fx.by,life:k>=3?10:8,kind:"twinkle",big:k>=3,cols:k===4?[C[0],"hue"]:[C[0],C[2]]}); }
    if(fx.hero) return;
    if(k>=2 && R()<[0,0,.35,.5,.7][k]){ const b=fx.bb; P(fx,{x:rnd(b[0]-3,b[2]+3),y:b[3]+rnd(0,3),vy:-rnd(.2,.42),life:(rnd(14,24))|0,cols:k===4?["#FFFFFF","hue","hue"]:[C[0],C[1],C[2],C[3]]}); }
    if(k>=3 && R()<.45){ const p=pick(fx.inner); if(p) P(fx,{x:p.x,y:p.y+fx.by,vx:rnd(-.15,.15),vy:-rnd(.25,.5),life:(rnd(8,14))|0,cols:k===4?["#FFFFFF","hue","hue","#8A2A6E"]:["#FFFFFF","#FFE9A0","#F2C14E","#C98A1E"]}); }
  }
  function rarBack(fx,c){
    const k=fx.rank, f=fx.f, pul=.5+.5*Math.sin(f*.22); if(!k) return;
    const cx=fx.cx, cy=fx.cy+fx.by, rad=fx.rad, gm=fx.src.length?.6:1;
    if(k===1){ glow(fx,c,cx,cy,rad,"#5EA7FF",.45+.2*pul,.4*gm); }
    if(fx.hero){ // autour du héros : une aura sobre, le visage reste lisible
      const col=k===4?hue(f,60):"#F2C14E"; glow(fx,c,cx,cy+2,rad+2,col,.55+.15*pul,.22); ringPx(fx,c,fx.ring1,k===4?hue(f,200):"#FFE08A",.3+.2*pul);
      if(k===4) orbit(fx,c,false); return; }
    if(k===2){ glow(fx,c,cx,cy,rad+1,"#B58CFF",.6+.25*pul,.45*gm); ringPx(fx,c,fx.ring1,"#D2B4FF",.3+.4*pul); }
    if(k===3){ rays(fx,c,cx,cy,rad+5,8,f*.045,"#FFE08A",.5); glow(fx,c,cx,cy,rad,"#F2C14E",.7+.25*pul,.45*gm);
      ringPx(fx,c,fx.ring1,"#FFE08A",fx.hero?.35:.55+.45*pul); if(!fx.hero) ringPx(fx,c,fx.ring2,"#C98A1E",.35); }
    if(k===4){ rays(fx,c,cx,cy,rad+7,6,f*.06,hue(f),.5,5); rays(fx,c,cx,cy,rad+4,10,-f*.035,hue(f,140),.35,8);
      glow(fx,c,cx,cy,rad,hue(f,60),.8+.2*pul,.45*gm);
      ringPx(fx,c,fx.ring1,hue(f,200),fx.hero?.5:1); if(!fx.hero) ringPx(fx,c,fx.ring2,hue(f,20),.55);
      const w=f%42; if(w<16) ringAt(fx,c,cx,cy,2+w*rad/12,hue(f,90),1-w/16);
      orbit(fx,c,false); }
  }
  function rarFront(fx,c){
    const k=fx.rank, f=fx.f; if(k<3) return;
    if(fx.hero){ if(k===4) orbit(fx,c,true); return; }
    const per=k===4?30:40, b=fx.bb, lo=b[0]+b[1]-6, hi=b[2]+b[3]+6, s=lo+(f%per)/per*(hi-lo)*1.6;
    if(s<hi) for(const p of fx.inner){ const v=p.x+p.y; if(v===Math.round(s)||v===Math.round(s)+1) dot(c,p.x,p.y+fx.by,"#FFFFFF",.75); else if(v===Math.round(s)+2) dot(c,p.x,p.y+fx.by,"#FFFFFF",.35); }
    if(k===4) orbit(fx,c,true);
  }
  function ringPx(fx,c,ring,col,a){ c.globalAlpha=Math.max(0,Math.min(1,a)); c.fillStyle=col; for(const p of ring) c.fillRect(p.x,p.y+fx.by,1,1); }
  function orbit(fx,c,front){
    const n=fx.hero?5:6, rx=(fx.bb[2]-fx.bb[0])/2+5, ry=Math.max(3,(fx.bb[3]-fx.bb[1])/2*.35);
    for(let k=0;k<n;k++) for(let t=3;t>=0;t--){ const a=fx.f*.13+k*Math.PI*2/n-t*.11, sn=Math.sin(a); if((sn>0)!==front) continue;
      dot(c,fx.cx+Math.cos(a)*rx,fx.cy+fx.by+sn*ry+Math.cos(a*2)*1.2,t===0?"#FFFFFF":hue(fx.f,k*60+t*20),t===0?1:.85-t*.2); }
  }

  // ---------- particules ----------
  function drawParts(fx,c,layer){
    for(const p of fx.parts){ if(p.layer!==layer) continue; const t=p.age/p.life, f=fx.f;
      const col=(cols)=>{ const v=ramp(cols,t); return v==="hue"?hue(f,p.ph*57):v; };
      switch(p.kind){
        case "fire": dot(c,p.x,p.y,ramp(FIRE,t),t>.8?.7:1); break;
        case "flake": if(t<.85) plus(c,p.x,p.y,1,"#FFFFFF",col(p.cols),.9); else dot(c,p.x,p.y,col(p.cols),.6); break;
        case "wisp": if(t>.6 && (p.age&1)) break; dot(c,p.x,p.y,col(p.cols),t>.7?.6:.9); if(t<.4) dot(c,p.x,p.y+1,col(p.cols.slice(2)),.45); break;
        case "bit": if(p.age%3===2) break; dot(c,p.x,p.y,col(p.cols),1); if(p.ph>3) dot(c,p.x+1,p.y,col(p.cols),.7); break;
        case "bubble": { const x=Math.round(p.x),y=Math.round(p.y),cc=col(p.cols); dot(c,x+1,y,cc,.8); dot(c,x-1,y,cc,.8); dot(c,x,y-1,cc,.8); dot(c,x,y+1,cc,.8); dot(c,x-1,y-1,"#FFFFFF",.9); break; }
        case "leaf": { const fl=(p.age>>2)&1; dot(c,p.x,p.y,p.col[0],1); dot(c,p.x+(fl?1:-1),p.y+(fl?0:1),p.col[1],1); break; }
        case "smoke": { const cc=col(p.cols); if(t<.5){ c.globalAlpha=.75; c.fillStyle=cc; c.fillRect(Math.round(p.x),Math.round(p.y),2,2); } else dot(c,p.x,p.y,cc,.6); break; }
        case "eyes": if(p.age%4<3){ dot(c,p.x,p.y,"#FF3A4A",1); dot(c,p.x+2,p.y,"#FF3A4A",1); } break;
        case "twinkle": { const sz=p.big?[0,1,2,2,2,1,1,0,0,0][p.age]||0:[0,1,1,2,1,0,0,0][p.age]||0; const arm=p.cols[1]==="hue"?hue(f,p.ph*57):p.cols[1];
          if(sz===0) dot(c,p.x,p.y,p.cols[0],.9); else plus(c,p.x,p.y,sz,p.cols[0],arm,.95); break; }
        default: dot(c,p.x,p.y,col(p.cols||["#FFFFFF"]),t>.75?.6:1);
      }
    }
    c.globalAlpha=1;
  }

  // ---------- boucle ----------
  const LIVE=new Set(); let raf=0, last=0;
  const reduce=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io=("IntersectionObserver" in window) ? new IntersectionObserver(es=>{ for(const e of es){ const fx=e.target.__fx; if(fx) fx.vis=e.isIntersecting; } },{rootMargin:"60px"}) : null;
  function loop(t){
    raf=requestAnimationFrame(loop); if(document.hidden) return; if(t-last<1000/FPS-2) return; last=t;
    for(const fx of LIVE){ if(!fx.cv.isConnected){ LIVE.delete(fx); if(io) io.unobserve(fx.cv); continue; } if(!fx.vis) continue; fx.step(); fx.draw(); }
    if(!LIVE.size){ cancelAnimationFrame(raf); raf=0; }
  }
  function start(fx){
    if(reduce && fx.M){ fx.motion=null; fx.drag=.45; }   // mouvement réduit : vue de trois quarts, immobile
    for(let i=0;i<24;i++) fx.step();   // l'effet démarre déjà installé
    fx.draw(); fx.cv.__fx=fx;
    const still = reduce || (!fx.rank && !fx.src.length && !fx.bob && !(fx.M && fx.motion));
    if(still) return fx;
    LIVE.add(fx); if(io) io.observe(fx.cv);
    if(!raf) raf=requestAnimationFrame(loop);
    return fx;
  }

  // ---------- API ----------
  // Tuile : sprite centré dans une toile carrée, l'effet tient dans la toile.
  PX.fxTile=function(cv, sprite, rarity, el, opts){
    opts=opts||{}; const sw=sprite.width, sh=sprite.height, rank=RANK[rarity]||0;
    const pad=opts.pad!=null?opts.pad:(rank>=3||el?7:rank?6:5);
    const S=Math.max(opts.min||22, Math.max(sw,sh)+pad*2);
    const ox=Math.floor((S-sw)/2), oy=Math.max(1,Math.floor((S-sh)/2)-(opts.lift||0));
    const vox=opts.vox===false?null:Object.assign({Q:2, maxH:1.6, motion:{amp:[.32,.38,.46,.55,.62][rank], speed:.9, piro:rank>=3?R()+1:0}}, opts.vox||{});
    const fx=new Fx({front:cv, W:S, H:S, sprite, ox, oy, rarity, sources:el?[{el, I:[1,1,1,1.3,1.6][rank]}]:[], bob:!!opts.bob, radPad:opts.radPad, vox});
    fx.half=!opts.bob; return start(fx);
  };
  // Héros en 3D : une seule toile (aura, héros en voxels, particules), marges m autour du sprite.
  PX.fxHero=function(cv, o){
    const m=o.m||6, W=o.sprite.width+2*m, H=o.sprite.height+2*m;
    return start(new Fx({front:cv, W, H, sprite:o.sprite, ox:m, oy:m, hero:true, rarity:o.rarity, radPad:3,
      vox:Object.assign({Q:2, maxH:3, k:.55, motion:{amp:.42, speed:.6}}, o.vox||{}),
      sources:(o.layers||[]).map(l=>({el:l.el, mask:l.mask, ox:m, oy:m, I:l.I||.55}))}));
  };
  // Le doigt fait tourner le volume ; au lâcher, l'objet reprend son mouvement
  PX.fxDrag=function(el, getFx){
    let x0=null; el.style.touchAction="pan-y";
    el.addEventListener("pointerdown",e=>{ const fx=getFx(); if(!fx||!fx.M) return; x0=e.clientX; fx.dragging=true; });
    el.addEventListener("pointermove",e=>{ const fx=getFx(); if(x0==null||!fx) return; fx.drag+=(e.clientX-x0)*.025; x0=e.clientX; if(reduce){ fx.step(); fx.draw(); } });
    const up=()=>{ const fx=getFx(); x0=null; if(fx) fx.dragging=false; };
    el.addEventListener("pointerup",up); el.addEventListener("pointercancel",up); el.addEventListener("pointerleave",up);
  };
  // Surimpression autour d'une image (héros) : toile arrière + toile avant, marges m.
  PX.fxOverlay=function(back, front, o){
    const m=o.m||6, W=o.w+2*m, H=o.h+2*m;
    return start(new Fx({front, back, W, H, ox:m, oy:m, silFrom:o.sil, hero:true, rarity:o.rarity, radPad:3,
      sources:(o.layers||[]).map(l=>({el:l.el, mask:l.mask, ox:m, oy:m, I:l.I||.55}))}));
  };
  PX.FX_EL=EL; PX.fxStopAll=function(){ LIVE.clear(); };
})();
