# Revision tecnica - AgroSmart Rural

Repositorio: https://github.com/mallequintana1515/agrosmart-taller-profesor-v4

## 1. Lista priorizada de bugs encontrados

1. Alta prioridad: los campos numericos vacios se aceptaban como cero porque `Number("")` devuelve `0`. Esto permitia registrar datos incompletos.
2. Alta prioridad: los botones "Exportar CSV" y "Exportar JSON" no funcionaban; solo mostraban un mensaje de funcionalidad pendiente.
3. Media prioridad: el canvas del reporte rapido aparecia vacio porque no existia una funcion para dibujar el grafico.
4. Media prioridad: el boton "Tema" agregaba la clase `tema-oscuro`, pero no habia estilos CSS asociados.
5. Media prioridad: la tabla usaba `onclick` dentro de HTML generado como texto, lo que mezcla estructura y comportamiento y dificulta el mantenimiento.
6. Baja prioridad: los campos del formulario no tenian atributos `required`, `min` o `step`, por lo que el navegador no ayudaba a prevenir entradas invalidas.

## 2. Correcciones aplicadas

- Se agrego validacion completa para fecha, leche, maiz y animales.
- Se agregaron atributos HTML de validacion: `required`, `min` y `step`.
- Se implemento exportacion funcional en CSV y JSON.
- Se implemento el dibujo del grafico de produccion en el canvas.
- Se agregaron estilos para el tema oscuro.
- Se reemplazo el `onclick` embebido por eventos agregados desde JavaScript.
- Se agregaron etiquetas visuales de estado: "Normal" y "Revisar".
- Se agregaron mensajes al panel de diagnostico cuando se crean, eliminan, exportan o modifican registros.

## 3. Comparacion antes y despues

Antes:

- Captura: `entrega/antes.png`
- El grafico no mostraba informacion.
- Los botones de exportacion no descargaban archivos.
- El tema oscuro no tenia efecto visual.
- El formulario podia aceptar algunos datos incompletos.

Despues:

- Captura: `entrega/despues.png`
- El canvas muestra el estado del grafico.
- Las exportaciones CSV y JSON descargan archivos cuando hay registros.
- El tema oscuro cambia colores principales del sitio.
- La validacion evita registros incompletos o invalidos.

## 4. Justificacion de los ajustes

Los ajustes se realizaron para mejorar la confiabilidad del sistema y completar funciones visibles en la interfaz. La validacion evita registros incorrectos, las exportaciones convierten informacion del proyecto en archivos utiles, el grafico hace mas claro el analisis de produccion y el tema oscuro ahora responde correctamente al boton existente. Tambien se mejoro la mantenibilidad del codigo al separar los eventos JavaScript del HTML generado.

## 5. Plan de mejora para la siguiente version

1. Guardar los registros en `localStorage` para que no se pierdan al recargar la pagina.
2. Agregar filtros por fecha y por estado.
3. Permitir editar registros existentes.
4. Agregar mas indicadores, como promedio de maiz y mejor/peor dia de produccion.
5. Mejorar la accesibilidad con mas etiquetas ARIA y pruebas de navegacion por teclado.
6. Crear pruebas automaticas basicas para validacion, exportacion y calculo de indicadores.
7. Publicar el sitio en GitHub Pages para compartir una URL de demostracion.

## 6. Verificacion realizada

- Se ejecuto `node --check sistema-estudiante/js/app.js` sin errores de sintaxis.
- Se genero captura "antes" con Chrome headless.
- Se genero captura "despues" con Chrome headless despues de aplicar las correcciones.
