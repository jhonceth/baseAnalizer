import { NextRequest, NextResponse } from 'next/server';

interface Web3BioProfile {
  address: string;
  identity: string;
  platform: string;
  displayName: string;
  avatar: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
  email: string | null;
  location: string | null;
  header: string | null;
  contenthash: string | null;
  links: Record<string, any>;
  social: {
    uid: number | null;
    follower: number;
    following: number;
  };
}

interface FarcasterData {
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
}

interface ConnectedWallet {
  address: string;
  platform: string;
  identity: string;
  displayName: string;
  avatar: string | null;
  description: string | null;
  createdAt: string | null;
}

interface ProfileResponse {
  input: string; // El input original (address o username)
  inputType: 'address' | 'username';
  primaryAddress: string | null; // La dirección principal si se busca por username
  platforms: string[];
  connectedWallets: ConnectedWallet[];
  farcaster: FarcasterData | null;
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
  allProfiles: Web3BioProfile[];
}

// Función para detectar direcciones de Solana (base58, ~44 caracteres)
function isSolanaAddress(address: string): boolean {
  // Las direcciones de Solana son base58 y típicamente tienen 32-44 caracteres
  // Patrón común: solo letras y números, sin 0, O, I, l
  const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaPattern.test(address) && address.length >= 32;
}

// Función para detectar direcciones Ethereum
function isEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Address or username is required' },
        { status: 400 }
      );
    }

    // Validar que sea una dirección Ethereum válida o un username válido
    const isEthAddress = isEthereumAddress(address);
    const isUsername = /^[a-zA-Z0-9._-]+$/.test(address) && address.length > 0;

    if (!isEthAddress && !isUsername) {
      return NextResponse.json(
        { error: 'Invalid format. Must be a valid Ethereum address (0x...) or username' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching profile data for ${address} (${isEthAddress ? 'address' : 'username'})...`);

    // Llamar a la API de web3.bio
    const response = await fetch(`https://api.web3.bio/profile/${address}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BaseAnalytics/1.0',
      },
      cache: 'no-store', // No cache para datos frescos
    });

    if (!response.ok) {
      console.error(`❌ web3.bio API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to fetch profile data' },
        { status: response.status }
      );
    }

    const profiles: Web3BioProfile[] = await response.json();

    if (!Array.isArray(profiles) || profiles.length === 0) {
      console.log(`⚠️ No profile data found for ${address}`);
      return NextResponse.json({
        input: address,
        inputType: isEthereumAddress(address) ? 'address' : 'username',
        primaryAddress: null,
        platforms: [],
        connectedWallets: [],
        farcaster: null,
        ens: null,
        basenames: null,
        allProfiles: [],
      });
    }

    console.log(`✅ Found ${profiles.length} profile(s) for ${address}`);

    // Extraer datos específicos por plataforma
    const platforms = Array.from(new Set(profiles.map(p => p.platform)));
    
    // Extraer todas las wallets conectadas (excluyendo la plataforma 'ethereum' y direcciones de Solana)
    const connectedWallets: ConnectedWallet[] = profiles
      .filter(p => p.platform !== 'ethereum' && !isSolanaAddress(p.address))
      .map(p => ({
        address: p.address,
        platform: p.platform,
        identity: p.identity,
        displayName: p.displayName,
        avatar: p.avatar,
        description: p.description,
        createdAt: p.createdAt,
      }));

    // Determinar la dirección principal
    const primaryAddress = isEthAddress 
      ? address 
      : profiles.find(p => p.platform === 'ethereum')?.address || null;
    
    // Buscar datos de Farcaster
    const farcasterProfile = profiles.find(p => p.platform === 'farcaster');
    const farcaster: FarcasterData | null = farcasterProfile ? {
      fid: farcasterProfile.social.uid,
      username: farcasterProfile.links?.farcaster?.handle || null,
      displayName: farcasterProfile.displayName,
      avatar: farcasterProfile.avatar,
      description: farcasterProfile.description,
      location: farcasterProfile.location,
      follower: farcasterProfile.social.follower,
      following: farcasterProfile.social.following,
      createdAt: farcasterProfile.createdAt,
      links: farcasterProfile.links || {},
    } : null;

    // Buscar datos de ENS
    const ensProfile = profiles.find(p => p.platform === 'ens');
    const ens = ensProfile ? {
      name: ensProfile.displayName,
      avatar: ensProfile.avatar,
      description: ensProfile.description,
    } : null;

    // Buscar datos de Base Names
    const basenamesProfile = profiles.find(p => p.platform === 'basenames');
    const basenames = basenamesProfile ? {
      name: basenamesProfile.displayName,
      avatar: basenamesProfile.avatar,
      description: basenamesProfile.description,
    } : null;

    const result: ProfileResponse = {
      input: address,
      inputType: isEthAddress ? 'address' : 'username',
      primaryAddress,
      platforms,
      connectedWallets,
      farcaster,
      ens,
      basenames,
      allProfiles: profiles,
    };

    console.log(`📊 Profile data extracted:`, {
      input: address,
      inputType: isEthAddress ? 'address' : 'username',
      primaryAddress,
      platforms: platforms.length,
      connectedWallets: connectedWallets.length,
      hasFarcaster: !!farcaster,
      hasENS: !!ens,
      hasBaseNames: !!basenames,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error fetching profile data:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch profile data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// También permitir GET para testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  // Reutilizar la lógica de POST
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ address }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return POST(mockRequest);
}
