# 🔗 Implementación de URLs Dinámicas con Metadata OG

## 📋 Descripción

Se ha implementado un sistema completo de URLs dinámicas (`/base/[address]`) que automáticamente genera metadata OG con imágenes personalizadas cuando se comparten en redes sociales.

## 🚀 Cómo Funciona

### 1. **URL Dinámica**
Cuando se comparte la URL `/base/[address]`, Next.js automáticamente:
- Genera metadata dinámica usando `generateMetadata()`
- Crea una imagen OG usando `opengraph-image.tsx`
- Muestra la imagen en redes sociales (Twitter, Discord, etc.)

### 2. **Flujo de Compartir**
```
Usuario hace clic en "Share Analysis with Image"
    ↓
Se genera URL: /base/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
    ↓
Se comparte en Farcaster con la URL
    ↓
Redes sociales detectan la URL y solicitan metadata
    ↓
Next.js genera automáticamente la imagen OG
    ↓
Se muestra la imagen personalizada en el preview
```

## 📁 Archivos Implementados

### **Página Dinámica**
- `app/base/[address]/page.tsx` - Página que muestra el análisis
- `app/base/[address]/opengraph-image.tsx` - Genera imagen OG automáticamente

### **API de Imagen**
- `app/api/og/analysis/route.tsx` - API para generar imágenes con datos específicos

### **Componente de Compartir**
- `components/ShareAnalysisWithImage.tsx` - Botón para compartir con URL dinámica

## 🎨 Características de la Imagen OG

### **Diseño Automático**
- **Tamaño**: 800x600px optimizado para redes sociales
- **Fondo**: Gradiente púrpura-azul consistente con la app
- **Logo**: "BA" en círculo blanco
- **Contenido**: Información del usuario y estadísticas del análisis

### **Datos Incluidos**
- Avatar del usuario (si está disponible)
- Nombre de usuario
- Dirección de wallet (formateada)
- Estadísticas del análisis:
  - Total de transacciones
  - Edad activa
  - Días únicos
  - Racha más larga
- Fecha de generación

## 🔧 Configuración de Metadata

### **OpenGraph Tags**
```html
<meta property="og:title" content="Base Analytics - 0x742d...d8b6" />
<meta property="og:description" content="Analyze Base wallet transactions..." />
<meta property="og:image" content="/api/og/analysis?address=0x742d..." />
<meta property="og:url" content="https://yourapp.com/base/0x742d..." />
```

### **Twitter Cards**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Base Analytics - 0x742d...d8b6" />
<meta name="twitter:image" content="/api/og/analysis?address=0x742d..." />
```

## 🧪 Cómo Probar

### **1. Ejecutar el proyecto:**
```bash
npm run dev
```

### **2. Probar la imagen OG directamente:**
```
http://localhost:3000/api/og/analysis?address=0x9b99b5EF89b5532263091ee2f61C93B263E8c15B&totalTx=732&activeAge=167+Days&uniqueDays=132&longestStreak=23&username=Jhon&pfpUrl=https://example.com/avatar.jpg
```

### **3. Probar la página dinámica:**
```
http://localhost:3000/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B
```

### **4. Probar metadata:**
Usar herramientas como:
- [Open Graph Preview](https://www.opengraph.xyz/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

## 🔍 Ejemplo de URL Compartida

### **URL Generada:**
```
https://yourapp.com/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B
```

### **Texto de Compartir:**
```
📊 Base Analytics Report for 0x9b99...c15B

• 732 Total Transactions
• 167 Days Active Age
• 132 Unique Days Active
• 23 Days Longest Streak

View full analysis: https://yourapp.com/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B
```

### **Imagen OG Mostrada:**
- Logo "BA" y título "Base Analytics"
- Avatar del usuario "Jhon"
- Dirección "0x9b99...c15B"
- 4 tarjetas con estadísticas
- Fecha de generación

## ⚡ Ventajas de esta Implementación

### **1. Automática**
- No requiere configuración manual
- Next.js maneja todo automáticamente
- Funciona en todas las redes sociales

### **2. Dinámica**
- Cada dirección genera su propia imagen
- Datos siempre actualizados
- Personalizada por usuario

### **3. Optimizada**
- Imágenes generadas bajo demanda
- Caché automático de Next.js
- Tamaño optimizado para redes sociales

### **4. Robusta**
- Fallbacks para errores
- Validación de direcciones
- Manejo de casos edge

## 🛠️ Solución de Problemas

### **Error de Fuentes**
Si ves errores como `Invalid URL` o problemas con fuentes:
- ✅ **Solucionado**: Se cambió a `fontFamily: 'system-ui, sans-serif'`
- ✅ **Removido**: Carga de fuentes personalizadas que causaba problemas

### **Error 500 en API**
Si la API `/api/og/analysis` falla:
- Verificar que `@vercel/og` esté instalado
- Revisar logs del servidor
- Probar con parámetros más simples

### **Metadata no se muestra**
Si las redes sociales no muestran la imagen:
- Verificar que la URL sea accesible públicamente
- Usar herramientas de validación de metadata
- Comprobar que `NEXT_PUBLIC_URL` esté configurado

## 🎯 Próximas Mejoras

- [ ] Agregar más métricas a la imagen OG
- [ ] Implementar diferentes estilos de imagen
- [ ] Agregar gráficos simples en la imagen
- [ ] Implementar caché de imágenes generadas
- [ ] Agregar opciones de personalización

## 📝 Notas Técnicas

- **Runtime**: Edge Runtime para mejor performance
- **Formato**: SVG renderizado a PNG
- **Tamaño**: 800x600px optimizado para redes sociales
- **Compatibilidad**: Funciona en Vercel y otros proveedores
- **Fuentes**: Usa fuentes del sistema para evitar problemas

