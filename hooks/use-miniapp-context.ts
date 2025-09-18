import { useMiniAppContext as useFarcasterContext } from "../components/farcaster-provider";
import { sdk } from "@farcaster/miniapp-sdk";

// Define specific types for each context
interface FarcasterContextResult {
  context: any;
  actions: typeof sdk.actions | null;
  isEthProviderAvailable: boolean;
}

interface NoContextResult {
  type: null;
  context: null;
  actions: null;
  isEthProviderAvailable: boolean;
}

// Union type of all possible results
type ContextResult = FarcasterContextResult | NoContextResult;

export const useMiniAppContext = (): ContextResult => {
  // Try to get Farcaster context
  try {
    const farcasterContext = useFarcasterContext();
    if (farcasterContext.context) {
      return {
        context: farcasterContext.context,
        actions: farcasterContext.actions,
        isEthProviderAvailable: farcasterContext.isEthProviderAvailable,
      } as FarcasterContextResult;
    }
  } catch (e) {
    // Ignore error if not in Farcaster context
    console.log("🌐 No se detectó contexto de Farcaster, ejecutando como web normal");
  }

  // No context found
  return {
    context: null,
    actions: null,
    isEthProviderAvailable: false,
  } as NoContextResult;
};

