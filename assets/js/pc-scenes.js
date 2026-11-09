/* ==========================================================
   PIXEL CLUB · escenarios de la selección de personajes
   Cada personaje tiene su propio lugar dibujado en pixel art
   (procedural, sin imágenes externas) y animado.
   Requiere: pc-common.js (PX) y el script principal (G, ST, pick...).
   ========================================================== */
(function () {
  'use strict';
  var R = function (g, c, x, y, w, h) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };

  /* ---------- tipografías pixel: 3x5 (etiquetas) y 5x7 (título) ---------- */
  var F3 = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '101111111111101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111', '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110', '4': '101101111001001', '5': '111100110001110', '6': '011100111101111', '7': '111001010010010', '8': '111101111101111', '9': '111101111001110', '-': '000000111000000', ':': '000010000010000', '.': '000000000000010', '/': '001001010100100', '+': '000010111010000', 'Ó': '010101101101010' };
  var F5 = { A: '01110100011000111111100011000110001', B: '11110100011000111110100011000111110', C: '01111100001000010000100001000001111', E: '11111100001000011110100001000011111', I: '11111001000010000100001000010011111', N: '10001110011010110101100111000110001', O: '01110100011000110001100011000101110', Q: '01110100011000110001101011001001101', R: '11110100011000111110101001001010001', S: '01111100001000001110000010000111110', T: '11111001000010000100001000010000100', U: '10001100011000110001100011000101110' };
  PX.text3 = function (g, txt, x, y, c, s) { s = s || 1; txt = String(txt).toUpperCase(); var cx = x; for (var i = 0; i < txt.length; i++) { var gl = F3[txt[i]]; if (gl) for (var k = 0; k < 15; k++) if (gl[k] === '1') R(g, c, cx + (k % 3) * s, y + ((k / 3) | 0) * s, s, s); cx += 4 * s; } return cx - x; };
  PX.w3 = function (txt, s) { return txt.length * 4 * (s || 1) - (s || 1); };
  PX.text5 = function (g, txt, x, y, c, s) { s = s || 1; var cx = x; for (var i = 0; i < txt.length; i++) { var gl = F5[txt[i]]; if (gl) for (var k = 0; k < 35; k++) if (gl[k] === '1') R(g, c, cx + (k % 5) * s, y + ((k / 5) | 0) * s, s, s); cx += 6 * s; } return cx - x - s; };
  PX.w5 = function (txt, s) { return txt.length * 6 * (s || 1) - (s || 1); };

  /* caja con contorno oscuro + luz superior */
  var bx = function (g, x, y, w, h, c, e) { R(g, e || '#20203b', x, y, w, h); R(g, c, x + 1, y + 1, w - 2, h - 2); R(g, PX.hex(c, 1.18), x + 1, y + 1, w - 2, 1); R(g, PX.hex(c, .78), x + 1, y + h - 2, w - 2, 1); };
  var motes = function (g, W, x0, y0, w, h, t, n, c) { for (var i = 0; i < n; i++) { var px = x0 + ((i * 37.7 + t * (3 + i % 4)) % w), py = y0 + ((i * 53.3 + Math.sin(t * .8 + i) * 4 + t * 2) % h); R(g, c, px, py, 1, 1); } };

  /* =====================================================================
     KIT DE ESCENARIO: profundidad (piso en perspectiva), sombras de contacto,
     haces de luz planos y capas. Todo procedural, sin imágenes externas.
     ===================================================================== */
  var hash = function (n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
  /* sombra de contacto bajo un objeto que apoya en el piso (y = línea de apoyo) */
  var sh = function (g, x, y, w) { g.fillStyle = 'rgba(14,8,30,.34)'; g.fillRect(x | 0, y | 0, w | 0, 3); g.fillRect((x + 2) | 0, (y - 1) | 0, (w - 4) | 0, 1); g.fillRect((x + 3) | 0, (y + 3) | 0, (w - 6) | 0, 1); };
  /* haz de luz inclinado (bandas planas translúcidas, estilo pixel art) */
  var shaft = function (g, col, x, y0, y1, w, slant) { g.fillStyle = col; for (var y = y0; y < y1; y++) g.fillRect((x + (y - y0) * slant) | 0, y, w, 1); };
  /* piso en perspectiva: columnas que convergen a (vx,vy); modo 'tile' = damero, 'plank' = tablones */
  function floorP(g, W, wh, H, o) {
    var vx = o.vx, vy = o.vy, hh = H - vy, D = hh * hh / (o.td || 20);
    for (var y = wh; y < H; y++) {
      var k = (y - vy) / hh, sp = o.step * k, zb = Math.floor(D / (y - vy)), i0 = Math.floor((0 - vx) / sp) - 1, i1 = Math.ceil((W - vx) / sp) + 1;
      for (var i = i0; i <= i1; i++) {
        var xa = vx + i * sp, xb = xa + sp; if (xb <= 0 || xa >= W) continue;
        var c = o.mode === 'tile' ? (((i + zb) & 1) ? o.A : o.B) : (hash(i * 3.1) > .72 ? o.C : ((i & 1) ? o.A : o.B));
        var xs = Math.max(0, xa); g.fillStyle = c; g.fillRect(xs | 0, y, Math.ceil(xb - xs), 1);
        if (xa >= 0) { g.fillStyle = o.line; g.fillRect(xa | 0, y, 1, 1); }
      }
      if (o.mode === 'tile' && zb !== Math.floor(D / (y + 1 - vy))) { g.fillStyle = o.line; g.fillRect(0, y, W, 1); }
    }
  }
  /* alfombra en perspectiva (trapecio) */
  function rugP(g, cxr, y0, y1, w0, w1, main, edge, dot) {
    for (var y = y0; y <= y1; y++) {
      var t = (y - y0) / (y1 - y0), w = w0 + (w1 - w0) * t, x = cxr - w / 2;
      g.fillStyle = '#20203b'; g.fillRect((x - 1) | 0, y, (w + 2) | 0, 1);
      g.fillStyle = (y === y0 || y === y1 || y === y0 + 2 || y === y1 - 2) ? edge : main; g.fillRect(x | 0, y, w | 0, 1);
      g.fillStyle = edge; g.fillRect((x + 2) | 0, y, 1, 1); g.fillRect((x + w - 3) | 0, y, 1, 1);
      if (dot && (y - y0) % 4 === 2) for (var d = 10; d < w - 10; d += 12) { g.fillStyle = dot; g.fillRect((x + d) | 0, y, 4, 1); }
    }
  }
  /* planta de interior (maceta con hojas anchas) apoyada en y */
  function plant(g, x, y, s, pot, leaf, leaf2) {
    sh(g, x - 2, y, 14 * s + 4);
    var cx = x + 7 * s, by = y - 9 * s, i;
    for (i = 0; i < 7; i++) {
      var a = -1.35 + i * .45, len = (13 + (i % 3) * 5) * s, tx = cx + Math.sin(a) * len * .8, ty = by - Math.cos(a) * len * .95 - 4;
      PX.line(g, '#20203b', cx + 1, by, tx + 1, ty); PX.line(g, '#20203b', cx - 1, by, tx - 1, ty); PX.line(g, '#20203b', cx, by, tx, ty - 1);
      PX.line(g, i % 2 ? leaf : leaf2, cx, by, tx, ty);
      R(g, '#20203b', tx - 2, ty - 2, 5, 5); R(g, i % 2 ? leaf2 : leaf, tx - 1, ty - 1, 3, 3);
    }
    R(g, '#20203b', x, by, 14 * s, 9 * s); R(g, pot, x + 1, by + 1, 14 * s - 2, 9 * s - 2); R(g, PX.hex(pot, 1.25), x + 1, by + 1, 14 * s - 2, 2); R(g, PX.hex(pot, .75), x + 1, by + 9 * s - 3, 14 * s - 2, 2);
  }

  /* =====================================================================
     SHAROL · laboratorio de normas (amarillo)
     La ventana es un PORTAL: el exterior (cielo, ciudad, grúa, calle y camión)
     se dibuja recortado dentro del vidrio y SIEMPRE antes que el marco, el
     travesaño, la persiana, los reflejos y los objetos de la repisa. Así el
     camión queda en el plano exterior, detrás del cristal, y pasa por detrás
     del travesaño sin atravesar nunca el marco.
     ===================================================================== */
  function shaStatic(g, W, H, L) {
    var wh = L.wh, tb = wh - 36, y, x;
    PX.vgrad(g, 0, 0, W, wh, '#ffe27a', '#fff4c4', 10);
    for (x = 0; x < W; x += 16) R(g, '#ffffff14', x, 0, 6, wh);
    R(g, '#c99a14', 0, 0, W, 5); R(g, '#fff3b0', 0, 5, W, 1); R(g, '#00000022', 0, 6, W, 3);
    /* zócalo de azulejo */
    R(g, '#e6b422', 0, tb, W, 36); for (x = 0; x < W; x += 12) R(g, '#fff3b0', x, tb, 1, 36); for (y = tb; y < wh; y += 12) R(g, '#fff3b0', 0, y, W, 1);
    R(g, '#20203b', 0, tb - 1, W, 1); R(g, '#c99a14', 0, tb, W, 2); R(g, '#8a6a10', 0, wh - 3, W, 3);
    /* piso de baldosa en perspectiva */
    floorP(g, W, wh, H, { mode: 'tile', vx: (W * .3) | 0, vy: wh - 80, step: 48, A: '#efdfab', B: '#d8c27e', line: '#b89c58', td: 22 });
    R(g, 'rgba(0,0,0,.38)', 0, wh, W, 2);

    /* vano de la ventana: moldura de pared (el contenido lo dibuja shaAnim) */
    var wx = 14, wy = 20, ww = 96, hh = Math.max(46, Math.min(94, tb - wy - 24));
    L.wx = wx; L.wy = wy; L.ww = ww; L.hh = hh;
    R(g, '#20203b', wx - 5, wy - 5, ww + 10, hh + 10); R(g, '#fff6d6', wx - 4, wy - 4, ww + 8, hh + 8); R(g, '#e6b422', wx - 4, wy - 4, ww + 8, 1); R(g, '#20203b', wx - 1, wy - 1, ww + 2, hh + 2);
    R(g, 'rgba(0,0,0,.18)', wx + ww + 5, wy, 3, hh + 6); /* sombra proyectada de la moldura */
    /* repisa exterior: cara superior clara y frente oscuro (perspectiva desde abajo) */
    R(g, '#20203b', wx - 9, wy + hh + 4, ww + 18, 7); R(g, '#fff6d6', wx - 8, wy + hh + 5, ww + 16, 2); R(g, '#c99a14', wx - 8, wy + hh + 7, ww + 16, 3);
    R(g, 'rgba(0,0,0,.2)', wx - 8, wy + hh + 11, ww + 16, 3);

    /* luz de la ventana sobre el piso: 3 parches con la sombra del travesaño */
    for (y = wh + 3; y < H; y++) { var o = (y - wh) * .8; for (var p = 0; p < 2; p++) R(g, 'rgba(255,248,200,.30)', wx + 6 + p * 46 + o, y, 40, 1); }

    /* cartel de recubrimiento (centro, sobre la cabeza del personaje) */
    var px = 132, py = 16;
    bx(g, px - 3, py - 3, 108, 78, '#8a5a3a'); R(g, '#fffdf0', px, py, 102, 72);
    R(g, '#c2403f', px, py, 102, 11); PX.text3(g, 'RECUBRIMIENTO', px + 15, py + 3, '#fff', 1);
    R(g, '#20203b', px + 16, py + 20, 70, 38); R(g, '#b6bac9', px + 17, py + 21, 68, 36); R(g, '#8f93a6', px + 24, py + 28, 54, 22);
    [[28, 32], [70, 32], [28, 43], [70, 43]].forEach(function (q) { R(g, '#d4683c', px + q[0], py + q[1], 4, 4); });
    R(g, '#9a4423', px + 28, py + 34, 46, 1); R(g, '#9a4423', px + 28, py + 45, 46, 1);
    R(g, '#c2403f', px + 17, py + 61, 7, 1); R(g, '#c2403f', px + 17, py + 59, 1, 5); R(g, '#c2403f', px + 24, py + 59, 1, 5); PX.text3(g, '75 MM', px + 30, py + 60, '#20203b', 1);
    R(g, '#c2403f', px + 78, py + 21, 1, 7); PX.text3(g, 'SUELO', px + 70, py + 62, '#6a3d22', 1);

    /* mesón bajo la ventana con probetas y cono de asentamiento */
    var ct = wh - 14, bw = 112, bx0 = 6;
    bx(g, bx0, ct, bw, 7, '#b8b2a4'); R(g, '#6a6e87', bx0 + 2, ct + 7, bw - 4, 36); R(g, '#7e82a0', bx0 + 2, ct + 7, bw - 4, 2);
    for (var d = 0; d < 3; d++) { var dx = bx0 + 6 + d * 35; R(g, '#20203b', dx, ct + 12, 30, 26); R(g, '#8f93aa', dx + 1, ct + 13, 28, 24); R(g, '#b0b4c6', dx + 1, ct + 13, 28, 2); R(g, '#20203b', dx + 11, ct + 24, 8, 3); }
    sh(g, bx0 - 2, ct + 43, bw + 4);
    for (var c = 0; c < 4; c++) { var cx = bx0 + 8 + c * 10; R(g, '#20203b', cx, ct - 19, 9, 19); R(g, '#c8ccd6', cx + 1, ct - 18, 7, 17); R(g, '#eef0f6', cx + 2, ct - 18, 2, 17); R(g, '#8f93aa', cx + 6, ct - 18, 2, 17); R(g, '#a39d90', cx + 1, ct - 18, 7, 2); }
    R(g, '#20203b', bx0 + 56, ct - 22, 22, 22); R(g, '#d4683c', bx0 + 58, ct - 20, 18, 20); R(g, '#9a4423', bx0 + 58, ct - 20, 18, 2); R(g, '#ff9a5e', bx0 + 60, ct - 14, 3, 12);
    R(g, '#20203b', bx0 + 84, ct - 7, 22, 7); R(g, '#8f93a6', bx0 + 85, ct - 6, 20, 5); R(g, '#ffd35a', bx0 + 88, ct - 5, 2, 3); R(g, '#ffd35a', bx0 + 94, ct - 5, 2, 3); R(g, '#ffd35a', bx0 + 100, ct - 5, 2, 3);

    /* estante de normas (derecha, alto) */
    var sx = 254, sy = 30;
    bx(g, sx, sy + 20, 82, 4, '#8a5a3a'); bx(g, sx, sy + 52, 82, 4, '#8a5a3a');
    var cols = ['#c2403f', '#3f6fd0', '#2f9e57', '#8a5fd6', '#ff8fb8', '#20203b'];
    for (var k = 0; k < 11; k++) { var bh = 15 + (k * 5) % 4; R(g, '#20203b', sx + 3 + k * 7, sy + 20 - bh, 7, bh); R(g, cols[k % 6], sx + 4 + k * 7, sy + 21 - bh, 5, bh - 1); R(g, '#ffffff66', sx + 5 + k * 7, sy + 23 - bh, 1, bh - 5); }
    PX.text3(g, 'NSR-10', sx + 4, sy - 4, '#6a3d22', 1);
    for (var m = 0; m < 3; m++) { R(g, '#20203b', sx + 4 + m * 26, sy + 36, 24, 16); R(g, '#c9a96a', sx + 5 + m * 26, sy + 37, 22, 14); R(g, '#a8895a', sx + 5 + m * 26, sy + 37, 22, 3); R(g, '#fff', sx + 10 + m * 26, sy + 43, 12, 4); }
    /* cartel de casco obligatorio */
    R(g, '#20203b', 318, 72, 28, 28); R(g, '#2f6fd0', 319, 73, 26, 26); PX.circ(g, '#fff', 332, 89, 8); R(g, '#ffb02e', 325, 83, 14, 6); R(g, '#20203b', 324, 89, 16, 2); PX.text3(g, 'EPP', 325, 75, '#fff', 1);

    /* prensa de compresión sobre el piso, con franjas de seguridad */
    var mx = 262, ym = wh + 27;
    for (var s = 0; s < 8; s++) R(g, s % 2 ? '#20203b' : '#ffd35a', mx - 8 + s * 8, ym + 2, 8, 3);
    sh(g, mx - 6, ym + 1, 62);
    bx(g, mx - 5, ym - 9, 56, 9, '#6a6e87'); bx(g, mx, ym - 82, 6, 74, '#c2403f'); bx(g, mx + 39, ym - 82, 6, 74, '#c2403f'); bx(g, mx - 3, ym - 92, 52, 11, '#c2403f');
    bx(g, mx + 14, ym - 32, 18, 5, '#8f93aa'); bx(g, mx + 17, ym - 28, 12, 20, '#c8ccd6'); R(g, '#eef0f6', mx + 19, ym - 27, 3, 18); bx(g, mx + 19, ym - 76, 8, 44, '#b0b4c6');
    bx(g, mx + 6, ym - 8, 20, 5, '#1d3a32'); R(g, '#5eea6a', mx + 8, ym - 7, 8, 3);
    L.pm = { x: mx + 23, y: ym - 104 }; L.gz = { x: mx + 8, y: ym - 7 };
    PX.circ(g, '#20203b', L.pm.x, L.pm.y, 10); PX.circ(g, '#f7f7ff', L.pm.x, L.pm.y, 8); PX.circ(g, '#e4e6f0', L.pm.x, L.pm.y + 2, 5);
    for (var tk = 0; tk < 12; tk++) { var an = -2.4 + tk * .45; R(g, '#20203b', L.pm.x + Math.round(Math.cos(an) * 7), L.pm.y + Math.round(Math.sin(an) * 7), 1, 1); }
    R(g, '#20203b', mx + 21, ym - 94, 4, 3);
  }

  /* exterior + interior de la ventana, en el orden correcto de capas */
  function shaWindow(g, t, L) {
    var wx = L.wx, wy = L.wy, ww = L.ww, hh = L.hh, F = 5;
    var gx = wx + F, gy = wy + F, gw = ww - 2 * F, gh = hh - 2 * F, st = gy + gh - 26 /* línea de la calle */, i;
    /* ---- 1. EXTERIOR (recortado al vidrio) ---- */
    g.save(); g.beginPath(); g.rect(gx, gy, gw, gh); g.clip();
    PX.vgrad(g, gx, gy, gw, gh, '#69b6ec', '#eaf8ff', 10);
    PX.circ(g, '#fff6c8', gx + gw - 20, gy + 18, 9); PX.circ(g, '#fffbe6', gx + gw - 20, gy + 18, 6);
    for (i = 0; i < 3; i++) { var cx = gx + ((t * 2.2 + i * 70) % (gw + 56)) - 28, cy = gy + 8 + i * 12; R(g, '#fff', cx, cy, 24, 5); R(g, '#fff', cx + 5, cy - 3, 14, 4); R(g, '#dcecff', cx, cy + 4, 24, 1); }
    /* ciudad: dos capas con parallax (se desplazan despacio, repitiendo) */
    [[14, 1.4, '#a9c6ea', '#c3d8f2', 22, 20], [12, 3.0, '#86a6d8', '#9cb9e4', 14, 28]].forEach(function (ly) {
      var bw = ly[0], sh0 = t * ly[1], bi = Math.floor(sh0 / bw), off = -(sh0 % bw);
      for (var j = -1; j < Math.ceil(gw / bw) + 2; j++) { var h = ly[4] + hash(j + bi) * ly[5], bxx = gx + off + j * bw; R(g, ly[2], bxx, st - h, bw - 1, h + 1); R(g, ly[3], bxx, st - h, bw - 1, 2); if (h > 26) for (var q = st - h + 5; q < st - 4; q += 6) R(g, ly[3], bxx + 3, q, 2, 2); }
    });
    /* grúa torre lejana con carga que oscila */
    var tx0 = gx + (gw * .74 | 0), top = gy + 10;
    for (i = top + 4; i < st; i += 5) { R(g, '#6b7aa0', tx0 - 3, i, 7, 1); R(g, '#6b7aa0', tx0 - 3, i, 1, 5); R(g, '#6b7aa0', tx0 + 3, i, 1, 5); PX.line(g, '#8b9ac0', tx0 - 3, i, tx0 + 3, i + 5); }
    R(g, '#6b7aa0', tx0 - 40, top, 56, 2); R(g, '#ffb02e', tx0 - 40, top, 56, 1); R(g, '#8b9ac0', tx0 + 8, top - 5, 7, 6);
    var hk = tx0 - 26 + Math.round(Math.sin(t * .8) * 6), hl = 12 + Math.round((Math.sin(t * .9) + 1) * 7);
    R(g, '#6b7aa0', hk, top + 2, 1, hl); R(g, '#20203b', hk - 3, top + 2 + hl, 7, 4); R(g, '#d4683c', hk - 2, top + 3 + hl, 5, 2);
    /* acera + calle */
    R(g, '#c3c8d8', gx, st, gw, 5); R(g, '#e6e9f2', gx, st, gw, 1); R(g, '#8f93a6', gx, st + 5, gw, 2);
    R(g, '#5b5f7a', gx, st + 7, gw, gh); R(g, '#6a6e87', gx, st + 7, gw, 2);
    for (i = 0; i < gw; i += 14) R(g, '#ffd35a', gx + i, st + 17, 8, 1);
    /* camión mezclador: cruza de izquierda a derecha, rueda sobre la calle (nunca fuera del vidrio) */
    var V = 34, path = gw + 80, cyc = path / V + 2.6, ph = (t % cyc) * V, tx = gx - 58 + Math.min(ph, path);
    if (ph < path) {
      var ty = gy + gh - 34, bob = Math.sin(t * 17) > .55 ? 1 : 0;
      PX.truck(g, tx, ty + bob, t, { shadow: true });
      if (((t * 9) | 0) % 2 === 0) { R(g, 'rgba(255,255,255,.45)', tx - 2, ty + 26, 3, 2); R(g, 'rgba(255,255,255,.3)', tx - 6, ty + 24, 2, 2); }
    }
    g.restore();
    /* ---- 2. INTERIOR (siempre por delante del exterior) ---- */
    /* marco blanco con filo oscuro */
    var fr = function (x, y, w, h) { R(g, '#20203b', x, y, w, h); R(g, '#fff6d6', x + 1, y + 1, w - 2, h - 2); };
    fr(wx, wy, ww, F); fr(wx, wy + hh - F, ww, F); fr(wx, wy, F, hh); fr(wx + ww - F, wy, F, hh);
    R(g, '#e6b422', wx + 1, wy + hh - 2, ww - 2, 1);
    /* travesaño vertical y horizontal: el camión pasa POR DETRÁS */
    var mxv = gx + (gw >> 1) - 2; fr(mxv, gy, 5, gh); fr(gx, gy + (gh * .36 | 0), gw, 4);
    /* sombra de profundidad del vano (jamba) y reflejos en el cristal */
    R(g, 'rgba(0,0,0,.18)', gx, gy, gw, 2); R(g, 'rgba(0,0,0,.14)', gx, gy, 2, gh);
    g.save(); g.beginPath(); g.rect(gx, gy, gw, gh); g.clip();
    for (i = 0; i < gh; i++) { R(g, 'rgba(255,255,255,.20)', gx + 10 + i * .75, gy + i, 7, 1); R(g, 'rgba(255,255,255,.12)', gx + 22 + i * .75, gy + i, 3, 1); }
    g.restore();
    /* persiana veneciana recogida (parte alta) */
    for (i = 0; i < 4; i++) { R(g, '#20203b', gx, gy + i * 3, gw, 1); R(g, '#fff0b0', gx, gy + i * 3 + 1, gw, 2); }
    R(g, '#20203b', gx + 6, gy + 12, 1, 14); R(g, '#c2403f', gx + 5, gy + 26, 3, 3);
    /* objetos sobre la repisa (plano interior): casco y planta */
    var by = wy + hh - F;
    R(g, '#20203b', gx + 5, by - 11, 17, 11); R(g, '#ffd35a', gx + 6, by - 10, 15, 10); R(g, '#fff3b0', gx + 8, by - 9, 6, 2); R(g, '#20203b', gx + 2, by - 3, 23, 3); R(g, '#ffb02e', gx + 3, by - 2, 21, 1);
    var px = gx + gw - 24; R(g, '#20203b', px, by - 9, 13, 9); R(g, '#d4683c', px + 1, by - 8, 11, 8); R(g, '#e8864f', px + 1, by - 8, 11, 2);
    for (i = 0; i < 5; i++) { var lx = px + 6 + (i - 2) * 4, ly = by - 17 - (i % 2) * 5; PX.line(g, '#20203b', px + 6, by - 9, lx, ly); R(g, '#20203b', lx - 2, ly - 2, 5, 4); R(g, '#3fae5a', lx - 1, ly - 1, 3, 2); }
  }

  function shaAnim(g, W, H, t, L) {
    shaWindow(g, t, L);
    /* manómetro de la prensa y luz del display */
    var p = L.pm, a = -2.3 + (Math.sin(t * .9) + 1) * 1.05; PX.line(g, '#c2403f', p.x, p.y + 2, p.x + Math.cos(a) * 6, p.y + 2 + Math.sin(a) * 6);
    R(g, ((t * 2) | 0) % 2 ? '#5eea6a' : '#2f9e57', L.gz.x, L.gz.y, 8, 3);
    /* tubos fluorescentes: uno parpadea; conos de luz planos */
    [[132, 1], [246, 0]].forEach(function (lp) {
      var lx = lp[0], on = lp[1] ? (((t * 7) | 0) % 23 !== 0) : true;
      R(g, '#20203b', lx - 1, 0, 1, 11); R(g, '#20203b', lx + 49, 0, 1, 11); R(g, '#20203b', lx - 3, 11, 56, 5); R(g, on ? '#ffffff' : '#c8ccd6', lx - 2, 12, 54, 3);
      if (on) { shaft(g, 'rgba(255,255,230,.09)', lx - 3, 16, 70, 56, 0); shaft(g, 'rgba(255,255,230,.07)', lx + 3, 16, 70, 44, 0); }
    });
    motes(g, W, 20, 40, 100, 90, t, 10, '#fff8c8');
  }

  /* =====================================================================
     ISAMAR · estudio de conceptos (vino y madera)
     ===================================================================== */
  function isaStatic(g, W, H, L) {
    var wh = L.wh, bw = wh - 34, x, y;
    PX.vgrad(g, 0, 0, W, wh, '#33091c', '#7a1a40', 14);
    for (x = 0; x < W; x += 14) R(g, '#ffffff09', x, 0, 5, wh);
    R(g, '#1d0612', 0, 0, W, 6); R(g, '#a8566f', 0, 6, W, 1); R(g, '#00000033', 0, 7, W, 3);
    /* boiserie */
    R(g, '#2a0a17', 0, bw, W, 34); R(g, '#a8566f', 0, bw, W, 2); R(g, '#5c1a35', 0, bw + 2, W, 1);
    for (x = 6; x < W; x += 44) { R(g, '#3c1022', x, bw + 7, 36, 22); R(g, '#1d0612', x, bw + 7, 36, 1); R(g, '#6b2845', x, bw + 28, 36, 1); R(g, '#6b2845', x + 35, bw + 7, 1, 22); }
    R(g, '#1d0612', 0, wh - 4, W, 4); R(g, '#a8566f', 0, wh - 4, W, 1);
    /* piso de madera en perspectiva */
    floorP(g, W, wh, H, { mode: 'plank', vx: (W * .3) | 0, vy: wh - 70, step: 46, A: '#8a5a3a', B: '#7d4f32', C: '#9a6a44', line: '#5e3a24' });
    R(g, 'rgba(0,0,0,.4)', 0, wh, W, 2);

    /* ventana al atardecer, con cortinas */
    var wx = 22, wy = 24, ww = 78, hh = Math.max(46, Math.min(96, bw - wy - 12));
    L.win = { x: wx, y: wy, w: ww, h: hh };
    R(g, '#20203b', wx - 5, wy - 5, ww + 10, hh + 10); R(g, '#6a3d22', wx - 4, wy - 4, ww + 8, hh + 8); R(g, '#20203b', wx - 1, wy - 1, ww + 2, hh + 2);
    PX.vgrad(g, wx, wy, ww, hh, '#4b2a6e', '#ff9a6e', 12);
    PX.circ(g, '#ffe9a8', wx + 52, wy + hh - 24, 9); PX.circ(g, '#fff6d0', wx + 52, wy + hh - 24, 6);
    for (x = 0; x < ww; x += 9) { var h = 16 + hash(x * .3) * 34; R(g, '#3a2160', wx + x, wy + hh - h - 8, 9, h + 8); R(g, '#4e3478', wx + x, wy + hh - h - 8, 9, 1); }
    for (x = 0; x < ww; x += 6) R(g, '#2a1a45', wx + x, wy + hh - 8, 6, 8);
    R(g, '#3b1a12', wx + (ww >> 1) - 1, wy, 3, hh); R(g, '#3b1a12', wx, wy + (hh * .42 | 0), ww, 3);
    for (y = 0; y < hh; y++) { R(g, 'rgba(255,255,255,.12)', wx + 8 + y * .6, wy + y, 6, 1); R(g, 'rgba(255,255,255,.07)', wx + 20 + y * .6, wy + y, 3, 1); }
    R(g, '#a8566f', wx - 8, wy + hh + 4, ww + 16, 4); R(g, '#20203b', wx - 8, wy + hh + 8, ww + 16, 1); R(g, 'rgba(0,0,0,.25)', wx - 8, wy + hh + 9, ww + 16, 3);
    /* cortinas con pliegues y barra */
    R(g, '#20203b', wx - 22, wy - 14, ww + 44, 4); R(g, '#d6a35a', wx - 22, wy - 13, ww + 44, 2); PX.circ(g, '#d6a35a', wx - 22, wy - 12, 3); PX.circ(g, '#d6a35a', wx + ww + 22, wy - 12, 3);
    [[wx - 18, 24], [wx + ww - 6, 24]].forEach(function (c) {
      for (var i = 0; i < 24; i += 3) { R(g, '#20203b', c[0] + i, wy - 10, 1, hh + 12); R(g, (i / 3) % 2 ? '#7a1f40' : '#5a1530', c[0] + i + 1, wy - 10, 2, hh + 12); }
      R(g, '#d6a35a', c[0] + 3, wy + (hh * .55 | 0), 18, 3);
    });
    /* charco de luz de la ventana sobre el piso */
    for (y = wh + 3; y < H; y++) { var o = (y - wh) * .85; for (var p = 0; p < 2; p++) R(g, 'rgba(255,196,130,.20)', wx + 6 + p * 42 + o, y, 34, 1); }

    /* pizarra con el sistema aporticado */
    var px = 128, py = 20, pw = 118, ph = 68;
    bx(g, px - 4, py - 4, pw + 8, ph + 8, '#7a4a2a'); R(g, '#1d3a32', px, py, pw, ph); R(g, '#2c5446', px, py, pw, 1); R(g, '#16302a', px, py + ph - 2, pw, 2);
    PX.text3(g, 'SISTEMA APORTICADO', px + ((pw - 71) >> 1), py + 5, '#e9f4ee', 1);
    var ch = '#f4f1e6';
    R(g, ch, px + 26, py + 28, 3, 28); R(g, ch, px + pw - 29, py + 28, 3, 28); R(g, ch, px + 21, py + 24, pw - 42, 3); R(g, ch, px + 16, py + 57, pw - 32, 1);
    for (var k = 0; k < 13; k++) R(g, ch, px + 16 + k * 7, py + 58, 3, 2);
    PX.text3(g, 'LOSA', px + 49, py + 15, '#ffd35a', 1); PX.text3(g, 'VIGA', px + 49, py + 31, '#9fd3f0', 1); PX.text3(g, 'COLUMNA', px + 40, py + 42, '#f0a9c1', 1);
    R(g, '#6a3d22', px - 2, py + ph + 1, pw + 4, 4); R(g, '#fff', px + 8, py + ph, 6, 2); R(g, '#f0a9c1', px + 17, py + ph, 5, 2); R(g, '#20203b', px + pw - 24, py + ph - 3, 16, 4); R(g, '#8f6f3a', px + pw - 23, py + ph - 2, 14, 2);

    /* plano enmarcado y repisa con maquetas */
    var fx = 262, fy2 = 14;
    bx(g, fx - 3, fy2 - 3, 62, 36, '#6a3d22'); R(g, '#1646a8', fx, fy2, 56, 30); R(g, '#bcd8fa', fx + 4, fy2 + 4, 48, 1); R(g, '#bcd8fa', fx + 4, fy2 + 25, 48, 1);
    [8, 26, 44].forEach(function (c) { R(g, '#ffffff', fx + c, fy2 + 8, 2, 14); }); R(g, '#ffffff', fx + 6, fy2 + 7, 42, 2); R(g, '#ffd35a', fx + 12, fy2 + 13, 12, 1);
    var ry = 66; bx(g, 256, ry, 82, 5, '#8a5a3a'); R(g, 'rgba(0,0,0,.22)', 256, ry + 5, 82, 3);
    [262, 292].forEach(function (mx) { R(g, '#20203b', mx - 1, ry - 22, 6, 22); R(g, '#e8e4f8', mx, ry - 21, 4, 21); R(g, '#20203b', mx + 21, ry - 22, 6, 22); R(g, '#e8e4f8', mx + 22, ry - 21, 4, 21); R(g, '#20203b', mx - 3, ry - 27, 33, 6); R(g, '#e4d6bd', mx - 2, ry - 26, 31, 4); });
    R(g, '#20203b', 322, ry - 10, 12, 10); R(g, '#3f6fd0', 323, ry - 9, 10, 8); R(g, '#20203b', 324, ry - 15, 10, 6); R(g, '#c2403f', 325, ry - 14, 8, 4);

    /* escritorio (mitad de profundidad) con maqueta de pórtico, lámpara y taza */
    var dx = 258, dt = wh - 6, dc = wh + 27;
    sh(g, dx - 2, dc, 84);
    bx(g, dx, dt, 80, 6, '#9a6a44'); R(g, '#20203b', dx + 4, dt + 6, 5, dc - dt - 6); R(g, '#20203b', dx + 71, dt + 6, 5, dc - dt - 6); R(g, '#6a3d22', dx + 5, dt + 6, 3, dc - dt - 6); R(g, '#6a3d22', dx + 72, dt + 6, 3, dc - dt - 6);
    bx(g, dx + 46, dt + 6, 24, 16, '#7a4a2a'); R(g, '#d6a35a', dx + 56, dt + 13, 5, 2); R(g, '#7a4a2a', dx + 10, dt + 8, 34, 4);
    var mb = dt; L.mb = mb; L.mx = dx + 18;
    [10, 44].forEach(function (c) { R(g, '#20203b', dx + c - 1, mb - 27, 6, 27); R(g, '#e8e4f8', dx + c, mb - 26, 4, 26); R(g, '#9aa0b4', dx + c + 2, mb - 26, 2, 26); });
    R(g, '#20203b', dx + 7, mb - 31, 44, 6); R(g, '#f4ead7', dx + 8, mb - 30, 42, 4); R(g, '#20203b', dx + 7, mb - 17, 44, 4); R(g, '#e4d6bd', dx + 8, mb - 16, 42, 2); R(g, '#d4683c', dx + 10, mb - 30, 38, 1);
    bx(g, dx + 62, mb - 9, 8, 9, '#ffd35a'); R(g, '#20203b', dx + 70, mb - 7, 3, 4);
    R(g, '#20203b', dx + 74, mb - 22, 2, 22); R(g, '#7a5230', dx + 73, mb - 24, 4, 4); /* regla T apoyada */
    L.mug = { x: dx + 66, y: mb - 9 };
    /* lámpara de brazo */
    R(g, '#20203b', dx + 2, mb - 3, 10, 3); R(g, '#c2403f', dx + 3, mb - 2, 8, 2); PX.line(g, '#20203b', dx + 7, mb - 3, dx + 2, mb - 22); PX.line(g, '#20203b', dx + 2, mb - 22, dx + 12, mb - 30); R(g, '#20203b', dx + 9, mb - 34, 9, 6); R(g, '#c2403f', dx + 10, mb - 33, 7, 4);

    /* alfombra y planta en perspectiva */
    rugP(g, 190, wh + 12, H - 4, 120, 210, '#6b1d3a', '#e7a0b8', '#ffd35a');
    plant(g, 4, wh + 34, 1, '#c2403f', '#2f9e57', '#3fae5a');
  }
  function isaAnim(g, W, H, t, L) {
    var w = L.win, i;
    /* ventanas de la ciudad que se encienden y apagan */
    for (i = 0; i < 14; i++) { var bxx = w.x + 3 + (i % 7) * 11, byy = w.y + w.h - 14 - ((i * 7) % 5) * 6 - ((i / 7) | 0) * 9; if (Math.sin(t * .6 + i * 2.3) > -.2) R(g, '#ffd9a0', bxx, byy, 2, 2); }
    /* lámpara colgante que se mece, con cono de luz plano */
    var lx = 116, sw = Math.round(Math.sin(t * 1.3) * 2), ly = 34;
    R(g, '#20203b', lx, 0, 1, ly - 1); R(g, '#20203b', lx + sw - 9, ly, 19, 9); R(g, '#c2403f', lx + sw - 8, ly + 1, 17, 7); R(g, '#e86a68', lx + sw - 8, ly + 1, 17, 2); R(g, '#fff0b0', lx + sw - 5, ly + 9, 11, 2);
    for (i = 0; i < 70; i++) { var cw = 14 + i * .8; R(g, 'rgba(255,217,160,' + (.11 - i * .0011).toFixed(3) + ')', lx + sw - cw / 2, ly + 11 + i, cw, 1); }
    /* flechas de carga sobre la maqueta del escritorio */
    var ph = ((t * 4) | 0) % 4;
    [12, 28, 44].forEach(function (x) { var a = L.mb - 46 + ph * 2, X = L.mx + x - 12; R(g, '#ffd35a', X, a, 2, 6); R(g, '#ffd35a', X - 2, a + 6, 6, 1); R(g, '#ffd35a', X - 1, a + 7, 4, 1); R(g, '#ffd35a', X, a + 8, 2, 1); });
    /* vapor de la taza */
    for (i = 0; i < 3; i++) R(g, 'rgba(255,255,255,.55)', L.mug.x + 3 + Math.round(Math.sin(t * 2 + i) * 1), L.mug.y - 4 - i * 3 - ((t * 5) | 0) % 3, 1, 2);
    motes(g, W, w.x, w.y + 20, 110, 130, t, 14, '#fff0b0');
  }

  /* =====================================================================
     LAURA · obra en proceso (azul): ciudad lejana, estructura de concreto
     en dos niveles, andamio, grúa torre y herramientas en el terreno
     ===================================================================== */
  function lauStatic(g, W, H, L) {
    var wh = L.wh, fy = L.fy, hz = wh - 6, y0 = wh + 8, x, y;
    PX.vgrad(g, 0, 0, W, hz, '#4a92ea', '#d9edff', 16);
    PX.circ(g, '#fff4b8', 66, 36, 15); PX.circ(g, '#fff9d6', 66, 36, 11); PX.circ(g, '#ffffff', 66, 36, 7);
    /* ciudad lejana: dos capas con neblina atmosférica */
    [['#b4cdea', '#cfe0f4', 13, 14, 26, 0], ['#8fb0dc', '#a9c4e8', 15, 18, 34, 5]].forEach(function (ly) {
      for (x = -4; x < W; x += ly[2]) { var bh = ly[3] + hash(x * .21 + ly[5]) * ly[4]; R(g, ly[0], x, hz - bh, ly[2] - 1, bh + 2); R(g, ly[1], x, hz - bh, ly[2] - 1, 2); for (var wy = hz - bh + 5; wy < hz - 4; wy += 6) { R(g, ly[1], x + 3, wy, 2, 2); R(g, ly[1], x + 8, wy + 3, 2, 2); } }
    });
    R(g, '#c8def5', 0, hz - 6, W, 8);
    /* terreno: pasto, tierra apisonada con huellas de neumático en perspectiva y gravilla */
    R(g, '#5f8a36', 0, hz - 2, W, 5); R(g, '#7fb04a', 0, hz - 2, W, 1);
    PX.vgrad(g, 0, hz + 3, W, H - hz, '#9a7a52', '#6b5034', 8);
    for (var k = 0; k < 2; k++) for (y = hz + 5; y < H; y++) { var tt = (y - hz) / (H - hz); R(g, 'rgba(60,40,24,.28)', (W * .3 + (k ? 1 : -1) * (30 + tt * 220)) | 0, y, 3 + tt * 3, 1); }
    for (var s = 0; s < 150; s++) { var sx = hash(s) * W, sy = hz + 6 + hash(s + 50) * (H - hz - 6); R(g, hash(s + 9) > .5 ? '#b89870' : '#5b4128', sx, sy, 1 + (s % 3 === 0), 1); }

    /* ESTRUCTURA: contacto en y0. Luz desde arriba-izquierda: filo claro a la izquierda y cara oscura a la derecha */
    var cols = [84, 138, 192, 246], sw = 190;
    var col = function (cx, top, h, c) { bx(g, cx - 4, top, 9, h, c); R(g, '#f1f2f8', cx - 3, top + 1, 2, h - 2); R(g, PX.hex(c, .74), cx + 3, top + 1, 1, h - 2); };
    sh(g, 66, y0 + 2, sw + 36);
    cols.forEach(function (c) { R(g, '#20203b', c - 8, y0 - 4, 17, 5); R(g, '#9aa0b4', c - 7, y0 - 3, 15, 3); col(c, y0 - 58, 56, '#c9ccd8'); });
    bx(g, 68, y0 - 66, sw + 36, 9, '#b6bac9'); bx(g, 66, y0 - 70, sw + 40, 5, '#d8dbe6'); R(g, 'rgba(0,0,0,.22)', 68, y0 - 57, sw + 36, 2);
    [0, 1, 2, 3].forEach(function (i) { var c = cols[i], top = y0 - 126;
      if (i % 2 === 0) { R(g, '#20203b', c - 6, top, 13, 56); R(g, '#c88a4a', c - 5, top + 1, 11, 54); R(g, '#e0a868', c - 5, top + 1, 2, 54); for (var q = 0; q < 8; q++) R(g, '#a8683a', c - 5, top + 4 + q * 7, 11, 1); R(g, '#5b5f7a', c - 7, top + 14, 15, 2); R(g, '#5b5f7a', c - 7, top + 36, 15, 2); }
      else { for (var b = -3; b <= 3; b += 2) R(g, '#d4683c', c + b, top - 4, 1, 60); for (var e = 0; e < 9; e++) R(g, '#9a4423', c - 4, top + 2 + e * 6, 9, 1); } });
    [16, 52, 88, 124, 160].forEach(function (c) { var px = 80 + c; R(g, '#20203b', px, y0 - 56, 4, 52); R(g, '#d4a96a', px + 1, y0 - 56, 2, 52); PX.line(g, '#a8683a', px + 2, y0 - 16, px + 15, y0 - 3); });
    /* barandilla de seguridad del primer nivel */
    for (x = 72; x < 72 + sw + 30; x += 15) { R(g, '#20203b', x, y0 - 82, 2, 12); R(g, '#ffb02e', x, y0 - 82, 1, 12); } R(g, '#20203b', 72, y0 - 82, sw + 30, 2); R(g, '#ffb02e', 72, y0 - 82, sw + 30, 1);

    /* andamio tubular (izquierda), apoyado en el suelo */
    var ax = 10, ay = y0 + 8; sh(g, ax - 3, ay, 44);
    for (var j = 0; j < 5; j++) { R(g, '#20203b', ax, ay - 120 + j * 24, 2, 26); R(g, '#20203b', ax + 28, ay - 120 + j * 24, 2, 26); R(g, '#ffb02e', ax, ay - 120 + j * 24, 1, 26); PX.line(g, '#a8761a', ax, ay - 120 + j * 24, ax + 28, ay - 96 + j * 24); }
    for (j = 0; j < 5; j++) { R(g, '#20203b', ax - 4, ay - 122 + j * 24, 38, 3); R(g, '#ffb02e', ax - 4, ay - 122 + j * 24, 38, 1); }
    R(g, '#c88a4a', ax - 2, ay - 76, 34, 3); R(g, '#20203b', ax - 2, ay - 73, 34, 1);
    /* escalera de mano apoyada en el andamio */
    R(g, '#20203b', ax + 36, ay - 70, 2, 70); R(g, '#20203b', ax + 46, ay - 70, 2, 70); for (j = 0; j < 12; j++) R(g, '#c88a4a', ax + 36, ay - 66 + j * 6, 12, 2);

    /* grúa torre a la derecha */
    var gx = 314, top = 12;
    for (y = top + 6; y < y0 + 6; y += 6) { R(g, '#20203b', gx - 5, y, 12, 1); R(g, '#ffb02e', gx - 5, y + 1, 2, 5); R(g, '#ffb02e', gx + 5, y + 1, 2, 5); PX.line(g, '#a8761a', gx - 4, y + 1, gx + 5, y + 6); }
    R(g, '#20203b', gx - 9, y0 + 3, 20, 5); R(g, '#6a6e87', gx - 8, y0 + 4, 18, 3); sh(g, gx - 10, y0 + 8, 22);
    var jl = 250; L.crane = { gx: gx, top: top };
    R(g, '#20203b', gx - jl, top, jl + 38, 5); R(g, '#ffb02e', gx - jl, top + 1, jl + 38, 3);
    for (x = 0; x < jl; x += 9) { PX.line(g, '#a8761a', gx - jl + x, top + 1, gx - jl + x + 9, top + 4); R(g, '#a8761a', gx - jl + x, top + 4, 1, 1); }
    bx(g, gx + 14, top + 5, 18, 14, '#8f93a8'); bx(g, gx - 3, top - 9, 13, 10, '#f2b038'); R(g, '#9fd3f0', gx, top - 7, 7, 5); R(g, '#20203b', gx + 4, top - 16, 1, 8); PX.line(g, '#20203b', gx + 4, top - 16, gx - 34, top); PX.line(g, '#20203b', gx + 4, top - 16, gx + 34, top);

    /* primer plano: valla de obra, conos, letrero, mezcladora y pilas de arena */
    var vy = fy - 4; sh(g, 4, vy + 17, 100);
    for (var f = 0; f < 3; f++) { var fx = 6 + f * 33; R(g, '#20203b', fx, vy - 2, 31, 19); R(g, '#ff8a2a', fx + 1, vy - 1, 29, 17); for (var st = 0; st < 6; st++) R(g, '#fff', fx + 2 + st * 5, vy - 1 + (st % 2) * 8, 3, 8); R(g, '#20203b', fx + 3, vy + 17, 3, 3); R(g, '#20203b', fx + 25, vy + 17, 3, 3); }
    [112, 124].forEach(function (cx, i) { var cy = vy + 16 - i * 2; sh(g, cx - 2, cy + 1, 14); R(g, '#20203b', cx - 1, cy - 14, 11, 15); R(g, '#ff7a1a', cx, cy - 13, 9, 13); R(g, '#fff', cx + 1, cy - 9, 7, 3); R(g, '#20203b', cx - 3, cy, 15, 3); R(g, '#ffb02e', cx - 2, cy, 13, 2); });
    var sx0 = 64, sy0 = wh + 22; R(g, '#20203b', sx0 + 15, sy0 - 40, 3, 40); sh(g, sx0 + 8, sy0 + 1, 18);
    bx(g, sx0, sy0 - 54, 36, 14, '#ffd35a'); PX.text3(g, 'OBRA', sx0 + 10, sy0 - 50, '#20203b', 1); R(g, '#c2403f', sx0 + 2, sy0 - 42, 32, 1);
    /* mezcladora de concreto (trompo) */
    var mx = 262, my = wh + 30; sh(g, mx - 4, my + 1, 48);
    R(g, '#20203b', mx, my - 12, 38, 5); R(g, '#5b5f7a', mx + 1, my - 11, 36, 3); PX.circ(g, '#20203b', mx + 8, my - 5, 6); PX.circ(g, '#8f93a8', mx + 8, my - 5, 3); PX.circ(g, '#20203b', mx + 30, my - 5, 6); PX.circ(g, '#8f93a8', mx + 30, my - 5, 3);
    R(g, '#20203b', mx + 14, my - 30, 5, 20); R(g, '#5b5f7a', mx + 15, my - 30, 3, 20); L.mix = { x: mx + 20, y: my - 36 };
    PX.circ(g, '#20203b', L.mix.x, L.mix.y, 18); PX.circ(g, '#ff7a1a', L.mix.x, L.mix.y, 16); PX.circ(g, '#ffa04a', L.mix.x - 4, L.mix.y - 5, 7); PX.circ(g, '#20203b', L.mix.x + 4, L.mix.y - 4, 8); PX.circ(g, '#7a5a3a', L.mix.x + 4, L.mix.y - 4, 6);
    var pe = [[298, wh + 31, 44, 20, '#d8c08a', '#efdcae'], [276, wh + 36, 34, 12, '#9a9a9a', '#bdbdbd']];
    pe.forEach(function (p, ii) { for (var r = 0; r < p[3]; r++) { var w = p[2] * (1 - r / p[3] * .75) * (ii ? 1 : 1); R(g, '#20203b', p[0] + (p[2] - w) / 2 - 1, p[1] - r, w + 2, 1); R(g, r > p[3] * .55 ? p[5] : p[4], p[0] + (p[2] - w) / 2, p[1] - r, w, 1); } R(g, '#20203b', p[0] - 1, p[1] + 1, p[2] + 2, 1); });
    sh(g, 296, wh + 33, 48);
  }
  function lauAnim(g, W, H, t, L) {
    var i;
    for (i = 0; i < 3; i++) { var cx = ((t * (2 + i) + i * 150) % (W + 90)) - 45, cy = 18 + i * 15; R(g, '#ffffff', cx, cy, 34, 7); R(g, '#ffffff', cx + 7, cy - 5, 20, 6); R(g, '#e3f0ff', cx, cy + 6, 34, 1); }
    /* gancho con cubeta de concreto que oscila */
    var gx = L.crane.gx, top = L.crane.top;
    var hx = 96 + Math.round(Math.sin(t * .7) * 16), len = 34 + Math.round((Math.sin(t * .9) + 1) * 26), ly = top + 5 + len, sway = Math.round(Math.sin(t * 1.6) * 1);
    R(g, '#20203b', hx - 4, top + 5, 9, 4); R(g, '#ffb02e', hx - 3, top + 5, 7, 2);
    R(g, '#20203b', hx, top + 9, 1, len - 4); R(g, '#20203b', hx - 3, ly, 7, 4); R(g, '#ffd35a', hx - 2, ly + 1, 5, 2);
    PX.line(g, '#20203b', hx, ly + 4, hx - 9 + sway, ly + 12); PX.line(g, '#20203b', hx, ly + 4, hx + 9 + sway, ly + 12);
    R(g, '#20203b', hx - 11 + sway, ly + 12, 23, 14); R(g, '#8f93a8', hx - 10 + sway, ly + 13, 21, 11); R(g, '#c9ccd8', hx - 10 + sway, ly + 13, 21, 2); R(g, '#ff7a1a', hx - 10 + sway, ly + 22, 21, 2); R(g, '#9fa2b4', hx - 5 + sway, ly + 26, 11, 3);
    /* trompo girando */
    var m = L.mix, a = t * 2.2; for (i = 0; i < 3; i++) { var an = a + i * 2.094; PX.line(g, '#ffffff', m.x - 2 + Math.cos(an) * 3, m.y + Math.sin(an) * 3, m.x - 2 + Math.cos(an) * 12, m.y + Math.sin(an) * 12); }
    /* aves */
    for (var b = 0; b < 2; b++) { var bxp = ((t * 14 + b * 90) % (W + 30)) - 15, byp = 56 + b * 14 + Math.round(Math.sin(t * 3 + b) * 2), f = ((t * 6 + b) | 0) % 2; R(g, '#20203b', bxp, byp + f, 2, 1); R(g, '#20203b', bxp + 2, byp, 2, 1); R(g, '#20203b', bxp + 4, byp + f, 2, 1); }
  }

  /* =====================================================================
     LAURY Y MALU · estudio de arquitectura (morado y rosa)
     ===================================================================== */
  function plaStatic(g, W, H, L) {
    var wh = L.wh, bw = wh - 34, x, y;
    PX.vgrad(g, 0, 0, W, wh, '#4a2f8c', '#a47fd8', 14);
    for (x = 0; x < W; x += 12) R(g, '#ffffff0b', x, 0, 4, wh);
    R(g, '#2a1a5a', 0, 0, W, 6); R(g, '#d8a6e8', 0, 6, W, 1); R(g, '#00000033', 0, 7, W, 3);
    R(g, '#3d2670', 0, bw, W, 34); R(g, '#d8a6e8', 0, bw, W, 2); for (x = 3; x < W; x += 10) { R(g, '#4b3187', x, bw + 5, 6, 26); R(g, '#6a4aa8', x, bw + 5, 1, 26); }
    R(g, '#2a1a5a', 0, wh - 4, W, 4); R(g, '#d8a6e8', 0, wh - 4, W, 1);
    floorP(g, W, wh, H, { mode: 'plank', vx: (W * .3) | 0, vy: wh - 70, step: 46, A: '#9b90ba', B: '#8f84af', C: '#a99fc6', line: '#6a5f8c' });
    R(g, 'rgba(0,0,0,.34)', 0, wh, W, 2);

    /* ventanal con la ciudad al atardecer */
    var wx = 10, wy = 18, ww = 150, hh = Math.max(46, Math.min(104, bw - wy - 10));
    L.win = { x: wx, y: wy, w: ww, h: hh };
    R(g, '#20203b', wx - 5, wy - 5, ww + 10, hh + 10); R(g, '#8a5fd6', wx - 4, wy - 4, ww + 8, hh + 8); R(g, '#20203b', wx - 1, wy - 1, ww + 2, hh + 2);
    PX.vgrad(g, wx, wy, ww, hh, '#7a4fc0', '#ffb0a0', 14);
    PX.circ(g, '#fff0c8', wx + 104, wy + hh - 30, 12); PX.circ(g, '#ffe0b0', wx + 104, wy + hh - 30, 8);
    for (x = 0; x < ww; x += 8) { var h = 14 + hash(x * .4) * 24; R(g, '#5a3a9a', wx + x, wy + hh - h - 14, 8, h + 14); }
    for (x = 0; x < ww; x += 10) { var h2 = 20 + hash(x * .27 + 9) * 42; R(g, '#3a2470', wx + x, wy + hh - h2, 9, h2); R(g, '#4e3490', wx + x, wy + hh - h2, 9, 1); for (var q = wy + hh - h2 + 4; q < wy + hh - 3; q += 5) if (hash(x + q) > .35) R(g, '#ffd9a0', wx + x + 2, q, 2, 2); }
    for (var m = 1; m < 3; m++) R(g, '#20203b', wx + (ww / 3 * m | 0) - 1, wy, 3, hh); R(g, '#20203b', wx, wy + (hh * .45 | 0), ww, 3);
    for (y = 0; y < hh; y++) { R(g, 'rgba(255,255,255,.13)', wx + 10 + y * .7, wy + y, 8, 1); R(g, 'rgba(255,255,255,.07)', wx + 24 + y * .7, wy + y, 3, 1); }
    R(g, '#d8a6e8', wx - 8, wy + hh + 4, ww + 16, 4); R(g, '#20203b', wx - 8, wy + hh + 8, ww + 16, 1); R(g, 'rgba(0,0,0,.25)', wx - 8, wy + hh + 9, ww + 16, 3);
    /* luz de la ventana sobre el piso */
    for (y = wh + 3; y < H; y++) { var o = (y - wh) * .8; for (var p = 0; p < 3; p++) R(g, 'rgba(255,190,200,.17)', wx + 4 + p * 48 + o, y, 40, 1); }

    /* reloj de pared y corcho con planos */
    PX.circ(g, '#20203b', 174, 34, 11); PX.circ(g, '#fff', 174, 34, 9); for (var tk = 0; tk < 12; tk++) R(g, '#20203b', 174 + Math.round(Math.cos(tk * .5236) * 7), 34 + Math.round(Math.sin(tk * .5236) * 7), 1, 1); L.clk = { x: 174, y: 34 };
    var kx = 194, ky = 14; bx(g, kx - 4, ky - 4, 104, 70, '#8a5a3a'); R(g, '#c9955a', kx, ky, 96, 62);
    for (var o2 = 0; o2 < 60; o2++) R(g, '#b8844a', kx + (o2 * 17) % 96, ky + (o2 * 11) % 62, 2, 1);
    [[5, 5, 38, 24, '#f4f1ff'], [50, 7, 40, 22, '#d6e8ff'], [8, 34, 32, 22, '#ffd0e3'], [48, 34, 38, 22, '#f4f1ff']].forEach(function (p) {
      R(g, '#20203b', kx + p[0] - 1, ky + p[1] - 1, p[2] + 2, p[3] + 2); R(g, p[4], kx + p[0], ky + p[1], p[2], p[3]);
      R(g, '#3f2a86', kx + p[0] + 4, ky + p[1] + 5, p[2] - 10, 1); R(g, '#3f2a86', kx + p[0] + 4, ky + p[1] + 5, 1, p[3] - 10); R(g, '#3f2a86', kx + p[0] + 4, ky + p[3] + p[1] - 6, p[2] - 10, 1); R(g, '#3f2a86', kx + p[0] + (p[2] >> 1), ky + p[1] + 5, 1, p[3] - 10);
      R(g, '#c2403f', kx + p[0] + (p[2] >> 1), ky + p[1] - 1, 2, 2); R(g, 'rgba(0,0,0,.18)', kx + p[0] + 1, ky + p[1] + p[3] + 1, p[2], 1); });
    /* repisa con maquetas de edificios */
    var ry = 112; bx(g, 190, ry, 104, 5, '#8a5a3a'); R(g, 'rgba(0,0,0,.22)', 190, ry + 5, 104, 3);
    [[196, 14, 26, '#f4f1ff'], [214, 18, 20, '#ffd0e3'], [236, 12, 32, '#9fd3f0'], [252, 16, 18, '#ffd9a0'], [274, 12, 22, '#bff0cf']].forEach(function (b) { R(g, '#20203b', b[0] - 1, ry - b[2] - 1, b[1] + 2, b[2] + 1); R(g, b[3], b[0], ry - b[2], b[1], b[2]); R(g, 'rgba(0,0,0,.14)', b[0] + b[1] - 3, ry - b[2], 3, b[2]); for (var wy2 = ry - b[2] + 4; wy2 < ry - 3; wy2 += 5) R(g, '#3f2a86', b[0] + 3, wy2, 2, 2); });

    /* planero (cajonera de planos) con tubos y lámpara, apoyado en el piso */
    var cx = 8, ct = wh - 12, cc = wh + 29;
    sh(g, cx - 2, cc, 72); bx(g, cx, ct, 68, 6, '#b6a6e0');
    R(g, '#20203b', cx + 2, ct + 6, 64, cc - ct - 6); R(g, '#7a4fc0', cx + 3, ct + 7, 62, cc - ct - 7);
    for (var d = 0; d < 3; d++) { var dy = ct + 9 + d * 12; R(g, '#20203b', cx + 5, dy, 58, 10); R(g, '#9a78d0', cx + 6, dy + 1, 56, 8); R(g, '#d8a6e8', cx + 6, dy + 1, 56, 2); R(g, '#20203b', cx + 28, dy + 4, 12, 3); R(g, '#ffd35a', cx + 29, dy + 4, 10, 1); }
    [[8, 30, '#f4f1ff'], [14, 34, '#ffd0e3'], [20, 28, '#e8e4f8']].forEach(function (p) { R(g, '#20203b', cx + p[0] - 1, ct - p[1], 6, p[1]); R(g, p[2], cx + p[0], ct - p[1] + 1, 4, p[1] - 2); R(g, '#c2403f', cx + p[0], ct - p[1] + 1, 4, 2); });
    R(g, '#20203b', cx + 44, ct - 3, 12, 3); R(g, '#ff8fb8', cx + 45, ct - 2, 10, 2); PX.line(g, '#20203b', cx + 50, ct - 3, cx + 46, ct - 20); PX.line(g, '#20203b', cx + 46, ct - 20, cx + 56, ct - 26); R(g, '#20203b', cx + 53, ct - 29, 8, 6); R(g, '#ff8fb8', cx + 54, ct - 28, 6, 4);

    /* plotter sobre patas que llegan al piso (corrige el aparato flotante) */
    var px = 300, pm = wh + 29;
    sh(g, px - 4, pm, 50);
    R(g, '#20203b', px + 2, pm - 22, 4, 22); R(g, '#5a3a9a', px + 3, pm - 22, 2, 22); R(g, '#20203b', px + 36, pm - 22, 4, 22); R(g, '#5a3a9a', px + 37, pm - 22, 2, 22); R(g, '#20203b', px + 2, pm - 8, 38, 2); R(g, '#7a4fc0', px + 3, pm - 8, 36, 1);
    bx(g, px - 3, pm - 46, 48, 24, '#e8e4f8'); R(g, '#20203b', px + 2, pm - 30, 38, 4); R(g, '#8a5fd6', px + 3, pm - 44, 22, 5); R(g, '#c9b8f0', px - 2, pm - 45, 46, 1);
    L.pl = { x: px, y: pm };
    /* alfombra y, encima, la planta */
    rugP(g, 170, wh + 13, H - 4, 170, 270, '#6a4aa8', '#ff8fb8', '#ffd0e3');
    plant(g, 164, wh + 26, 1, '#ff8fb8', '#2f9e57', '#3fae5a');
  }
  function plaAnim(g, W, H, t, L) {
    var w = L.win, p = L.pl, i;
    for (i = 0; i < 22; i++) { var bxx = w.x + 6 + (i % 11) * 13, byy = w.y + w.h - 12 - ((i * 5) % 6) * 7 - ((i / 11) | 0) * 11; if (Math.sin(t * .5 + i * 1.9) > -.1) R(g, '#ffd9a0', bxx, byy, 2, 2); }
    /* plotter: hoja que sale por delante y va cayendo, con trazos; luz de estado */
    var len = Math.min(24, ((t * 6) % 32) | 0), top = p.y - 22;
    R(g, ((t * 3) | 0) % 2 ? '#5eea6a' : '#bff0cf', p.x + 36, p.y - 41, 3, 3);
    R(g, '#20203b', p.x + 4, top, 34, len + 2); R(g, '#fffdf8', p.x + 5, top + 1, 32, len);
    for (i = 0; i < len - 2; i += 5) R(g, '#3f2a86', p.x + 8, top + 3 + i, 14 + (i * 7) % 18, 1);
    /* reloj */
    var c = L.clk, am = t * .35, ah = t * .03; PX.line(g, '#20203b', c.x, c.y, c.x + Math.cos(am) * 7, c.y + Math.sin(am) * 7); PX.line(g, '#c2403f', c.x, c.y, c.x + Math.cos(ah) * 4, c.y + Math.sin(ah) * 4);
    /* lámparas colgantes con conos de luz planos */
    [102, 250].forEach(function (x, k) {
      var s = Math.round(Math.sin(t * 1.2 + k * 2) * 2), y = 30;
      R(g, '#20203b', x, 0, 1, y - 1); R(g, '#20203b', x + s - 9, y, 19, 8); R(g, '#ff8fb8', x + s - 8, y + 1, 17, 6); R(g, '#ffc0d8', x + s - 8, y + 1, 17, 2); R(g, '#fff0c8', x + s - 5, y + 8, 11, 2);
      for (var r = 0; r < 60; r++) { var cw = 14 + r * .85; R(g, 'rgba(255,240,200,' + (.10 - r * .001).toFixed(3) + ')', x + s - cw / 2, y + 10 + r, cw, 1); }
    });
    motes(g, W, w.x, w.y + 10, 150, 120, t, 14, '#ffe0b0');
    var sp = ((t * 2) | 0) % 5; R(g, '#fff', w.x + 14 + sp * 24, w.y + 14 + sp * 9, 1, 1);
  }

  var SC = { isamar: { s: isaStatic, a: isaAnim }, laura: { s: lauStatic, a: lauAnim }, sharol: { s: shaStatic, a: shaAnim }, planos: { s: plaStatic, a: plaAnim } };

  /* ---------- motor de escena ---------- */
  var cvs, cx, base, bg, W = 0, H = 0, S = 3, cur = 'isamar', L = {}, baseKey = '', raf = 0, lastT = 0, t0 = performance.now(), tr, trg, trBlocks = null, trP = 0, trLast = 0;
  var RMo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    var st = document.getElementById('stage'); if (!st) return false;
    var r = st.getBoundingClientRect(); if (r.width < 50 || r.height < 50) return false;
    var s = Math.max(2, Math.round(r.height / 240)); if (r.width < 600) s = 2;
    var nw = Math.ceil(r.width / s), nh = Math.ceil(r.height / s);
    if (nw === W && nh === H && s === S) return true;
    S = s; W = nw; H = nh;
    cvs.width = tr.width = W; cvs.height = tr.height = H; cx.imageSmoothingEnabled = false; trg.imageSmoothingEnabled = false;
    baseKey = ''; return true;
  }
  function mkL(w, h, sc) { var fy = h - Math.ceil(56 / sc) - 3, fd = Math.max(34, Math.min(60, Math.round(fy * .2))); return { fy: fy, wh: fy - fd, fd: fd, V: (w * .54) | 0, cx: (w * .27) | 0 }; }
  function layout() { L = mkL(W, H, S); }
  function rebuild() {
    layout(); base = PX.mk(W, H); SC[cur].s(base.g, W, H, L); baseKey = cur + W + 'x' + H;
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.getElementById('v-home').classList.contains('hid')) return;
    if (!size()) return;
    if (baseKey !== cur + W + 'x' + H) rebuild();
    if (now - lastT < 33) { stepTr(now); return; } lastT = now;
    var t = RMo ? 1 : (now - t0) / 1000;
    cx.drawImage(base.c, 0, 0); SC[cur].a(cx, W, H, t, L); stepTr(now);
  }
  function stepTr(now) {
    if (!trBlocks) return; if (now - trLast < 40) return; trLast = now; trP += .09;
    var bs = 8, cols = Math.ceil(W / bs);
    trBlocks.forEach(function (b) { if (!b.d && b.th < trP) { b.d = 1; trg.clearRect(b.x * bs, b.y * bs, bs, bs); } });
    if (trP > 1.2) { trBlocks = null; trg.clearRect(0, 0, W, H); }
  }
  function transition() {
    if (RMo || !W) return; trg.clearRect(0, 0, W, H); trg.drawImage(cvs, 0, 0);
    var bs = 8, cols = Math.ceil(W / bs), rows = Math.ceil(H / bs); trBlocks = []; trP = 0;
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) trBlocks.push({ x: x, y: y, d: 0, th: (x / cols) * .75 + Math.random() * .3 });
  }
  function setScene(k, anim) { if (anim) transition(); cur = k; }

  /* ---------- datos de la selección ---------- */
  var EX = {
    isamar: { name: 'ISAMAR', n: 1, who: '— ISAMAR · CONCEPTUALIZACIÓN', quote: 'Un edificio no se sostiene solo: se sostiene por la forma en que se conectan sus partes.', desc: 'Descubre qué es un sistema aporticado, cómo viajan las cargas hasta el suelo, cuáles son sus seis elementos y cuáles son sus ventajas y desventajas.', goals: ['¿Qué es y cómo funciona?', 'Ruta de las cargas', 'Los 6 elementos', 'Ventajas y desventajas'], icon: 'col' },
    laura: { name: 'LAURA', n: 2, who: '— LAURA · PASOS DE CONSTRUCCIÓN', quote: 'En una obra, el orden de los pasos importa tanto como los materiales.', desc: 'Sigue el proceso de construcción de principio a fin: desde preparar el terreno hasta levantar la estructura, la mampostería y la cubierta.', goals: ['Control geométrico', 'Terreno y cimentación', 'Columnas, vigas y placas', 'Mampostería y cubierta'], icon: 'obr' },
    sharol: { name: 'SHAROL', n: 3, who: '— SHAROL · NORMAS TÉCNICAS', quote: 'Una obra segura sigue la norma, y cada número que revisamos tiene su numeral.', desc: 'Inspecciona la obra con la norma en la mano: resuelve cuatro retos y consulta la biblioteca de normas DMO sobre concreto, recubrimientos, estribos y más.', goals: ['4 retos de inspección', 'Biblioteca de normas DMO', 'Maqueta 3D que se arma', 'Recubrimientos y estribos'], icon: 'nrm' },
    planos: { name: 'LAURY Y MALU', n: 4, who: '— LAURY Y MALU · PLANOS', quote: 'Un plano es el idioma de la obra: ¡aprendamos a leerlo juntas!', desc: 'Recorre proyectos reales con ellas: plantas, cortes, despieces y detalles de refuerzo, y consigue las cuatro estrellas.', goals: ['4 láminas de proyectos', 'Plantas y despieces', 'Detalles de refuerzo', 'Colecciona 4 estrellas'], icon: 'dim' }
  };
  var qTimer = 0;
  function typeQuote(txt) {
    var p = document.getElementById('dquote'), box = p.parentElement; clearInterval(qTimer); box.classList.remove('done');
    if (RMo) { p.textContent = txt; box.classList.add('done'); return; }
    var i = 0; p.textContent = ''; qTimer = setInterval(function () { i++; p.textContent = txt.slice(0, i); if (i >= txt.length) { clearInterval(qTimer); box.classList.add('done'); } }, 18);
  }
  var firstPick = true;
  window.pick = function (k) {
    ST.guide = k; save();
    var g = G[k], ex = EX[k], s = $('#stage'), sw = $('.sprw'), i = $('#spr'), i2 = $('#spr2');
    s.style.setProperty('--c1', g.c1); s.style.setProperty('--c3', g.c3); s.style.setProperty('--tc', g.tc);
    if (k === 'planos') { sw.classList.add('duo'); sw.classList.remove('sharol-size', 'laura-size'); i.src = IMGH.laury || IMG.laury; i.alt = 'Laury, arquitecta'; i2.src = IMGH.malu || IMG.malu; i2.alt = 'Malu, arquitecta'; i2.style.display = 'block'; }
    else { sw.classList.remove('duo'); sw.classList.toggle('sharol-size', k === 'sharol'); sw.classList.toggle('laura-size', k === 'laura'); i.src = IMGH[k] || IMG[k]; i.alt = 'Retrato pixel art de ' + g.n; i2.removeAttribute('src'); i2.alt = ''; i2.style.display = 'none'; }
    i.classList.remove('sw'); void i.offsetWidth; i.classList.add('sw');
    var dlg = $('#dlg'); dlg.classList.remove('dsw'); void dlg.offsetWidth; dlg.classList.add('dsw');
    $('#dtag').textContent = g.tag + (ST.done[g.m] ? ' · COMPLETADA' : '');
    $('#dnum').textContent = 'MISIÓN ' + ex.n + ' / 4';
    $('#dname').textContent = ex.name; $('#dttl').textContent = g.ttl; $('#dwho').textContent = ex.who;
    $('#dtxt').textContent = ex.desc;
    $('#dgoals').innerHTML = ex.goals.map(function (x) { return '<li>' + x.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</li>'; }).join('');
    var go = $('#go'); go.innerHTML = '<span class="gi">' + ico(ex.icon, 28) + '</span><span>' + (ST.done[g.m] ? 'REPETIR MISIÓN' : 'COMENZAR MISIÓN') + '</span><span class="gi">▶</span>';
    typeQuote(ex.quote);
    if (cvs) setScene(k, !firstPick);
    firstPick = false;
    dots();
  };

  function init() {
    cvs = document.getElementById('scene'); tr = document.getElementById('sceneTr');
    if (!cvs) return;
    cx = cvs.getContext('2d'); trg = tr.getContext('2d');
    size(); pick(ST.guide); prog(false);
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  window.PCScenes = { init: init, render: function (k, w, h, t) { var c = PX.mk(w, h), l = mkL(w, h, 2); SC[k].s(c.g, w, h, l); SC[k].a(c.g, w, h, t || 1, l); return c.c; } };
  init();
})();
