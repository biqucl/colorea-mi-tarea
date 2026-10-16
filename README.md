# Colorea Mi Tarea

App web (PWA) para iPad/tablet: convierte una foto de una hoja de tarea en un dibujo de líneas de alto contraste que se puede colorear con zoom. Pensada para niños con visión reducida.

## Uso rápido
1. Servir la carpeta con un servidor estático:
   `npx -y serve -l 8765 .`
2. Abrir `http://<ip-del-mac>:8765` en Safari del iPad.
3. Compartir → "Añadir a pantalla de inicio" para instalarla (funciona sin conexión después).

## Funciones
- Caligrafía: mayúsculas, minúsculas (con ñ en español) y números. La letra se escribe sola, trazo por trazo, con una flecha que avanza; cada trazo tiene su número y su color. Al lado, una hoja con renglones y la misma animación en color suave para repasarla con el dedo (deshacer, borrar, ver otra vez).
- Juegos (sin tiempo límite, con voz que se puede apagar):
  - Memoria (3, 4 o 6 pares): letras iguales en mayúscula (AA) o minúscula (aa), mayúscula con su minúscula (Aa, más difícil), número/puntos o palabra en español/inglés.
  - Contar: ¿cuántos hay? (1–5 o 1–10). Al tocar cada objeto se marca (sin mostrar el número, el niño cuenta); tres respuestas grandes y una estrella por acierto.
  - Atrapa y cuenta: los animalitos caminan por el campo; se atrapan dibujando un círculo alrededor (con el dedo o el lápiz) y, cuando están todos quietos, hay que contarlos. Velocidad 🐢/🐇.
  - Sight words (Kindergarten Savvas, unidades 1–3, 18 palabras cada una): una tarjeta grande por palabra; el adulto marca ✓ Bien o ✗ Mal (también con las flechas → / ←, y ↶ para deshacer). Al final, festejo según el resultado (🏆 todas, 🎉 casi todas, 👍 la mitad, 💪 a seguir practicando), las palabras que faltaron para practicarlas de nuevo y el último resultado de cada unidad guardado con la fecha.
- Página en blanco para dibujar libremente (desde el inicio o dentro de un cuaderno).
- Tomar foto o elegir imagen; umbral adaptativo para fotos con sombras; líneas con bordes suavizados.
- Ajustes: grosor de líneas, sensibilidad, limpieza de puntos, giro de 90°, enderezado fino (±10°), modo fondo oscuro.
- Herramientas: cubo (relleno limitado por las líneas), pincel, borrador, mover, deshacer.
- Zoom con pellizco, botones + / −, ajustar a pantalla.
- Cuadernos: cada hoja se guarda dentro de un cuaderno (crear, renombrar, borrar). Las hojas se pueden renombrar tocando su nombre.
- Exportar o compartir la hoja coloreada como PNG.
- Hojas de ejemplo en `samples/`; cualquier imagen se abre con `?img=ruta`.
