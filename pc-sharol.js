/* ==========================================================
   PIXEL CLUB · Misión de Sharol
   - Camión mezclador de concreto 3D para el modelo giratorio
     (sustituye al cubo de concreto). Se construye con cajas
     alineadas a los ejes, como el resto del modelo.
   - Orden de dibujo exacto por planos separadores, para que se vea
     bien desde cualquier ángulo de giro.
   - Icono del concreto = camión mezclador.
   ========================================================== */
(function () {
  'use strict';
  /* Ordena cajas disjuntas de atrás hacia adelante para la dirección de vista g=[gx,gy,gz]
     (mayor producto punto = más cerca de la cámara). */
  window.PCOrder = function (parts, g) {
    var n = parts.length, E = 1e-4, mn = [], mx = [], pre = [], i, j, a, b;
    for (i = 0; i < n; i++) { var p = parts[i]; mn.push([p.x - p.w / 2, p.y, p.z - p.d / 2]); mx.push([p.x + p.w / 2, p.y + p.h, p.z + p.d / 2]); pre.push(0); }
    var after = []; for (i = 0; i < n; i++) after.push([]);
    var cd = function (i2) { return g[0] * parts[i2].x + g[1] * (parts[i2].y + parts[i2].h / 2) + g[2] * parts[i2].z; };
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      var best = -1, bi = 0;
      for (a = 0; a < 3; a++) {
        var sep = (mx[i][a] <= mn[j][a] + E) ? 1 : (mx[j][a] <= mn[i][a] + E) ? -1 : 0;
        if (sep && Math.abs(g[a]) > best) { best = Math.abs(g[a]); bi = sep * (g[a] >= 0 ? 1 : -1); }
      }
      var first = bi > 0 ? i : bi < 0 ? j : (cd(i) <= cd(j) ? i : j), second = first === i ? j : i;
      after[first].push(second); pre[second]++;
    }
    var out = [], done = new Array(n).fill(false);
    for (var c = 0; c < n; c++) {
      var pick = -1;
      for (i = 0; i < n; i++) if (!done[i] && pre[i] === 0 && (pick < 0 || cd(i) < cd(pick))) pick = i;
      if (pick < 0) for (i = 0; i < n; i++) if (!done[i] && (pick < 0 || cd(i) < cd(pick))) pick = i;
      done[pick] = true; out.push(parts[pick]); after[pick].forEach(function (k) { pre[k]--; });
    }
    return out;
  };

  /* Camión mezclador. t = tiempo (gira la hélice del tambor); yb,bx,bz = posición en el mundo.
     Vive en +x (la cabina mira hacia +x). */
  var TIRE = '#2c2c44', HUB = '#b0b4c6', CH = '#5b5f7a', YEL = '#ffc21a', YEL2 = '#ffe27a', GL = '#a6dcf5', GR = '#8f93aa', WH = '#ffffff', OR = '#ff7a33', DK = '#3a3a50';
  var RAD = [.45, .62, .72, .74, .74, .74, .72, .66, .58, .5];
  window.PCTruck = function (t, yb, bx, bz) {
    var K = .85, P = [];
    function part(x0, x1, y0, y1, z0, z1, c) { P.push({ k: 'concreto', x: bx + K * (x0 + x1) / 2, y: yb + K * y0, z: bz + K * (z0 + z1) / 2, w: K * (x1 - x0), h: K * (y1 - y0), d: K * (z1 - z0), c: c, late: true }); }
    /* ruedas octogonales (3 cajas) con tuerca central, 3 ejes x 2 lados */
    [-1.5, -.6, 1.5].forEach(function (xc) {
      [1, -1].forEach(function (sd) {
        var z0 = sd > 0 ? .49 : -.75, z1 = sd > 0 ? .75 : -.49;
        part(xc - .31, xc + .31, .12, .5, z0, z1, TIRE); part(xc - .19, xc + .19, .5, .62, z0, z1, TIRE); part(xc - .19, xc + .19, 0, .12, z0, z1, TIRE);
        if (sd > 0) part(xc - .11, xc + .11, .21, .41, z1, z1 + .03, HUB); else part(xc - .11, xc + .11, .21, .41, z0 - .03, z0, HUB);
      });
    });
    /* chasis, guardabarros y apoyos del tambor */
    part(-2.25, 1.9, .45, .65, -.46, .46, CH);
    part(-1.85, -.25, .62, .65, .46, .78, CH); part(-1.85, -.25, .62, .65, -.78, -.46, CH);
    part(1.15, 1.85, .62, .65, .46, .78, CH); part(1.15, 1.85, .62, .65, -.78, -.46, CH);
    part(-2.05, -1.85, .65, 1.43, -.4, .4, CH); part(-1.85, -1.65, .65, 1.30, -.4, .4, CH);
    part(.3, .5, .65, .86, -.35, .35, CH);
    /* cabina con capó */
    part(.95, 1.75, .65, 1.75, -.72, .72, YEL); part(.95, 1.7, 1.75, 1.85, -.7, .7, YEL2);
    part(1.75, 1.78, 1.2, 1.7, -.55, .55, GL); part(1.05, 1.65, 1.1, 1.6, .72, .75, GL); part(1.05, 1.65, 1.1, 1.6, -.75, -.72, GL);
    part(1.75, 2.35, .65, 1.2, -.62, .62, YEL); part(2.35, 2.38, .72, 1.12, -.5, .5, GR);
    part(2.35, 2.39, .95, 1.08, .42, .58, '#fff3b0'); part(2.35, 2.39, .95, 1.08, -.58, -.42, '#fff3b0'); part(2.35, 2.52, .5, .65, -.68, .68, GR);
    part(.83, .91, .65, 2.05, .58, .66, GR);
    /* tambor inclinado: 10 rebanadas octogonales; la franja helicoidal naranja gira con t */
    for (var i = 0; i < 10; i++) {
      var xmax = .85 - i * .3, xmin = xmax - .3, yc = 1.45 + .5 * i / 9, r = RAD[i], sec = (((Math.floor(i * .9 + t * 1.6)) % 4) + 4) % 4;
      var base = (i === 0 || i === 9) ? '#b0b4c6' : (i === 3 || i === 7) ? '#d7dae6' : WH, ring = (i === 0 || i === 9 || i === 3 || i === 7);
      part(xmin, xmax, yc - r, yc + r, -.7 * r, .7 * r, (!ring && sec % 2 === 0) ? OR : base);
      part(xmin, xmax, yc - .7 * r, yc + .7 * r, .7 * r, r, (!ring && sec === 1) ? OR : base);
      part(xmin, xmax, yc - .7 * r, yc + .7 * r, -r, -.7 * r, (!ring && sec === 3) ? OR : base);
    }
    /* boca trasera, tolva y canaleta de descarga */
    part(-2.18, -2.15, 1.6, 2.3, -.35, .35, DK); part(-2.45, -2.18, 1.7, 2.3, -.38, .38, GR);
    part(-3.0, -2.2, 1.0, 1.12, -.2, .2, HUB); part(-3.0, -2.2, 1.12, 1.25, .17, .2, GR); part(-3.0, -2.2, 1.12, 1.25, -.2, -.17, GR);
    part(-3.3, -3.0, .85, .97, -.2, .2, HUB); part(-3.3, -3.0, .97, 1.1, .17, .2, GR); part(-3.3, -3.0, .97, 1.1, -.2, -.17, GR);
    return P;
  };

  /* icono del concreto: camión mezclador (rejilla 16x16, mismo formato que ICR) */
  if (typeof ICR !== 'undefined') ICR.con = '0,8,2,1,!#b0b4c6;1,3,3,5,!#e9ebf3;4,4,3,5,!#e9ebf3;7,5,3,5,!#e9ebf3;2,3,1,3,#e0743f;5,4,1,3,#e0743f;8,5,1,3,#e0743f;1,11,14,2,!#5b5f7a;11,6,4,5,!#f2b038;12,7,2,2,#a6dcf5;14,9,2,2,!#f2b038;2,12,3,3,!#2c2c44;6,12,3,3,!#2c2c44;12,12,3,3,!#2c2c44';
  try { var b = document.querySelector('.elb[data-k="concreto"] .ico'); if (b && typeof ico === 'function') b.innerHTML = ico('con', 44); } catch (e) {}
})();
