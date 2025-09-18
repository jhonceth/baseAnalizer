import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface SharePageProps {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ counts?: string; advancedStats?: string }>;
}

export async function generateMetadata({ params, searchParams }: SharePageProps): Promise<Metadata> {
  const { address } = await params;
  const { counts, advancedStats } = await searchParams;
  
  let countsData = { total: 0 };
  let advancedStatsData = { sinceFormatted: 'N/A' };

  if (counts) {
    try {
      countsData = JSON.parse(counts);
    } catch (e) {
      console.error('Error parsing counts:', e);
    }
  }

  if (advancedStats) {
    try {
      advancedStatsData = JSON.parse(advancedStats);
    } catch (e) {
      console.error('Error parsing advancedStats:', e);
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const ogImageUrl = `${baseUrl}/api/og/share/${address}?counts=${encodeURIComponent(counts || '{}')}&advancedStats=${encodeURIComponent(advancedStats || '{}')}`;

  return {
    title: `Base Analytics - ${address.slice(0, 6)}...${address.slice(-4)}`,
    description: `Wallet analysis showing ${countsData.total} transactions since ${advancedStatsData.sinceFormatted}`,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `Base Analytics - ${address.slice(0, 6)}...${address.slice(-4)}`,
      description: `Wallet analysis showing ${countsData.total} transactions since ${advancedStatsData.sinceFormatted}`,
      type: 'website',
      url: `${baseUrl}/${address}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 800,
          alt: `Base Analytics for ${address}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Base Analytics - ${address.slice(0, 6)}...${address.slice(-4)}`,
      description: `Wallet analysis showing ${countsData.total} transactions since ${advancedStatsData.sinceFormatted}`,
      images: [ogImageUrl],
    },
    other: {
      'og:image': ogImageUrl,
      'og:image:width': '1200',
      'og:image:height': '800',
      'og:image:type': 'image/png',
    },
  };
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const { address } = await params;
  const { counts, advancedStats } = await searchParams;

  // Validar que la dirección sea válida
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    notFound();
  }

  let countsData = {
    total: 0,
    normalTx: 0,
    internalTx: 0,
    tokenTx: 0,
    tokenNftTx: 0
  };
  
  let advancedStatsData = {
    sinceFormatted: 'N/A',
    activeAgeFormatted: 'N/A',
    uniqueDays: 0,
    longestStreak: 0
  };

  if (counts) {
    try {
      countsData = JSON.parse(counts);
    } catch (e) {
      console.error('Error parsing counts:', e);
    }
  }

  if (advancedStats) {
    try {
      advancedStatsData = JSON.parse(advancedStats);
    } catch (e) {
      console.error('Error parsing advancedStats:', e);
    }
  }

  const ogImageUrl = `/api/og/share/${address}?counts=${encodeURIComponent(counts || '{}')}&advancedStats=${encodeURIComponent(advancedStats || '{}')}`;

  return (
    <>
      {/* Meta tags adicionales para asegurar compatibilidad con Farcaster */}
      <head>
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600 font-bold text-2xl">BA</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Base Analytics</h1>
          </div>
          <p className="text-white/80 text-lg">
            Wallet Analysis Report
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Transaction Count */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">{countsData.total}</div>
            <div className="text-sm text-white/80">Total Transactions</div>
            <div className="text-xs text-white/60 mt-1">Since {advancedStatsData.sinceFormatted}</div>
          </div>

          {/* Active Age */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-2xl font-bold text-white mb-2">{advancedStatsData.activeAgeFormatted}</div>
            <div className="text-sm text-white/80">Active Age</div>
            <div className="text-xs text-white/60 mt-1">Since {advancedStatsData.sinceFormatted}</div>
          </div>

          {/* Unique Days */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-2xl font-bold text-white mb-2">{advancedStatsData.uniqueDays}</div>
            <div className="text-sm text-white/80">Unique Days</div>
            <div className="text-xs text-white/60 mt-1">Since {advancedStatsData.sinceFormatted}</div>
          </div>

          {/* Longest Streak */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-2xl font-bold text-white mb-2">{advancedStatsData.longestStreak}</div>
            <div className="text-sm text-white/80">Longest Streak</div>
            <div className="text-xs text-white/60 mt-1">Since {advancedStatsData.sinceFormatted}</div>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 inline-block">
            <div className="text-white/80 text-sm mb-1">Analyzed Address</div>
            <div className="text-white font-mono text-lg">{address}</div>
          </div>
        </div>

        {/* Share Image Preview */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-4">Share Image Preview</h3>
            <div className="flex justify-center">
              <Image
                src={ogImageUrl}
                alt="Base Analytics Share Image"
                width={1200}
                height={800}
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(`📊 Base Analytics Report for ${address.slice(0, 6)}...${address.slice(-4)}\n\n• ${countsData.total} Total Transactions\n• ${advancedStatsData.activeAgeFormatted} Active Age\n• ${advancedStatsData.uniqueDays} Unique Days Active\n• ${advancedStatsData.longestStreak} Days Longest Streak\n\nAnalyze your Base wallet: ${typeof window !== 'undefined' ? window.location.origin : ''}`)}&embeds[]=${encodeURIComponent(ogImageUrl)}`, '_blank')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 font-semibold transition-all duration-200"
            >
              Share on Farcaster
            </button>
            
            <button
              onClick={() => window.open('/', '_blank')}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold transition-all duration-200"
            >
              Analyze Your Wallet
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Generated by Base Analytics • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
