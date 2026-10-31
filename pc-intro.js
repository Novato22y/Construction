/* ==========================================================
   PIXEL CLUB · introducción cinematográfica (≈17 s)
   Acto 1  Amanecer sobre un solar vacío
   Acto 2  El plano se dibuja trazo a trazo
   Acto 3  Una grúa ensambla el pórtico; pasa un camión mezclador
   Acto 4  Se encienden las luces y aparece el título + las 5 arquitectas
   Todo es pixel art procedural (canvas 320x180) + efectos de sonido
   sintetizados; usa musica_ambiental.mp3 como fondo si el sonido está activo.
   ========================================================== */
(function () {
  'use strict';
  var boot = document.getElementById('pcIntroBoot');
  function done() { window.__pcIntroOk = true; if (boot) boot.remove(); }
  if (window.__pcReturning || !window.PX || !window.PX.text5) { done(); return; }

  var W = 320, H = 180, GY = 150, RMo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.createElement('div'); root.id = 'pcIntro'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Introducción: Arquitectas en obra');
  var cv = document.createElement('canvas'); cv.width = W; cv.height = H; root.appendChild(cv);
  var gate = document.createElement('button'); gate.type = 'button'; gate.className = 'pci-gate'; gate.setAttribute('aria-label', 'Tocar para comenzar la introducción'); root.appendChild(gate);
  var btns = document.createElement('div'); btns.className = 'pci-btns';
  var skip = document.createElement('button'); skip.type = 'button'; skip.className = 'pci-skip'; skip.textContent = 'OMITIR ▶'; btns.appendChild(skip); root.appendChild(btns);
  var sndHost = document.createElement('div'); sndHost.className = 'pci-snd'; root.appendChild(sndHost);
  var cast = document.createElement('div'); cast.className = 'pci-cast'; root.appendChild(cast);
  document.body.appendChild(root);
  PC.bar({ host: sndHost, noMenu: true, theme: { bg: '#fff8d8', fg: '#20203b', bd: '#fff', sh: '#7954cc', hi: '#ffd35a' } });
  var g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
  var R = PX.r;

  /* reparto: retratos reales del juego (sin modificar) */
  var CAST = [['isamar', 'Isamar'], ['laura', 'Laura'], ['sharol', 'Sharol'], ['laury', 'Laury'], ['malu', 'Malu']];
  CAST.forEach(function (c, i) {
    var im = document.createElement('img'); im.src = IMG[c[0]]; im.alt = c[1]; im.className = 'pci-c'; im.style.setProperty('--i', i); cast.appendChild(im);
  });

  /* capas estáticas */
  var stars = []; for (var i = 0; i < 70; i++) stars.push([(i * 97 % W), (i * 53 % 100) + 8, i * .7]);
  var sky = [], sx = 0; while (sx < W) { var w = 10 + (sx * 7 % 14), h = 16 + ((sx * 13 + 7) % 46); sky.push([sx, w, h]); sx += w + 1 + (sx % 3); }
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); }, ease = function (p) { return 1 - (1 - p) * (1 - p); };

  /* piezas del pórtico (x,y,w,h,tipo) en orden de montaje */
  var PIECES = [], T0 = 7.0, STEP = .34, FALL = .3;
  function add(x, y, w, h, k) { PIECES.push({ x: x, y: y, w: w, h: h, k: k, t: T0 + PIECES.length * STEP }); }
  [100, 160, 220].forEach(function (c) { add(c - 11, GY - 6, 22, 6, 'foot'); });
  [100, 160, 220].forEach(function (c) { add(c - 4, GY - 46, 8, 40, 'col'); });
  add(96, GY - 52, 64, 6, 'beam'); add(160, GY - 52, 68, 6, 'beam'); add(90, GY - 56, 140, 4, 'slab');
  [100, 160, 220].forEach(function (c) { add(c - 4, GY - 96, 8, 40, 'col'); });
  add(96, GY - 102, 64, 6, 'beam'); add(160, GY - 102, 68, 6, 'beam'); add(90, GY - 106, 140, 4, 'slab');
  var T_END = PIECES[PIECES.length - 1].t + FALL, T_FLASH = T_END + .5, T_TITLE = T_FLASH + .8;
  var COL = { foot: ['#8f93a6', '#b0b4c6'], col: ['#c9ccd8', '#eef0f6'], beam: ['#e4d6bd', '#f6eedb'], slab: ['#b6bac9', '#d3d6e2'] };
  function piece(c, p, x, y) {
    var cc = COL[p.k]; R(c, '#20203b', x - 1, y - 1, p.w + 2, p.h + 2); R(c, cc[0], x, y, p.w, p.h); R(c, cc[1], x, y, p.k === 'col' ? 2 : p.w, p.k === 'col' ? p.h : 1);
    if (p.k === 'beam') for (var s = 4; s < p.w; s += 7) R(c, '#d4683c', x + s, y + 2, 1, 2);
  }

  var parts = [], fired = {}, shake = 0, st = 'gate', tStart = 0, tFinish = 0, castOn = false;
  function spark(x, y, n, cols) { for (var i = 0; i < n; i++) parts.push({ x: x, y: y, vx: (Math.random() - .5) * 70, vy: -Math.random() * 60 - 10, l: .5 + Math.random() * .4, c: cols[i % cols.length] }); }
  function at(t, key, fn) { if (t >= key[0] && !fired[key[1]]) { fired[key[1]] = 1; fn(); } }

  function draw(t) {
    var dawn = clamp((t - .6) / 9, 0, 1);
    /* cielo: se calcula con mix de hex → usamos hex directos */
    var hexTop = mixHex('#04061a', '#3a3f8a', dawn), hexBot = mixHex('#0b1030', '#ff9a5e', dawn);
    PX.vgrad(g, 0, 0, W, GY, hexTop, hexBot, 18);
    if (dawn < .85) stars.forEach(function (s) { var a = (Math.sin(t * 2 + s[2]) + 1) / 2; if (a > .35 * (1 + dawn)) R(g, dawn > .5 ? '#cfd3ff' : '#ffffff', s[0], s[1], 1, 1); });
    var sunY = 150 - dawn * 78; PX.circ(g, mixHex('#ff9a5e', '#fff0b0', dawn), 232, sunY, 14); PX.circ(g, '#fff6d0', 232, sunY, 9);
    for (var r = 1; r <= 3; r++) PX.dith(g, '#ffd9a0', 232 - 24 - r * 8, sunY - 24 - r * 8, 48 + r * 16, 48 + r * 16, .05);
    sky.forEach(function (s) { R(g, mixHex('#10132e', '#4a3a6e', dawn), s[0], GY - s[2], s[1], s[2]); if (s[2] > 30) for (var wy = GY - s[2] + 5; wy < GY - 6; wy += 7) if ((wy + s[0]) % 3) R(g, dawn < .6 ? '#ffd9a0' : '#7a6aa0', s[0] + 3, wy, 2, 2); });
    R(g, '#0a0c1e', 0, GY, W, H - GY); R(g, '#1c2040', 0, GY, W, 2);
    for (var gx = 0; gx < W; gx += 16) R(g, '#141834', gx + ((gx / 16) % 2) * 8, GY + 6 + (gx % 5), 5, 1);

    /* ACTO 1: línea de trazado sobre el solar */
    if (t < 7.2) { var lp = clamp((t - 1.2) / 2.2, 0, 1); R(g, '#ffd35a', 70, GY - 1, 180 * lp, 1); for (var k = 0; k < 4; k++) if (lp > k / 4) R(g, '#ffd35a', 70 + 60 * k, GY - 6, 1, 6); }

    /* ACTO 2: plano que se dibuja */
    var bp = clamp((t - 3.4) / .5, 0, 1) * (1 - clamp((t - 6.7) / .5, 0, 1));
    if (bp > 0) {
      g.save(); g.globalAlpha = .9 * bp; R(g, '#1646a8', 56, 24, 208, 124); g.globalAlpha = bp;
      R(g, '#bcd8fa', 56, 24, 208, 1); R(g, '#bcd8fa', 56, 147, 208, 1); R(g, '#bcd8fa', 56, 24, 1, 124); R(g, '#bcd8fa', 263, 24, 1, 124);
      for (var x = 66; x < 262; x += 10) R(g, '#2f66c8', x, 25, 1, 122); for (var y2 = 34; y2 < 146; y2 += 10) R(g, '#2f66c8', 57, y2, 206, 1);
      var dp = clamp((t - 3.9) / 2.6, 0, 1), segs = [[100, 140, 220, 140], [100, 140, 100, 90], [160, 140, 160, 90], [220, 140, 220, 90], [96, 90, 224, 90], [100, 90, 100, 44], [160, 90, 160, 44], [220, 90, 220, 44], [96, 44, 224, 44], [90, 40, 230, 40]], tot = 0, lens = segs.map(function (s) { var l = Math.abs(s[2] - s[0]) + Math.abs(s[3] - s[1]); tot += l; return l; }), drawn = dp * tot, acc = 0;
      segs.forEach(function (s, i) { var l = lens[i], q = clamp((drawn - acc) / l, 0, 1); acc += l; if (q <= 0) return; var ex = s[0] + (s[2] - s[0]) * q, ey = s[1] + (s[3] - s[1]) * q; PX.line(g, '#ffffff', s[0], s[1], ex, ey); if (i === 0) PX.line(g, '#ffffff', s[0] - 8, s[1] + 4, ex + 8, ey + 4); if (q < 1 && dp < 1) { R(g, '#ffd35a', ex - 1, ey - 1, 3, 3); } });
      if (dp > .5) PX.text3(g, '3.50', 124, 133, '#ffd35a', 1); if (dp > .75) PX.text3(g, 'VIGA', 128, 83, '#ffd35a', 1); if (dp > .9) { PX.text3(g, 'ESC 1:50', 66, 138, '#bcd8fa', 1); PX.text3(g, 'PORTICO', 214, 30, '#bcd8fa', 1); }
      g.restore();
    }

    /* ACTO 3 y 4: obra (grupo escalado al final) */
    var pull = ease(clamp((t - T_FLASH) / 1.2, 0, 1)), sc = 1 - .38 * pull;
    g.save(); g.translate(160, GY); g.scale(sc, sc); g.translate(-160, -GY);
    if (t > T0 - .8) {
      /* grúa */
      var cax = 44, jy = 24;
      for (var yy = jy + 6; yy < GY; yy += 6) { R(g, '#20203b', cax - 5, yy, 11, 1); R(g, '#ffb02e', cax - 5, yy + 1, 2, 5); R(g, '#ffb02e', cax + 4, yy + 1, 2, 5); PX.line(g, '#a8761a', cax - 4, yy + 1, cax + 4, yy + 6); }
      R(g, '#20203b', cax - 28, jy, 190, 4); R(g, '#ffb02e', cax - 28, jy + 1, 190, 2); R(g, '#20203b', cax - 8, jy - 8, 14, 9); R(g, '#f2b038', cax - 7, jy - 7, 12, 7); R(g, '#9fd3f0', cax - 4, jy - 6, 6, 4); R(g, '#8f93a6', cax - 32, jy - 1, 10, 8);
      /* pieza en caída o gancho */
      var cur = null; PIECES.forEach(function (p) { if (t >= p.t && t < p.t + FALL) cur = p; });
      var lastDone = null; PIECES.forEach(function (p) { if (t >= p.t + FALL) lastDone = p; });
      var hx = cur ? cur.x + cur.w / 2 : (lastDone ? lastDone.x + lastDone.w / 2 : 150), hy = jy + 14;
      if (cur) { var fp = ease((t - cur.t) / FALL), py = cur.y - (1 - fp) * 90; hy = py - 6; piece(g, cur, cur.x, py); }
      R(g, '#20203b', hx, jy + 4, 1, hy - jy - 2); R(g, '#ffd35a', hx - 2, hy - 2, 5, 3); R(g, '#20203b', hx - 3, hy - 3, 7, 1);
    }
    PIECES.forEach(function (p) { if (t >= p.t + FALL) piece(g, p, p.x, p.y); });
    /* ventanas encendidas tras el destello */
    if (t > T_FLASH) { var lit = clamp((t - T_FLASH) / .6, 0, 1); g.save(); g.globalAlpha = lit; [[GY - 98, 'x'], [GY - 48, 'x']].forEach(function (L) { for (var c = 0; c < 2; c++) { var wx = 106 + c * 60, wy = L[0] + 6; R(g, '#20203b', wx - 1, wy - 1, 50, 36); R(g, '#ffd9a0', wx, wy, 48, 34); R(g, '#ffefc4', wx, wy, 48, 3); R(g, '#c98a3c', wx + 23, wy, 2, 34); R(g, '#c98a3c', wx, wy + 16, 48, 2); } }); g.restore(); }
    g.restore();

    /* camión mezclador que cruza por delante */
    if (t > 8.2 && t < 13.2) { var tx = -60 + (t - 8.2) * 74; PX.truck(g, tx, GY - 28, t, { shadow: true }); if (((t * 10) | 0) % 3 === 0) R(g, '#ffffff55', tx - 3, GY - 6, 3, 2); }
    /* partículas */
    parts = parts.filter(function (p) { p.l -= .016; p.x += p.vx * .016; p.y += p.vy * .016; p.vy += 3; return p.l > 0; });
    parts.forEach(function (p) { R(g, p.c, p.x, p.y, 1, 1); });

    /* destello */
    var fl = 1 - clamp(Math.abs(t - T_FLASH) / .35, 0, 1); if (fl > 0) { g.save(); g.globalAlpha = fl * .9; R(g, '#ffffff', 0, 0, W, H); g.restore(); }

    /* subtítulos */
    var cap = t < 3.2 ? ['UN TERRENO VACIO', 1.0] : t < 7 ? ['UN PLANO...', 4.0] : t < T_END ? ['...Y MUCHAS MANOS', 7.2] : null;
    if (cap && t > cap[1] - .01) { var a = clamp((t - cap[1]) / .5, 0, 1), txt = cap[0]; g.save(); g.globalAlpha = a; PX.text3(g, txt, (W - PX.w3(txt, 2)) / 2 | 0, 150, '#ffffff', 2); g.restore(); }

    /* título */
    if (t > T_TITLE) {
      var tt = t - T_TITLE, L1 = 'ARQUITECTAS', L2 = 'EN OBRA', s5 = 3, w1 = PX.w5(L1, s5), w2 = PX.w5(L2, s5), x1 = (W - w1) / 2 | 0, x2 = (W - w2) / 2 | 0;
      function stamp(txt, x0, y0, c, i0) { var cx = x0; for (var i = 0; i < txt.length; i++) { var q = clamp((tt - i0 - i * .06) / .12, 0, 1); if (q > 0) { var dy = (1 - q) * -14; PX.text5(g, txt[i], cx + 3, y0 + 3 + dy, '#20203b', s5); PX.text5(g, txt[i], cx, y0 + dy, c, s5); } cx += 6 * s5; } }
      stamp(L1, x1, 20, '#ffffff', 0); stamp(L2, x2, 46, '#ffd35a', .8);
      if (tt > 1.8) { var sh = ((tt - 1.8) * 120) % 380 - 40; g.save(); g.beginPath(); g.rect(x1, 20, w1, 21); g.rect(x2, 46, w2, 21); g.clip(); R(g, '#ffffff90', sh, 18, 6, 52); g.restore(); }
      if (tt > 1.5) { var sub = 'ARQUITECTURA - APRENDE JUGANDO'; PX.text3(g, sub, (W - PX.w3(sub, 1)) / 2 | 0, 72, '#f0a9c1', 1); }
      if (tt > 3.2 && ((t * 2) | 0) % 2 === 0) { var pr = 'PRESIONA PARA CONTINUAR'; PX.text3(g, pr, (W - PX.w3(pr, 1)) / 2 | 0, 171, '#ffd35a', 1); }
    }
    /* barras de cine */
    var bar = Math.round(90 - 76 * ease(clamp(t / 1.2, 0, 1))); R(g, '#000', 0, 0, W, bar); R(g, '#000', 0, H - bar, W, bar);
  }
  function mixHex(a, b, t) { var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = function (s) { return Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t); }; return '#' + [16, 8, 0].map(function (s) { var v = m(s).toString(16); return v.length < 2 ? '0' + v : v; }).join(''); }

  /* eventos de sonido sincronizados con la animación */
  function events(t) {
    at(t, [.1, 'sw'], function () { PC.snd.swell(0, 3.2); });
    at(t, [1.2, 'wh1'], function () { PC.snd.whoosh(0, .7); });
    at(t, [3.5, 'bp'], function () { PC.snd.chime(0); });
    at(t, [4.0, 'wh2'], function () { PC.snd.whoosh(0, 1.6); PC.snd.tone(300, 2.3, 'triangle', .02, 0, 600); });
    at(t, [T0 - .3, 'eng'], function () { PC.snd.swell(0, 1); });
    PIECES.forEach(function (p, i) {
      at(t, [p.t + FALL, 'p' + i], function () {
        if (p.k === 'foot' || p.k === 'slab') PC.snd.thud(0); else PC.snd.clang(0);
        shake = .12; spark(p.x + p.w / 2, p.y, 10, ['#ffd35a', '#fff', '#ffb02e']);
      });
    });
    for (var k = 0; k < 14; k++) at(t, [8.3 + k * .35, 'tr' + k], function () { PC.snd.tone(58 + Math.random() * 6, .3, 'sawtooth', .028); });
    at(t, [T_FLASH - .05, 'fl'], function () { PC.snd.swell(0, .1); PC.snd.chime(0); PC.snd.tone(523, .6, 'triangle', .05, .05); PC.snd.tone(784, .8, 'triangle', .05, .1); });
    at(t, [T_TITLE, 't1'], function () { PC.snd.thud(0); PC.snd.noise(.25, .06, 0, 800, 1); });
    at(t, [T_TITLE + .8, 't2'], function () { PC.snd.thud(0); PC.snd.fanfare(); });
    at(t, [T_TITLE + 1.4, 'cast'], showCast);
  }
  function showCast() { if (castOn) return; castOn = true; cast.classList.add('on'); CAST.forEach(function (c, i) { PC.snd.chime(i * .14); }); }

  var raf = 0, t0 = 0, last = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    var t = (now - t0) / 1000; events(t);
    if (shake > 0) { shake -= .016; cv.style.transform = 'translate(' + ((Math.random() * 3 - 1.5) | 0) + 'px,' + ((Math.random() * 3 - 1.5) | 0) + 'px)'; } else cv.style.transform = '';
    draw(t);
    if (t > T_TITLE + 3.2) { st = 'wait'; }
  }
  function drawGate(now) {
    if (st !== 'gate') return; requestAnimationFrame(drawGate); var t = now / 1000;
    PX.vgrad(g, 0, 0, W, H, '#05040c', '#10132e', 8);
    stars.forEach(function (s) { var a = (Math.sin(t * 2 + s[2]) + 1) / 2; if (a > .4) R(g, '#cfd3ff', s[0], s[1] * 1.6, 1, 1); });
    var hy = 62 + Math.round(Math.sin(t * 2.5) * 2);
    R(g, '#20203b', 134, hy + 14, 52, 7); R(g, '#ffb02e', 135, hy + 15, 50, 5); R(g, '#20203b', 140, hy, 40, 16); R(g, '#ffd35a', 141, hy + 1, 38, 15); R(g, '#fff3b0', 144, hy + 2, 14, 4); R(g, '#20203b', 156, hy - 4, 8, 5); R(g, '#ffd35a', 157, hy - 3, 6, 4);
    var a = 'PIXEL CLUB', b = 'ARQUITECTAS EN OBRA'; PX.text3(g, a, (W - PX.w3(a, 2)) / 2 | 0, 100, '#ffffff', 2);
    PX.text3(g, b, (W - PX.w3(b, 1)) / 2 | 0, 118, '#f0a9c1', 1);
    if (((t * 1.6) | 0) % 2 === 0) { var c = 'TOCA PARA COMENZAR', c2 = 'CON SONIDO'; PX.text3(g, c, (W - PX.w3(c, 1)) / 2 | 0, 146, '#ffd35a', 1); PX.text3(g, c2, (W - PX.w3(c2, 1)) / 2 | 0, 154, '#9fd3f0', 1); }
  }
  requestAnimationFrame(drawGate);
  done();

  function start() {
    if (st !== 'gate') return; gate.remove(); st = 'play';
    PC.ctx(); if (PC.sfxOn()) { PC.setMusicVolume(.35); PC.playMusic(); }
    if (RMo) { fired = {}; t0 = performance.now() - (T_TITLE + 3.5) * 1000; showCast(); }
    else t0 = performance.now();
    raf = requestAnimationFrame(loop); skip.focus();
  }
  function finish() {
    if (st === 'out') return; var was = st; st = 'out'; cancelAnimationFrame(raf);
    PC.setMusicVolume(.5); if (PC.sfxOn()) PC.snd.pick();
    var tr = document.createElement('canvas'); tr.width = 40; tr.height = 23; var tg = tr.getContext('2d'); tr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;z-index:4;pointer-events:none'; root.appendChild(tr);
    var cells = []; for (var y = 0; y < 23; y++) for (var x = 0; x < 40; x++) cells.push([x, y, (x + y) / 63 * .6 + Math.random() * .4]);
    var p0 = performance.now(); (function step(now) { var p = (now - p0) / 650; tg.clearRect(0, 0, 40, 23); tg.fillStyle = '#05040c'; cells.forEach(function (c) { if (c[2] < p) tg.fillRect(c[0], c[1], 1, 1); });
      if (p < 1.05) requestAnimationFrame(step); else { root.classList.add('out'); setTimeout(function () { root.remove(); }, 800); } })(p0);
    if (window.PCScenes) setTimeout(function () { try { dots(); } catch (e) {} }, 0);
  }
  gate.addEventListener('click', start);
  skip.addEventListener('click', function () { if (st === 'gate') { gate.remove(); st = 'play'; PC.ctx(); if (PC.sfxOn()) PC.playMusic(); } finish(); });
  root.addEventListener('click', function (e) { if (st === 'wait') finish(); });
  addEventListener('keydown', function (e) { if (!document.getElementById('pcIntro')) return; if (e.key === 'Escape') finish(); else if ((e.key === 'Enter' || e.key === ' ') && st === 'wait') { e.preventDefault(); finish(); } });
})();
