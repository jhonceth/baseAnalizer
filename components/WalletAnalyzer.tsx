"use client";

import { useState, useEffect } from "react";
import { useFarcasterContext } from "@/hooks/use-farcaster-context";
import { useAccount } from "wagmi";
import UserInfo from "./UserInfo";
import ActivityHeatmap from "./ActivityHeatmap";
import ShareAnalysisWithImage from "./ShareAnalysisWithImage";
import { sdk } from "@farcaster/miniapp-sdk";
import { useUserWallets } from "@/hooks/use-user-wallets";

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
  const { allWallets, connectedWallet, isLoading: walletsLoading } = useUserWallets(userInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  // Establecer la wallet conectada como seleccionada cuando esté disponible
  useEffect(() => {
    if (connectedWallet && !selectedWallet) {
      console.log("🔄 Estableciendo wallet conectada como seleccionada:", connectedWallet);
      setSelectedWallet(connectedWallet);
    }
  }, [connectedWallet, selectedWallet]);

  // Limpiar estadísticas cuando cambie la wallet seleccionada (solo si ya hay resultados)
  useEffect(() => {
    if (selectedWallet && result && result.address !== selectedWallet) {
      console.log("🔄 Wallet seleccionada cambió, limpiando estadísticas:", selectedWallet);
      setResult(null);
      setError("");
    }
  }, [selectedWallet, result]);

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
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-blue-400/30 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-lg">BA</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Base Analytics</h1>
            </div>
            
            {/* Share Button and User Info */}
            <div className="flex items-center space-x-3">
                  <button
                    onClick={shareApp}
                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center shadow-lg hover:shadow-blue-500/25"
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
              className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10"
            >
              <option value="" className="text-gray-300 bg-gray-800">Choose a wallet...</option>
              {allWallets.map((wallet, index) => (
                <option key={index} value={wallet} className="text-white bg-gray-800">
                  {formatWalletAddress(wallet)} {wallet === connectedWallet ? '(Connected)' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={() => analyzeWallet(selectedWallet)}
              disabled={!selectedWallet || loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 border-2 border-purple-400 hover:border-purple-300 shadow-lg hover:shadow-purple-500/25 hover:shadow-xl"
            >
              {loading ? "Analyzing..." : "Analyze Address"}
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
            {/* Título MY BASE ACTIVITY */}
            <div className="text-center mb-6 mt-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase tracking-wider whitespace-nowrap">
                MY BASE ACTIVITY
              </h2>
            </div>
            
            {/* Advanced Statistics */}
            <div className="space-y-4">
              {/* Primera fila - Transaction Count y Active Age */}
              <div className="flex justify-between gap-2">
                {/* Transaction Count */}
                <div className="flex-1 bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-xl p-5 text-center border border-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{result.counts.total || 0}</div>
                  <div className="text-sm font-semibold text-purple-200 mb-1">Transaction Count</div>
                  <div className="text-xs text-gray-300">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
                </div>
                
                {/* Active Age */}
                <div className="flex-1 bg-gradient-to-br from-green-600/30 to-teal-600/30 backdrop-blur-sm rounded-xl p-5 text-center border border-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{result.advancedStats.activeAgeFormatted || 'N/A'}</div>
                  <div className="text-sm font-semibold text-green-200 mb-1">Active Age</div>
                  <div className="text-xs text-gray-300">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
                </div>
              </div>
              
              {/* Segunda fila - Unique Days Active y Longest Streak */}
              <div className="flex justify-between gap-2">
                {/* Unique Days Active */}
                <div className="flex-1 bg-gradient-to-br from-orange-600/30 to-red-600/30 backdrop-blur-sm rounded-xl p-5 text-center border border-orange-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{result.advancedStats.uniqueDays || 0}</div>
                  <div className="text-sm font-semibold text-orange-200 mb-1">Unique Days Active</div>
                  <div className="text-xs text-gray-300">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
                </div>
                
                {/* Longest Streak */}
                <div className="flex-1 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-sm rounded-xl p-5 text-center border border-indigo-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{result.advancedStats.longestStreak || 0}</div>
                  <div className="text-sm font-semibold text-indigo-200 mb-1">Longest Streak</div>
                  <div className="text-xs text-gray-300">Since {result.advancedStats.sinceFormatted || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Share Analysis Button */}
            <ShareAnalysisWithImage 
              result={result} 
              onShare={() => console.log('Analysis shared successfully!')}
            />

            {/* Activity Heatmap */}
            <div className="mt-6 -mx-1 sm:-mx-2 lg:-mx-3 bg-white rounded-lg p-4 sm:p-6 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Heatmap</h3>
              <ActivityHeatmap data={result.activityHeatmap} />
            </div>

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

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              App developed by{' '}
              <a 
                href="https://farcaster.xyz/jobit.eth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium"
              >
                @jobit.eth
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}