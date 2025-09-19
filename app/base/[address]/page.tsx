import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WalletAnalyzer from '@/components/WalletAnalyzer';

interface PageProps {
  params: {
    address: string;
  };
  searchParams: {
    t?: string;
  };
}

// Función para validar dirección Ethereum
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Función para obtener datos del análisis (simulada por ahora)
async function getAnalysisData(address: string) {
  // En una implementación real, aquí harías la llamada a la API
  // Por ahora retornamos datos simulados
  return {
    address,
    exists: true, // Simular que la dirección existe
    // Otros datos que podrías necesitar para la metadata
  };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { address } = params;
  const { t } = searchParams;
  
  // Validar dirección
  if (!isValidEthereumAddress(address)) {
    return {
      title: 'Invalid Address - Base Analytics',
      description: 'The provided address is not a valid Ethereum address.',
    };
  }

  try {
    // Obtener datos del análisis
    const analysisData = await getAnalysisData(address);
    
    if (!analysisData.exists) {
      return {
        title: 'Address Not Found - Base Analytics',
        description: 'No analysis data found for this address.',
      };
    }

    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    // Agregar timestamp a la URL de la imagen OG para evitar caché
    const timestamp = t || Date.now().toString();
    const imageUrl = `${baseUrl}/base/${address}/opengraph-image?t=${timestamp}`;
    
    // Crear Frame de Farcaster según la documentación oficial
    const miniappFrame = {
      version: "1",
      imageUrl: imageUrl,
      button: {
        title: "📊 Analyze Wallet",
        action: {
          type: "launch_miniapp",
          url: `${baseUrl}/`, // Apuntar a la URL principal
          name: "Base Analytics",
          splashImageUrl: `${baseUrl}/images/splash.png`,
          splashBackgroundColor: "#6D28D9",
        },
      },
    };
    
    return {
      title: `Base Analytics - ${shortAddress}`,
      description: `Analyze Base wallet transactions and activity patterns for ${shortAddress}. View transaction history, activity heatmap, and advanced statistics.`,
      openGraph: {
        title: `Base Analytics - ${shortAddress}`,
        description: `Analyze Base wallet transactions and activity patterns for ${shortAddress}`,
        type: 'website',
        url: `${baseUrl}/base/${address}`,
        images: [
          {
            url: imageUrl,
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
        images: [imageUrl],
      },
      // Frame de Farcaster - esto es lo que hace que aparezca el botón
      other: {
        "fc:miniapp": JSON.stringify(miniappFrame),
        // Para compatibilidad hacia atrás
        "fc:frame": JSON.stringify(miniappFrame),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Base Analytics - Error',
      description: 'An error occurred while generating the analysis.',
    };
  }
}

export default async function BaseAddressPage({ params, searchParams }: PageProps) {
  const { address } = params;
  const { t } = searchParams;
  
  // Validar dirección
  if (!isValidEthereumAddress(address)) {
    notFound();
  }

  try {
    // Obtener datos del análisis
    const analysisData = await getAnalysisData(address);
    
    if (!analysisData.exists) {
      notFound();
    }

    return (
      <div className="min-h-screen">
        <WalletAnalyzer />
      </div>
    );
  } catch (error) {
    console.error('Error loading analysis:', error);
    notFound();
  }
}
