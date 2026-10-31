/* ==========================================================
   PIXEL CLUB · Misión de Isamar
   - Sección 4: "Sala de exploración" con 10 tarjetas (5 ventajas y
     5 desventajas del sistema aporticado), cada una con su ilustración
     pixel art animada, y un reto final de clasificación.
   - Ventana de logro propia (Isamar / Sharol) en lugar del aviso genérico.
   ========================================================== */
(function () {
  'use strict';
  var R = PX.r, T3 = PX.text3;
  function LB(g, txt, x, y, c) { R(g, '#ffffffd0', x - 1, y - 1, PX.w3(txt, 1) + 2, 7); T3(g, txt, x, y, c, 1); }

  /* ---------- contenido (texto de la misión, sin recortes) ---------- */
  var ITEMS = [
    { t: 'v', k: 'Espacios flexibles', d: 'Permite distribuir divisiones interiores con mayor libertad, si el diseño lo permite.', ok: 'Con columnas y vigas que cargan el peso, los muros interiores pueden ubicarse con libertad cuando el diseño lo permite.' },
    { t: 'v', k: 'Materiales conocidos', d: 'El concreto y el acero de refuerzo tienen amplia aplicación en la construcción.', ok: 'El concreto y el acero de refuerzo son materiales de amplia aplicación en la construcción.' },
    { t: 'v', k: 'Durabilidad', d: 'Puede ofrecer una larga vida útil con diseño, ejecución y mantenimiento adecuados.', ok: 'La larga vida útil depende de un buen diseño, una buena ejecución y un mantenimiento adecuado.' },
    { t: 'v', k: 'Adaptabilidad arquitectónica', d: 'Permite distintas distribuciones y configuraciones de espacios.', ok: 'El mismo esqueleto estructural admite distintas distribuciones y configuraciones de espacios.' },
    { t: 'v', k: 'Resistencia sísmica diseñada', d: 'Puede disipar energía y desarrollar ductilidad si cumple los requisitos de diseño y detallado correspondientes.', ok: 'Si cumple el diseño y el detallado correspondientes, el pórtico puede disipar energía y deformarse con ductilidad.' },
    { t: 'd', k: 'Construcción por etapas', d: 'El encofrado, el armado, el vaciado y el curado requieren coordinación.', ok: 'Encofrado, armado, vaciado y curado son etapas sucesivas que deben coordinarse.' },
    { t: 'd', k: 'Peso propio elevado', d: 'Puede incrementar las cargas sobre columnas y cimentaciones.', ok: 'El peso propio del concreto suma carga sobre columnas y cimentaciones.' },
    { t: 'd', k: 'Tiempo de ejecución', d: 'El concreto necesita alcanzar la resistencia requerida antes de ciertas actividades de obra.', ok: 'El concreto necesita tiempo para alcanzar la resistencia requerida antes de ciertas actividades.' },
    { t: 'd', k: 'Control de calidad exigente', d: 'Errores en el acero, el vaciado, la compactación o el curado pueden afectar el desempeño.', ok: 'Errores en el acero, el vaciado, la compactación o el curado pueden afectar el desempeño.' },
    { t: 'd', k: 'Deformaciones laterales', d: 'Un pórtico sin rigidez suficiente puede presentar derivas excesivas ante cargas horizontales.', ok: 'Sin rigidez suficiente, el pórtico puede presentar derivas excesivas ante cargas horizontales.' }
  ];

  /* reto final: las 10 tarjetas (reemplaza las 6 frases anteriores) */
  CARDS.length = 0;
  ITEMS.forEach(function (it) { CARDS.push({ text: it.k + ': ' + it.d, type: it.t, ok: '¡Correcto! ' + it.ok }); });

  /* ---------- ilustraciones 160x72 ---------- */
  var BGV = ['#e3f6ea', '#cfeedb'], BGD = ['#ffe9e4', '#ffd6cf'];
  function paper(g, W, H, d) { PX.vgrad(g, 0, 0, W, H, d ? BGD[0] : BGV[0], d ? BGD[1] : BGV[1], 4); for (var x = 0; x < W; x += 8) R(g, '#00000010', x, 0, 1, H); for (var y = 0; y < H; y += 8) R(g, '#00000010', 0, y, W, 1); R(g, '#20203b', 0, H - 6, W, 6); R(g, '#7a5230', 0, H - 6, W, 1); }
  /* pórtico con inclinación opcional (lean px en la cima) */
  function PF(g, x0, gy, span, sh, ns, lean, o) {
    o = o || {}; var th = sh * ns, cc = o.col || '#c9ccd8', bc = o.beam || '#e4d6bd';
    for (var r = 0; r < th; r++) { var dx = Math.round(lean * r / th), y = gy - r - 1; [x0, x0 + span].forEach(function (cx) { R(g, '#20203b', cx + dx - 1, y, 6, 1); R(g, cc, cx + dx, y, 4, 1); R(g, '#f4f5f9', cx + dx, y, 1, 1); }); }
    for (var s = 1; s <= ns; s++) { var by = gy - s * sh, dd = Math.round(lean * (s * sh) / th); R(g, '#20203b', x0 + dd - 1, by - 3, span + 6, 5); R(g, bc, x0 + dd, by - 2, span + 4, 3); }
    R(g, '#20203b', x0 - 3, gy - 2, 10, 2); R(g, '#20203b', x0 + span - 3, gy - 2, 10, 2);
  }
  function arrow(g, x, y, len, c, w) { w = w || 2; R(g, c, x, y, w, len); R(g, c, x - w, y + len, w * 3, 1); R(g, c, x - w + 1, y + len + 1, w * 3 - 2, 1); R(g, c, x, y + len + 2, w, 1); }
  function harrow(g, x, y, len, c) { R(g, c, x, y, len, 2); R(g, c, x + len, y - 2, 1, 6); R(g, c, x + len + 1, y - 1, 1, 4); R(g, c, x + len + 2, y, 1, 2); }

  var ILL = [
    /* 0 Espacios flexibles: planta con muros que se reubican */
    function (g, W, H, t) {
      paper(g, W, H, 0); var lay = ((t / 2.2) | 0) % 3, x0 = 30, y0 = 8, w = 100, h = 50;
      R(g, '#20203b', x0 - 2, y0 - 2, w + 4, h + 4); R(g, '#fffdf5', x0, y0, w, h);
      [0, 1, 2].forEach(function (i) { [0, 1].forEach(function (j) { var cx = x0 + 3 + i * 47, cy = y0 + 3 + j * 40; R(g, '#20203b', cx, cy, 5, 5); R(g, '#8f93a6', cx + 1, cy + 1, 3, 3); }); });
      var walls = [[[x0 + 50, y0 + 8, 3, 34]], [[x0 + 25, y0 + 25, 3, 20], [x0 + 25, y0 + 25, 40, 3], [x0 + 70, y0 + 8, 3, 30]], [[x0 + 8, y0 + 20, 36, 3], [x0 + 60, y0 + 20, 32, 3], [x0 + 44, y0 + 8, 3, 12]]][lay];
      walls.forEach(function (q) { R(g, '#20203b', q[0] - 1, q[1] - 1, q[2] + 2, q[3] + 2); R(g, '#ff8fb8', q[0], q[1], q[2], q[3]); });
      LB(g, ['DISTRIBUCION A', 'DISTRIBUCION B', 'DISTRIBUCION C'][lay], 40, 59, '#1c6b3a'); harrow(g, 4, 30, 14, '#2f9e57'); harrow(g, 138, 30, 14, '#2f9e57');
    },
    /* 1 Materiales conocidos */
    function (g, W, H, t) {
      paper(g, W, H, 0);
      for (var b = 0; b < 3; b++) { var bx = 8 + b * 5, by = 44 - b * 12; R(g, '#20203b', bx, by, 26, 14); R(g, '#d9d4c4', bx + 1, by + 1, 24, 12); R(g, '#3f6fd0', bx + 4, by + 4, 18, 5); T3(g, 'CEM', bx + 6, by + 5, '#fff', 1); }
      for (var r = 0; r < 5; r++) { R(g, '#20203b', 58, 30 + r * 4, 38, 3); R(g, '#d4683c', 59, 31 + r * 4, 36, 1); for (var k = 0; k < 9; k++) R(g, '#9a4423', 60 + k * 4, 31 + r * 4, 1, 1); }
      T3(g, '+', 44, 28, '#20203b', 2); harrow(g, 100, 34, 10, '#20203b');
      var sx = 122; R(g, '#20203b', sx, 16, 34, 34); R(g, '#b6bac9', sx + 1, 17, 32, 32); R(g, '#8f93a6', sx + 5, 21, 24, 24); R(g, '#20203b', sx + 8, 24, 18, 18); R(g, '#a8a39a', sx + 9, 25, 16, 16);
      [[10, 26], [22, 26], [10, 38], [22, 38]].forEach(function (p) { R(g, '#d4683c', sx + p[0] - 1, p[1] - 1, 3, 3); }); R(g, '#d4683c', sx + 8, 24, 18, 1); R(g, '#d4683c', sx + 8, 41, 18, 1); R(g, '#d4683c', sx + 8, 24, 1, 18); R(g, '#d4683c', sx + 25, 24, 1, 18);
      T3(g, 'CONCRETO + ACERO', 36, 8, '#1c6b3a', 1); if (((t * 3) | 0) % 4 === 0) R(g, '#fff', 130, 18, 2, 2);
    },
    /* 2 Durabilidad */
    function (g, W, H, t) {
      paper(g, W, H, 0); PF(g, 52, 56, 38, 17, 3, 0);
      R(g, '#a6dcf5', 58, 44, 28, 8); R(g, '#a6dcf5', 58, 27, 28, 8);
      var yr = Math.min(50, ((t * 9) | 0) % 64); T3(g, 'ANO ' + yr, 100, 8, '#20203b', 2);
      ['DISENO', 'EJECUCION', 'MANTENIM.'].forEach(function (s, i) { var on = ((t / 1.2) | 0) % 4 > i, x = 100, y = 26 + i * 12; R(g, '#20203b', x, y, 56, 10); R(g, on ? '#bff0cf' : '#f4f1ff', x + 1, y + 1, 54, 8); T3(g, s, x + 3, y + 2, '#20203b', 1); if (on) { R(g, '#2f9e57', x + 46, y + 3, 2, 2); R(g, '#2f9e57', x + 48, y + 2, 2, 2); R(g, '#2f9e57', x + 50, y + 1, 2, 3); } });
      for (var i = 0; i < 3; i++) R(g, '#2f9e5788', 42 + i * 2, 12 + ((t * 8 + i * 9) % 40), 1, 3);
    },
    /* 3 Adaptabilidad: misma estructura, distintos usos */
    function (g, W, H, t) {
      paper(g, W, H, 0); var m = ((t / 2.4) | 0) % 3, x0 = 40, gy = 58; PF(g, x0, gy, 70, 24, 2, 0);
      var fill = function (x, y, w, h, c) { R(g, '#20203b', x - 1, y - 1, w + 2, h + 2); R(g, c, x, y, w, h); };
      if (m === 0) { [0, 1].forEach(function (r) { [0, 1].forEach(function (c) { fill(x0 + 10 + c * 36, gy - 20 - r * 24, 22, 14, '#a6dcf5'); }); }); fill(x0 + 30, gy - 15, 10, 15, '#a8683a'); R(g, '#c2403f', x0 - 2, gy - 52, 78, 3); }
      if (m === 1) { [0, 1].forEach(function (r) { fill(x0 + 8, gy - 21 - r * 24, 62, 11, '#9fd3f0'); for (var k = 1; k < 5; k++) R(g, '#20203b', x0 + 8 + k * 12, gy - 21 - r * 24, 1, 11); }); }
      if (m === 2) { fill(x0 + 8, gy - 22, 62, 20, '#ffd9a0'); R(g, '#c2403f', x0 + 6, gy - 28, 66, 6); for (var s = 0; s < 8; s++) R(g, '#fff', x0 + 8 + s * 8, gy - 28, 4, 6); fill(x0 + 10, gy - 48, 58, 10, '#a6dcf5'); }
      LB(g, ['VIVIENDA', 'OFICINAS', 'LOCAL COMERCIAL'][m], 98, 3, '#1c6b3a'); LB(g, 'MISMA ESTRUCTURA', 94, 62 - 8, '#20203b');
    },
    /* 4 Resistencia sísmica */
    function (g, W, H, t) {
      paper(g, W, H, 0); var sh = Math.sin(t * 5), lean = Math.round(sh * 7), gy = 56 + (((t * 20) | 0) % 2);
      R(g, '#6f5436', 0, 57, W, 9); PF(g, 50, gy, 50, 22, 2, lean);
      var pulse = ((t * 4) | 0) % 2; [[0, 1], [50, 1], [0, 2], [50, 2]].forEach(function (p) { var by = gy - p[1] * 22, dd = Math.round(lean * (p[1] * 22) / 44); R(g, pulse ? '#ff4d4d' : '#ff9a9a', 50 + p[0] + dd + 1, by - 3, 4, 4); });
      for (var i = 0; i < 3; i++) { var a = (t * 2 + i) % 3; R(g, '#8f6f3a', 8 + a * 10, 60, 8, 1); R(g, '#8f6f3a', 124 + a * 10, 60, 8, 1); }
      T3(g, 'DISIPA ENERGIA', 40, 4, '#c2403f', 1); T3(g, 'DUCTILIDAD', 108, 24, '#1c6b3a', 1); T3(g, 'NO COLAPSA', 108, 32, '#1c6b3a', 1);
    },
    /* 5 Construcción por etapas */
    function (g, W, H, t) {
      paper(g, W, H, 1); var act = ((t / 1.6) | 0) % 4, names = ['ENCOFRADO', 'ARMADO', 'VACIADO', 'CURADO'];
      for (var i = 0; i < 4; i++) {
        var x = 6 + i * 38, y = 8, on = i === act; R(g, '#20203b', x, y, 34, 40); R(g, on ? '#fff7d6' : '#f4f1ff', x + 1, y + 1, 32, 38);
        if (on) R(g, '#ffd35a', x - 1, y + 40, 36, 3);
        if (i === 0) { R(g, '#c88a4a', x + 8, y + 8, 3, 26); R(g, '#c88a4a', x + 23, y + 8, 3, 26); R(g, '#a8683a', x + 8, y + 34, 18, 2); R(g, '#5b5f7a', x + 6, y + 18, 22, 1); }
        if (i === 1) { for (var b = 0; b < 3; b++) R(g, '#d4683c', x + 10 + b * 6, y + 6, 2, 28); for (var e = 0; e < 5; e++) R(g, '#9a4423', x + 9, y + 9 + e * 6, 16, 1); }
        if (i === 2) { var lv = on ? 2 + ((t * 10) % 16) : 8; R(g, '#c88a4a', x + 6, y + 14, 3, 22); R(g, '#c88a4a', x + 25, y + 14, 3, 22); R(g, '#9aa0b4', x + 9, y + 36 - lv, 16, lv); R(g, '#20203b', x + 12, y + 3, 12, 6); R(g, '#f2b038', x + 13, y + 4, 10, 4); if (on) R(g, '#9aa0b4', x + 17, y + 9, 2, 5); }
        if (i === 3) { R(g, '#b6bac9', x + 9, y + 12, 16, 24); for (var d = 0; d < 3; d++) R(g, '#4ea0e8', x + 11 + d * 5, y + 5 + ((t * 8 + d * 5) % 12), 1, 2); T3(g, '7D', x + 12, y + 16, '#20203b', 1); }
        T3(g, names[i], x + 17 - PX.w3(names[i], 1) / 2 | 0, y + 44, '#20203b', 1); R(g, '#ffffff', x + 1, y + 1, 4, 5); T3(g, String(i + 1), x + 2, y + 1, '#c2403f', 1);
      }
      for (var k = 0; k < 3; k++) { var on2 = k < act; R(g, '#20203b', 34 + k * 38, 26, 8, 3); R(g, on2 ? '#c2403f' : '#ffd6cf', 35 + k * 38, 27, 6, 1); }
    },
    /* 6 Peso propio elevado */
    function (g, W, H, t) {
      paper(g, W, H, 1); var k = Math.round(Math.sin(t * 3) * 1);
      R(g, '#20203b', 40, 6 + k, 80, 10); R(g, '#b6bac9', 41, 7 + k, 78, 8); T3(g, 'PESO PROPIO', 52, 9 + k, '#20203b', 1);
      [50, 78, 106].forEach(function (x, i) { var a = (t * 12 + i * 3) % 6 | 0; arrow(g, x, 17 + a, 6, '#c2403f', 2); });
      R(g, '#20203b', 38, 30, 84, 6); R(g, '#e4d6bd', 39, 31, 82, 4);
      [46, 100].forEach(function (x) { R(g, '#20203b', x - 1, 36, 12, 18); R(g, '#c9ccd8', x, 36, 10, 18); R(g, '#f4f5f9', x, 36, 2, 18); });
      [48, 102].forEach(function (x) { arrow(g, x + 3, 38, 12, '#c2403f', 3); });
      R(g, '#20203b', 30, 54, 28, 6); R(g, '#8f93a6', 31, 55, 26, 4); R(g, '#20203b', 86, 54, 28, 6); R(g, '#8f93a6', 87, 55, 26, 4);
      T3(g, 'MAS CARGA', 124, 38, '#c2403f', 1); T3(g, 'EN COLUMNAS', 120, 46, '#c2403f', 1); T3(g, 'Y CIMENTACION', 116, 54, '#c2403f', 1);
    },
    /* 7 Tiempo de ejecución */
    function (g, W, H, t) {
      paper(g, W, H, 1); var days = [1, 3, 7, 28], p = ((t / 1.5) | 0) % 5, fill = [0, 8, 18, 30, 44][p];
      R(g, '#20203b', 10, 6, 56, 52); R(g, '#b6bac9', 11, 7, 54, 50); T3(g, 'CONCRETO', 17, 10, '#20203b', 1);
      R(g, '#20203b', 18, 22, 40, 10); R(g, '#f4f1ff', 19, 23, 38, 8); R(g, '#2f9e57', 19, 23, Math.round(fill / 44 * 38), 8); T3(g, 'RESISTENCIA', 14, 36, '#20203b', 1);
      for (var i = 0; i < 4; i++) { R(g, '#20203b', 76 + i * 20, 6, 18, 20); R(g, p > i ? '#bff0cf' : '#fff', 77 + i * 20, 7, 16, 18); T3(g, String(days[i]), 80 + i * 20, 9, '#20203b', 2); T3(g, 'DIAS', 77 + i * 20, 18, '#20203b', 1); }
      PX.circ(g, '#20203b', 90, 44, 11); PX.circ(g, '#fff', 90, 44, 9); var a = t * 2; PX.line(g, '#c2403f', 90, 44, 90 + Math.cos(a) * 7, 44 + Math.sin(a) * 7); R(g, '#20203b', 90, 35, 1, 2);
      T3(g, 'ESPERAR', 108, 36, '#c2403f', 1); T3(g, 'ANTES DE', 108, 43, '#c2403f', 1); T3(g, 'CONTINUAR', 108, 50, '#c2403f', 1);
    },
    /* 8 Control de calidad */
    function (g, W, H, t) {
      paper(g, W, H, 1); var sx = 8, sy = 8; R(g, '#20203b', sx, sy, 50, 50); R(g, '#b6bac9', sx + 1, sy + 1, 48, 48);
      R(g, '#20203b', sx + 8, sy + 8, 34, 34); R(g, '#a8a39a', sx + 9, sy + 9, 32, 32);
      [[12, 12], [34, 12], [12, 34], [34, 34]].forEach(function (p) { R(g, '#d4683c', sx + p[0], sy + p[1], 4, 4); }); R(g, '#9a4423', sx + 12, sy + 12, 26, 1); R(g, '#9a4423', sx + 12, sy + 37, 26, 1); R(g, '#9a4423', sx + 12, sy + 12, 1, 26); R(g, '#9a4423', sx + 37, sy + 12, 1, 26);
      for (var v = 0; v < 6; v++) R(g, '#5a5446', sx + 18 + (v * 5) % 14, sy + 20 + (v * 7) % 12, 3, 2);
      var mx = sx + 24 + Math.round(Math.sin(t * 1.5) * 12), my = sy + 24 + Math.round(Math.cos(t * 1.5) * 9);
      PX.circ(g, '#20203b', mx, my, 8); PX.circ(g, '#dff2ff', mx, my, 6); R(g, '#20203b', mx + 5, my + 5, 8, 3);
      var L = ['ACERO', 'VACIADO', 'COMPACTAC.', 'CURADO'], ok = [1, 1, 0, 1];
      L.forEach(function (s, i) { var y = 8 + i * 12, on = ((t / 1.0) | 0) % 5 > i; R(g, '#20203b', 70, y, 84, 10); R(g, '#fff', 71, y + 1, 82, 8); T3(g, s, 74, y + 2, '#20203b', 1); if (on) { if (ok[i]) { R(g, '#2f9e57', 140, y + 4, 2, 2); R(g, '#2f9e57', 142, y + 3, 2, 2); R(g, '#2f9e57', 144, y + 2, 2, 3); } else { R(g, '#c2403f', 142, y + 2, 2, 6); R(g, '#c2403f', 140, y + 4, 6, 2); } } });
      LB(g, 'UN ERROR AFECTA', 70, 60, '#c2403f');
    },
    /* 9 Deformaciones laterales */
    function (g, W, H, t) {
      paper(g, W, H, 1); var lean = Math.round((Math.sin(t * 1.8) + 1) / 2 * 12); R(g, '#6f5436', 0, 57, W, 9);
      PF(g, 70, 56, 46, 22, 2, 0, { col: '#ffffff66', beam: '#ffffff66' }); PF(g, 70, 56, 46, 22, 2, lean);
      for (var i = 0; i < 3; i++) { var a = (t * 20 + i * 12) % 36 | 0; harrow(g, 14 + a, 16 + i * 12, 16, '#4ea0e8'); }
      R(g, '#c2403f', 70, 10, 1, 4); R(g, '#c2403f', 70 + lean, 10, 1, 4); R(g, '#c2403f', 70, 12, lean + 1, 1); T3(g, 'DERIVA', 128, 8, '#c2403f', 1);
      LB(g, 'VIENTO O SISMO', 46, 4, '#2a6db0');
    }
  ];
  /* iconos pequeños 16x16 para las tarjetas */
  var ICN = [
    function (g) { R(g, '#20203b', 1, 2, 14, 12); R(g, '#fffdf5', 2, 3, 12, 10); R(g, '#ff8fb8', 7, 3, 2, 6); R(g, '#ff8fb8', 3, 9, 8, 2); },
    function (g) { R(g, '#20203b', 1, 5, 9, 9); R(g, '#d9d4c4', 2, 6, 7, 7); R(g, '#3f6fd0', 3, 8, 5, 2); R(g, '#d4683c', 11, 2, 3, 12); R(g, '#9a4423', 11, 5, 3, 1); },
    function (g) { R(g, '#20203b', 2, 1, 12, 11); R(g, '#bfd6f2', 3, 2, 10, 9); R(g, '#20203b', 5, 12, 6, 3); R(g, '#2f9e57', 5, 6, 2, 2); R(g, '#2f9e57', 7, 7, 2, 2); R(g, '#2f9e57', 9, 4, 2, 4); },
    function (g) { R(g, '#20203b', 1, 1, 14, 14); R(g, '#a6dcf5', 2, 2, 6, 6); R(g, '#ffd9a0', 9, 2, 5, 6); R(g, '#ff8fb8', 2, 9, 6, 5); R(g, '#bff0cf', 9, 9, 5, 5); },
    function (g) { R(g, '#20203b', 4, 1, 8, 13); R(g, '#c9ccd8', 5, 2, 6, 11); PX.line(g, '#c2403f', 0, 8, 3, 6); PX.line(g, '#c2403f', 3, 6, 5, 10); PX.line(g, '#c2403f', 11, 10, 13, 6); PX.line(g, '#c2403f', 13, 6, 15, 8); },
    function (g) { R(g, '#20203b', 1, 10, 5, 5); R(g, '#c88a4a', 2, 11, 3, 3); R(g, '#20203b', 6, 6, 5, 9); R(g, '#d4683c', 7, 7, 3, 7); R(g, '#20203b', 11, 2, 4, 13); R(g, '#9aa0b4', 12, 3, 2, 11); },
    function (g) { R(g, '#20203b', 2, 6, 12, 9); R(g, '#8f93a6', 3, 7, 10, 7); R(g, '#c2403f', 7, 0, 2, 4); R(g, '#c2403f', 5, 3, 6, 1); R(g, '#c2403f', 6, 4, 4, 1); T3(g, 'KG', 4, 9, '#fff', 1); },
    function (g) { PX.circ(g, '#20203b', 8, 8, 7); PX.circ(g, '#fff', 8, 8, 5); R(g, '#c2403f', 8, 4, 1, 5); R(g, '#c2403f', 8, 8, 3, 1); },
    function (g) { PX.circ(g, '#20203b', 6, 6, 5); PX.circ(g, '#dff2ff', 6, 6, 3); R(g, '#20203b', 9, 9, 5, 2); R(g, '#20203b', 11, 11, 3, 4); },
    function (g) { R(g, '#20203b', 2, 12, 12, 3); R(g, '#c9ccd8', 3, 12, 10, 2); PX.line(g, '#20203b', 4, 12, 7, 2); PX.line(g, '#20203b', 10, 12, 13, 2); R(g, '#4ea0e8', 0, 4, 4, 2); R(g, '#4ea0e8', 3, 3, 1, 4); }
  ];
  function iconCanvas(i) { var m = PX.mk(16, 16); ICN[i](m.g); return m.c; }

  /* ---------- sección 4: sala de exploración ---------- */
  var origTopic = topic, seenV = new Set(), curV = -1, illRaf = 0, illT0 = 0;
  function stopIll() { cancelAnimationFrame(illRaf); }
  function showItem(i) {
    var it = ITEMS[i], first = !seenV.has(i); seenV.add(i); curV = i;
    document.querySelectorAll('.vd-card').forEach(function (b, j) { b.classList.toggle('sel', j === i || false); });
    document.querySelectorAll('.vd-card').forEach(function (b) { var j = +b.dataset.i; b.classList.toggle('sel', j === i); if (seenV.has(j)) b.classList.add('seen'); });
    var det = $('#vdDet'); det.className = 'vd-det ' + it.t;
    det.innerHTML = '<div class="vd-ill"><canvas width="160" height="72" aria-hidden="true"></canvas><span class="vd-badge">' + (it.t === 'v' ? '＋ VENTAJA' : '－ DESVENTAJA') + '</span></div><div class="vd-txt"><h4>' + esc(it.k) + '</h4><p>' + esc(it.d) + '</p></div>';
    stopIll(); var cv = det.querySelector('canvas'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false; illT0 = performance.now(); var f = 0;
    (function loop(now) { illRaf = requestAnimationFrame(loop); if (!cv.isConnected) { stopIll(); return; } if (f && now - f < 66) return; f = now; ILL[i](g, 160, 72, RM ? 1.4 : (now - illT0) / 1000); })(performance.now());
    if (first) { gI(4); PC.snd.pick(); }
    var c = $('#vdCount'); c.textContent = seenV.size + '/10 DESCUBIERTAS'; c.classList.toggle('all', seenV.size === 10);
    say((it.t === 'v' ? 'Ventaja: ' : 'Desventaja: ') + it.d);
    var b = $('#vdFinal'); if (b) { b.disabled = seenV.size < 10; b.classList.toggle('rdy', seenV.size === 10); }
    if (first && seenV.size === 10) setTimeout(function () { if ($('#vdFinal')) { say('¡Descubriste las diez tarjetas! Ahora pon a prueba lo que aprendiste en el reto final.'); PC.snd.chime(0); } }, 2800);
  }
  function renderExplore() {
    var cols = ['v', 'd'].map(function (ty) {
      return '<div class="vd-col ' + ty + '"><h5>' + (ty === 'v' ? '＋ VENTAJAS' : '－ DESVENTAJAS') + '</h5>' + ITEMS.map(function (it, i) { return it.t === ty ? '<button type="button" class="vd-card ' + ty + (seenV.has(i) ? ' seen' : '') + (i === curV ? ' sel' : '') + '" data-i="' + i + '"><canvas class="vd-ico" width="16" height="16" aria-hidden="true"></canvas><span>' + esc(it.k) + '</span><i class="vd-chk" aria-hidden="true">✓</i></button>' : ''; }).join('') + '</div>';
    }).join('');
    isaMain.innerHTML = '<div class="krow"><div class="kick">REGISTRO 04 · EVALUACIÓN DEL SISTEMA</div><span id="vdCount" class="vd-count">' + seenV.size + '/10 DESCUBIERTAS</span></div>' +
      '<div class="vd"><div class="vd-list">' + cols + '</div><div class="vd-det" id="vdDet"><div class="vd-empty"><div class="vd-hand">◀</div><b>Elige una tarjeta</b><span>Cada una abre una ilustración que te ayuda a entender el concepto.</span></div></div></div>' +
      '<div class="acts"><button class="ab sec" id="pv">← Anterior</button><button class="ab" id="vdFinal" disabled>Reto final →</button><span class="kick">DESCUBRE LAS 10 TARJETAS PARA ABRIR EL RETO</span></div>';
    document.querySelectorAll('.vd-card').forEach(function (b) { var i = +b.dataset.i, c = b.querySelector('canvas').getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(iconCanvas(i), 0, 0); b.onclick = function () { showItem(i); }; });
    $('#pv').onclick = function () { stopIll(); topic(2); };
    $('#vdFinal').onclick = renderFinal; $('#vdFinal').disabled = seenV.size < 10; $('#vdFinal').classList.toggle('rdy', seenV.size === 10);
    if (curV >= 0) showItem(curV);
  }
  function renderFinal() {
    stopIll();
    isaMain.innerHTML = '<div class="rk" id="rk" style="flex:1;min-height:0;display:flex;flex-direction:column;gap:10px"></div><div class="acts"><button class="ab sec" id="vdBack">← Volver a las tarjetas</button><button class="ab" id="nx3" disabled>Completar misión</button></div>';
    $('#vdBack').onclick = function () { renderExplore(); say('Puedes repasar las tarjetas cuando quieras.'); };
    $('#nx3').onclick = function () { gI(20); ST.xp += mx; save(); win('isamar'); };
    game();
  }
  topic = function (n) {
    if (n !== 3) { stopIll(); return origTopic(n); }
    isaTopic = 3; renderTabs(3); CV = CV.filter(function (o) { return !o.f; });
    renderExplore(); say(seenV.size === 10 ? 'Ya descubriste todas las tarjetas. Puedes repasarlas o ir al reto final.' : 'Explora las tarjetas: cada ventaja y cada desventaja tiene su propia ilustración.');
  };
  var origStart = startIsa; startIsa = function () { seenV = new Set(); curV = -1; stopIll(); origStart(); };

  /* ---------- ventana de logro (Isamar y Sharol) ---------- */
  var origWin = win;
  win = function (m) {
    if (m !== 'isamar' && m !== 'sharol') return origWin(m);
    ST.done[m] = 1; save();
    var cfg = m === 'isamar' ? {
      key: 'isamar', art: 'isamar', title: '¡YA ENTIENDES EL ESQUELETO DEL EDIFICIO!',
      msg: '¡Excelente trabajo! Ahora reconoces cómo funciona un sistema aporticado, identificas sus elementos y comprendes sus ventajas y desventajas para relacionarlas con las decisiones de diseño y construcción.',
      learned: ['Explicas qué es un sistema aporticado: columnas, vigas y losas conectadas por nudos que trabajan como un conjunto.', 'Sigues la ruta de las cargas: losa, viga, columna, cimentación y suelo.', 'Reconoces los seis elementos: losa, vigas, columnas, nudos, cimentación y acero de refuerzo.', 'Distingues cinco ventajas y cinco desventajas del sistema y su relación con el diseño y la obra.'],
      theme: { c1: '#8d2049', c2: '#ffd35a', c3: '#fff3f6', ink: '#2b0c1a', bg: '#1d0812', rib: '#ffffff' }
    } : {
      key: 'sharol', art: 'sharol', title: '¡OBRA INSPECCIONADA CON LA NORMA!',
      msg: '¡Excelente trabajo! Ahora sabes consultar las normas DMO para revisar una obra: recubrimientos, concreto antes de fundir, vigas y ganchos sísmicos, y sabes dónde encontrar cada numeral.',
      learned: ['Identificas el recubrimiento de zapatas y vigas de amarre contra el suelo (75 mm).', 'Reconoces qué revisar antes de fundir: equipo limpio, desmoldante y sin agua libre.', 'Ubicas requisitos de vigas y columnas DMO en la biblioteca de normas.', 'Relacionas el gancho sísmico (135°, extensión 6db y mínimo 75 mm) con el confinamiento del acero.'],
      theme: { c1: '#d99a00', c2: '#20203b', c3: '#fffbe8', ink: '#20203b', bg: '#241a05', rib: '#20203b' }
    };
    cfg.kicker = 'MISIÓN COMPLETADA'; cfg.btn = 'ELEGIR OTRA MISIÓN ▶';
    PC.win(Object.assign(cfg, { onClose: function () { goHome(true); } }));
  };
})();
