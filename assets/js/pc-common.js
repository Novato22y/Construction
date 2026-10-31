/* ==========================================================
   PIXEL CLUB · módulo común  (se carga en TODAS las páginas)
   1. Audio global: un solo interruptor de sonido (música + efectos)
   2. Barra de opciones: volver al menú + sonido, con tema por misión
   3. Ventana de logro por misión (una sola vez)
   4. Toolkit pixel art compartido (PX) + sprite del camión mezclador
   ========================================================== */
(function () {
  'use strict';
  var KEY = 'pcSoundOn', ACH_STORE = 'pcArq1';
  var AC = window.AudioContext || window.webkitAudioContext;
  var soundOn = true;
  try { soundOn = localStorage.getItem(KEY) !== '0'; } catch (e) {}
  var masters = [];

  /* ---- 1. Todo WebAudio pasa por una ganancia maestra: el botón de sonido silencia
         también los efectos que cada misión genera por su cuenta ---- */
  if (AC && window.AudioNode && !AudioNode.prototype.__pcPatched) {
    var oc = AudioNode.prototype.connect, map = new WeakMap();
    AudioNode.prototype.connect = function (d) {
      if (window.AudioDestinationNode && d instanceof AudioDestinationNode) {
        var m = map.get(this.context);
        if (!m) { m = this.context.createGain(); oc.call(m, d); map.set(this.context, m); masters.push(m); m.gain.value = soundOn ? 1 : 0; }
        arguments[0] = m;
      }
      return oc.apply(this, arguments);
    };
    AudioNode.prototype.__pcPatched = true;
  }

  var PC = window.PC = { musicSrc: 'musica_ambiental.mp3', listeners: [] };
  var actx = null, au = null, unlocked = false;

  PC.sfxOn = function () { return soundOn; };
  PC.ctx = function () {
    if (!AC) return null;
    try { actx = actx || new AC(); if (actx.state === 'suspended') actx.resume(); } catch (e) { return null; }
    return actx;
  };

  /* música ambiental (archivo musica_ambiental.mp3), con reanudación entre páginas */
  function audioEl() {
    if (au) return au;
    au = new Audio(PC.musicSrc); au.loop = true; au.preload = 'auto'; au.volume = 0.5;
    var t = 0; try { t = +sessionStorage.getItem('pcMusicT') || 0; } catch (e) {}
    au.addEventListener('loadedmetadata', function () { try { if (t > 0 && t < au.duration - 1) au.currentTime = t; } catch (e) {} }, { once: true });
    return au;
  }
  PC.playMusic = function () {
    if (!soundOn) return;
    var a = audioEl(), p = a.play();
    if (p && p.then) p.then(function () { unlocked = true; }, function () { unlocked = false; });
  };
  PC.pauseMusic = function () { if (au) au.pause(); };
  PC.musicPlaying = function () { return !!au && !au.paused; };
  PC.setMusicVolume = function (v) { audioEl().volume = v; };
  setInterval(function () { try { if (au && !au.paused) sessionStorage.setItem('pcMusicT', String(au.currentTime)); } catch (e) {} }, 1000);
  addEventListener('pagehide', function () { try { if (au) sessionStorage.setItem('pcMusicT', String(au.currentTime)); } catch (e) {} });

  /* los navegadores exigen un gesto del usuario antes de reproducir audio */
  function unlock() {
    PC.ctx();
    if (soundOn && !PC.musicPlaying()) PC.playMusic();
    if (unlocked) ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { removeEventListener(ev, unlock, true); });
  }
  ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { addEventListener(ev, unlock, true); });

  PC.setSound = function (on) {
    soundOn = !!on;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    masters.forEach(function (m) { try { m.gain.value = on ? 1 : 0; } catch (e) {} });
    if (on) PC.playMusic(); else PC.pauseMusic();
    document.querySelectorAll('.pcb-snd').forEach(paintSnd);
    PC.listeners.forEach(function (f) { try { f(on); } catch (e) {} });
  };
  PC.toggleSound = function () { PC.setSound(!soundOn); if (soundOn) PC.snd.tone(660, .07, 'square', .05); };

  /* ---- sintetizador mínimo para efectos ---- */
  PC.snd = {
    tone: function (f, d, type, vol, when, slideTo) {
      var c = PC.ctx(); if (!c || !soundOn) return;
      try {
        var t0 = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain();
        o.type = type || 'square'; o.frequency.setValueAtTime(f, t0);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + d);
        g.gain.setValueAtTime(vol == null ? .04 : vol, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
        o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .02);
      } catch (e) {}
    },
    noise: function (d, vol, when, freq, q) {
      var c = PC.ctx(); if (!c || !soundOn) return;
      try {
        var n = Math.max(1, Math.floor(c.sampleRate * d)), b = c.createBuffer(1, n, c.sampleRate), ch = b.getChannelData(0);
        for (var i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
        var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t0 = c.currentTime + (when || 0);
        s.buffer = b; f.type = 'bandpass'; f.frequency.value = freq || 1200; f.Q.value = q || 1;
        g.gain.setValueAtTime(vol == null ? .06 : vol, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
        s.connect(f); f.connect(g); g.connect(c.destination); s.start(t0);
      } catch (e) {}
    },
    clang: function (w) { this.noise(.12, .07, w, 2600, 6); this.tone(880, .16, 'square', .035, w, 440); this.tone(1320, .1, 'triangle', .03, w); },
    thud: function (w) { this.tone(110, .22, 'sine', .12, w, 40); this.noise(.14, .05, w, 300, 1); },
    whoosh: function (w, d) { this.noise(d || .5, .05, w, 900, .7); },
    swell: function (w, d) { var c = PC.ctx(); if (!c || !soundOn) return; try { var t0 = c.currentTime + (w || 0), o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(55, t0); o.frequency.exponentialRampToValueAtTime(110, t0 + d); g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.05, t0 + d * .85); g.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .05); } catch (e) {} },
    fanfare: function () { var n = [523, 659, 784, 1047, 784, 1047, 1319]; var s = this; n.forEach(function (f, i) { s.tone(f, .22, 'square', .045, i * .11); s.tone(f / 2, .22, 'triangle', .05, i * .11); }); },
    chime: function (w) { this.tone(1047, .35, 'triangle', .05, w); this.tone(1568, .45, 'sine', .04, (w || 0) + .06); },
    pick: function () { this.tone(520, .05, 'square', .035); this.tone(780, .06, 'square', .03, .05); }
  };

  /* ---- 2. Barra de opciones ---- */
  var ICO_ON = ['.....K........', '....KK....K...', '.KKKKK.....K..', '.KKKKK..K...K.', '.KKKKK...K..K.', '.KKKKK...K..K.', '.KKKKK..K...K.', '.KKKKK.....K..', '....KK....K...', '.....K........'];
  var ICO_OFF = ['.....K........', '....KK........', '.KKKKK..K...K.', '.KKKKK...K.K..', '.KKKKK....K...', '.KKKKK....K...', '.KKKKK...K.K..', '.KKKKK..K...K.', '....KK........', '.....K........'];
  var ICO_BACK = ['...K....', '..KK....', '.KKKKKKK', 'KKKKKKKK', '.KKKKKKK', '..KK....', '...K....'];
  function svgPx(rows) {
    var w = rows[0].length, h = rows.length, s = '<svg viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true" fill="currentColor">';
    rows.forEach(function (r, y) { for (var x = 0; x < r.length; x++) if (r[x] !== '.') s += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'; });
    return s + '</svg>';
  }
  function paintSnd(b) {
    b.setAttribute('aria-pressed', String(soundOn));
    b.setAttribute('aria-label', soundOn ? 'Sonido activado. Pulsa para silenciar' : 'Sonido desactivado. Pulsa para activar');
    b.title = soundOn ? 'Sonido: activado (tecla M)' : 'Sonido: desactivado (tecla M)';
    b.querySelector('.pcb-ico').innerHTML = svgPx(soundOn ? ICO_ON : ICO_OFF);
    b.querySelector('.pcb-st').textContent = soundOn ? 'ON' : 'OFF';
  }
  PC.goMenu = function () { try { sessionStorage.setItem('pcArqReturn', '1'); } catch (e) {} location.href = 'avance 2.html'; };

  /* opt: {host:Element|selector, theme:{bg,fg,bd,sh,on,hi}, menuId, menuLabel, onMenu, noMenu} */
  PC.bar = function (opt) {
    opt = opt || {};
    var host = typeof opt.host === 'string' ? document.querySelector(opt.host) : opt.host;
    var bar = document.createElement('div');
    bar.className = 'pcbar' + (host ? '' : ' pcbar-fixed');
    bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Opciones');
    var th = opt.theme || {};
    ['bg', 'fg', 'bd', 'sh', 'on', 'hi'].forEach(function (k) { if (th[k]) bar.style.setProperty('--pb-' + k, th[k]); });
    if (!opt.noMenu) {
      var m = document.createElement('button');
      m.type = 'button'; m.className = 'pcb pcb-menu'; if (opt.menuId) m.id = opt.menuId; m.setAttribute('data-menu', '');
      m.setAttribute('aria-label', 'Volver al menú de personajes'); m.title = 'Volver al menú de personajes';
      m.innerHTML = '<span class="pcb-ico">' + svgPx(ICO_BACK) + '</span><span>' + (opt.menuLabel || 'MENÚ') + '</span>';
      m.addEventListener('click', function () { if (m.onclick) return; if (opt.onMenu) opt.onMenu(); else PC.goMenu(); });
      bar.appendChild(m);
    }
    var s = document.createElement('button');
    s.type = 'button'; s.className = 'pcb pcb-snd';
    s.innerHTML = '<span class="pcb-ico"></span><span class="pcb-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="pcb-st"></span>';
    s.addEventListener('click', function () { PC.toggleSound(); });
    paintSnd(s); bar.appendChild(s);
    if (host) host.insertBefore(bar, host.firstChild); else document.body.appendChild(bar);
    return bar;
  };
  addEventListener('keydown', function (e) {
    if (e.key !== 'm' && e.key !== 'M') return;
    var t = e.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    PC.toggleSound();
  });

  /* ---- 3. Logros (una sola vez por misión) ---- */
  function readStore() { try { return JSON.parse(localStorage.getItem(ACH_STORE) || '{}') || {}; } catch (e) { return {}; } }
  PC.achieved = function (key) { var x = readStore(); return !!(x.ach && x.ach[key]); };
  PC.markAch = function (key) { try { if (typeof ST !== 'undefined' && ST) { ST.ach = ST.ach || {}; ST.ach[key] = 1; } } catch (e) {} var x = readStore(); x.ach = x.ach || {}; x.ach[key] = 1; try { localStorage.setItem(ACH_STORE, JSON.stringify(x)); } catch (e) {} };

  /* o: {key,kicker,title,msg,learned:[],xp,theme:{c1,c2,c3,ink,bg,rib},art,btn,force,onClose} */
  PC.win = function (o) {
    return new Promise(function (resolve) {
      if (!o.force && PC.achieved(o.key)) { resolve(false); if (o.onClose) o.onClose(false); return; }
      PC.markAch(o.key);
      var th = o.theme || {}, el = document.createElement('div');
      el.className = 'pcw'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'pcwT-' + o.key);
      [['c1', '--w1'], ['c2', '--w2'], ['c3', '--w3'], ['ink', '--wink'], ['bg', '--wbg'], ['rib', '--wrib'], ['tx', '--wtx']].forEach(function (p) { if (th[p[0]]) el.style.setProperty(p[1], th[p[0]]); });
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      el.innerHTML = '<canvas class="pcw-conf" aria-hidden="true"></canvas><div class="pcw-card"><div class="pcw-rib">★ ' + esc(o.kicker || 'MISIÓN COMPLETADA') + ' ★</div>' +
        '<canvas class="pcw-art" width="112" height="64" aria-hidden="true"></canvas>' +
        '<h2 id="pcwT-' + o.key + '">' + esc(o.title) + '</h2><p class="pcw-msg">' + esc(o.msg) + '</p>' +
        (o.learned && o.learned.length ? '<p class="pcw-lt">LO QUE LOGRASTE</p><ul class="pcw-list">' + o.learned.map(function (l) { return '<li><span>' + esc(l) + '</span></li>'; }).join('') + '</ul>' : '') +
        (o.xp ? '<div class="pcw-xp">+' + esc(o.xp) + ' XP</div><br>' : '') +
        '<button type="button" class="pcw-btn">' + esc(o.btn || 'CONTINUAR ▶') + '</button></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('on'); });
      var art = el.querySelector('.pcw-art').getContext('2d'), conf = el.querySelector('.pcw-conf'), cg = conf.getContext('2d');
      art.imageSmoothingEnabled = false;
      var RMo = matchMedia('(prefers-reduced-motion: reduce)').matches, run = true, t0 = performance.now(), last = 0, parts = [];
      var cols = [th.c1 || '#7954cc', th.c2 || '#ffd35a', '#fff', '#5eea6a', '#ff8fb8'];
      if (!RMo) for (var i = 0; i < 70; i++) parts.push({ x: Math.random(), y: -Math.random() * .6, v: .12 + Math.random() * .28, s: 4 + (Math.random() * 3 | 0) * 2, c: cols[i % cols.length], w: Math.random() * 6 });
      function fit() { conf.width = innerWidth; conf.height = innerHeight; } fit(); addEventListener('resize', fit);
      var arts = PX.art[o.art] || PX.art.isamar;
      function tick(now) {
        if (!run) return;
        var t = (now - t0) / 1000;
        if (now - last > 80 || last === 0) { last = now; arts(art, t, 112, 64, th); }
        if (!RMo) {
          cg.clearRect(0, 0, conf.width, conf.height);
          parts.forEach(function (p) { p.y += p.v * .016; p.x += Math.sin(t * 2 + p.w) * .0006; if (p.y > 1.05) p.y = -.05; cg.fillStyle = p.c; cg.fillRect(p.x * conf.width | 0, p.y * conf.height | 0, p.s, p.s); });
          requestAnimationFrame(tick);
        } else if (last === now) { /* estático */ }
        if (RMo) return;
      }
      if (RMo) arts(art, 1.2, 112, 64, th); else requestAnimationFrame(tick);
      PC.snd.fanfare();
      var btn = el.querySelector('.pcw-btn'); setTimeout(function () { try { btn.focus(); } catch (e) {} }, 400);
      function close() {
        run = false; removeEventListener('keydown', onKey, true); removeEventListener('resize', fit);
        el.classList.remove('on'); setTimeout(function () { el.remove(); }, 30);
        resolve(true); if (o.onClose) o.onClose(true);
      }
      function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } else if (e.key === 'Tab') { e.preventDefault(); btn.focus(); } }
      addEventListener('keydown', onKey, true);
      btn.addEventListener('click', close);
    });
  };

  /* aviso breve inferior (pixel) */
  PC.toast = function (msg, ms) {
    var old = document.querySelector('.pc-toast'); if (old) old.remove();
    var t = document.createElement('div'); t.className = 'pc-toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 400); }, ms || 3200);
  };

  /* ---- 4. Toolkit pixel art ---- */
  var PX = window.PX = {};
  PX.mk = function (w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d'); g.imageSmoothingEnabled = false; return { c: c, g: g }; };
  PX.r = function (g, c, x, y, w, h) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
  PX.hex = function (h, f) { var v = parseInt(h.slice(1), 16), r = (v >> 16) & 255, gg = (v >> 8) & 255, b = v & 255; var cl = function (n) { return Math.max(0, Math.min(255, n | 0)); }; return 'rgb(' + cl(r * f) + ',' + cl(gg * f) + ',' + cl(b * f) + ')'; };
  PX.mix = function (a, b, t) { var A = parseInt(a.slice(1), 16), Bv = parseInt(b.slice(1), 16), m = function (s) { return Math.round(((A >> s) & 255) * (1 - t) + ((Bv >> s) & 255) * t); }; return 'rgb(' + m(16) + ',' + m(8) + ',' + m(0) + ')'; };
  PX.circ = function (g, c, cx, cy, r) { for (var y = -r; y <= r; y++) { var w = Math.floor(Math.sqrt(r * r - y * y) + .5); g.fillStyle = c; g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } };
  PX.line = function (g, c, x0, y0, x1, y1) { x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0; var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy; g.fillStyle = c; for (;;) { g.fillRect(x0, y0, 1, 1); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } } };
  /* ordered dither 4x4 */
  var BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  PX.dith = function (g, c, x, y, w, h, level) { g.fillStyle = c; for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) if (BAY[((y + j) & 3) * 4 + ((x + i) & 3)] < level * 16) g.fillRect(x + i, y + j, 1, 1); };
  PX.vgrad = function (g, x, y, w, h, c1, c2, steps) { steps = steps || 8; for (var i = 0; i < steps; i++) { g.fillStyle = PX.mix(c1, c2, i / (steps - 1)); g.fillRect(x, y + Math.floor(i * h / steps), w, Math.ceil(h / steps) + 1); } };

  /* Camión mezclador de concreto, vista lateral mirando a la derecha. 50x30 px.
     t: tiempo en segundos (gira la hélice del tambor). o:{scale,shadow} */
  PX.truck = function (g, ox, oy, t, o) {
    o = o || {}; var W = 50, H = 30, B = new Uint8Array(W * H);
    var P = [null, '#20203b', '#f4f4f8', '#c6c9d8', '#8f93aa', '#d4683c', '#ffb02e', '#f2b038', '#a8761a', '#a6dcf5', '#5b5f7a', '#33344f', '#cfd3df', '#ff4d4d', '#6a6e87'];
    var S = function (x, y, i) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = i; };
    var Rr = function (x, y, w, h, i) { for (var j = 0; j < h; j++) for (var k = 0; k < w; k++) S(x + k, y + j, i); };
    var Ci = function (cx, cy, r, i) { for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * .6) S(cx + x, cy + y, i); };
    /* chasis y escalera */
    Rr(3, 19, 44, 3, 10); Rr(6, 22, 12, 1, 11);
    /* tolva y canal de descarga (atrás, a la izquierda) */
    Rr(1, 4, 7, 2, 4); Rr(2, 6, 5, 3, 3);
    Rr(4, 11, 5, 2, 3); Rr(2, 13, 5, 2, 3); Rr(0, 15, 4, 2, 4); Rr(3, 13, 3, 1, 4);
    /* tambor: inclinado, sube hacia atrás */
    var X0 = 8, X1 = 35;
    for (var x = X0; x <= X1; x++) {
      var tt = (x - X0) / (X1 - X0), cy = 9.5 + tt * 5, r = 7.6 - tt * 1.8;
      if (x > 31) r *= Math.sqrt(Math.max(0, 1 - Math.pow((x - 31) / 5, 2)));
      if (x < 10) r *= .93;
      for (var y = Math.ceil(cy - r); y <= Math.floor(cy + r); y++) {
        var v = (y - cy) / r, ang = Math.asin(Math.max(-1, Math.min(1, v)));
        var col = v < -.5 ? 2 : v < .25 ? 12 : v < .6 ? 3 : 4;
        if (Math.sin(x * .5 + ang * 1.15 - t * 5) > .55) col = v > .45 ? 8 : 5;
        if (x <= X0 + 1 || (x >= 30 && x <= 31)) col = v < 0 ? 3 : 4;
        S(x, y, col);
      }
    }
    /* apoyos del tambor y tanque de agua */
    Rr(10, 17, 3, 3, 10); Rr(30, 18, 4, 2, 10); Rr(21, 20, 7, 3, 12); Rr(22, 21, 5, 1, 3);
    /* cabina */
    Rr(36, 9, 9, 10, 7); Rr(44, 14, 4, 5, 7); Rr(37, 10, 1, 8, 8);
    Rr(40, 11, 5, 5, 9); S(41, 12, 2); S(42, 12, 2); S(41, 13, 2); Rr(45, 11, 1, 2, 9); S(44, 11, 9); S(44, 12, 9);
    Rr(47, 15, 2, 2, 6); Rr(47, 18, 3, 2, 3); S(46, 17, 8); Rr(36, 17, 8, 1, 8);
    Rr(34, 3, 2, 9, 4); S(34, 2, 14);
    /* ruedas */
    [[11, 25], [20, 25], [40, 25]].forEach(function (w) { Ci(w[0], w[1], 4, 11); Ci(w[0], w[1], 2, 12); S(w[0], w[1], 4); });
    /* contorno */
    var F = new Uint8Array(W * H);
    for (var y2 = 0; y2 < H; y2++) for (var x2 = 0; x2 < W; x2++) {
      var i = y2 * W + x2; if (B[i]) { F[i] = B[i]; continue; }
      if ((x2 > 0 && B[i - 1]) || (x2 < W - 1 && B[i + 1]) || (y2 > 0 && B[i - W]) || (y2 < H - 1 && B[i + W])) F[i] = 1;
    }
    var sc = o.scale || 1;
    if (o.shadow !== false) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(ox + 2 * sc, oy + 28 * sc, 46 * sc, 2 * sc); g.fillRect(ox + 5 * sc, oy + 30 * sc, 40 * sc, 1 * sc); }
    for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { var c = F[yy * W + xx]; if (c) { g.fillStyle = P[c]; g.fillRect(ox + xx * sc, oy + yy * sc, sc, sc); } }
    return { w: W * sc, h: H * sc };
  };

  /* ---- arte de las ventanas de logro (112x64) ---- */
  function sparkle(g, x, y, t, c, ph) { var s = Math.sin(t * 5 + ph); if (s < .1) return; var k = s > .7 ? 2 : 1; g.fillStyle = c; g.fillRect(x - k, y, 2 * k + 1, 1); g.fillRect(x, y - k, 1, 2 * k + 1); }
  PX.art = {
    isamar: function (g, t, W, H, th) {
      PX.vgrad(g, 0, 0, W, H, '#3a0f22', '#8d2049', 8);
      for (var i = 0; i < 14; i++) PX.r(g, '#ffffff14', (i * 9) % W, 0, 1, H);
      for (var j = 0; j < 8; j++) PX.r(g, '#ffffff10', 0, j * 9, W, 1);
      /* pórtico */
      var cx = 56, by = 54;
      PX.r(g, '#20203b', cx - 25, by, 50, 4); PX.r(g, '#7a5230', cx - 25, by, 50, 1);
      [cx - 20, cx + 14].forEach(function (x) { PX.r(g, '#20203b', x - 1, 20, 9, 34); PX.r(g, '#cfd3df', x, 21, 7, 33); PX.r(g, '#f3f4f8', x + 1, 21, 2, 33); PX.r(g, '#9aa0b4', x + 5, 21, 2, 33); for (var k = 0; k < 4; k++) PX.r(g, '#d4683c', x, 26 + k * 7, 7, 1); });
      PX.r(g, '#20203b', cx - 27, 14, 54, 9); PX.r(g, '#e4d6bd', cx - 26, 15, 52, 7); PX.r(g, '#f4ead7', cx - 26, 15, 52, 2);
      for (var s = 0; s < 8; s++) PX.r(g, '#d4683c', cx - 24 + s * 7, 18, 1, 4);
      /* tarjetas ventaja / desventaja con flotación */
      var b1 = Math.round(Math.sin(t * 3) * 2), b2 = Math.round(Math.sin(t * 3 + 2) * 2);
      PX.r(g, '#20203b', 4, 22 + b1, 24, 28); PX.r(g, '#dff8e6', 5, 23 + b1, 22, 26); PX.r(g, '#2f9e57', 5, 23 + b1, 22, 6);
      PX.r(g, '#2f9e57', 14, 33 + b1, 4, 12); PX.r(g, '#2f9e57', 10, 37 + b1, 12, 4);
      PX.r(g, '#20203b', 84, 22 + b2, 24, 28); PX.r(g, '#ffd8de', 85, 23 + b2, 22, 26); PX.r(g, '#c2403f', 85, 23 + b2, 22, 6);
      PX.r(g, '#c2403f', 90, 37 + b2, 12, 4);
      [[10, 8, 0], [100, 10, 1.7], [30, 5, 3.1], [80, 6, 4.4], [56, 4, 2.2], [20, 30, 5.1], [95, 45, .6]].forEach(function (p) { sparkle(g, p[0], p[1], t, '#ffd35a', p[2]); });
    },
    sharol: function (g, t, W, H) {
      PX.vgrad(g, 0, 0, W, H, '#ffe98f', '#ffd35a', 6);
      for (var d = 0; d < 20; d++) { PX.line(g, '#20203b18', d * 10 - 20, H, d * 10 + 20, 0); }
      PX.r(g, '#8f93a6', 0, 52, W, 12); PX.r(g, '#6a6e87', 0, 52, W, 2);
      for (var m = 0; m < 14; m++) PX.r(g, '#ffd35a', m * 9 - ((t * 20) | 0) % 9, 58, 5, 1);
      var bob = Math.round(Math.sin(t * 6) * .6);
      PX.truck(g, 31, 25 + bob, t, { scale: 1 });
      /* casco */
      var hy = 8 + Math.round(Math.sin(t * 3) * 2);
      PX.r(g, '#20203b', 8, hy + 6, 30, 3); PX.r(g, '#ffb02e', 9, hy + 7, 28, 1);
      PX.r(g, '#20203b', 12, hy, 22, 7); PX.r(g, '#ffd35a', 13, hy + 1, 20, 6); PX.r(g, '#fff3b0', 15, hy + 1, 8, 2); PX.r(g, '#20203b', 22, hy - 2, 4, 3); PX.r(g, '#ffd35a', 23, hy - 1, 2, 2);
      /* sello de norma */
      PX.r(g, '#20203b', 78, 8, 24, 20); PX.r(g, '#fff', 79, 9, 22, 18); PX.r(g, '#2f9e57', 80, 10, 20, 3);
      for (var q = 0; q < 3; q++) PX.r(g, '#20203b', 83, 16 + q * 3, 14 - q * 3, 1);
      PX.r(g, '#2f9e57', 90, 21, 2, 2); PX.r(g, '#2f9e57', 92, 20, 2, 2); PX.r(g, '#2f9e57', 94, 18, 2, 3);
      [[6, 40, 0], [104, 36, 2], [60, 6, 3.3], [70, 34, 1.1]].forEach(function (p) { sparkle(g, p[0], p[1], t, '#fff', p[2]); });
    },
    laura: function (g, t, W, H) {
      PX.vgrad(g, 0, 0, W, H, '#7fb2f0', '#d8ebff', 8);
      for (var c = 0; c < 3; c++) { var cx = ((t * 3 + c * 44) % (W + 40)) - 20; PX.r(g, '#fff', cx, 8 + c * 9, 18, 4); PX.r(g, '#fff', cx + 4, 6 + c * 9, 10, 3); }
      PX.r(g, '#6b5a43', 0, 52, W, 12); PX.r(g, '#85b84e', 0, 52, W, 2);
      /* edificio que sube por etapas */
      var st = Math.min(4, Math.floor((t % 5.2) / 1.0) + 0);
      var bx = 62, by = 52;
      PX.r(g, '#20203b', bx - 2, by - 2, 44, 3); PX.r(g, '#8f93a6', bx - 1, by - 1, 42, 2);
      for (var f = 0; f < st; f++) {
        var y = by - 10 - f * 11;
        [bx, bx + 18, bx + 36].forEach(function (x) { PX.r(g, '#20203b', x - 1, y - 1, 6, 12); PX.r(g, '#cfd3df', x, y, 4, 11); });
        PX.r(g, '#20203b', bx - 2, y - 3, 44, 4); PX.r(g, '#e4d6bd', bx - 1, y - 2, 42, 2);
        if (f < st - 1 || st === 4) { PX.r(g, '#a6dcf5', bx + 5, y + 2, 11, 6); PX.r(g, '#a6dcf5', bx + 23, y + 2, 11, 6); }
      }
      /* grúa */
      var gx = 24;
      PX.r(g, '#20203b', gx - 2, 8, 6, 46); PX.r(g, '#ffb02e', gx - 1, 9, 4, 45);
      for (var k = 0; k < 8; k++) PX.line(g, '#a8761a', gx - 1, 10 + k * 5, gx + 2, 14 + k * 5);
      PX.r(g, '#20203b', gx - 8, 5, 46, 4); PX.r(g, '#ffb02e', gx - 7, 6, 44, 2);
      PX.r(g, '#20203b', gx - 12, 3, 8, 8); PX.r(g, '#5b5f7a', gx - 11, 4, 6, 6);
      var hx = gx + 28 + Math.round(Math.sin(t * 1.4) * 3), hy = 20 + Math.round((Math.sin(t * 1.4) + 1) * 8);
      PX.r(g, '#20203b', hx, 9, 1, hy - 9); PX.r(g, '#20203b', hx - 3, hy, 7, 5); PX.r(g, '#cfd3df', hx - 2, hy + 1, 5, 3);
      PX.r(g, '#20203b', hx - 1, hy + 5, 3, 9); PX.r(g, '#cfd3df', hx, hy + 5, 1, 8);
      [[8, 20, 0], [100, 12, 1.4], [50, 10, 2.8], [104, 48, 4]].forEach(function (p) { sparkle(g, p[0], p[1], t, '#fff', p[2]); });
    },
    planos: function (g, t, W, H) {
      PX.vgrad(g, 0, 0, W, H, '#8a5fd6', '#ffb3d1', 8);
      for (var i = 0; i < 12; i++) PX.r(g, '#ffffff18', i * 10, 0, 1, H);
      for (var j = 0; j < 7; j++) PX.r(g, '#ffffff18', 0, j * 10, W, 1);
      /* plano que se dibuja */
      PX.r(g, '#20203b', 16, 8, 80, 48); PX.r(g, '#f4f1ff', 17, 9, 78, 46);
      var seg = Math.floor(((t % 6) / 6) * 60);
      var path = [[24, 16, 88, 16], [88, 16, 88, 48], [88, 48, 24, 48], [24, 48, 24, 16], [52, 16, 52, 34], [24, 34, 52, 34], [66, 48, 66, 28], [66, 28, 88, 28]], n = 0;
      path.forEach(function (p) { var len = Math.max(Math.abs(p[2] - p[0]), Math.abs(p[3] - p[1])); for (var s = 0; s <= len; s++) { if (n++ > seg) return; var x = p[0] + (p[2] - p[0]) * s / (len || 1), y = p[1] + (p[3] - p[1]) * s / (len || 1); PX.r(g, '#3f2a86', x - (p[1] === p[3] ? 0 : 0), y, p[1] === p[3] ? 1 : 2, p[1] === p[3] ? 2 : 1); } });
      [[88, 16], [88, 48], [24, 48], [24, 16]].forEach(function (p) { PX.r(g, '#ff6b9a', p[0] - 1, p[1] - 1, 3, 3); });
      PX.r(g, '#20203b', 58, 38, 18, 3); PX.r(g, '#fff', 59, 39, 16, 1);
      /* regla y lápiz */
      PX.r(g, '#20203b', 2, 44, 10, 18); PX.r(g, '#ffd35a', 3, 45, 8, 16); for (var r = 0; r < 6; r++) PX.r(g, '#20203b', 3, 47 + r * 3, 3 + (r % 2) * 2, 1);
      var py = 12 + Math.round(Math.sin(t * 4) * 1);
      PX.r(g, '#20203b', 100, py, 6, 30); PX.r(g, '#ffd35a', 101, py + 1, 4, 24); PX.r(g, '#ff6b9a', 101, py + 25, 4, 3); PX.r(g, '#f2d7b0', 101, py + 28, 4, 2);
      PX.r(g, '#20203b', 100, py + 30, 6, 2);
      [[8, 10, 0], [104, 6, 1.9], [60, 4, 3.4], [6, 30, 4.8]].forEach(function (p) { sparkle(g, p[0], p[1], t, '#fff', p[2]); });
    }
  };
})();
