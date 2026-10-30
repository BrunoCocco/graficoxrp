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
2. Elegir entre 1 y 12 activos del catálogo.
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

Implementado: login/registro/cierre de sesión, selección de activos, vista original dinámica, preferencias locales por cuenta, exportación/importación validada y diseño adaptable.

Pendiente de configuración: conectar un proyecto Supabase en el entorno de la rama. El proyecto Vercel no tenía variables y el conector Supabase no devolvió proyectos accesibles al momento de esta entrega. El ingreso real y la confirmación de correo no pueden darse por verificados hasta conectar y probar una cuenta real.

Verificación de esta entrega: compilación y lint correctos; 5 pruebas de modelo/exportación/validación/aislamiento de preferencias. Recorrido en Chromium con autenticación y widgets **simulados**: ingreso, selección BTC/SOL, 3 gráficos iniciales y 6 al visitar ambos, sin recreación al alternar, exportación JSON, recuperación tras recarga, diseño móvil y separación entre cuentas. Esta prueba no valida Supabase real, cotizaciones reales ni dibujos dentro del iframe.
