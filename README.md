# Misión de Laury y Malu · Sistemas aporticados

## Cómo ejecutarla
1. Descomprime el ZIP conservando las carpetas.
2. Abre `mision_malu_y_laury.html` en Chrome, Edge, Firefox o Safari (no necesita servidor ni internet).

## Contenido
- `mision_malu_y_laury.html`: la misión (los planos y retratos van embebidos).
- `planos/`: recortes PNG de los cuatro proyectos y los PDF de las láminas completas (`planos/pdf/`).
- `assets/`: retratos originales de Laury y Malu.
- `respaldo_original/`: copia del HTML original antes de los cambios.

## Versión 2: cambios
- Orden de misiones: 1 Museo, 2 Vivienda de 2 pisos, 3 Condominio Los Sauces, 4 Salud (tarjetas, barra, estrellas 2 a 5 y cierre). El progreso guardado se reasigna por misión, no por posición.
- Barra superior sin retratos: «Personajes · Laury y Malu», «Misión · Sistemas aporticados» y cuatro chips de misión con estado (actual, en progreso, completada).
- Pantalla de recompensas propia por misión (título de logro, narrativa, habilidades según los planos abiertos, bitácora real, insignia y paso a la siguiente misión).
- Museo: ambas plantas vuelan 1,8 m con vigas voladizas y viga de borde, muros laterales que cierran el voladizo, losas sin juntas, cubierta verde con parapeto en todos los volúmenes.
- Condominio: tinacos cilíndricos con base, bandas, tapa y tubería.
- Varillas «en espera» eliminadas en los cuatro modelos; las de arranque se ocultan al construirse las columnas.

## Qué se agregó (versión 1)
- Barra superior: «← MENÚ», identificación de Laury y Malu, cinco estrellas y control de música. No hay XP.
- Estrella 1: 40 % de las anotaciones únicas (72 en total: 43 de los planos de los cuatro proyectos + 29 de la guía «Leer anotaciones»; meta: 29).
- Estrellas 2 a 5: abrir al menos dos planos distintos en cada proyecto (Museo, Salud, Los Sauces, Vivienda de 2 pisos).
- Progreso guardado en `localStorage` (clave `mml_progreso_v1`); se conserva al recargar o volver al menú. El botón «Reiniciar progreso» (panel de estrellas, pide confirmación) lo borra.
- Pantalla final al lograr las cinco estrellas (también desde el panel de estrellas).

## Botón MENÚ
La pantalla de selección de personajes no venía en el paquete. El botón:
- dentro de un iframe, envía `postMessage({tipo:'mision-malu-laury:menu'})` a la página padre;
- si no, abre `index.html` de la misma carpeta, o la ruta dada con `?menu=ruta.html`.

## Música
Se genera en el navegador (sin archivos de audio). Empieza con el primer clic o tecla, por la política de los navegadores. Su estado ON/OFF se recuerda.
