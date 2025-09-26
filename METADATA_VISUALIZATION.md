# 🔍 Cómo Ver los Metadatos Generados Dinámicamente

## 📋 Páginas Creadas para Verificar Metadatos

He creado varias páginas para que puedas ver exactamente cómo funcionan los metadatos dinámicos vs estáticos:

### **1. Página de Comparación de Metadatos**
**URL:** `http://localhost:3000/metadata-comparison`

Esta página muestra la diferencia entre metadatos estáticos y dinámicos con ejemplos visuales.

### **2. Página de Metadatos Específicos**
**URL:** `http://localhost:3000/base/[address]/metadata`

Esta página muestra los metadatos generados para una dirección específica.

## 🔍 **Cómo Ver los Metadatos Generados**

### **Método 1: Inspeccionar Elemento**
1. Ve a: `http://localhost:3000/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B`
2. Click derecho → "Inspeccionar elemento"
3. Busca en el `<head>` las etiquetas `<meta>`

### **Método 2: Ver Código Fuente**
1. Ve a la URL de la página
2. Click derecho → "Ver código fuente de la página"
3. Busca las etiquetas `<meta property="og:">`

### **Método 3: Usar las Páginas de Prueba**
1. Ve a: `http://localhost:3000/metadata-comparison`
2. Usa los enlaces de prueba para ver diferentes tipos de metadatos

## 📊 **Comparación: Estáticos vs Dinámicos**

### **🔒 Metadatos ESTÁTICOS (Como tu ejemplo)**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const appUrl = env.NEXT_PUBLIC_URL;
  
  const frame = {
    version: "next",
    imageUrl: `${appUrl}/images/feed.png`, // ← Imagen fija
    button: {
      title: "📊 Analyze Wallet",
      action: {
        type: "launch_frame",
        name: "Base Analytics",
        url: appUrl,
        splashImageUrl: `${appUrl}/images/splash.png`,
        splashBackgroundColor: "#6D28D9",
      },
    },
  };

  return {
    title: "Base Analytics", // ← Título fijo
    description: "Analyze Base wallet transactions and activity patterns", // ← Descripción fija
    openGraph: {
      title: "Base Analytics",
      description: "Analyze Base wallet transactions and activity patterns",
      images: [
        {
          url: `${appUrl}/images/feed.png`, // ← Imagen fija
          width: 1200,
          height: 630,
          alt: "Base Analytics",
        },
      ],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}
```

**Resultado:** Los mismos metadatos para todas las direcciones.

### **🔄 Metadatos DINÁMICOS (Nuestro sistema)**
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = params; // ← Parámetro dinámico
  const baseUrl = env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`; // ← Dirección corta
  
  return {
    title: `Base Analytics - ${shortAddress}`, // ← Título dinámico
    description: `Analyze Base wallet transactions and activity patterns for ${shortAddress}`, // ← Descripción dinámica
    openGraph: {
      title: `Base Analytics - ${shortAddress}`,
      description: `Analyze Base wallet transactions and activity patterns for ${shortAddress}`,
      type: 'website',
      url: `${baseUrl}/base/${address}`, // ← URL dinámica
      images: [
        {
          url: `${baseUrl}/base/${address}/opengraph-image`, // ← Imagen dinámica
          width: 1200,
          height: 800,
          alt: `Base Analytics for ${shortAddress}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Base Analytics - ${shortAddress}`,
      description: `Analyze Base wallet transactions and activity patterns for ${shortAddress}`,
      images: [`${baseUrl}/base/${address}/opengraph-image`],
    },
  };
}
```

**Resultado:** Metadatos personalizados para cada dirección con datos reales.

## 🎯 **Diferencias Clave**

| Aspecto | Estáticos | Dinámicos |
|---------|-----------|-----------|
| **Título** | "Base Analytics" | "Base Analytics - 0x9b99...c15B" |
| **Descripción** | Genérica | Específica para la dirección |
| **Imagen** | `/images/feed.png` | `/base/[address]/opengraph-image` |
| **Datos** | Fijos | Reales del análisis |
| **Farcaster** | Frame configurado | Metadatos OG estándar |

## 🔗 **URLs de Prueba**

### **Metadatos Estáticos:**
- **Página:** `http://localhost:3000/`
- **Imagen:** `http://localhost:3000/images/feed.png`

### **Metadatos Dinámicos:**
- **Página:** `http://localhost:3000/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B`
- **Imagen:** `http://localhost:3000/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B/opengraph-image`
- **Metadatos:** `http://localhost:3000/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B/metadata`

### **Comparación:**
- **Comparación:** `http://localhost:3000/metadata-comparison`

## 📱 **Cómo Funciona con Farcaster**

### **Metadatos Estáticos:**
```html
<meta property="fc:frame" content='{"version":"next","imageUrl":"http://localhost:3000/images/feed.png","button":{"title":"📊 Analyze Wallet","action":{"type":"launch_frame","name":"Base Analytics","url":"http://localhost:3000","splashImageUrl":"http://localhost:3000/images/splash.png","splashBackgroundColor":"#6D28D9"}}}' />
```

### **Metadatos Dinámicos:**
```html
<meta property="og:image" content="http://localhost:3000/base/0x9b99b5EF89b5532263091ee2f61C93B263E8c15B/opengraph-image" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="800" />
<meta property="og:title" content="Base Analytics - 0x9b99...c15B" />
<meta property="og:description" content="Analyze Base wallet transactions and activity patterns for 0x9b99...c15B" />
```

## 🚀 **Ventajas del Sistema Dinámico**

1. **Personalización:** Cada dirección tiene sus propios metadatos
2. **Datos Reales:** Muestra estadísticas reales del análisis
3. **Compatibilidad:** Funciona con todas las plataformas sociales
4. **SEO:** Mejor posicionamiento en buscadores
5. **Experiencia:** Los usuarios ven información relevante

## 📝 **Próximos Pasos**

1. **Probar las URLs:** Visita las páginas de prueba
2. **Ver Metadatos:** Usa las herramientas del navegador
3. **Compartir:** Prueba compartir las URLs en Farcaster
4. **Personalizar:** Modifica los metadatos según tus necesidades

¡Ahora puedes ver exactamente cómo funcionan los metadatos dinámicos vs estáticos! 🎉

