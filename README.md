# AgroSmart Rural

Proyecto de sistema base para el registro y análisis de producción agrícola y ganadera, con foco en leche y maíz para la "Finca La Esperanza".

## Descripción

`AgroSmart Rural` es una aplicación web simple creada con HTML, CSS y JavaScript. Permite registrar datos diarios de producción, visualizar indicadores clave, generar un reporte rápido, exportar datos en CSV/JSON y alternar un modo oscuro.

## Características principales

- Registro de producción diaria con fecha, litros de leche, kilos de maíz, número de animales y observaciones.
- Indicadores de total de leche, total de maíz, promedio de leche y alertas por riesgos.
- Tabla dinámica de registros con opción de eliminar entradas.
- Exportación de datos a CSV y JSON.
- Carga de datos de demostración.
- Gráfico básico de producción de leche y maíz.
- Panel de diagnóstico con historial de acciones.
- Modo oscuro / tema alterno.

## Estructura del proyecto

- `sistema-estudiante/index.html` - página principal de la aplicación.
- `sistema-estudiante/css/styles.css` - estilos de presentación.
- `sistema-estudiante/js/app.js` - lógica de la aplicación.
- `entrega/INFORME_REVISION.md` - documento de informe o revisión asociado al proyecto.

## Cómo ejecutar

1. Abre `sistema-estudiante/index.html` en un navegador web.
2. Si prefieres, usa un servidor local para evitar restricciones del navegador al cargar archivos.

### Opciones de servidor local

En Windows, puedes usar Python si está instalado:

```powershell
cd "c:\Users\PC\Desktop\agroexmar v-4\agrosmart-taller-profesor-v4\sistema-estudiante"
python -m http.server 8000
```

Luego abre en el navegador:

```
http://localhost:8000
```

## Uso

- Completa el formulario de registro con fecha, litros de leche, kilos de maíz y animales.
- Haz clic en `Registrar` para agregar el registro.
- Usa `Cargar demo` para ver datos de ejemplo.
- Haz clic en `Exportar CSV` o `Exportar JSON` para guardar los datos.
- Usa `Limpiar` para borrar todos los registros.
- Cambia el tema con el botón `Tema`.

## Recomendaciones

- Verifica que todos los campos obligatorios estén completos y con valores válidos.
- Revisa el panel de alertas si `Leche` es menor a 5 L o `Maíz` es menor a 10 kg.
- El reporte rápido se actualiza automáticamente según los registros ingresados.

## Mejoras aplicadas

- Se corrigió un carácter extra en el encabezado de la página.
- Se añadió validación para evitar registros con la misma fecha, mejorando la calidad de los datos.
- Se habilitó persistencia local en el navegador para que los registros se mantengan después de recargar la página.
- Se creó `mejoras.md` para documentar la revisión, la sugerencia recibida y la reflexión.

## Nota

Este proyecto es una base funcional para seguir expandiendo la aplicación con más análisis, almacenamiento persistente y mejoras en la interfaz.
