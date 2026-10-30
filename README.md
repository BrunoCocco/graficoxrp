# Gráficos XRP · Producto

React + Vite, con acceso por Supabase Auth y espacios de activos configurables. Rama de trabajo: `graficosxrp-producto`.

## Desarrollo y despliegue

```sh
npm ci
cp .env.example .env.local
# Completar URL del proyecto y clave pública de Supabase
npm run dev
```

En Vercel, agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` al entorno Preview de esta rama y desplegar nuevamente. Usar únicamente una clave publishable (nunca service_role ni secret). Configurar correo/contraseña y las URLs autorizadas de la aplicación en Supabase Auth. No se requieren tablas, migraciones ni cambios en otras aplicaciones.

```sh
npm run lint
npm run build
node --test scripts/workspace.test.mjs
```

## Flujo

1. Ingresar o crear una cuenta; confirmar correo si el proveedor lo exige.
2. Buscar por nombre, ticker o mercado y agregar entre 1 y 6 activos.
3. Abrir los gráficos: semanal, diario y 4 horas, con la configuración heredada.
4. Cambiar de activo desde los cuadros inferiores. Los gráficos visitados permanecen montados durante la sesión.
5. Editar activos, exportar configuración JSON o importar un archivo exportado. Importar reemplaza la selección del espacio; las instancias visitadas se conservan hasta cerrar la sesión/página.

## Alcance y límites

- Autenticación real mediante Supabase; sin conexión configurada, se informa el problema y se bloquea el ingreso. No hay credenciales ficticias ni bypass en producción.
- Preferencias guardadas por ID de usuario en localStorage: mismo navegador y origen. No hay sincronización en nube. No se guardan contraseñas en la configuración; la sesión es administrada por el SDK de Supabase.
- Exportar/importar incluye activos y selección. **No incluye dibujos, indicadores modificados manualmente ni objetos internos del widget TradingView.** Esas APIs no están expuestas por esta integración. Los dibujos sobreviven al cambio de activo durante la sesión, no se garantiza su restauración tras recargar/cerrar.
- Los gráficos son widgets externos; los estilos de indicadores heredados dependen del soporte de TradingView. Las cotizaciones inferiores usan CoinGecko y pueden retrasarse o fallar por límites del proveedor.
- Esta es una aplicación estática sin datos privados de servidor. Si se incorpora almacenamiento compartido, será necesario un backend con autorización por propietario y RLS.
- El código fuente y `dist` son portables a cualquier hosting estático. Para ejecutarlo se necesita conexión con los proveedores externos; no es una app offline.

## Estado de la primera entrega

Implementado: login/registro/cierre de sesión, buscador de activos con límite de 6, vista original dinámica, preferencias locales por cuenta, exportación/importación validada y diseño adaptable.

Conexión configurada: proyecto Supabase `graficosxrp-producto` (`nrfmpywlqfwweztoyjow`) dentro de CloeFuturesLab. Las variables públicas están limitadas al Preview de esta rama en Vercel. Site URL y redirect URL apuntan a la URL estable de la rama. Health y settings Auth respondieron HTTP 200, registro por correo habilitado con confirmación. No se ha comprobado todavía el registro/login con una cuenta real desde la app desplegada (vista previa protegida por Vercel).

## Buscador · segunda entrega

- Catálogo inicial de 12 criptomonedas, filtrado local por nombre, ticker e identificador de mercado. **No es una copia ni una sincronización del catálogo global de TradingView.** El widget público no proporciona en esta integración una API documentada de descarga de todos sus instrumentos.
- Selección de máximo 6, contador, eliminación, bloqueo de duplicados por símbolo completo y límite aplicado también a importación/exportación.
- Opción avanzada para agregar un identificador exacto `MERCADO:SÍMBOLO`, por ejemplo `NASDAQ:AAPL`. Se valida el formato, no la existencia ni permisos de visualización; TradingView puede rechazarlo al abrir. Estos símbolos se muestran como sin verificar. CoinGecko no aporta cotizaciones del pie para símbolos fuera del catálogo; se muestra —.
- Preferencias antiguas de 7–12 activos siguen legibles y se pide reducirlas antes de continuar. No se recortan automáticamente ni se sobrescribe el original antes de confirmar.
- Catálogo implementado como módulo de datos versionado, sin tablas nuevas ni llamadas privadas a TradingView. Una búsqueda global requerirá acordar un proveedor de instrumentos y sus condiciones, y luego incorporar búsqueda paginada/sincronización al backend.
- Documentación consultada: https://www.tradingview.com/widget-docs/faq/many-widgets/ y https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/.


Verificación de esta entrega: compilación y lint correctos; 5 pruebas de modelo/exportación/validación/aislamiento de preferencias. Recorrido en Chromium con autenticación y widgets **simulados**: ingreso, selección BTC/SOL, 3 gráficos iniciales y 6 al visitar ambos, sin recreación al alternar, exportación JSON, recuperación tras recarga, diseño móvil y separación entre cuentas. Esta prueba no valida Supabase real, cotizaciones reales ni dibujos dentro del iframe.


## Menú inferior y mesa de análisis · tercera entrega

La selección actual admite 6 activos. El séptimo recuadro es un menú que abre hacia arriba con las acciones antes ubicadas en el header: Activos, Exportar, Importar y Salir. En escritorio hay seis posiciones de activos y una de menú; en móvil los activos se desplazan horizontalmente y el menú permanece accesible. El header se retiró para ampliar el espacio disponible de los gráficos.

Funciones adicionales:
- Cuaderno por cuenta y símbolo: hipótesis e invalidación con guardado explícito de cortes fechados. Se agregan registros sin reescribir los anteriores. Hasta 100 cortes por símbolo, sin purga automática; se informa al alcanzar el límite. Exportación JSON independiente de la configuración del espacio.
- Checklist de cinco revisiones técnicas. Es una ayuda de proceso, no un motor de señales.
- Calculadora de riesgo teórico: entradas manuales en USD; riesgo monetario = capital × porcentaje / 100, cantidad = riesgo / distancia absoluta entrada-stop, exposición = cantidad × entrada. No incluye costes, deslizamiento o apalancamiento y no envía órdenes.
- Concentración: ver un único gráfico semanal, diario o 4 horas, o restaurar los tres. Los widgets siguen montados.

Las notas son locales a navegador/origen, no sincronizadas con Supabase. El borrador sin guardar se pierde al cerrar el cuaderno; el botón Guardar corte persiste el registro. Las modificaciones internas de TradingView no forman parte del cuaderno.

Validación: 10 pruebas de modelo, validación, riesgo e historial; lint y build correctos. Chromium con Auth y widgets simulados: límite de seis, séptimo menú por encima del pie, Escape, concentración sin recrear widgets, guardado/reapertura/exportación del cuaderno, cálculo, configuración exportada, cierre de sesión y presentación móvil. No equivale a una prueba de cuenta real ni de dibujos en TradingView.

## Captura y paquete de evidencia · cuarta entrega

- El menú inferior ahora agrupa **Captura y evidencia**, **Análisis** y **Espacio de trabajo**. No se eliminaron los accesos anteriores.
- **Capturar gráficos** invoca `getDisplayMedia` desde la interacción del usuario. Se debe elegir explícitamente la pestaña de Gráficos XRP en el selector del navegador. Se toma un único fotograma y se descarga como PNG; las pistas se cierran inmediatamente después. Si el navegador no admite la API, se indica usar la captura del sistema.
- **Exportar evidencia** descarga un JSON con activo, símbolos, marcos temporales, fecha de exportación y cortes históricos del cuaderno almacenados localmente. No altera ni elimina registros. La captura se adjunta por separado para evitar afirmar que el JSON contiene dibujos.
- No hay reconocimiento de imagen automático, acceso a los dibujos internos del widget ni envío directo a ChatGPT. Para revisar anotaciones con Cloe, adjuntar voluntariamente el PNG en la conversación.
- Precisión: los datos OHLCV, las coordenadas exactas de dibujos y los indicadores dentro del iframe **no** se obtienen de la captura; una lectura visual solo permite estimaciones.
- Privacidad: la captura se solicita con permiso explícito, se guarda localmente y no se sube a servidor por estas funciones. El usuario debe revisar qué pestaña eligió y si contiene datos sensibles.
- **Pruebas pendientes:** validar en navegador real la selección de pestaña, el contenido del PNG y las restricciones de móvil, HTTPS y permisos; no se afirma compatibilidad universal ni verificación de los dibujos.
