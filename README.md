# ILANOT COSMOS BESA 1.9 — Integración Atlas Chajes 1.0

Copia de trabajo derivada de ILANOT COSMOS BESA 1.9 / integración Atlas Chajes 1.0. Está alojada en el repositorio público `CHAJES-ATLAS-PUBLIC` para continuar su edición; no se ha desplegado un GPT Site nuevo. El GPT Site existente continúa privado y separado. **No hay versiones 1.3–1.8 entregadas por separado**: esta versión reúne los cambios solicitados al avanzar directamente a la 1.9.



## Integración real con Atlas Chajes
La mesa de evidencias incluye ahora enlaces profundos a registros existentes de **Atlas BESA 1.3**. Los enlaces abren el registro correspondiente en el sitio Atlas actual, en una pestaña nueva; desde COSMOS se regresa a la escena 3D cerrando la pestaña de Atlas. No se descargaron ni copiaron imágenes, fichas extensas ni datos privados del repositorio.

La fuente del Atlas enlazado es la base parcial del proyecto privado [besa-atlas-private](https://github.com/Lucien1234-pixel/besa-atlas-private), identificada en su README como Atlas BESA 1.3 y basada en *The Kabbalistic Tree* (2022). COSMOS, por separado, cita el artículo de Chajes de 2020, *Imaginative Thinking with a Lurianic Diagram* (JQR 110.1, pp. 30–63). Las dos fuentes se muestran diferenciadas en la interfaz y en la matriz.

`academia/matriz_atlas_chajes.csv` documenta para cada facsímil la relación y el nivel de evidencia. Los registros enlazados son contextuales o temáticos. Para ILAN-04 existe una coincidencia exacta de signatura (MS 572, fol. 54a) entre el registro Atlas `ART-0030` y la figura 3 citada en el artículo JQR; esto no prueba que el facsímil de COSMOS sea el mismo manuscrito. No se confirma la identidad histórica de ninguno de los siete: **0/7**. ILAN-07 queda sin registro específico verificado, sin sustituto forzado.

Los enlaces usan el formato de ruta profunda observado en el propio Atlas: `#explorar/<ID>?tipo=Todas&lang=es`. El destino comprobado durante esta sesión mostró la pantalla de acceso de ChatGPT y no permitió verificar la ficha ya renderizada; por ello, los enlaces requieren sesión con permiso para ver el sitio, además de conectividad. La portada queda disponible como alternativa.

## Fuentes, privacidad y derechos
- Sitio Atlas: https://besa-atlas-chajes.parcifal.chatgpt.site/
- Repositorio fuente indicado por el usuario: https://github.com/Lucien1234-pixel/besa-atlas-private (privado; no modificado).
- Corpus Atlas examinado: `public/data.json` del ZIP aportado por el usuario, Atlas BESA 1.3 (154 registros). El archivo completo no se incorpora al paquete de COSMOS.
- COSMOS 1.9 de entrada: SHA-256 `EDBB627B80DA5D11985B52F0A2B9FE61BD9499A2B73B836504A109A1BD347E5B`, ZIP de 53 entradas.
- Atlas: solo se conservan IDs de ficha, etiquetas breves de identificación, tipo de relación y enlaces. No se copian imágenes ni descripciones del Atlas. Los siete facsímiles COSMOS proporcionados están incluidos en este repositorio público por indicación del propietario; sus permisos de reproducción siguen sin determinar. Resolver los derechos antes de una difusión o despliegue público.
- El sitio Atlas en línea puede cambiar independientemente de esta copia local. Las rutas son enlaces externos, no una copia offline del Atlas.

## Cambio 1.0 · entrega consolidada
En **ATLAS CHAJES** se puede desplegar **¿EL ATLAS TE PIDE INICIAR SESIÓN?**. Indica que, después de iniciar sesión con una cuenta autorizada, se debe volver a COSMOS y abrir de nuevo la ficha si el sitio llevó al usuario a la portada. Esta guía refleja la pantalla de acceso observada en la última comprobación; el flujo del sitio puede cambiar.

## Cambio v0.8 · procedencia visible en la interfaz
La pestaña **ATLAS CHAJES** contiene un bloque desplegable con los enlaces y el estado de acceso de las fuentes, diferencia entre Atlas 1.3/Chajes 2022 y el artículo JQR 2020, carácter privado del repositorio y la falta de permisos de reproducción establecidos. No se incrustan imágenes del Atlas. El JSON exportado también lleva notas de acceso y derechos.

## Cambio v0.7 · exportación JSON
Junto al CSV, **DESCARGAR MATRIZ JSON** genera un archivo estructurado con los siete objetos, los hashes, los enlaces verificados, el estado de identidad y la procedencia de Atlas 1.3 y del artículo JQR de 2020. El elemento sin ficha específica se conserva como tal, sin sustituto. La descarga se crea en el navegador y no transmite información.

## Cambio v0.6 · exportar matriz desde COSMOS
La pestaña **ATLAS CHAJES** ofrece **DESCARGAR MATRIZ CSV**. El archivo reúne siete filas (una por facsímil), los IDs y nombres breves de las fichas enlazadas, enlaces profundos, tipo de relación y estado de identidad. ILAN-07 queda documentado sin asignarle un registro. La descarga se genera localmente y no envía datos al Atlas.

## Cambio v0.5 · regreso a COSMOS
La pestaña **ATLAS CHAJES** ahora incluye **VOLVER A LA ESCENA 3D** al pie del índice. Lo pulsa para cerrar la ventana de estudio y regresar a la escena. Los enlaces externos al Atlas se abren en otra pestaña, así el recorrido de vuelta no depende del historial del navegador.

## Cambio v0.4 · filtro del índice
La pestaña **ATLAS CHAJES** incluye un filtro que encuentra los siete ILAN por identificador o página y las fichas por signatura o ID (por ejemplo `MS 572` o `ART-0030`). El contador muestra cuántas tarjetas coinciden; borrar el texto vuelve a mostrar todos los resultados. El filtro funciona localmente y no envía búsquedas al Atlas.

## Cambio v0.3 · índice Atlas dentro del estudio
La ventana **ESTUDIAR EL ILAN** incorpora una sección propia **ATLAS CHAJES**. Ahí se ve la matriz de los siete facsímiles, las fichas BESA 1.3 verificadas y sus límites; cada ficha del Atlas abre en pestaña nueva y COSMOS queda abierto. ILAN-07 señala expresamente que no hay ficha específica verificada.

El Atlas no se incrusta por iframe: el sitio puede exigir autenticación y no se pudo verificar que permita marcos embebidos. El índice integrado enlaza al Atlas real sin copiar sus imágenes ni su base privada.

## Cambio v0.2 · acceso directo desde la escena
Ahora hay un botón **ENTRAR AL ATLAS CHAJES** siempre visible en la escena 3D, encima de **ESTUDIAR EL ILAN** (abajo a la derecha; en móvil también aparece abajo a la derecha). Abre la portada oficial del Atlas en una pestaña nueva. No hace falta abrir la mesa de evidencias para entrar al sitio.

La mesa conserva los enlaces profundos por registro y la matriz de relaciones. Este botón directo no incrusta el Atlas dentro de COSMOS: el sitio Atlas requiere su propia sesión y conectividad. Cerrar la pestaña Atlas devuelve a COSMOS.

## Uso
Abrí `ILANOT_COSMOS_1_9_ABRIR.html` en Chrome o Edge; pulsá **ESTUDIAR EL ILAN** y luego **MESA DE EVIDENCIAS**. Navegá entre ILAN-01 y ILAN-07, compará las referencias temáticas, y agregá tus observaciones. Guardan en localStorage cuando está disponible; exportá CSV/JSON de respaldo. También existen los modos de la 0.9 y el cotejo 1.2.

## Mejoras
- Mesa global con 7 registros digitales SHA-256 verificados y 12 figuras documentadas en la edición de estudio BESA de Chajes (JQR 110.1, 2020).
- Filtro de láminas y referencias temáticas; ficha con manuscrito, número de página *extraído del nombre de archivo* y bibliografía.
- Registro de evidencias propias: fuente, URL opcional, signatura propuesta, observación, estado (pendiente/contrastada/descartada); eliminación y exportación JSON/CSV.
- Conserva todas las fichas de estudio anteriores, panel testimonios, trazabilidad y cotejo v1.2.
- El código solo lee datos locales, no envía anotaciones ni documentos a servidores.

## Advertencias editoriales
- Los 7 títulos de COSMOS son editoriales. Ni los hashes ni las coincidencias temáticas prueban identidad histórica. **Identidades históricas certificadas: 0/7.**
- La biblioteca de Chajes aporta **paralelos de estudio, no imágenes catalográficas cotejadas**. La edición BESA en español es una edición académica de estudio, no traducción oficial.
- Las etiquetas de estado representan decisiones del usuario sobre **sus notas**, no autenticación por Chajes o por una institución.
- Los facsímiles están incluidos en un repositorio GitHub público; sus derechos de reproducción no están establecidos. El GPT Site permanece privado hasta resolverlos.
- La funcionalidad WebGL2 no está certificada con GPU real en este entorno; el render alternativo puede funcionar.
- QA visual del GPT Site separado: escritorio verificado; móvil pendiente porque el navegador no aplicó el tamaño de ventana solicitado. El panel Atlas abre con siete elementos y el enlace ART-0009 conserva su ruta; el Atlas solicita iniciar sesión. La inspección interactiva de escritorio/móvil del archivo local no se realizó.

## Integridad
`academia/registro_publico_v19.json` y `academia/registro_publico_v19.csv` contienen las referencias de Chajes 2020; `academia/matriz_atlas_chajes.csv` documenta los enlaces verificados al Atlas. `academia/integracion_atlas_chajes.json` registra la procedencia y los límites de la integración; `INTEGRIDAD_1_9.json` contiene los SHA-256 originales verificados. Los originales JPG permanecen byte a byte idénticos a la 1.2.


## Historial de versiones
- 0.2: acceso visible al Atlas desde la escena 3D.
- 0.3: índice de los siete facsímiles y seis enlaces profundos verificados.
- 0.4: filtro local del índice.
- 0.5: regreso directo a la escena 3D.
- 0.6: exportación CSV.
- 0.7: exportación JSON estructurada.
- 0.8: procedencia, privacidad y derechos visibles.
- 0.9: ayuda cuando el Atlas requiere inicio de sesión.
- 1.0: paquete consolidado con notas de entrega y verificación.
