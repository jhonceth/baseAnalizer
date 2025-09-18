"use client";

import { useState, useEffect } from "react";
import { useFarcasterContext } from "@/hooks/use-farcaster-context";
import { useAccount } from "wagmi";
import UserInfo from "./UserInfo";
import ActivityHeatmap from "./ActivityHeatmap";
import ShareAnalysisWithImage from "./ShareAnalysisWithImage";
import { sdk } from "@farcaster/miniapp-sdk";

interface AnalysisResult {
  address: string;
  counts: {
    normalTx: number;
    internalTx: number;
    tokenTx: number;
    tokenNftTx: number;
    total: number;
  };
  advancedStats: {
    since: string;
    sinceFormatted: string;
    activeAge: string;
    activeAgeFormatted: string;
    uniqueDays: number;
    longestStreak: number;
  };
  activityHeatmap: { [key: string]: number };
  analysisTime: string;
}

export default function WalletAnalyzer() {
  const { isInFarcaster, isLoading, userInfo } = useFarcasterContext();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [connectedWallets, setConnectedWallets] = useState<Array<{address: string, platform: string, name: string}>>([]);

  // Cargar wallets cuando el contexto de Farcaster esté listo
  useEffect(() => {
    const loadWallets = async () => {
      console.log("🔍 loadWallets called:", { isLoading, isInFarcaster, userInfo });
      
      if (!isLoading && isInFarcaster) {
        try {
          console.log("🔍 Checking SDK in WalletAnalyzer:", {
            hasWallet: !!sdk.wallet,
            hasEthProvider: !!(sdk.wallet && sdk.wallet.ethProvider)
          });
          
          // Obtener wallet primaria directamente del SDK
          if (sdk.wallet && sdk.wallet.ethProvider) {
            console.log("🔍 Requesting eth_accounts from WalletAnalyzer...");
            const accounts = await sdk.wallet.ethProvider.request({ method: 'eth_accounts' });
            console.log("🔍 eth_accounts response in WalletAnalyzer:", accounts);
            
            if (accounts && accounts.length > 0) {
              const primaryWallet = accounts[0];
              console.log("✅ Setting connected wallets with:", primaryWallet);
              
              setConnectedWallets([{
                address: primaryWallet,
                platform: "Farcaster",
                name: userInfo?.displayName || userInfo?.username || "Farcaster User"
              }]);
              // Auto-seleccionar la wallet primaria
              setSelectedWallet(primaryWallet);
            }
          } else {
            console.log("⚠️ SDK wallet not available in WalletAnalyzer");
          }
        } catch (error) {
          console.log("Error obteniendo wallets del SDK:", error);
        }
      }
    };

    loadWallets();
  }, [isLoading, isInFarcaster, userInfo]);

  // Función para analizar una wallet
  const analyzeWallet = async (walletAddress?: string) => {
    const targetAddress = walletAddress || address;
    
    if (!targetAddress) {
      setError("Please connect your wallet or enter an address");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: targetAddress }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Datos recibidos en frontend:', data);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };


  const formatWalletAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const shareApp = async () => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const url = base
    const text = `Analyze Base wallet transactions and activity patterns with this amazing app! 🚀\n\n${url}`
    const intent = `https://farcaster.xyz/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`
    
    // Intento con Mini App composeCast si está disponible
    try {
      // dynamic import to avoid SSR issues
      import("@farcaster/miniapp-sdk").then(({ sdk }) => {
        if (sdk?.actions?.composeCast) {
          sdk.actions.composeCast({
            text: text,
            embeds: [url],
          })
        } else {
          window.open(intent, '_blank')
        }
      }).catch(() => {
        window.open(intent, '_blank')
      })
    } catch {
      window.open(intent, '_blank')
    }
  };

  const shareAnalysis = async () => {
    if (!result) return;
    
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${base}/${result.address}?counts=${encodeURIComponent(JSON.stringify(result.counts))}&advancedStats=${encodeURIComponent(JSON.stringify(result.advancedStats))}`;
    
    const text = `📊 Base Analytics Report for ${result.address.slice(0, 6)}...${result.address.slice(-4)}\n\n` +
      `• ${result.counts.total} Total Transactions\n` +
      `• ${result.advancedStats.activeAgeFormatted} Active Age\n` +
      `• ${result.advancedStats.uniqueDays} Unique Days Active\n` +
      `• ${result.advancedStats.longestStreak} Days Longest Streak\n\n` +
      `Analyze your Base wallet: ${base}`;
    
    const intent = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`;
    
    try {
      import("@farcaster/miniapp-sdk").then(({ sdk }) => {
        if (sdk?.actions?.composeCast) {
          sdk.actions.composeCast({
            text: text,
            embeds: [shareUrl],
          });
        } else {
          window.open(intent, '_blank');
        }
      }).catch(() => {
        window.open(intent, '_blank');
      });
    } catch {
      window.open(intent, '_blank');
    }
  };

  // Mostrar loading mientras se detecta el contexto
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Base Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">BA</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Base Analytics</h1>
            </div>
            
            {/* Share Button and User Info */}
            <div className="flex items-center space-x-3">
                  <button
                    onClick={shareApp}
                    className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    title="Share App"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
              <UserInfo />
            </div>
          </div>
        </div>
      </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Wallet Selection - Always show */}
        <div className="mb-6 relative z-10">
          <label className="block text-sm font-medium text-white mb-2">
            Select Wallet to Analyze
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10"
            >
              <option value="">Choose a wallet...</option>
              {connectedWallets.map((wallet, index) => (
                <option key={index} value={wallet.address} className="text-black">
                  {wallet.name} ({formatWalletAddress(wallet.address)})
                </option>
              ))}
            </select>
            <button
              onClick={() => analyzeWallet(selectedWallet)}
              disabled={!selectedWallet || loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
            >
              {loading ? "Analyzing..." : "Analyze Wallet"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-center">Analyzing wallet...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            {/* Advanced Statistics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Transaction Count */}
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{result.counts.total || 0}</div>
                <div className="text-xs text-gray-300 mb-1">Transaction Count</div>
                <div className="text-xs text-gray-400">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
              </div>
              
              {/* Active Age */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-white">{result.advancedStats.activeAgeFormatted || 'N/A'}</div>
                <div className="text-xs text-gray-300 mb-1">Active Age</div>
                <div className="text-xs text-gray-400">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
              </div>
              
              {/* Unique Days Active */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-white">{result.advancedStats.uniqueDays || 0} Days</div>
                <div className="text-xs text-gray-300 mb-1">Unique Days Active</div>
                <div className="text-xs text-gray-400">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
              </div>
              
              {/* Longest Streak */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-white">{result.advancedStats.longestStreak || 0} Days</div>
                <div className="text-xs text-gray-300 mb-1">Longest Streak</div>
                <div className="text-xs text-gray-400">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Transaction Heatmap</h3>
              <ActivityHeatmap data={result.activityHeatmap} />
            </div>
    
            {/* Share Analysis Button */}
            <ShareAnalysisWithImage 
              result={result} 
              onShare={() => console.log('Analysis shared successfully!')}
            />

            {/* Analysis Info */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="text-xs text-gray-400 space-y-1">
                <div className="break-all">Analyzed Address: <span className="font-mono text-white">{result.address}</span></div>
                <div>Analysis Time: {result.analysisTime}</div>
                <div>Analyzed: {new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}