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

  /* =============== ISAMAR · estudio de conceptos (vino) =============== */
  function isaStatic(g, W, H, L) {
    var V = L.V, fy = L.fy, wh = fy - 8;
    PX.vgrad(g, 0, 0, W, wh, '#3d0d21', '#8d2049', 12);
    for (var x = 0; x < W; x += 8) R(g, '#ffffff0b', x, 0, 3, wh);
    R(g, '#2a0a17', 0, wh - 26, W, 26); R(g, '#a8566f', 0, wh - 27, W, 2);
    for (var x2 = 0; x2 < W; x2 += 14) R(g, '#3c1022', x2, wh - 24, 1, 22);
    /* piso de madera */
    for (var y = wh; y < H; y += 5) { R(g, y % 10 ? '#8a5a3a' : '#9a6a44', 0, y, W, 5); R(g, '#5e3a24', 0, y + 4, W, 1); }
    for (var x3 = 0; x3 < W; x3 += 38) for (var y3 = wh; y3 < H; y3 += 10) R(g, '#5e3a24', x3 + (y3 % 20 ? 19 : 0), y3, 1, 5);
    R(g, '#00000040', 0, wh, W, 3);
    /* alfombra */
    var rx = L.cx - 60, rw = 120;
    R(g, '#20203b', rx - 1, fy - 3, rw + 2, 14); R(g, '#6b1d3a', rx, fy - 2, rw, 12); R(g, '#e7a0b8', rx + 3, fy, rw - 6, 1); R(g, '#e7a0b8', rx + 3, fy + 7, rw - 6, 1);
    for (var q = 0; q < 10; q++) R(g, '#ffd35a', rx + 10 + q * 11, fy + 3, 4, 3);
    /* ventana al atardecer */
    var wx = (V * .06) | 0, wy = wh - 112, ww = 56, hh = 78;
    R(g, '#20203b', wx - 3, wy - 3, ww + 6, hh + 6); PX.vgrad(g, wx, wy, ww, hh, '#4b2a6e', '#ffb68a', 10);
    PX.circ(g, '#fff0b0', wx + 38, wy + 50, 7); PX.circ(g, '#ffd9a0', wx + 38, wy + 50, 5);
    [[0, 16, 8], [9, 28, 9], [19, 20, 8], [28, 36, 10], [40, 24, 7], [48, 32, 8]].forEach(function (b) { R(g, '#2a1a45', wx + b[0], wy + hh - b[1], b[2], b[1]); });
    R(g, '#3b1a12', wx + ww / 2 - 1, wy, 3, hh); R(g, '#3b1a12', wx, wy + hh / 2 - 1, ww, 3); R(g, '#a8566f', wx - 4, wy + hh + 3, ww + 8, 3);
    /* haz de luz */
    for (var r = 0; r < 52; r++) PX.dith(g, '#ffd9a0', wx + 4 + r * 1.3 | 0, wy + hh + 6 + r * 1.2 | 0, ww - 6, 1, .14);
    /* pizarra */
    var px = (V * .5) | 0, py = wh - 108, pw = 90, ph = 62;
    bx(g, px - 3, py - 3, pw + 6, ph + 6, '#7a4a2a'); R(g, '#1d3a32', px, py, pw, ph); R(g, '#2c5446', px, py, pw, 1);
    PX.text3(g, 'SISTEMA APORTICADO', px + 8, py + 5, '#e9f4ee', 1);
    var ch = '#f4f1e6';
    R(g, ch, px + 16, py + 24, 3, 30); R(g, ch, px + 70, py + 24, 3, 30); R(g, ch, px + 12, py + 21, 66, 3); R(g, ch, px + 10, py + 54, 70, 1);
    for (var h = 0; h < 11; h++) R(g, ch, px + 10 + h * 6, py + 55, 3, 2);
    PX.text3(g, 'LOSA', px + 34, py + 14, '#ffd35a', 1); PX.text3(g, 'VIGA', px + 34, py + 29, '#9fd3f0', 1); PX.text3(g, 'COLUMNA', px + 31, py + 40, '#f0a9c1', 1);
    R(g, '#6a3d22', px, py + ph + 1, pw, 3); R(g, '#fff', px + 8, py + ph, 5, 2); R(g, '#f0a9c1', px + 16, py + ph, 4, 2);
    /* estante con maquetas */
        /* escritorio con maqueta */
    var dx = (V * .63) | 0, dy = fy - 22;
    bx(g, dx, dy, 74, 6, '#9a6a44'); R(g, '#20203b', dx + 4, dy + 6, 4, 20); R(g, '#20203b', dx + 66, dy + 6, 4, 20); R(g, '#7a4a2a', dx + 6, dy + 8, 62, 10);
    R(g, '#20203b', dx + 12, dy - 3, 52, 3); R(g, '#7a5230', dx + 12, dy - 2, 52, 2);
    [14, 36, 58].forEach(function (cx) { R(g, '#20203b', cx + dx - 1, dy - 27, 6, 25); R(g, '#e8e4f8', cx + dx, dy - 26, 4, 24); });
    R(g, '#20203b', dx + 11, dy - 30, 52, 6); R(g, '#f4ead7', dx + 12, dy - 29, 50, 4); R(g, '#20203b', dx + 11, dy - 15, 52, 4); R(g, '#e4d6bd', dx + 12, dy - 14, 50, 2);
    bx(g, dx + 66, dy - 8, 7, 8, '#ffd35a');
    /* lámpara: cable */
    R(g, '#20203b', (V * .38) | 0, 0, 1, wh - 90);
    L.lamp = { x: (V * .38) | 0, y: wh - 90 }; L.dx = dx; L.dy = dy;
  }
  function isaAnim(g, W, H, t, L) {
    var l = L.lamp, sw = Math.round(Math.sin(t * 1.4) * 2), y = l.y;
    R(g, '#20203b', l.x + sw, y - 1, 1, 2);
    R(g, '#20203b', l.x + sw - 9, y, 19, 8); R(g, '#c2403f', l.x + sw - 8, y + 1, 17, 6); R(g, '#e86a68', l.x + sw - 8, y + 1, 17, 2);
    R(g, '#fff0b0', l.x + sw - 5, y + 8, 11, 2);
    for (var i = 0; i < 28; i++) PX.dith(g, '#ffd9a0', l.x + sw - 10 - (i >> 1), y + 10 + i, 21 + i, 1, .1 - i * .003);
    /* flechas de carga sobre la maqueta */
    var by = L.dy - 44, ph = ((t * 4) | 0) % 4;
    [20, 40, 60].forEach(function (x) { var a = by + ph * 2; R(g, '#ffd35a', L.dx + x, a, 2, 5); R(g, '#ffd35a', L.dx + x - 2, a + 5, 6, 1); R(g, '#ffd35a', L.dx + x - 1, a + 6, 4, 1); R(g, '#ffd35a', L.dx + x, a + 7, 2, 1); });
    /* vapor de la taza */
    for (var s = 0; s < 3; s++) R(g, '#ffffff90', L.dx + 69 + Math.round(Math.sin(t * 2 + s) * 1), L.dy - 12 - s * 3 - ((t * 5) | 0) % 3, 1, 2);
    motes(g, W, (L.V * .06) | 0, L.fy - 100, 70, 90, t, 14, '#fff0b0');
  }

  /* =============== LAURA · obra en proceso (azul) =============== */
  function lauStatic(g, W, H, L) {
    var V = L.V, fy = L.fy, gy = fy - 12;
    PX.vgrad(g, 0, 0, W, gy, '#4e98ec', '#d6ebff', 14);
    PX.circ(g, '#fff6c8', (W * .08) | 0, 24, 12); PX.circ(g, '#fffbe6', (W * .08) | 0, 24, 9);
    /* ciudad lejana */
    for (var x = 0; x < W; x += 14) { var bh = 18 + ((x * 7 + 13) % 40); R(g, '#8fb2de', x, gy - bh, 12, bh); R(g, '#a8c4e8', x, gy - bh, 12, 2); for (var wy = gy - bh + 5; wy < gy - 4; wy += 6) R(g, '#c8def5', x + 3, wy, 2, 2); R(g, '#c8def5', x + 7, wy - 3, 2, 2); }
    /* terreno */
    R(g, '#6b8f3a', 0, gy - 3, W, 4); R(g, '#8a6a46', 0, gy + 1, W, H); for (var i = 0; i < W; i += 9) { R(g, '#6f5436', i, gy + 4 + (i * 3) % 14, 5, 2); R(g, '#a07e56', i + 3, gy + 2 + (i * 5) % 12, 3, 1); }
    R(g, '#6f5436', 0, fy + 8, W, H);
    /* estructura de concreto en construcción */
    var sx = (V * .26) | 0, sw = 108, y0 = gy;
    var cols = [0, 36, 72, 108];
    cols.forEach(function (c) { R(g, '#20203b', sx + c - 6, y0 - 4, 14, 5); R(g, '#9aa0b4', sx + c - 5, y0 - 3, 12, 3); });
    /* primer nivel: columnas terminadas */
    cols.forEach(function (c) { bx(g, sx + c - 3, y0 - 44, 8, 42, '#c9ccd8'); R(g, '#e8eaf2', sx + c - 1, y0 - 43, 2, 40); });
    bx(g, sx - 7, y0 - 52, sw + 14, 9, '#b6bac9'); bx(g, sx - 9, y0 - 56, sw + 18, 5, '#d3d6e2');
    /* segundo nivel: encofrado y acero */
    [0, 36, 72, 108].forEach(function (c, i) {
      if (i % 2 === 0) { R(g, '#20203b', sx + c - 5, y0 - 96, 12, 40); R(g, '#c88a4a', sx + c - 4, y0 - 95, 10, 38); for (var k = 0; k < 7; k++) R(g, '#a8683a', sx + c - 4, y0 - 92 + k * 5, 10, 1); R(g, '#5b5f7a', sx + c - 6, y0 - 80, 14, 2); R(g, '#5b5f7a', sx + c - 6, y0 - 66, 14, 2); }
      else { for (var b = -2; b <= 3; b += 2) R(g, '#d4683c', sx + c + b - 1, y0 - 98, 1, 42); for (var e = 0; e < 7; e++) R(g, '#9a4423', sx + c - 3, y0 - 94 + e * 6, 8, 1); }
    });
    /* puntales */
    [16, 52, 88].forEach(function (c) { R(g, '#20203b', sx + c, y0 - 41, 4, 38); R(g, '#d4a96a', sx + c + 1, y0 - 41, 2, 38); PX.line(g, '#a8683a', sx + c + 2, y0 - 12, sx + c + 14, y0 - 3); });
    /* andamio izquierda */
    for (var j = 0; j < 4; j++) { R(g, '#20203b', sx - 26, y0 - 96 + j * 24, 2, 26); R(g, '#20203b', sx - 12, y0 - 96 + j * 24, 2, 26); R(g, '#ffb02e', sx - 26, y0 - 96 + j * 24, 16, 2); } R(g, '#ffb02e', sx - 26, y0 - 4, 16, 2);
    /* primer plano: cerco y objetos */
    var ox = 3;
    for (var f = 0; f < 3; f++) { var fx = ox + f * 30; R(g, '#20203b', fx, fy - 4, 28, 20); R(g, '#ff8a2a', fx + 1, fy - 3, 26, 18); for (var s = 0; s < 6; s++) R(g, '#fff', fx + 1 + s * 5 + (s % 2) * 0, fy - 3 + (s % 2) * 9, 3, 9); R(g, '#20203b', fx + 2, fy + 16, 3, 2); R(g, '#20203b', fx + 23, fy + 16, 3, 2); }
    var ax = (V * .64) | 0;
    PX.dith(g, '#c9a96a', ax, fy + 6, 52, 14, .8); for (var m = 0; m < 14; m++) R(g, '#c9a96a', ax + 8 + m * 3 - ((m * 7) % 4), fy + 2 + ((m * 5) % 4), 3, 3);
    R(g, '#20203b', ax - 1, fy + 5, 54, 1);
    var cn = [(V * .5) | 0, (V * .84) | 0];
    cn.forEach(function (c) { R(g, '#20203b', c - 1, fy + 8, 12, 10); R(g, '#ff7a1a', c, fy + 9, 10, 8); R(g, '#fff', c + 2, fy + 11, 6, 2); R(g, '#20203b', c + 3, fy + 3, 4, 6); R(g, '#ff7a1a', c + 4, fy + 4, 2, 5); });
    /* letrero */
    var gx = (V * .9) | 0; R(g, '#20203b', gx, fy - 14, 2, 24); bx(g, gx - 14, fy - 24, 30, 11, '#ffd35a'); PX.text3(g, 'OBRA', gx - 9, fy - 21, '#20203b', 1);
    L.sx = sx; L.gy = gy;
  }
  function lauAnim(g, W, H, t, L) {
    /* nubes */
    for (var c = 0; c < 3; c++) { var cx = ((t * (2 + c) + c * 150) % (W + 80)) - 40, cy = 14 + c * 14; R(g, '#ffffff', cx, cy, 30, 6); R(g, '#ffffff', cx + 6, cy - 4, 18, 5); R(g, '#e6f2ff', cx, cy + 5, 30, 1); }
    /* grúa torre */
    var gx = (L.V * .94) | 0, top = 10, gy = L.gy;
    for (var y = top + 6; y < gy; y += 6) { R(g, '#20203b', gx - 5, y, 12, 1); R(g, '#ffb02e', gx - 5, y + 1, 2, 5); R(g, '#ffb02e', gx + 5, y + 1, 2, 5); PX.line(g, '#a8761a', gx - 4, y + 1, gx + 5, y + 6); }
    R(g, '#20203b', gx - 6, top + 6, 14, 3); R(g, '#20203b', gx - 8, gy - 3, 18, 4);
    var jl = 140; R(g, '#20203b', gx - jl, top, jl + 34, 5); R(g, '#ffb02e', gx - jl, top + 1, jl + 34, 3);
    for (var k = 0; k < jl; k += 8) PX.line(g, '#a8761a', gx - jl + k, top + 1, gx - jl + k + 8, top + 3);
    bx(g, gx + 14, top + 5, 16, 12, '#8f93a6'); bx(g, gx - 2, top - 8, 12, 9, '#f2b038'); R(g, '#9fd3f0', gx + 1, top - 6, 6, 4); R(g, '#20203b', gx + 4, top - 14, 1, 7); PX.line(g, '#20203b', gx + 4, top - 14, gx - 30, top);
    /* gancho con carga */
    var hx = gx - 90 + Math.round(Math.sin(t * .7) * 14), len = 30 + Math.round((Math.sin(t * .9) + 1) * 24);
    R(g, '#20203b', hx, top + 5, 1, len); R(g, '#20203b', hx - 3, top + 5 + len, 7, 4); R(g, '#ffd35a', hx - 2, top + 6 + len, 5, 2);
    var ly = top + 9 + len, sway = Math.round(Math.sin(t * 1.6) * 1);
    PX.line(g, '#20203b', hx, ly, hx - 8 + sway, ly + 8); PX.line(g, '#20203b', hx, ly, hx + 8 + sway, ly + 8);
    R(g, '#20203b', hx - 10 + sway, ly + 8, 21, 5); R(g, '#d4683c', hx - 9 + sway, ly + 9, 19, 3); for (var s = 0; s < 4; s++) R(g, '#9a4423', hx - 7 + sway + s * 5, ly + 9, 1, 3);
    /* aves */
    for (var b = 0; b < 2; b++) { var bxp = ((t * 14 + b * 90) % (W + 30)) - 15, byp = 30 + b * 12 + Math.round(Math.sin(t * 3 + b) * 2), f = ((t * 6 + b) | 0) % 2; R(g, '#20203b', bxp, byp + f, 2, 1); R(g, '#20203b', bxp + 2, byp, 2, 1); R(g, '#20203b', bxp + 4, byp + f, 2, 1); }
  }

  /* =============== SHAROL · laboratorio de normas (amarillo) =============== */
  function shaStatic(g, W, H, L) {
    var V = L.V, fy = L.fy, wh = fy - 8;
    PX.vgrad(g, 0, 0, W, wh, '#ffe27a', '#fff6c8', 8);
    R(g, '#e6b422', 0, wh - 30, W, 30); for (var x = 0; x < W; x += 10) R(g, '#fff3b0', x, wh - 30, 1, 30); for (var y = wh - 30; y < wh; y += 10) R(g, '#fff3b0', 0, y, W, 1);
    R(g, '#20203b', 0, wh - 31, W, 1);
    for (var yy = wh; yy < H; yy += 8) for (var xx = 0; xx < W; xx += 8) R(g, ((xx + yy) / 8) % 2 ? '#e9d9a3' : '#d4be78', xx, yy, 8, 8);
    R(g, '#00000030', 0, wh, W, 3);
    /* ventana con la obra */
    var wx = (V * .17) | 0, wy = wh - 112, ww = 100, hh = 74;
    L.win = { x: wx, y: wy, w: ww, h: hh };
    R(g, '#20203b', wx - 4, wy - 4, ww + 8, hh + 8); PX.vgrad(g, wx, wy, ww, hh, '#7fc4ee', '#e6f6ff', 8);
    R(g, '#8fb2de', wx, wy + hh - 24, ww, 24);
    for (var b = 0; b < 7; b++) { var bh = 12 + (b * 11) % 26; R(g, '#a8c4e8', wx + 6 + b * 14, wy + hh - 24 - bh, 11, bh); }
    R(g, '#7a8a9a', wx, wy + hh - 14, ww, 14); R(g, '#5b5f7a', wx, wy + hh - 8, ww, 1); for (var d = 0; d < ww; d += 12) R(g, '#ffd35a', wx + d, wy + hh - 5, 6, 1);
    R(g, '#ffd35a', wx + ww / 2 - 1, wy, 3, hh); R(g, '#20203b', wx + ww / 2 - 1, wy, 1, hh); R(g, '#e6b422', wx - 6, wy + hh + 4, ww + 12, 3);
    /* estante de normas */
    var sx = 3, sy = wh - 100;
    bx(g, sx, sy - 3, 30, 98, '#8a5a3a');
    for (var r = 0; r < 4; r++) { var ry = sy + r * 24; R(g, '#5e3a24', sx + 2, ry + 20, 26, 3); var bxx = sx + 3; var cols = ['#c2403f', '#3f6fd0', '#2f9e57', '#ffd35a', '#8a5fd6', '#ff8fb8']; for (var k = 0; k < 6; k++) { var bw = 3 + (k % 3); R(g, '#20203b', bxx, ry + 6 + (k % 2) * 2, bw + 1, 14 - (k % 2) * 2); R(g, cols[(k + r) % 6], bxx, ry + 7 + (k % 2) * 2, bw, 13 - (k % 2) * 2); bxx += bw + 1; } }
    PX.text3(g, 'NSR', sx + 5, sy + 1, '#20203b', 1);
    /* cartel de recubrimiento */
    var px = (V * .66) | 0, py = wh - 118;
    bx(g, px - 3, py - 3, 56, 54, '#8a5a3a'); R(g, '#fffdf0', px, py, 50, 48);
    PX.text3(g, 'RECUBRIM.', px + 3, py + 3, '#c2403f', 1); R(g, '#20203b', px + 12, py + 14, 26, 26); R(g, '#b6bac9', px + 13, py + 15, 24, 24); R(g, '#8f93a6', px + 17, py + 19, 16, 16);
    [[19, 21], [30, 21], [19, 32], [30, 32]].forEach(function (p) { R(g, '#d4683c', px + p[0], py + p[1], 2, 2); });
    R(g, '#c2403f', px + 13, py + 42, 24, 1); R(g, '#c2403f', px + 13, py + 40, 1, 5); R(g, '#c2403f', px + 36, py + 40, 1, 5); PX.text3(g, '75 MM', px + 13, py + 43, '#20203b', 1);
    /* banco de laboratorio con probetas y cono */
    var bnx = (V * .8) | 0, bny = fy - 30;
    bx(g, bnx, bny, 64, 7, '#a8a39a'); R(g, '#20203b', bnx + 4, bny + 7, 5, 28); R(g, '#20203b', bnx + 54, bny + 7, 5, 28); R(g, '#7a766e', bnx + 6, bny + 9, 50, 14);
    for (var p = 0; p < 3; p++) { var cx = bnx + 6 + p * 11; R(g, '#20203b', cx, bny - 17, 9, 17); R(g, '#c8ccd6', cx + 1, bny - 16, 7, 15); R(g, '#eef0f6', cx + 2, bny - 16, 2, 15); R(g, '#8f93aa', cx + 6, bny - 16, 2, 15); }
    R(g, '#20203b', bnx + 38, bny - 20, 20, 20); R(g, '#d4683c', bnx + 40, bny - 18, 16, 18); R(g, '#9a4423', bnx + 40, bny - 18, 16, 2);
    /* prensa de compresión */
    var mx = (V * .62) | 0, my = fy - 62;
    bx(g, mx, fy - 10, 40, 10, '#6a6e87'); bx(g, mx + 4, my + 10, 5, 46, '#c2403f'); bx(g, mx + 31, my + 10, 5, 46, '#c2403f'); bx(g, mx, my + 4, 40, 8, '#c2403f');
    bx(g, mx + 14, my + 12, 12, 8, '#8f93aa'); bx(g, mx + 14, fy - 30, 12, 20, '#b0b4c6'); R(g, '#eef0f6', mx + 17, fy - 28, 3, 16);
    PX.circ(g, '#20203b', mx + 20, my - 2, 8); PX.circ(g, '#f7f7ff', mx + 20, my - 2, 6);
    for (var tk = 0; tk < 8; tk++) R(g, '#20203b', mx + 20 + Math.round(Math.cos(tk * .8 - 1.2) * 5), my - 2 + Math.round(Math.sin(tk * .8 - 1.2) * 5), 1, 1);
    L.pm = { x: mx + 20, y: my - 2 };
    /* casco y chaleco */
    
  }
  function shaAnim(g, W, H, t, L) {
    var w = L.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
    var tx = ((t * 10) % (w.w + 80)) - 60; PX.truck(g, w.x + tx, w.y + w.h - 38, t, { shadow: false });
    var gx = w.x + 78; R(g, '#20203b', gx, w.y + 8, 3, w.h - 24); R(g, '#ffb02e', gx + 1, w.y + 9, 1, w.h - 26); R(g, '#20203b', gx - 30, w.y + 8, 40, 3); R(g, '#ffb02e', gx - 29, w.y + 9, 38, 1);
    var hh = 6 + Math.round(((Math.sin(t) + 1) * 14)); R(g, '#20203b', gx - 24, w.y + 11, 1, hh); R(g, '#20203b', gx - 26, w.y + 11 + hh, 5, 3);
    g.restore();
    /* aguja del manómetro */
    var p = L.pm, a = -2.3 + (Math.sin(t * .9) + 1) * 1.1; PX.line(g, '#c2403f', p.x, p.y, p.x + Math.cos(a) * 5, p.y + Math.sin(a) * 5);
    /* lámpara fluorescente que parpadea */
    var lx = (L.V * .42) | 0, on = ((t * 7) | 0) % 23 !== 0; R(g, '#20203b', lx, 0, 1, 12); R(g, '#20203b', lx - 28, 12, 58, 5); R(g, on ? '#ffffff' : '#c8ccd6', lx - 27, 13, 56, 3);
    if (on) for (var i = 0; i < 22; i++) PX.dith(g, '#ffffffcc', lx - 26 - i, 17 + i, 54 + i * 2, 1, .07 - i * .002);
  }

  /* =============== LAURY Y MALU · estudio de arquitectura (rosa/morado) =============== */
  function plaStatic(g, W, H, L) {
    var V = L.V, fy = L.fy, wh = fy - 8;
    PX.vgrad(g, 0, 0, W, wh, '#5a3a9a', '#d8a6e8', 12);
    for (var x = 0; x < W; x += 10) R(g, '#ffffff0a', x, 0, 4, wh);
    /* ventanal con ciudad al atardecer */
    var wx = (V * .03) | 0, wy = wh - 120, ww = (V * .5) | 0, hh = 92;
    R(g, '#20203b', wx - 4, wy - 4, ww + 8, hh + 8); PX.vgrad(g, wx, wy, ww, hh, '#7a4fc0', '#ffb0a0', 12);
    PX.circ(g, '#fff0c8', wx + ww * .7 | 0, wy + hh - 20, 10); PX.circ(g, '#ffe0b0', wx + ww * .7 | 0, wy + hh - 20, 7);
    for (var x2 = 0; x2 < ww; x2 += 9) { var bh = 16 + ((x2 * 13 + 5) % 44); R(g, '#3a2470', wx + x2, wy + hh - bh, 8, bh); for (var q = wy + hh - bh + 4; q < wy + hh - 3; q += 5) if ((q + x2) % 3) R(g, '#ffd9a0', wx + x2 + 2, q, 2, 2); }
    for (var m = 1; m < 4; m++) R(g, '#20203b', wx + (ww / 4 * m | 0), wy, 2, hh); R(g, '#20203b', wx, wy + hh / 2 | 0, ww, 2);
    R(g, '#8a5fd6', wx - 6, wy + hh + 4, ww + 12, 4);
    /* piso y alfombra */
    for (var y = wh; y < H; y += 6) { R(g, y % 12 ? '#9a8fb8' : '#8e83ae', 0, y, W, 6); } R(g, '#00000030', 0, wh, W, 3);
    var rx = (V * .02) | 0, rw = (V * .52) | 0; R(g, '#20203b', rx - 1, fy - 2, rw + 2, 16); R(g, '#6a4aa8', rx, fy - 1, rw, 14); R(g, '#ff8fb8', rx + 4, fy + 1, rw - 8, 1); R(g, '#ff8fb8', rx + 4, fy + 9, rw - 8, 1);
    for (var d = 0; d < rw - 20; d += 10) R(g, '#ff8fb8', rx + 10 + d, fy + 4, 4, 3);
    /* mesa de dibujo inclinada */
    var tx = (V * .54) | 0, ty = fy - 34;
    R(g, '#20203b', tx, ty, 66, 10); R(g, '#f4f1ff', tx + 2, ty + 1, 62, 6); PX.line(g, '#ffffffaa', tx + 2, ty + 1, tx + 64, ty + 1); R(g, '#c9b8f0', tx + 2, ty + 7, 62, 2);
    for (var l = 0; l < 5; l++) R(g, '#3f2a86', tx + 8 + l * 11, ty + 3, 6, 1); R(g, '#3f2a86', tx + 8, ty + 3, 1, 3);
    R(g, '#20203b', tx + 14, ty + 10, 4, 28); R(g, '#20203b', tx + 48, ty + 10, 4, 28); R(g, '#7a4fc0', tx + 15, ty + 10, 2, 28); R(g, '#7a4fc0', tx + 49, ty + 10, 2, 28); R(g, '#5a3a9a', tx + 14, ty + 26, 38, 3);
        /* tubos de planos */
    var rx2 = tx + 72; R(g, '#20203b', rx2, fy - 20, 22, 22); R(g, '#7a4fc0', rx2 + 1, fy - 19, 20, 20);
    [[2, 28, '#f4f1ff'], [8, 34, '#ffd0e3'], [14, 30, '#e8e4f8']].forEach(function (p) { R(g, '#20203b', rx2 + p[0] - 1, fy - 20 - p[1] + 8, 6, p[1]); R(g, p[2], rx2 + p[0], fy - 20 - p[1] + 9, 4, p[1] - 2); });
    /* corcho con planos */
    var kx = (V * .56) | 0, ky = wh - 112; bx(g, kx - 3, ky - 3, 76, 56, '#8a5a3a'); R(g, '#c9955a', kx, ky, 70, 50);
    for (var o = 0; o < 40; o++) R(g, '#b8844a', kx + (o * 17) % 70, ky + (o * 11) % 50, 2, 1);
    [[4, 4, 28, 20, '#f4f1ff'], [36, 6, 30, 18, '#d6e8ff'], [8, 28, 22, 18, '#ffd0e3'], [36, 28, 28, 16, '#f4f1ff']].forEach(function (p) { R(g, '#20203b', kx + p[0] - 1, ky + p[1] - 1, p[2] + 2, p[3] + 2); R(g, p[4], kx + p[0], ky + p[1], p[2], p[3]); R(g, '#3f2a86', kx + p[0] + 3, ky + p[1] + 4, p[2] - 8, 1); R(g, '#3f2a86', kx + p[0] + 3, ky + p[1] + 4, 1, p[3] - 8); R(g, '#3f2a86', kx + p[0] + 3, ky + p[1] + p[3] - 5, p[2] - 8, 1); R(g, '#c2403f', kx + p[0] + p[2] / 2 | 0, ky + p[1] - 1, 2, 2); });
    L.plot = { x: (V * .3) | 0, y: fy - 70 };
    /* plantas */
    var pl = (V * .5) | 0; R(g, '#20203b', pl, fy - 8, 12, 10); R(g, '#ff8fb8', pl + 1, fy - 7, 10, 8); for (var lf = 0; lf < 5; lf++) { R(g, '#20203b', pl + 5 - lf * 2 + 4, fy - 22 - lf * 2, 3, 14); R(g, '#3fae5a', pl + 6 - lf * 2 + 4, fy - 21 - lf * 2, 1, 12); }
  }
  function plaAnim(g, W, H, t, L) {
    var p = L.plot, fy = L.fy;
    /* plotter: papel largo que sale con trazos */
    bx(g, p.x, p.y, 54, 22, '#e8e4f8'); R(g, '#20203b', p.x + 4, p.y + 14, 46, 3); R(g, '#8a5fd6', p.x + 4, p.y + 4, 24, 3); R(g, ((t * 3) | 0) % 2 ? '#2f9e57' : '#bff0cf', p.x + 46, p.y + 5, 3, 3);
    R(g, '#20203b', p.x + 4, p.y + 22, 4, 14); R(g, '#20203b', p.x + 46, p.y + 22, 4, 14); R(g, '#5a3a9a', p.x + 5, p.y + 22, 2, 14); R(g, '#5a3a9a', p.x + 47, p.y + 22, 2, 14);
    var len = Math.min(28, ((t * 8) % 36) | 0); R(g, '#20203b', p.x + 6, p.y + 16, 42, len + 2); R(g, '#f4f1ff', p.x + 7, p.y + 17, 40, len);
    for (var i = 0; i < len; i += 5) { R(g, '#3f2a86', p.x + 10, p.y + 18 + i, 20 + (i * 7) % 14, 1); }
    /* lámparas colgantes */
    [(L.V * .1) | 0, (L.V * .42) | 0].forEach(function (x, i) { var s = Math.round(Math.sin(t * 1.2 + i * 2) * 2); R(g, '#20203b', x, 0, 1, 22); R(g, '#20203b', x + s - 8, 22, 17, 7); R(g, '#ff8fb8', x + s - 7, 23, 15, 5); R(g, '#fff0c8', x + s - 4, 29, 9, 2); for (var k = 0; k < 18; k++) PX.dith(g, '#fff0c8', x + s - 8 - k / 2 | 0, 31 + k, 17 + k, 1, .1 - k * .004); });
    motes(g, W, (L.V * .03) | 0, L.fy - 110, (L.V * .5) | 0, 100, t, 12, '#ffe0b0');
    /* destellos en el ventanal */
    var sp = ((t * 2) | 0) % 5; R(g, '#fff', (L.V * .08 + sp * 20) | 0, L.fy - 92 + sp * 7, 1, 1);
  }

  var SC = { isamar: { s: isaStatic, a: isaAnim }, laura: { s: lauStatic, a: lauAnim }, sharol: { s: shaStatic, a: shaAnim }, planos: { s: plaStatic, a: plaAnim } };

  /* ---------- motor de escena ---------- */
  var cvs, cx, base, bg, W = 0, H = 0, S = 3, cur = 'isamar', L = {}, baseKey = '', raf = 0, lastT = 0, t0 = performance.now(), tr, trg, trBlocks = null, trP = 0, trLast = 0;
  var RMo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    var st = document.getElementById('stage'); if (!st) return false;
    var r = st.getBoundingClientRect(); if (r.width < 50 || r.height < 50) return false;
    var s = Math.max(2, Math.round(r.height / 150)); if (r.width < 600) s = 2;
    var nw = Math.ceil(r.width / s), nh = Math.ceil(r.height / s);
    if (nw === W && nh === H && s === S) return true;
    S = s; W = nw; H = nh;
    cvs.width = tr.width = W; cvs.height = tr.height = H; cx.imageSmoothingEnabled = false; trg.imageSmoothingEnabled = false;
    baseKey = ''; return true;
  }
  function layout() { var fy = H - Math.ceil(56 / S) - 4; L = { fy: fy, V: (W * .54) | 0, cx: (W * .27) | 0 }; }
  function rebuild() {
    layout(); base = PX.mk(W, H); SC[cur].s(base.g, W, H, L); baseKey = cur + W + 'x' + H;
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.getElementById('v-home').classList.contains('hid')) return;
    if (!size()) return;
    if (baseKey !== cur + W + 'x' + H) rebuild();
    if (now - lastT < 83) { stepTr(now); return; } lastT = now;
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
  window.PCScenes = { init: init, render: function (k, w, h, t) { var c = PX.mk(w, h), l = { fy: h - 23, V: (w * .54) | 0, cx: (w * .27) | 0 }; SC[k].s(c.g, w, h, l); SC[k].a(c.g, w, h, t || 1, l); return c.c; } };
  init();
})();
