CONSTRUCCIÓN · PIXEL CLUB — VERSIÓN INTEGRADA ACTUALIZADA

ARCHIVOS PRINCIPALES
- avance 2.html: menú principal, selección de personajes, introducción cinematográfica y pantalla de conclusión global.
- etapa1_control_geometrico.html → etapa2_preparar_terreno.html → etapa3.html → etapa4.html → etapa5.html → etapa6-7.html: secuencia de Laura.
- mision malu y laury.html: misión conjunta de Laury y Malu.
- planos.pptx: fuente de referencia visual entregada.
- planos.zip: recursos gráficos originales.

CAMBIOS DE ESTA REVISIÓN
1. La selección ahora muestra a Laury y Malu juntas en una única tarjeta conjunta, con fondos pastel morado/rosa y los dos retratos.
2. El botón de la tarjeta conjunta abre exactamente "mision malu y laury.html".
3. La misión conjunta incluye un rótulo visual "LAURY + MALU" y conserva su progreso y botón de regreso al menú.
4. En la etapa 1 de Laura, la documentación se representa como hojas finas superpuestas con líneas de plano y cajetín sobre una superficie de revisión, no como un bloque macizo. El camión geotécnico incorpora sarta de perforación, boca de sondeo y muestra estratificada.
5. En la etapa 2, la excavación muestra zanjas con fondo y paredes diferenciados, además de tierra retirada separada de la zanja. Se mantuvieron las escenas de bombeo/achique y entibación existentes.
6. La pantalla de victoria global comprueba las cuatro misiones de progreso compartido y se presenta una vez; el botón de reinicio borra también esa marca.
7. Se conservan los HTML y recursos originales de la misión de Laury/Malu y las etapas 3–7 de Laura.
8. Se mantiene la retirada de la referencia de fachada duplicada de la segunda sección del Museo. No se sustituyeron imágenes cuya correspondencia exacta con la diapositiva no pudo verificarse con certeza.

NAVEGACIÓN
- Isamar y Sharol siguen dentro del menú original.
- Laura abre etapa1_control_geometrico.html y avanza en secuencia hasta etapa6-7.html.
- La tarjeta conjunta Laury y Malu abre mision malu y laury.html.
- El progreso global usa localStorage bajo la clave pcArq1.

PRUEBAS REALIZADAS
- Se comprobó sintaxis JavaScript de los scripts inline de los ocho HTML con Node.js.
- Se comprobaron las rutas de los HTML enlazados y la presencia de los recursos principales en el paquete.
- No se ejecutó una prueba end-to-end completa en navegador; la geometría 3D y todas las asociaciones visuales del PowerPoint requieren revisión visual en navegador.

PENDIENTE DOCUMENTADO
- La correspondencia de cada imagen emergente con las diapositivas debe confirmarse visualmente. El PowerPoint tiene cuatro diapositivas: dos del Museo de la Ciudad Autoconstruida, una vivienda de dos pisos en Sincelejo y una vivienda del Condominio Los Sauces en Moniquirá. No se inventaron sustituciones para imágenes dudosas.


VERSION 4 - AJUSTES SOLICITADOS
- El menú reinicia el progreso al recargar directamente; el regreso explícito desde una misión conserva el avance de la sesión.
- Se añadieron efectos sonoros retro generados con Web Audio en páginas HTML, sin archivos de audio externos. El navegador puede requerir el primer clic para habilitar audio.
- En la misión de Laury y Malu se añadió un visor del detalle de nudo viga-columna usando la imagen de referencia aportada, con explicación de barras y estribos.
- Se mejoraron los globos de diálogo con contraste, borde y espaciado.

Ajuste de esta versión: se retiró la ventana adicional del nudo estructural y se corrigió la visibilidad de los globos de diálogo de Laury y Malu.


ACTUALIZACION v6 (sonido, modelos y diálogos)
- Se añadió un control de música ambiental generada localmente (Web Audio), activable por el usuario; no necesita archivos de audio externos.
- Se reforzaron los efectos breves de interacción cuando la música está activa.
- Los diálogos de Laura ahora enlazan las etapas sin repetir saludos ni presentaciones.
- Se mejoraron las geometrías de Isamar para representar el nudo viga-columna y una jaula de acero con barras longitudinales y estribos.
- Se dio más acabado visual al control de sonido y a la barra de estrellas de Laury y Malu.
