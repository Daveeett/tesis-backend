---
name: Mini Market Urbano
description: Operacion diaria del mini market.
colors:
  primary-navy: "#002A5C"
  accent-yellow: "#FFDD00"
  neutral-50: "#f2f5f9"
  neutral-100: "#e2e8f0"
  surface: "#ffffff"
  text-muted: "#4a5568"
  info-blue: "#3b82f6"
  success-green: "#10b981"
  danger-red: "#dc2626"
typography:
  display:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.5px"
  headline:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  sm: "0.6rem"
  md: "0.8rem"
  lg: "1rem"
  xl: "1.4rem"
spacing:
  sm: "0.7rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-navy}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.2rem"
  button-accent:
    backgroundColor: "{colors.accent-yellow}"
    textColor: "{colors.primary-navy}"
    rounded: "{rounded.md}"
    padding: "0.7rem 1rem"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.9rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-navy}"
    rounded: "{rounded.lg}"
    padding: "1rem"
---

# Design System: Mini Market Urbano

## 1. Overview

**Creative North Star: "La Libreta Moderna"**

La Libreta Moderna es una interfaz de operaciones diarias que prioriza velocidad, claridad y confianza. Cada pantalla se comporta como una libreta ordenada, con jerarquia tipografica fuerte y acciones visibles en el primer vistazo. La energia es agil y atractiva, con controles tactiles que invitan a completar tareas sin friccion.

Las superficies se apilan en capas visibles para separar informacion critica de acciones. El color mantiene el orden, el navy ancla la identidad y el amarillo senala lo urgente o destacado. El sistema evita el estilo viejo y la saturacion de tarjetas repetitivas para mantener un ritmo limpio.

**Key Characteristics:**
- Agilidad operativa
- Jerarquia clara
- Capas suaves
- Controles tactiles

## 2. Colors

La paleta se apoya en un navy profundo para la confianza, un amarillo de señal para el foco y neutros frios que limpian el fondo.

### Primary
- **Navy Operativo**: Ancla de identidad, navegacion, titulos y acciones principales.

### Secondary
- **Amarillo de Senal**: Enfasis puntual en alertas y datos clave sin contaminar toda la pantalla.

### Tertiary (optional)
- **Azul de Accion**: Interacciones de soporte, estados activos y focos visibles.

### Neutral
- **Niebla Fria**: Fondos generales y paneles de respiro.
- **Gris de Superficie**: Bordes y divisores suaves.
- **Blanco de Tarjeta**: Superficies de trabajo y formularios.
- **Gris de Texto**: Lectura secundaria y metadatos.

**The Ledger Anchor Rule.** El navy es la voz principal, si el color principal no se percibe en la primera mirada, la pantalla pierde autoridad.

## 3. Typography

**Display Font:** Inter, -apple-system, sans-serif
**Body Font:** Inter, -apple-system, sans-serif
**Label Font:** Inter, -apple-system, sans-serif

**Character:** Tipografia directa y moderna, con pesos altos para guiar la lectura y tamanos compactos para mantener ritmo agil.

### Hierarchy
- **Display** (800, 2.2rem, 1.1): Encabezados hero o cifras principales.
- **Headline** (800, 1.5rem, 1.2): Titulos de seccion y paneles.
- **Title** (700, 1.1rem, 1.3): Subtitulos, tarjetas y agrupaciones.
- **Body** (500, 1rem, 1.5): Lectura principal, maximo 65 a 75 caracteres por linea.
- **Label** (700, 0.85rem, 0.04em): Etiquetas en mayusculas y metadatos.

**The Upright Labels Rule.** Las etiquetas son claras y compactas, sin cursivas ni adornos.

## 4. Elevation

La elevacion es visible y ordena capas de informacion, con sombras suaves que separan bloques sin dramatismo. Los contenedores principales se perciben como tarjetas operativas, no como decoracion.

### Shadow Vocabulary
- **Panel Soft** (`0 12px 20px rgba(15, 23, 42, 0.08)`): Tarjetas de trabajo y formularios.
- **Panel Strong** (`0 14px 24px rgba(4, 16, 29, 0.12)`): Secciones principales o estados criticos.
- **Hero Lift** (`0 24px 36px rgba(12, 23, 31, 0.35)`): Login y bloques de entrada.

**The Layered Ledger Rule.** Si dos bloques compiten, el mas importante siempre debe estar una capa arriba.

## 5. Components

### Buttons
- **Shape:** Bordes suaves y tactiles (0.8rem).
- **Primary:** Navy con texto claro y relleno generoso.
- **Accent:** Amarillo de senal para acciones destacadas.
- **Hover / Focus:** Oscurecer sutilmente y elevar 1px sin brillo excesivo.

### Inputs / Fields
- **Style:** Fondo claro, borde fino y radio suave (0.6rem).
- **Focus:** Borde en azul de accion y halo tenue para guiar la vista.
- **Error / Disabled:** Rojo claro para error, opacidad reducida en deshabilitado.

### Cards / Containers
- **Corner Style:** Redondeo visible (1rem).
- **Background:** Blanco de tarjeta sobre neutros frios.
- **Shadow Strategy:** Usar Panel Soft por defecto, Panel Strong en resumenes clave.

### Navigation
- **Style:** Navegacion vertical con fondo oscuro, texto claro y estados activos resaltados con luz suave.
- **Mobile:** Iconos con etiquetas cortas, sin saturar con tarjetas.

### Toasts
- **Style:** Mensajes compactos, color de estado y sombra ligera.

**The Tactile Control Rule.** Todo control debe sentirse presionable, con relleno suficiente y foco visible.

## 6. Do's and Don'ts

### Do:
- **Do** priorizar jerarquia tipografica para estados y montos.
- **Do** usar el navy como ancla en navegacion y titulos clave.
- **Do** mantener sombras suaves y consistentes en capas principales.

### Don't:
- **Don't** caer en estilo viejo o pesado.
- **Don't** repetir tarjetas iguales en exceso, evita la grilla monotona.
- **Don't** usar acentos laterales gruesos como decoracion principal.
