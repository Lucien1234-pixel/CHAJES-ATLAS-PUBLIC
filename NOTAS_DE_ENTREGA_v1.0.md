# ILANOT COSMOS BESA 1.9 — Atlas Chajes Integration 1.0

## Entrega
Versión local consolidada de la integración. Incluye el acceso al sitio Atlas, seis enlaces profundos a fichas verificadas, un índice para siete facsímiles, filtro local, exportaciones CSV/JSON, procedencia y límites editoriales, ayuda de acceso y regreso a la escena 3D.

## Fuentes y límites
- Atlas en línea: https://besa-atlas-chajes.parcifal.chatgpt.site/
- Repositorio indicado por el usuario: https://github.com/Lucien1234-pixel/besa-atlas-private (privado; sin modificaciones).
- Base analizada: `public/data.json` del ZIP aportado, Atlas BESA 1.3, corpus parcial de 154 registros, basado en *The Kabbalistic Tree* (2022).
- Fuente comparativa de COSMOS: Chajes, “Imaginative Thinking with a Lurianic Diagram,” JQR 110.1 (2020), DOI https://doi.org/10.1353/jqr.2020.0001.
- No se copiaron imágenes ni textos extensos del Atlas. No se estableció licencia ni permiso de reproducción de imágenes.
- No hay identidad histórica confirmada entre los siete escaneos y los registros enlazados. El enlace ART-0030/MS 572 es un cruce bibliográfico exacto con JQR fig. 3, no autentica el facsímil ILAN-04. ILAN-07 queda sin ficha específica.

## Verificación efectuada
- Sintaxis del JS modular y del script embebido en el HTML independiente: correcta.
- Script embebido y archivo modular: coinciden.
- Exportaciones CSV y JSON: ejecutadas sobre los datos locales; siete elementos y estado sin ficha incluido.
- Siete JPG originales: hashes SHA-256 iguales al manifiesto de COSMOS 1.9.
- Integridad ZIP: comprobada; 57 entradas.
- No se publicó ni desplegó el paquete.

## QA pendiente
No se completó QA visual de escritorio y móvil: la política del navegador rechazó abrir HTML local. No se usó un método alternativo para eludir esa restricción. La ruta Atlas se abrió por HTTPS, pero el sitio presentó su pantalla de inicio de sesión, por lo que no se pudo confirmar visualmente el contenido de la ficha desde el navegador.
