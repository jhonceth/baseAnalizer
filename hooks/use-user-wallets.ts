"use client";

import { useState, useEffect } from "react";

interface ConnectedWallet {
  address: string;
  platform: string;
  identity: string;
  displayName: string;
  avatar: string | null;
  description: string | null;
  createdAt: string | null;
}

interface ProfileData {
  input: string;
  inputType: 'address' | 'username';
  primaryAddress: string | null;
  platforms: string[];
  connectedWallets: ConnectedWallet[];
  farcaster: {
    fid: number | null;
    username: string | null;
    displayName: string | null;
    avatar: string | null;
    description: string | null;
    location: string | null;
    follower: number;
    following: number;
    createdAt: string | null;
    links: {
      farcaster?: {
        link: string;
        handle: string;
        sources: string[];
      };
      twitter?: {
        link: string;
        handle: string;
        sources: string[];
      };
    };
  } | null;
  ens: {
    name: string | null;
    avatar: string | null;
    description: string | null;
  } | null;
  basenames: {
    name: string | null;
    avatar: string | null;
    description: string | null;
  } | null;
}

interface UserWallets {
  isLoading: boolean;
  error: string | null;
  allWallets: string[]; // Todas las wallets únicas para el combo
  connectedWallet: string | null; // Solo la wallet conectada del SDK
  profileData: ProfileData | null;
}

// Función para detectar direcciones de Solana (base58, ~44 caracteres)
function isSolanaAddress(address: string): boolean {
  // Las direcciones de Solana son base58 y típicamente tienen 32-44 caracteres
  // Patrón común: solo letras y números, sin 0, O, I, l
  const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaPattern.test(address) && address.length >= 32;
}

export function useUserWallets(userInfo: {
  fid: number | null;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
  walletAddress: string | null;
} | null): UserWallets {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allWallets, setAllWallets] = useState<string[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchUserWallets = async () => {
      if (!userInfo) {
        setAllWallets([]);
        setConnectedWallet(null);
        setProfileData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Siempre establecer la wallet conectada del SDK
      setConnectedWallet(userInfo.walletAddress);

      try {
        console.log("🔍 Obteniendo wallets del usuario:", userInfo);

        // Intentar obtener datos por username primero (más completo)
        let input = userInfo.username || userInfo.walletAddress;
        
        if (!input) {
          console.log("⚠️ No hay username ni wallet address disponible");
          // Solo usar la wallet conectada
          setAllWallets(userInfo.walletAddress ? [userInfo.walletAddress] : []);
          setIsLoading(false);
          return;
        }

        console.log(`📡 Llamando a API de profile con input: ${input}`);

        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address: input }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ProfileData = await response.json();
        console.log("✅ Datos de perfil obtenidos:", data);

        setProfileData(data);

        // Recopilar todas las wallets únicas
        const uniqueWallets = new Set<string>();
        
        // Agregar la wallet conectada del SDK
        if (userInfo.walletAddress) {
          uniqueWallets.add(userInfo.walletAddress);
        }

        // Agregar la dirección principal de la API
        if (data.primaryAddress) {
          uniqueWallets.add(data.primaryAddress);
        }

        // Agregar todas las wallets de la API (filtrar Solana)
        data.connectedWallets.forEach(wallet => {
          // Filtrar direcciones de Solana
          if (!isSolanaAddress(wallet.address)) {
            uniqueWallets.add(wallet.address);
          } else {
            console.log("🚫 Filtrando dirección de Solana:", wallet.address);
          }
        });

        const allWalletsArray = Array.from(uniqueWallets);
        setAllWallets(allWalletsArray);

        console.log("💰 Todas las wallets únicas:", allWalletsArray);
        console.log("🔗 Wallet conectada del SDK:", userInfo.walletAddress);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error("❌ Error obteniendo wallets del usuario:", err);
        
        // FALLBACK: Solo usar la wallet conectada del SDK
        console.log("🔄 Usando fallback: solo wallet del SDK de Farcaster");
        
        if (userInfo.walletAddress) {
          setAllWallets([userInfo.walletAddress]);
          setProfileData(null);
          setError(`API Error: ${errorMessage}. Usando solo wallet conectada.`);
          
          console.log("✅ Fallback aplicado:", userInfo.walletAddress);
        } else {
          setAllWallets([]);
          setProfileData(null);
          setError(`API Error: ${errorMessage}. No hay wallet conectada disponible.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserWallets();
  }, [userInfo?.fid, userInfo?.username, userInfo?.walletAddress]);

  return {
    isLoading,
    error,
    allWallets,
    connectedWallet,
    profileData,
  };
}
