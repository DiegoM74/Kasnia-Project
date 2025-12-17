# Kasnia Project - Website (V1/Prototype)

Este repositorio alberga el código fuente del sitio web actual para **Kasnia Project**, un grupo dedicado a la traducción de novelas ligeras.

> ⚠️ **Nota Importante:** Esta versión del sitio está construida ("hardcoded") en HTML/CSS/JS puro para establecer el diseño, la identidad visual y la experiencia de usuario (UX).
>
> **La versión de producción final migrará a [Hugo](https://gohugo.io/)** (Static Site Generator) en un repositorio separado. Esto permitirá una gestión de contenido mucho más eficiente sin editar HTML manualmente.

## 🎯 Objetivo

El objetivo de este repositorio es servir como referencia de diseño y estructura para el futuro tema de Hugo, así como mantener la versión actual del sitio mientras se prepara la migración. Está pensado para desarrolladores que quieran entender la estructura visual.

## 🛠️ Tecnologías (Tech Stack)

El proyecto se mantiene simple y ligero, sin dependencias de compilación complejas para esta etapa:

- **HTML5**: Estructura semántica, uso de `View Transitions API` para navegación fluida.
- **CSS3 (Vanilla)**:
  - Uso extensivo de **CSS Grid** y **Flexbox**.
  - **CSS Variables** (`:root`) para temas y consistencia de colores.
  - Diseño totalmente **Responsive** sin uso de preprocesadores ni frameworks pesados (como Bootstrap o Tailwind) para mantener una identidad única y "premium".
- **JavaScript (ES6+)**:
  - Lógica modular para componentes dinámicos (navegación, modales, búsqueda).
  - Optimización de carga (Lazy Loading).

## 📂 Estructura del Proyecto

```text
/
├── css/             # Estilos globales y específicos por página
├── js/              # Scripts de lógica (main.js, novelas.js, etc.)
├── img/             # Activos gráficos (SVGs optimizados, portadas de novelas)
├── novelas/         # Páginas individuales de novelas (e.g., /seirei-gensouki)
├── staff/           # Página de créditos y miembros
├── donaciones/      # Página de apoyo al proyecto
├── dmca/            # Política de derechos de autor
└── index.html       # Landing page (Home)
```

## 🚀 Instalación y Uso

Al ser un sitio estático nativo, no requiere instalación de dependencias npm ni procesos de build para visualizarlo localmente.

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/DiegoM74/Kasnia-Project.git
    ```
2.  **Ejecutar**:
    Simplemente abre el archivo `index.html` en tu navegador favorito.
    _Recomendación:_ Para una mejor experiencia (especialmente con rutas relativas y módulos JS), utiliza una extensión como **Live Server** en VS Code o corre un servidor local simple:
    ```bash
    npx serve .
    ```

## ✨ Características de Diseño

- **Estética Premium**: Paleta de colores cuidada, sombras suaves y tipografía moderna.
- **Micro-interacciones**: Efectos de hover y transiciones de estado.
- **View Transitions**: Animaciones nativas entre páginas para una experiencia tipo SPA (Single Page Application).

## 📄 Licencia

Este proyecto y su diseño son propiedad de **Kasnia Project**. El contenido de las novelas pertenece a sus respectivos autores y editoriales.

#### Nota: Este README fue generado por **Gemini**.
