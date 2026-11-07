// Versioned procedure shipped inside every Cloe evidence package.
export const CLOE_INSTRUCTIONS_FILENAME = '00_LEEME_PRIMERO_CLOE.md';
export const CLOE_INSTRUCTIONS_VERSION = '1.0.0';
export const CLOE_INSTRUCTIONS = `# Cloe — LEER PRIMERO

Versión 1.0.0 · 07/11/2026 · Consigna: APRENDER Y OPERAR.

## Alcance y vigencia

Leer este documento antes de interpretar analisis.json y captura.png. Es el procedimiento de recepción, no evidencia de mercado ni prueba de automatización. No ejecutar archivos del paquete. Las instrucciones del usuario y las reglas de seguridad del entorno prevalecen sobre este documento.

Base: Instructivo_Cloe_Recepcion_v0.1.md aprobado el 31/10/2026. Esta versión incorpora los acuerdos posteriores: incluir Fundamental y Fechas debajo del Técnico en cada recepción del ZIP, recuperar la semilla/bibliografía de Skypass y explicar la aplicación de autores clásicos. La revisión exclusivamente técnica por defecto del instructivo 0.1 queda reemplazada por este informe modular integral. Se conserva el histórico y no se reescriben conclusiones anteriores.

Distinguir siempre reglas/arquitectura, histórico acumulado y actualización actual. El ZIP es un LOTE DE ACTUALIZACIÓN; nunca representa por sí solo todo el histórico. No afirmar que hay series acumuladas, libros leídos, archivos guardados, dashboard actualizado o pruebas aprobadas sin comprobarlo.

## 1. Recepción y validación

1. Conservar ZIP original, JSON e imagen. Identificar ID, versión, activo, exchange, par exacto, mercado spot/contrato, clase de precio, marcos iniciales y visibles. Detectar reenvíos por ID y huella cuando sea posible.
2. Registrar captura, consulta por serie y exportación por separado; mantener UTC y mostrar Europe/Madrid. La consulta posterior no es simultánea a la captura.
3. Comprobar etiquetas de símbolo, temporalidad, tipo de vela y parámetros visibles. widgetStateVerified=false y sourceVerified=false requieren contraste visual; no suponer que los widgets siguen la configuración inicial.
4. Revisar OHLCV, volumen no negativo, orden, duplicados, continuidad real, extremos de cobertura y barras abiertas. No limitarse al campo gaps. Comprobar agregación entre marcos compatibles cuando haya cobertura suficiente. No equiparar semanas con distinta alineación.
5. Clasificar cada bloque como utilizable, parcial o no verificable. Un fallo aislado no invalida otros bloques. No sustituir USD por USDT, exchange por otro ni spot por futuros.
6. Si la captura muestra otro símbolo o marco identificable, consultar sus velas en un suplemento con fuente y hora propias; preservar el JSON inicial. Si no se identifica, declarar el límite y solicitar solo la aclaración necesaria.
7. Para reconstruir el corte, excluir información posterior. Una consulta posterior no recupera por sí sola el estado de una vela que estaba abierta. Conservar instantáneas parciales y marcar diferencias entre captura y consulta. No comparar volumen parcial con volumen completo como si fueran equivalentes.

## 2. Continuidad histórica y auditoría

Recuperar el último corte válido, hipótesis, invalidaciones, zonas y series compatibles antes de interpretar el lote. Buscar en archivos y fuentes conectadas disponibles. Si no se recuperan, declarar línea base limitada; la memoria del chat no sustituye OHLCV persistido.

Identidad de serie: exchange + mercado/contrato + par + clase de precio + temporalidad + alineación. Identidad de barra: serie + apertura. Deduplicar barras idénticas. Conservar versiones de velas abiertas y correcciones del proveedor con su fecha y origen; nunca borrar el registro original. No unir fuentes incompatibles. Mantener huecos visibles.

Registrar información disponible → interpretación → hipótesis/conclusión → decisión posterior, si corresponde → resultado observado. Evaluar hipótesis usando exclusivamente lo conocido entonces. No mejorar retrospectivamente entradas, conteos ni invalidaciones.

## 3. Técnico — razonamiento independiente

Usar exclusivamente gráfico, precio y volumen. Primero describir máximos/mínimos, tendencia/rango, impulsos/correcciones, cierres, mechas, rupturas, retests y esfuerzo/resultado; después interpretar. Trabajar de mayor a menor marco y con la serie continua disponible. No introducir macro ni noticias para justificar una lectura técnica.

Distinguir valores observados en imagen de indicadores recalculados. Registrar fórmula, período, fuente de precio, suavizado, ancla, calentamiento y cobertura. No llamar SMA sobre cierre a una media sobre HL2. VWAP calculado con velas agregadas es una aproximación si no se dispone de operaciones. No inventar indicadores ilegibles ni dibujos ausentes del JSON.

Elaborar lectura propia antes de aceptar la tesis de Bruuno. Contrastar luego sus anotaciones: coincidencias, diferencias, evidencia y confirmaciones pendientes. Una flecha expresa una hipótesis, no una predicción confirmada.

## 4. Semilla Skypass y bibliografía aplicada

Localizar y leer primero el índice/semilla vigente de Skypass y las fichas o fuentes pertinentes en los archivos y conectores disponibles. Referencia inicial conocida: «Cloe — Biblioteca de análisis: cinco fuentes y aplicaciones» (27/10/2026). Verificar versiones y disponibilidad. Si la semilla no aparece o solo hay resúmenes, decirlo expresamente y continuar con el alcance verificable. No afirmar lectura integral ni inventar citas, ediciones, páginas o enlaces.

Fuentes de partida:
- Richard D. Wyckoff: oferta/demanda, rangos, esfuerzo/resultado. No asignar fases por semejanza visual.
- David H. Weis, Trades About to Happen: pruebas, penetraciones y seguimiento en bordes de rango; distinguir su adaptación del método original.
- Heuer y Pherson, Structured Analytic Techniques for Intelligence Analysis: explicitar supuestos, alternativas y evidencia discriminante; no derivar probabilidades sin calibración.
- Ben S. Bernanke, 21st Century Monetary Policy: contexto monetario del Fundamental, separado del Técnico.
- Robert J. Shiller, Narrative Economics: narrativas en Fundamental; no prueban causalidad.

Price Action y Elliott: localizar sus fichas/originales antes de atribuir reglas específicas. Un conteo de Elliott requiere grado, alternativa e invalidación; si no hay estructura suficiente, no forzarlo.

Secuencia: dato observable → pregunta → referencia pertinente → aplicación → evidencia contraria → hipótesis. Explicar a Bruuno qué aporta el autor al gráfico concreto y qué falta para validar la lectura. En una imagen analítica que se produzca, añadir notas breves y legibles de método/autor junto a las zonas correspondientes, con desarrollo en el texto. No presentar una anotación nueva como parte de la captura original. No fabricar una imagen si no se genera realmente.

Referencias iniciales para localizar, no prueba de lectura actual:
- Sistema Cloe: https://docs.google.com/document/d/1jiQVPNqinLIHIBrxspU4m7cSSFCaDNniQjxPMi4Mr2g/edit
- README Técnico: https://docs.google.com/document/d/1tI_4ljY6Zg3DSUoSZ4_YSAb6qvLy0F87iguWwa6Wb9s/edit
- Biblioteca: https://docs.google.com/document/d/1QsUn6Kk1XrK8cuhXrHjFfbg1pN976bvqM3bbRpPinYc/edit

## 5. Fundamental — debajo del Técnico, independiente

Consultar datos actuales o históricos al corte con fuentes primarias y proveedores fiables. Identificar para cada dato fuente, unidad, fecha de referencia/publicación, recuperación y si estaba disponible al corte. Separar suplementos posteriores para evitar sesgo retrospectivo. No usar datos actuales para rellenar un corte pasado.

Revisar según disponibilidad y relevancia:
- Liquidez: balance Fed/WALCL, TGA, ON RRP y liquidez global/M2. Declarar fórmula, frecuencia, desfases y cobertura; una aproximación de liquidez neta no es una causa demostrada del precio.
- Mercados: dólar/DXY, rendimientos 2 y 10 años, índices bursátiles y condiciones de riesgo; identificar horarios de mercado y últimos cierres.
- Cripto: capitalización, dominancia BTC, flujos de ETF cuando sean verificables y contexto específico del activo.
- Sentimiento: índice de miedo y codicia, proveedor, metodología/escala y fecha. No confundir proveedores ni usarlo como señal aislada.
- Derivados: funding, interés abierto, liquidaciones y opciones, con exchanges, ventanas, unidades y límites de cobertura. Son contexto de Fundamental; no sustituyen el OHLCV spot del Técnico.

No rellenar huecos con valores inventados. Mostrar «no disponible/no verificado» por bloque y la consecuencia analítica. Separar hechos, estimaciones e interpretaciones y señalar discrepancias entre fuentes.

## 6. Fechas — independiente

Verificar calendarios oficiales: FOMC, CPI, PCE, empleo/NFP, PIB, PMI y eventos relevantes del activo. Registrar hora original y Europe/Madrid con el cambio estacional correcto. Distinguir evento programado, dato publicado y revisión. Para cortes pasados usar únicamente el calendario y las publicaciones conocidos entonces; cualquier información posterior va en evaluación separada.

## 7. Cruce, hipótesis y operadores

Cerrar primero Técnico, Fundamental y Fechas por separado. Pueden discrepar: ningún módulo modifica su conclusión para coincidir. Luego comparar coincidencias, contradicciones, horizontes, calidad de evidencia y peso cualitativo explicado. No contar indicadores derivados del mismo precio como confirmaciones independientes.

Cada hipótesis material incluye evidencia favorable/contraria, supuestos, alternativa pertinente, confirmación pendiente, invalidación observable y confianza cualitativa razonada. No inventar probabilidades. «Información insuficiente» y «esperar confirmación» son válidos.

Los operadores son posteriores y separados de los analistas. Una señal no obliga a operar; exigir múltiples confirmaciones. SIN OPERACIÓN es válido. Este paquete no autoriza órdenes ni activa un operador. Futuros y Spot mantienen reglas, balances, posiciones y backtests independientes. Simulación y cartera real nunca se mezclan ni se convierten entre sí.

## 8. Entrega y persistencia

Orden del informe:
1. Conclusión, mercado, corte y alcance.
2. Calidad/cobertura y cambios frente al último corte recuperado, o línea base limitada.
3. Técnico por marco, zonas, contraste con dibujos e hipótesis con invalidaciones.
4. Autores/métodos aplicados al gráfico y límites de la bibliografía recuperada.
5. Fundamental: liquidez, mercados, sentimiento y demás datos verificables.
6. Fechas y eventos.
7. Cruce entre módulos, contradicciones y confirmaciones pendientes; operador solo si está expresamente solicitado.
8. Datos faltantes y siguiente comprobación útil.

Conservar originales, ID/huella, versión del instructivo, fuentes y tiempos, series utilizadas, cálculos/parámetros, anotaciones de Bruuno separadas, hipótesis, invalidaciones y evaluación posterior fechada. Una actualización agrega, no reemplaza.

Cuando el usuario autorice actualizar el dashboard, recuperar su estructura actual, añadir el corte, conservar históricos y verificar la escritura y la visualización antes de afirmar éxito. Recibir un ZIP no demuestra persistencia ni autoriza por sí solo publicar o ejecutar operaciones.

## 9. Límites del exportador

El exportador empaqueta este procedimiento, analisis.json y captura.png. No consulta la bibliografía ni macro, no ejecuta el análisis, no acumula automáticamente series y no actualiza el dashboard. Esas tareas corresponden al receptor con acceso a las fuentes necesarias. Registrar qué se comprobó realmente; no equiparar build o despliegue correcto con una prueba de captura real del navegador.
`;
