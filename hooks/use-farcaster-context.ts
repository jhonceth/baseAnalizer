"use client";

import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from "wagmi";

export interface FarcasterContext {
  isInFarcaster: boolean;
  isLoading: boolean;
  error: string | null;
  features: {
    auth: boolean;
    wallet: boolean;
    notifications: boolean;
    sharing: boolean;
  };
  userInfo: {
    fid: number | null;
    username: string | null;
    displayName: string | null;
    pfpUrl: string | null;
    walletAddress: string | null;
  } | null;
}

export function useFarcasterContext(): FarcasterContext {
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [features, setFeatures] = useState({
    auth: false,
    wallet: false,
    notifications: false,
    sharing: false,
  });
  const [userInfo, setUserInfo] = useState<{
    fid: number | null;
    username: string | null;
    displayName: string | null;
    pfpUrl: string | null;
    walletAddress: string | null;
  } | null>(null);

  // Usar Wagmi para obtener la dirección de la wallet
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();

  useEffect(() => {
    const detectContext = async () => {
      try {
        console.log("🔍 Detectando contexto de Farcaster...");
        
        // Intentar obtener el contexto
        const context = await sdk.context;
        
        if (context) {
          console.log("✅ Ejecutando en contexto de Farcaster");
          setIsInFarcaster(true);
          
          // Obtener información del usuario
          if (context.user) {
            const user = context.user as any;
            console.log("👤 Usuario completo:", user);
            console.log("🔍 Verificando propiedades del usuario:", {
              fid: user.fid,
              username: user.username,
              displayName: user.displayName,
              pfpUrl: user.pfpUrl,
            });
            
            // En Farcaster Mini Apps, la wallet debería estar automáticamente conectada
            let walletAddress = null;
            
            if (isWagmiConnected && wagmiAddress) {
              walletAddress = wagmiAddress;
              console.log("✅ Wallet address obtenida automáticamente desde Wagmi:", walletAddress);
            } else {
              // Intentar obtener la wallet directamente del SDK ya que debería estar disponible
              try {
                console.log("🔍 Intentando obtener wallet automáticamente desde SDK...");
                const provider = await sdk.wallet.getEthereumProvider();
                console.log("📋 Provider obtenido:", provider);
                
                if (provider) {
                  const accounts = await provider.request({ method: 'eth_accounts' });
                  console.log("📋 Cuentas obtenidas automáticamente:", accounts);
                  
                  if (accounts && accounts.length > 0) {
                    walletAddress = accounts[0];
                    console.log("✅ Wallet address obtenida automáticamente desde SDK:", walletAddress);
                  } else {
                    console.log("⚠️ No se encontraron cuentas - el usuario puede no tener wallet configurada");
                  }
                } else {
                  console.log("❌ No se pudo obtener el provider de Ethereum");
                }
              } catch (error) {
                console.log("❌ Error obteniendo wallet automáticamente:", error);
              }
            }
            
            setUserInfo({
              fid: user.fid || null,
              username: user.username || null,
              displayName: user.displayName || null,
              pfpUrl: user.pfpUrl || null,
              walletAddress,
            });
            console.log("👤 Información del usuario:", {
              fid: user.fid,
              username: user.username,
              displayName: user.displayName,
              walletAddress,
            });
          }
          
          // Verificar funcionalidades disponibles
          const availableFeatures = {
            auth: !!sdk.quickAuth,
            wallet: !!sdk.wallet,
            notifications: false, // Notifications no está disponible en el SDK actual
            sharing: !!sdk.actions.composeCast,
          };
          
          setFeatures(availableFeatures);
          console.log("🔧 Funcionalidades disponibles:", availableFeatures);
          
          // Llamar a ready() para ocultar splash screen
          try {
            await sdk.actions.ready();
            console.log("✅ Splash screen ocultado");
          } catch (readyError) {
            console.warn("⚠️ Error ocultando splash screen:", readyError);
          }
        } else {
          console.log("🌐 Ejecutando en navegador web normal");
          setIsInFarcaster(false);
          setFeatures({
            auth: false,
            wallet: false,
            notifications: false,
            sharing: false,
          });
          setUserInfo(null);
        }
      } catch (err) {
        console.log("🌐 No se detectó contexto de Farcaster, ejecutando como web normal");
        setIsInFarcaster(false);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    detectContext();
  }, [isWagmiConnected, wagmiAddress]);

  return {
    isInFarcaster,
    isLoading,
    error,
    features,
    userInfo,
  };
}
