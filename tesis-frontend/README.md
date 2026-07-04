# tesis-frontend

Frontend Angular para operacion diaria del Mini Market Urbano.

## Stack
- Angular 17 standalone
- Router modular por features
- Service Worker (PWA)
- ng-icons para iconografia

## Arquitectura
src/app/
- core/: servicios base, modelos, auth e interceptores
- shared/: componentes reutilizables
- features/: modulos funcionales por dominio

Features actuales:
- auth
- dashboard
- customers
- credits
- cash
- reports
- public-statement

## Convencion de componentes
Cada componente/pagina debe tener archivos separados:
- archivo .ts con la logica
- archivo .html con la plantilla
- archivo .scss con estilos

No se usan templates inline para facilitar mantenimiento.

## Configuracion
Revisa src/environments/environment.ts para la URL del backend.

## Scripts
- npm start: servidor local Angular
- npm run build: build de produccion
- npm test: pruebas unitarias

## Flujo de desarrollo
1. npm install
2. npm start
3. Navegar en http://localhost:4200

## Integracion con backend
El frontend consume endpoints bajo /api.
Recomendado levantar backend en paralelo para usar:
- login
- dashboard de mora
- clientes y semaforo
- creditos y cobranza WhatsApp
- caja diaria
- reportes PDF

## Estilos
Se puede evolucionar el sistema visual con utilidades tipo Tailwind/DaisyUI si el equipo lo requiere,
manteniendo la regla de separacion ts/html/scss por componente.
