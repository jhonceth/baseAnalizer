"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import MiniAppWalletProvider from "./frame-wallet-provider";

interface MiniAppContextValue {
  context: any | null;
  isSDKLoaded: boolean;
  isEthProviderAvailable: boolean;
  error: string | null;
  actions: typeof sdk.actions | null;
}

const MiniAppProviderContext = createContext<MiniAppContextValue | undefined>(
  undefined
);

export function useMiniAppContext() {
  const context = useContext(MiniAppProviderContext);
  if (context === undefined) {
    throw new Error("useMiniAppContext must be used within a MiniAppProvider");
  }
  return context;
}

interface MiniAppProviderProps {
  children: ReactNode;
}

export function MiniAppProvider({ children }: MiniAppProviderProps) {
  const [context, setContext] = useState<any | null>(null);
  const [actions, setActions] = useState<typeof sdk.actions | null>(null);
  const [isEthProviderAvailable, setIsEthProviderAvailable] =
    useState<boolean>(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("🔄 Inicializando SDK de Farcaster Mini App...");
        
        const context = await sdk.context;
        if (context) {
          console.log("✅ Contexto de Farcaster detectado");
          setContext(context);
          setActions(sdk.actions);
          setIsEthProviderAvailable(sdk.wallet?.ethProvider ? true : false);
          
          // Llamar a ready() para ocultar splash screen según la documentación
          await sdk.actions.ready();
          console.log("✅ Splash screen ocultado");
        } else {
          console.log("🌐 No se detectó contexto de Farcaster, ejecutando como web normal");
          setError("No Farcaster context detected");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize SDK";
        console.error("❌ Error inicializando SDK:", err);
        setError(errorMessage);
      }
    };

    if (sdk && !isSDKLoaded) {
      load().then(() => {
        setIsSDKLoaded(true);
        console.log("✅ SDK de Farcaster Mini App cargado");
      });
    }
  }, [isSDKLoaded]);

  return (
    <MiniAppProviderContext.Provider
      value={{
        context,
        actions,
        isSDKLoaded,
        isEthProviderAvailable,
        error,
      }}
    >
      <MiniAppWalletProvider>{children}</MiniAppWalletProvider>
    </MiniAppProviderContext.Provider>
  );
}
