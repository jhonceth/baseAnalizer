"use client";

import { useState } from "react";
import { useFarcasterContext } from "@/hooks/use-farcaster-context";
import { Button } from "./ui/button";
import { ImageIcon, Share2, Loader2 } from "lucide-react";

interface AnalysisResult {
  address: string;
  counts: {
    total: number;
  };
  advancedStats: {
    activeAgeFormatted: string;
    uniqueDays: number;
    longestStreak: number;
  };
}

interface ShareAnalysisWithImageProps {
  result: AnalysisResult;
  onShare?: () => void;
}

export default function ShareAnalysisWithImage({ result, onShare }: ShareAnalysisWithImageProps) {
  const { isInFarcaster, userInfo } = useFarcasterContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShareWithCustomImage = async () => {
    if (!result || !isInFarcaster) return;

    setIsGenerating(true);
    
    try {
      // Crear URL simple de la página de análisis con timestamp para evitar caché
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const timestamp = Date.now();
      const analysisUrl = `${baseUrl}/base/${result.address}?t=${timestamp}`;

      console.log('🔗 Generated analysis URL:', analysisUrl);

      // Crear texto del análisis
      const today = new Date().toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const text = `📊 My Base Analytics - ${today}\n\n` +
        `• ${result.counts.total} Total Transactions\n` +
        `• ${result.advancedStats.activeAgeFormatted} Active Age\n` +
        `• ${result.advancedStats.uniqueDays} Unique Days Active\n` +
        `• ${result.advancedStats.longestStreak} Days Longest Streak`;

      setIsGenerating(false);
      setIsSharing(true);

      // Intentar compartir usando el SDK de Farcaster
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        if (sdk?.actions?.composeCast) {
          await sdk.actions.composeCast({
            text: text,
            embeds: [analysisUrl],
          });
          console.log('✅ Shared analysis URL via Farcaster SDK');
        } else {
          // Fallback: abrir en nueva ventana
          const intent = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(analysisUrl)}`;
          window.open(intent, '_blank');
          console.log('✅ Opened share intent in new window');
        }
      } catch (error) {
        console.error('❌ Error sharing via SDK:', error);
        // Fallback: abrir en nueva ventana
        const intent = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(analysisUrl)}`;
        window.open(intent, '_blank');
      }

      // Llamar callback si existe
      if (onShare) {
        onShare();
      }

    } catch (error) {
      console.error('❌ Error sharing analysis:', error);
    } finally {
      setIsGenerating(false);
      setIsSharing(false);
    }
  };

  // No mostrar si no estamos en Farcaster o no hay resultado
  if (!isInFarcaster || !result) {
    return null;
  }

  return (
    <div className="mt-6 text-center">
      <div className="relative group">
        <Button
          onClick={handleShareWithCustomImage}
          disabled={isGenerating || isSharing}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 font-bold text-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl hover:scale-105 transform"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Generating Image...
            </>
          ) : isSharing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Sharing...
            </>
          ) : (
            <>
              <img src="/images/farcaster.png" alt="Farcaster" className="w-6 h-6" />
              <Share2 className="w-6 h-6" />
              Share Analysis
            </>
          )}
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Share your Base analytics on Farcaster
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
      
      {isGenerating && (
        <p className="text-sm text-gray-300 mt-2">
          Creating personalized analysis image...
        </p>
      )}
      
      {isSharing && (
        <p className="text-sm text-gray-300 mt-2">
          Opening share dialog...
        </p>
      )}
    </div>
  );
}
