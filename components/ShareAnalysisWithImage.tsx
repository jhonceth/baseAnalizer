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
      // Crear URL de la página de análisis
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const analysisUrl = `${baseUrl}/base/${result.address}`;

      console.log('🔗 Generated analysis URL:', analysisUrl);

      // Crear texto del análisis
      const shortAddress = `${result.address.slice(0, 6)}...${result.address.slice(-4)}`;
      const text = `📊 Base Analytics Report for ${shortAddress}\n\n` +
        `• ${result.counts.total} Total Transactions\n` +
        `• ${result.advancedStats.activeAgeFormatted} Active Age\n` +
        `• ${result.advancedStats.uniqueDays} Unique Days Active\n` +
        `• ${result.advancedStats.longestStreak} Days Longest Streak\n\n` +
        `View full analysis: ${analysisUrl}`;

      setIsGenerating(false);
      setIsSharing(true);

      // Intentar compartir usando el SDK de Farcaster
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        if (sdk?.actions?.composeCast) {
          await sdk.actions.composeCast({
            text: text,
            embeds: [analysisUrl], // Usar la URL de la página en lugar de la imagen directa
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
      <Button
        onClick={handleShareWithCustomImage}
        disabled={isGenerating || isSharing}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Image...
          </>
        ) : isSharing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sharing...
          </>
        ) : (
          <>
            <ImageIcon className="w-5 h-5" />
            Share Analysis with Image
          </>
        )}
      </Button>
      
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
