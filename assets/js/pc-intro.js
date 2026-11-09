/* ==========================================================
   PIXEL CLUB · introducción cinematográfica
   ESCENA 1  Pantalla negra. Los nombres de las cuatro productoras aparecen
             uno por uno, con EXACTAMENTE el mismo tratamiento visual,
             tipográfico, duración y relevancia, en el orden establecido.
             Ningún personaje ni elemento ocupa el centro.
   ESCENA 2  Una rendija de luz en el horizonte se abre y revela una obra
             al amanecer. Una "A" de acero se suelda pieza a pieza mientras
             un camión mezclador cruza en primer plano (misma animación del
             camión de la intro anterior: PX.truck). Al coronarla sale el sol
             por su interior y se forma el logotipo ARQUITECTAS EN OBRA.
   Todo es pixel art procedural (canvas 480x270) + efectos de sonido
   sintetizados; usa musica_ambiental.mp3 como fondo si el sonido está activo.
   ========================================================== */
(function () {
  'use strict';
  var boot = document.getElementById('pcIntroBoot');
  function done() { window.__pcIntroOk = true; if (boot) boot.remove(); }
  if (window.__pcReturning || !window.PX || !window.PX.text5) { done(); return; }

  var W = 480, H = 270, RMo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.createElement('div'); root.id = 'pcIntro'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Introducción: Arquitectas en obra');
  var cv = document.createElement('canvas'); cv.width = W; cv.height = H; root.appendChild(cv);

  /* ---- ESCENA 1: créditos en DOM (tipografía real, no pixelada) ----
     Los cuatro nombres, en el orden indicado. Todos usan la misma clase y el mismo bloque. */
  var NAMES = ['Laury Melissa Alemán Canchila', 'María Lucía Paternina', 'Isamar Valeria Brito Corona', 'Sharol Gineth Hurtado Villarreal'];
  var cred = document.createElement('div'); cred.className = 'pci-credits';
  NAMES.forEach(function (n) {
    var b = document.createElement('div'); b.className = 'pci-cr';
    b.innerHTML = '<span class="pci-k">PRODUCTORA</span><span class="pci-rule"></span><h2 class="pci-nm"></h2>';
    b.querySelector('.pci-nm').textContent = n; cred.appendChild(b);
  });
  var col = document.createElement('div'); col.className = 'pci-cr pci-col';
  col.innerHTML = '<span class="pci-rule"></span><p class="pci-nm pci-sm">Cuatro productoras.<br>Un solo videojuego.</p>'; cred.appendChild(col);
  var dotsEl = document.createElement('div'); dotsEl.className = 'pci-dots'; dotsEl.setAttribute('aria-hidden', 'true');
  NAMES.forEach(function () { dotsEl.appendChild(document.createElement('i')); }); cred.appendChild(dotsEl);
  root.appendChild(cred);

  var gate = document.createElement('button'); gate.type = 'button'; gate.className = 'pci-gate'; gate.setAttribute('aria-label', 'Tocar para comenzar la introducción'); root.appendChild(gate);
  var btns = document.createElement('div'); btns.className = 'pci-btns';
  var skip = document.createElement('button'); skip.type = 'button'; skip.className = 'pci-skip'; skip.textContent = 'OMITIR ▶'; btns.appendChild(skip); root.appendChild(btns);
  var sndHost = document.createElement('div'); sndHost.className = 'pci-snd'; root.appendChild(sndHost);
  document.body.appendChild(root);
  PC.bar({ host: sndHost, noMenu: true, theme: { bg: '#fff8d8', fg: '#20203b', bd: '#fff', sh: '#7954cc', hi: '#ffd35a' } });
  var g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
  var R = PX.r;

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); }, ease = function (p) { return 1 - (1 - p) * (1 - p); }, easeIO = function (p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };
  function mixHex(a, b, t) { var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = function (s) { return Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t); }; return '#' + [16, 8, 0].map(function (s) { var v = m(s).toString(16); return v.length < 2 ? '0' + v : v; }).join(''); }

  /* ---- línea de tiempo (segundos) ---- */
  var CR0 = .7, SLOT = 2.6;                       /* cada nombre: misma duración (SLOT) */
  var T_COL = CR0 + 4 * SLOT + .1;                /* frase colectiva */
  var T2 = T_COL + 2.3;                           /* comienza la escena 2 */
  var U_FOOT = 1.9, U_LEG = 2.9, U_CROSS = 4.6, U_RIV = 5.6, U_CAP = 6.4, U_FLASH = 6.65, U_TITLE = 7.4, U_TRUCK = 2.2, U_END = U_TITLE + 6.2;
  root.style.setProperty('--slot', SLOT + 's');

  /* ---- geometría de la "A" (estructura de acero) ---- */
  var HZ = 134, AX = 240, APX = 52, FY = 150, HB = 44, TH = 10, CY = 120, DEP = 5;
  var legX = function (side, y) { return AX + side * HB * (y - APX) / (FY - APX); };
  function extrude(rows, dep, ol, sd, fr, hi, lo, stripe) {
    var d, i, r;
    if (!rows.length) return;
    for (d = dep; d >= 0; d--) { for (i = 0; i < rows.length; i++) { r = rows[i]; R(g, ol, r[0] + d - 1, r[1] - d, r[2] + 2, 1); } R(g, ol, rows[0][0] + d - 1, rows[0][1] - d - 1, rows[0][2] + 2, 1); }
    for (d = dep; d >= 1; d--) for (i = 0; i < rows.length; i++) { r = rows[i]; R(g, d === dep ? PX.hex(sd, .8) : sd, r[0] + d, r[1] - d, r[2], 1); }
    for (i = 0; i < rows.length; i++) {
      r = rows[i]; R(g, fr, r[0], r[1], r[2], 1); R(g, hi, r[0], r[1], 2, 1); R(g, lo, r[0] + r[2] - 2, r[1], 2, 1);
      if (stripe && (r[1] % 14) < 3) R(g, stripe, r[0] + 2, r[1], r[2] - 4, 1);
    }
    R(g, hi, rows[0][0], rows[0][1], rows[0][2], 1);
  }
  function legRows(side, yTop) { var a = [], y; for (y = Math.ceil(yTop); y <= FY; y++) a.push([Math.round(legX(side, y) - TH / 2), y, TH]); return a; }
  function boxRows(x, y, w, h) { var a = [], j; for (j = 0; j < h; j++) a.push([x, y + j, w]); return a; }

  var parts = [], fired = {}, shake = 0, st = 'gate', muteBefore = -1, jumped = false;
  function spark(x, y, n, cols) { for (var i = 0; i < n; i++) parts.push({ x: x, y: y, vx: (Math.random() - .5) * 90, vy: -Math.random() * 80 - 10, l: .45 + Math.random() * .45, c: cols[i % cols.length] }); }
  function at(t, key, fn) { if (t >= key[0] && !fired[key[1]]) { fired[key[1]] = 1; if (key[0] >= muteBefore) fn(); } }

  var stars = []; for (var si = 0; si < 90; si++) stars.push([(si * 97 % W), (si * 53 % 120) + 6, si * .7]);

  /* ---------------- ESCENA 2 ---------------- */
  function drawWorld(u) {
    var dawn = clamp((u - .8) / 6.4, 0, 1), rise = ease(clamp((u - 1.0) / 2.2, 0, 1)), lift = Math.round(16 * (1 - ease(clamp(u / 3.4, 0, 1)))), i, k;
    g.save(); g.translate(0, lift);
    /* cielo y estrellas */
    PX.vgrad(g, 0, -20, W, HZ + 20, mixHex('#02030c', '#33388a', dawn), mixHex('#070816', '#ff9a5e', dawn), 22);
    if (dawn < .9) stars.forEach(function (s) { var a = (Math.sin(u * 2 + s[2]) + 1) / 2; if (a > .35 * (1 + dawn * 1.4)) R(g, dawn > .5 ? '#cfd3ff' : '#ffffff', s[0], s[1], 1, 1); });
    /* sol que sale por detrás de la A */
    var sunY = HZ + 34 + (108 - HZ - 34) * ease(clamp((u - 1.6) / 5.4, 0, 1)), sr = 21;
    for (k = 3; k >= 1; k--) PX.dith(g, mixHex('#ff9a5e', '#fff0b0', dawn), AX - sr - k * 12, sunY - sr - k * 12, (sr + k * 12) * 2, (sr + k * 12) * 2, .035 * (4 - k) * (.4 + dawn));
    PX.circ(g, mixHex('#ff7a3a', '#ffd9a0', dawn), AX, sunY, sr); PX.circ(g, mixHex('#ff9a5e', '#fff0b0', dawn), AX, sunY, sr - 4); PX.circ(g, '#fff6d0', AX, sunY, sr - 10);
    /* rayos de luz tras el destello */
    if (u > U_FLASH) {
      var rp = clamp((u - U_FLASH) / 1.2, 0, 1); g.save(); g.globalAlpha = .13 * rp;
      for (i = 0; i < 9; i++) { var an = u * .12 + i * .698, L1 = 260, a2 = an + .09; g.beginPath(); g.moveTo(AX, sunY); g.lineTo(AX + Math.cos(an) * L1, sunY + Math.sin(an) * L1); g.lineTo(AX + Math.cos(a2) * L1, sunY + Math.sin(a2) * L1); g.closePath(); g.fillStyle = '#ffe9b0'; g.fill(); }
      g.restore();
    }
    /* ciudad en tres capas con parallax; surge desde el horizonte */
    [[22, 3, '#1a1740', '#2c2766', 26, 30, 1], [18, 6, '#141235', '#241f58', 34, 40, 2], [26, 11, '#0d0b25', '#1a1747', 44, 56, 3]].forEach(function (ly, li) {
      var bw = ly[0], sft = u * ly[1], bi = Math.floor(sft / bw), off = -(sft % bw);
      for (var j = -1; j < Math.ceil(W / bw) + 2; j++) {
        var h = (ly[4] + hash(j + bi + li * 40) * ly[5]) * rise, bxx = off + j * bw; if (h < 1) continue;
        R(g, ly[2], bxx, HZ - h, bw - 2, h + 1); R(g, ly[3], bxx, HZ - h, bw - 2, 2);
        if (h > 30) for (var q = HZ - h + 7; q < HZ - 6; q += 7) if (hash(j + bi + q) > .45) R(g, dawn > .55 ? '#6a5a9a' : '#ffd9a0', bxx + 4, q, 2, 3);
      }
    });
    /* suelo con rejilla en perspectiva */
    for (i = HZ; i < H + 20; i += 2) R(g, mixHex(mixHex('#1c1640', '#5a3340', dawn), '#0a0b1c', clamp((i - HZ) / 120, 0, 1)), 0, i, W, 2);
    for (k = 1; k < 10; k++) { var gy = HZ + Math.round(4 * Math.pow(k, 1.75)); R(g, 'rgba(255,211,90,.10)', 0, gy, W, 1); }
    for (i = -9; i <= 9; i++) PX.line(g, '#ffd35a1c', AX + i * 3, HZ + 1, AX + i * 70, H);
    R(g, '#ffb06a', 0, HZ, W, 1); R(g, 'rgba(255,170,100,.35)', 0, HZ + 1, W, 2);
    /* ---- la A de acero ---- */
    var fp = [clamp((u - U_FOOT) / .32, 0, 1), clamp((u - U_FOOT - .35) / .32, 0, 1)];
    [[-1, 0], [1, 1]].forEach(function (f) {
      var p = fp[f[1]]; if (p <= 0) return; var yy = Math.round(FY - 4 - (1 - ease(p)) * 120), x0 = Math.round(AX + f[0] * HB - 16);
      if (p >= 1) R(g, 'rgba(0,0,0,.3)', x0 - 4, FY + 6, 40, 3);
      extrude(boxRows(x0, yy, 32, 10), 4, '#20203b', '#8f93a6', '#c9ccd8', '#f1f2f8', '#9aa0b4');
    });
    var lp = ease(clamp((u - U_LEG) / 1.6, 0, 1)), ytop = FY - (FY - APX) * lp;
    if (lp > 0) { [-1, 1].forEach(function (s) { extrude(legRows(s, ytop), DEP, '#20203b', '#a8761a', '#ffb02e', '#ffe08a', '#d98a14', '#d4683c'); }); }
    var cp = ease(clamp((u - U_CROSS) / .9, 0, 1)), xl = Math.round(legX(-1, CY)), xr = Math.round(legX(1, CY));
    if (cp > 0) extrude(boxRows(xl, CY, Math.max(1, Math.round((xr - xl) * cp)), 9), DEP, '#20203b', '#a8761a', '#ffb02e', '#ffe08a', '#d98a14');
    /* soldadores: chispas en la punta de cada pieza mientras se forma */
    if (lp > 0 && lp < 1) [-1, 1].forEach(function (s) { var tx = legX(s, ytop), ty = ytop; if (Math.random() < .8) spark(tx + DEP, ty - DEP, 2, ['#fff', '#ffd35a', '#8fd0ff']); R(g, '#ffffff', tx + DEP - 1, ty - DEP - 1, 3, 3); R(g, 'rgba(160,220,255,.5)', tx + DEP - 3, ty - DEP - 3, 7, 7); });
    if (cp > 0 && cp < 1) { var cx2 = xl + (xr - xl) * cp; if (Math.random() < .8) spark(cx2 + DEP, CY + 4 - DEP, 2, ['#fff', '#ffd35a', '#8fd0ff']); R(g, '#ffffff', cx2 + DEP - 1, CY + 3 - DEP, 3, 3); }
    /* remaches que aparecen uno a uno */
    var rv = [], rr; for (rr = 0; rr < 5; rr++) { var ry = APX + 24 + rr * 20; rv.push([legX(-1, ry), ry], [legX(1, ry), ry]); } rv.push([xl + 6, CY + 4], [xr - 6, CY + 4], [AX, CY + 4]);
    rv.forEach(function (p, ix) { var q = u - U_RIV - ix * .07; if (q < 0) return; R(g, '#a8761a', p[0] + DEP - 1, p[1] - DEP, 3, 3); R(g, '#ffe08a', p[0] + DEP - 1, p[1] - DEP, 1, 1); if (q < .12) R(g, '#ffffff', p[0] + DEP - 3, p[1] - DEP - 2, 7, 7); });
    /* remate: cae sobre el vértice */
    var cap = clamp((u - U_CAP) / .26, 0, 1);
    if (cap > 0) { var capY = Math.round(APX - 14 - (1 - ease(cap)) * 110); extrude(boxRows(AX - 8, capY, 16, 14), 4, '#20203b', '#a8761a', '#ffd35a', '#fff3b0', '#e6b422'); if (cap >= 1) { R(g, '#fff3b0', AX - 3, capY + 3, 6, 3); } }
    /* ---- calle y camión (primer plano) ---- */
    R(g, '#10121f', 0, 262, W, 20); R(g, '#23263c', 0, 198, W, 62); R(g, '#8f93a6', 0, 196, W, 2); R(g, '#5b5f7a', 0, 198, W, 2); R(g, '#3a3d58', 0, 258, W, 2); R(g, '#8f93a6', 0, 260, W, 2);
    for (i = -1; i < 22; i++) R(g, '#ffd35a', i * 26 + 4, 228, 14, 2);
    var tu = u - U_TRUCK, tx = Math.round(-112 + tu * 122);
    if (tu > 0 && tx < W + 10) {
      var bob = Math.sin(u * 17) > .55 ? 1 : 0, oy = 190 + bob;
      PX.truck(g, tx, oy, u, { scale: 2, shadow: true });
      if (Math.random() < .5) parts.push({ x: tx + 20, y: oy + 56, vx: -22 - Math.random() * 24, vy: -6 - Math.random() * 12, l: .5 + Math.random() * .4, c: Math.random() < .5 ? '#9aa0b4' : '#cfd3df', d: 1 });
    }
    g.restore();
  }

  function draw(t) {
    if (t < T2) { R(g, '#000', 0, 0, W, H); return; }
    var u = t - T2; cred.classList.add('off');
    R(g, '#000', 0, 0, W, H);
    drawWorld(u);
    /* partículas */
    parts = parts.filter(function (p) { p.l -= .016; p.x += p.vx * .016; p.y += p.vy * .016; if (!p.d) p.vy += 3.6; return p.l > 0; });
    parts.forEach(function (p) { R(g, p.c, p.x, p.y, p.d ? 2 : 1, p.d ? 2 : 1); });
    /* franja inferior oscura para el logotipo */
    if (u > U_TITLE - .3) { var fa = clamp((u - U_TITLE + .3) / .8, 0, 1); for (var y = 156; y < H; y += 2) R(g, 'rgba(4,3,12,' + (Math.min(.72, (y - 156) / 42 * .72) * fa).toFixed(3) + ')', 0, y, W, 2); }
    /* título */
    if (u > U_TITLE) {
      var tt = u - U_TITLE, L1 = 'ARQUITECTAS', L2 = 'EN OBRA', s5 = 4, w1 = PX.w5(L1, s5), w2 = PX.w5(L2, s5), x1 = (W - w1) / 2 | 0, x2 = (W - w2) / 2 | 0, Y1 = 168, Y2 = 200;
      var stamp = function (txt, x0, y0, c, i0) { var cx = x0; for (var i = 0; i < txt.length; i++) { var q = clamp((tt - i0 - i * .06) / .12, 0, 1); if (q > 0) { var dy = (1 - q) * -18; PX.text5(g, txt[i], cx + 4, y0 + 4 + dy, '#20203b', s5); PX.text5(g, txt[i], cx, y0 + dy, c, s5); } cx += 6 * s5; } };
      stamp(L1, x1, Y1, '#ffffff', 0); stamp(L2, x2, Y2, '#ffd35a', .8);
      if (tt > 1.8) { var sh = ((tt - 1.8) * 160) % 560 - 40; g.save(); g.beginPath(); g.rect(x1, Y1, w1, 28); g.rect(x2, Y2, w2, 28); g.clip(); R(g, '#ffffff90', sh, Y1 - 4, 8, 70); g.restore(); }
      if (tt > 1.5) { var sub = 'ARQUITECTURA - APRENDE JUGANDO'; PX.text3(g, sub, (W - PX.w3(sub, 2)) / 2 | 0, 232, '#f0a9c1', 2); }
      if (tt > 2.8 && ((u * 2) | 0) % 2 === 0) { var pr = 'PRESIONA PARA CONTINUAR'; PX.text3(g, pr, (W - PX.w3(pr, 1)) / 2 | 0, 245, '#ffd35a', 1); }
    }
    /* destello al coronar */
    var fl = 1 - clamp(Math.abs(u - U_FLASH) / .35, 0, 1); if (fl > 0) { g.save(); g.globalAlpha = fl * .9; R(g, '#ffffff', 0, 0, W, H); g.restore(); }
    /* rendija de luz del horizonte que se abre como un telón de cine (barras negras) */
    var open = ease(clamp((u - .15) / 2.2, 0, 1)), bar = Math.round(HZ - 1 - (HZ - 1 - 20) * open);
    R(g, '#000', 0, 0, W, bar); R(g, '#000', 0, H - bar + 2, W, bar);
    var lw = Math.round(W * ease(clamp(u / 1.0, 0, 1))); if (u < 1.6) { R(g, 'rgba(255,200,140,.55)', (W - lw) / 2, HZ - 1, lw, 3); R(g, '#ffffff', (W - lw) / 2, HZ, lw, 1); }
  }

  /* ---------------- sonido sincronizado ---------------- */
  function events(t) {
    NAMES.forEach(function (n, i) {
      at(t, [CR0 + i * SLOT, 'n' + i], function () { showName(i); PC.snd.chime(0); });
    });
    at(t, [T_COL, 'col'], function () { col.classList.add('on'); PC.snd.swell(0, 1.8); });
    var u = t - T2;
    at(t, [T2 + .1, 'sw'], function () { PC.snd.swell(0, 3.4); });
    at(t, [T2 + .3, 'wh1'], function () { PC.snd.whoosh(0, 1.2); });
    at(t, [T2 + U_FOOT + .3, 'f1'], function () { PC.snd.thud(0); shake = .14; spark(AX - HB, FY, 14, ['#ffd35a', '#fff', '#ffb02e']); });
    at(t, [T2 + U_FOOT + .65, 'f2'], function () { PC.snd.thud(0); shake = .14; spark(AX + HB, FY, 14, ['#ffd35a', '#fff', '#ffb02e']); });
    at(t, [T2 + U_LEG, 'w1'], function () { PC.snd.noise(1.6, .035, 0, 3200, 1.5); PC.snd.tone(180, 1.6, 'sawtooth', .012, 0, 260); });
    at(t, [T2 + U_CROSS, 'w2'], function () { PC.snd.noise(.9, .035, 0, 3000, 1.5); });
    for (var r = 0; r < 13; r++) (function (r) { at(t, [T2 + U_RIV + r * .07, 'rv' + r], function () { PC.snd.tone(1300 + (r % 4) * 90, .04, 'square', .03); }); })(r);
    at(t, [T2 + U_CAP + .24, 'cap'], function () { PC.snd.clang(0); PC.snd.thud(0); shake = .2; spark(AX, APX, 16, ['#ffd35a', '#fff', '#ffb02e']); });
    at(t, [T2 + U_FLASH - .05, 'fl'], function () { PC.snd.swell(0, .1); PC.snd.chime(0); PC.snd.tone(523, .6, 'triangle', .05, .05); PC.snd.tone(784, .8, 'triangle', .05, .1); });
    for (var k = 0; k < 14; k++) (function (k) { at(t, [T2 + U_TRUCK + .1 + k * .35, 'tr' + k], function () { PC.snd.tone(58 + Math.random() * 6, .3, 'sawtooth', .028); }); })(k);
    at(t, [T2 + U_TITLE, 't1'], function () { PC.snd.thud(0); PC.snd.noise(.25, .06, 0, 800, 1); });
    at(t, [T2 + U_TITLE + .8, 't2'], function () { PC.snd.thud(0); PC.snd.fanfare(); });
  }
  function showName(i) { var els = cred.querySelectorAll('.pci-cr'); if (els[i]) els[i].classList.add('on'); var d = dotsEl.children[i]; if (d) d.classList.add('on'); }

  var raf = 0, t0 = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    var t = (now - t0) / 1000;
    /* movimiento reducido: los nombres se muestran con fundidos y la escena 2 salta a su plano final */
    if (RMo && !jumped && t >= T2) { jumped = true; t0 -= (U_TITLE + 2.4) * 1000; t = (now - t0) / 1000; muteBefore = t - .05; }
    events(t);
    if (shake > 0) { shake -= .016; cv.style.transform = 'translate(' + ((Math.random() * 3 - 1.5) | 0) + 'px,' + ((Math.random() * 3 - 1.5) | 0) + 'px)'; } else cv.style.transform = '';
    draw(t);
    if (t > T2 + U_TITLE + 2.4 && st === 'play') st = 'wait';
    if (t > T2 + U_END && st === 'wait') finish();
  }
  /* pantalla de espera: negro puro; solo un aviso mínimo para activar el sonido */
  function drawGate(now) {
    if (st !== 'gate') return; requestAnimationFrame(drawGate); var t = now / 1000;
    R(g, '#000', 0, 0, W, H);
    if (((t * 1.4) | 0) % 2 === 0) { var c = 'TOCA PARA COMENZAR', c2 = 'CON SONIDO'; PX.text3(g, c, (W - PX.w3(c, 1)) / 2 | 0, 244, '#4a4768', 1); PX.text3(g, c2, (W - PX.w3(c2, 1)) / 2 | 0, 252, '#3a3858', 1); }
  }
  requestAnimationFrame(drawGate);
  done();

  function start() {
    if (st !== 'gate') return; gate.remove(); st = 'play'; root.classList.add('run');
    PC.ctx(); if (PC.sfxOn()) { PC.setMusicVolume(.35); PC.playMusic(); }
    t0 = performance.now(); raf = requestAnimationFrame(loop); skip.focus();
  }
  function finish() {
    if (st === 'out') return; st = 'out'; cancelAnimationFrame(raf);
    PC.setMusicVolume(.5); if (PC.sfxOn()) PC.snd.pick();
    cred.style.display = 'none';
    var tr = document.createElement('canvas'); tr.width = 40; tr.height = 23; var tg = tr.getContext('2d'); tr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;z-index:4;pointer-events:none'; root.appendChild(tr);
    var cells = []; for (var y = 0; y < 23; y++) for (var x = 0; x < 40; x++) cells.push([x, y, (x + y) / 63 * .6 + Math.random() * .4]);
    var p0 = performance.now(); (function step(now) { var p = (now - p0) / 650; tg.clearRect(0, 0, 40, 23); tg.fillStyle = '#05040c'; cells.forEach(function (c) { if (c[2] < p) tg.fillRect(c[0], c[1], 1, 1); });
      if (p < 1.05) requestAnimationFrame(step); else { root.classList.add('out'); setTimeout(function () { root.remove(); }, 800); } })(p0);
    if (window.PCScenes) setTimeout(function () { try { dots(); } catch (e) {} }, 0);
  }
  var hash = function (n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
  gate.addEventListener('click', start);
  skip.addEventListener('click', function () { if (st === 'gate') { gate.remove(); st = 'play'; PC.ctx(); if (PC.sfxOn()) PC.playMusic(); } finish(); });
  root.addEventListener('click', function (e) { if (st === 'wait' && e.target !== skip) finish(); });
  addEventListener('keydown', function (e) { if (!document.getElementById('pcIntro')) return; if (e.key === 'Escape') finish(); else if ((e.key === 'Enter' || e.key === ' ') && st === 'wait') { e.preventDefault(); finish(); } });
})();
