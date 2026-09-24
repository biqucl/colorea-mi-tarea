# Colorea Mi Tarea

App web (PWA) para iPad/tablet: convierte una foto de una hoja de tarea en un dibujo de líneas de alto contraste que se puede colorear con zoom. Pensada para niños con visión reducida.

## Uso rápido
1. Servir la carpeta con un servidor estático:
   `npx -y serve -l 8765 .`
2. Abrir `http://<ip-del-mac>:8765` en Safari del iPad.
3. Compartir → "Añadir a pantalla de inicio" para instalarla (funciona sin conexión después).

## Funciones
- Página en blanco para dibujar libremente (desde el inicio o dentro de un cuaderno).
- Tomar foto o elegir imagen; umbral adaptativo para fotos con sombras; líneas con bordes suavizados.
- Ajustes: grosor de líneas, sensibilidad, limpieza de puntos, giro de 90°, enderezado fino (±10°), modo fondo oscuro.
- Herramientas: cubo (relleno limitado por las líneas), pincel, borrador, mover, deshacer.
- Zoom con pellizco, botones + / −, ajustar a pantalla.
- Cuadernos: cada hoja se guarda dentro de un cuaderno (crear, renombrar, borrar). Las hojas se pueden renombrar tocando su nombre.
- Exportar o compartir la hoja coloreada como PNG.
- Hojas de ejemplo en `samples/`; cualquier imagen se abre con `?img=ruta`.
