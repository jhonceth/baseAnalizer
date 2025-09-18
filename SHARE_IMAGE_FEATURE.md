# 🖼️ Funcionalidad de Compartir Análisis con Imagen Personalizada

## 📋 Descripción

Se ha implementado una funcionalidad completa para generar y compartir imágenes personalizadas con los datos del análisis de wallet, siguiendo el ejemplo del proyecto `monad-miniapp-template`.

## 🚀 Características Implementadas

### 1. **API Route para Generar Imágenes OG** (`/api/og/analysis`)
- Genera imágenes personalizadas de 800x600px
- Incluye datos del análisis: transacciones totales, edad activa, días únicos, racha más larga
- Diseño con gradiente púrpura-azul consistente con la app
- Información del usuario (avatar, nombre, dirección de wallet)
- Fecha de generación

### 2. **Componente ShareAnalysisWithImage**
- Botón integrado para compartir con imagen personalizada
- Estados de carga durante generación y compartir
- Integración con Farcaster SDK
- Fallback a Warpcast si el SDK no está disponible

### 3. **Integración en WalletAnalyzer**
- Reemplaza el botón de compartir anterior
- Solo visible cuando hay resultados de análisis
- Solo funciona en contexto de Farcaster

## 🔧 Cómo Funciona

### Flujo de Compartir:
1. **Usuario hace clic** en "Share Analysis with Image"
2. **Se genera URL** de imagen OG con parámetros del análisis
3. **Se crea texto** descriptivo del análisis
4. **Se abre diálogo** de compartir de Farcaster con imagen embebida
5. **Usuario puede compartir** en su feed de Farcaster

### Parámetros de la Imagen OG:
```
/api/og/analysis?
  address=0x...&
  totalTx=1234&
  activeAge=2 Years 15 Days&
  uniqueDays=45&
  longestStreak=7&
  username=Usuario&
  pfpUrl=https://...
```

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `app/api/og/analysis/route.tsx` - API para generar imágenes OG
- `components/ShareAnalysisWithImage.tsx` - Componente de compartir

### Archivos Modificados:
- `components/WalletAnalyzer.tsx` - Integración del nuevo componente
- `package.json` - Dependencia `@vercel/og` agregada

## 🎨 Diseño de la Imagen

La imagen generada incluye:
- **Header**: Logo "BA" y título "Base Analytics Report"
- **Usuario**: Avatar, nombre y dirección de wallet
- **Estadísticas**: 4 tarjetas con métricas principales
- **Footer**: Información de la app y fecha
- **Estilo**: Gradiente púrpura-azul con efectos glassmorphism

## 🧪 Cómo Probar

### 1. Ejecutar el proyecto:
```bash
npm run dev
```

### 2. Abrir en Farcaster:
- Usar el proyecto como Mini App en Farcaster
- O abrir en navegador normal (funcionalidad limitada)

### 3. Probar análisis:
- Conectar wallet o ingresar dirección
- Ejecutar análisis
- Hacer clic en "Share Analysis with Image"

### 4. Verificar imagen:
- La imagen se genera en: `http://localhost:3000/api/og/analysis?address=0x...&...`
- Se puede abrir directamente en el navegador para ver la imagen

## 🔍 Ejemplo de URL de Imagen

```
http://localhost:3000/api/og/analysis?address=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6&totalTx=1234&activeAge=2%20Years%2015%20Days&uniqueDays=45&longestStreak=7&username=TestUser&pfpUrl=https://example.com/avatar.jpg
```

## ⚡ Optimizaciones Implementadas

- **Caché de imágenes**: Las imágenes se generan dinámicamente
- **Fallback robusto**: Si falla el SDK, abre Warpcast directamente
- **Estados de carga**: Feedback visual durante generación y compartir
- **Validación**: Solo funciona con datos válidos de análisis

## 🎯 Próximas Mejoras

- [ ] Agregar más métricas a la imagen (ETH balance, tokens únicos)
- [ ] Implementar diferentes estilos de imagen
- [ ] Agregar gráficos simples en la imagen
- [ ] Implementar caché de imágenes generadas
- [ ] Agregar opciones de personalización de imagen

## 📝 Notas Técnicas

- **Dependencia**: `@vercel/og` para generación de imágenes
- **Formato**: SVG renderizado a PNG
- **Tamaño**: 800x600px optimizado para redes sociales
- **Compatibilidad**: Funciona en Vercel y otros proveedores que soporten Edge Runtime
