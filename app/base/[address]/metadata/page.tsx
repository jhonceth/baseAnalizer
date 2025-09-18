import { Metadata } from 'next';
import { env } from '@/lib/env';

interface MetadataPageProps {
  params: {
    address: string;
  };
}

export async function generateMetadata({ params }: MetadataPageProps): Promise<Metadata> {
  const { address } = params;
  const baseUrl = env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  return {
    title: `Base Analytics - ${shortAddress}`,
    description: `Analyze Base wallet transactions and activity patterns for ${shortAddress}`,
    openGraph: {
      title: `Base Analytics - ${shortAddress}`,
      description: `Analyze Base wallet transactions and activity patterns for ${shortAddress}`,
      type: 'website',
      url: `${baseUrl}/base/${address}`,
      images: [
        {
          url: `${baseUrl}/base/${address}/opengraph-image`,
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

export default function MetadataPage({ params }: MetadataPageProps) {
  const { address } = params;
  const baseUrl = env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          📊 Metadatos Generados para {shortAddress}
        </h1>
        
        <div className="space-y-6">
          {/* Información Básica */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">📋 Información Básica</h2>
            <div className="space-y-2">
              <p><strong>Dirección:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{address}</code></p>
              <p><strong>Dirección Corta:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{shortAddress}</code></p>
              <p><strong>URL de la Página:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{baseUrl}/base/{address}</code></p>
            </div>
          </div>

          {/* Metadatos OpenGraph */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-4">🌐 Metadatos OpenGraph</h2>
            <div className="space-y-2">
              <p><strong>Título:</strong> <code className="bg-gray-200 px-2 py-1 rounded">Base Analytics - {shortAddress}</code></p>
              <p><strong>Descripción:</strong> <code className="bg-gray-200 px-2 py-1 rounded">Analyze Base wallet transactions and activity patterns for {shortAddress}</code></p>
              <p><strong>Tipo:</strong> <code className="bg-gray-200 px-2 py-1 rounded">website</code></p>
              <p><strong>URL:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{baseUrl}/base/{address}</code></p>
              <p><strong>Imagen OG:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{baseUrl}/base/{address}/opengraph-image</code></p>
              <p><strong>Dimensiones:</strong> <code className="bg-gray-200 px-2 py-1 rounded">1200x800px</code></p>
            </div>
          </div>

          {/* Metadatos Twitter */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">🐦 Metadatos Twitter</h2>
            <div className="space-y-2">
              <p><strong>Card:</strong> <code className="bg-gray-200 px-2 py-1 rounded">summary_large_image</code></p>
              <p><strong>Título:</strong> <code className="bg-gray-200 px-2 py-1 rounded">Base Analytics - {shortAddress}</code></p>
              <p><strong>Descripción:</strong> <code className="bg-gray-200 px-2 py-1 rounded">Analyze Base wallet transactions and activity patterns for {shortAddress}</code></p>
              <p><strong>Imagen:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{baseUrl}/base/{address}/opengraph-image</code></p>
            </div>
          </div>

          {/* Enlaces de Prueba */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">🔗 Enlaces de Prueba</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">📱 Ver Imagen OG:</p>
                <a 
                  href={`${baseUrl}/base/${address}/opengraph-image`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Abrir Imagen OG
                </a>
              </div>
              
              <div>
                <p className="font-medium mb-2">🌐 Ver Página Completa:</p>
                <a 
                  href={`${baseUrl}/base/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Abrir Página de Análisis
                </a>
              </div>
              
              <div>
                <p className="font-medium mb-2">🔍 Ver Metadatos en HTML:</p>
                <a 
                  href={`${baseUrl}/base/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                >
                  Ver Código Fuente
                </a>
                <p className="text-sm text-gray-600 mt-1">(Click derecho → &quot;Ver código fuente de la página&quot;)</p>
              </div>
            </div>
          </div>

          {/* Código HTML Generado */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📄 Código HTML Generado</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`<head>
  <title>Base Analytics - ${shortAddress}</title>
  <meta name="description" content="Analyze Base wallet transactions and activity patterns for ${shortAddress}" />
  
  <!-- OpenGraph -->
  <meta property="og:title" content="Base Analytics - ${shortAddress}" />
  <meta property="og:description" content="Analyze Base wallet transactions and activity patterns for ${shortAddress}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/base/${address}" />
  <meta property="og:image" content="${baseUrl}/base/${address}/opengraph-image" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="Base Analytics for ${shortAddress}" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Base Analytics - ${shortAddress}" />
  <meta name="twitter:description" content="Analyze Base wallet transactions and activity patterns for ${shortAddress}" />
  <meta name="twitter:image" content="${baseUrl}/base/${address}/opengraph-image" />
</head>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
