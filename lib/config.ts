// Configuración de la aplicación
export const config = {
  // API Keys de Basescan - usando variables de entorno o fallback
  BASESCAN_API_KEYS: [
    process.env.BASESCAN_API_KEY_1 || '8Y2T3V4558TJT8ZS56AA9U9CV225PSHY6G',
    process.env.BASESCAN_API_KEY_2 || '8Y2T3V4558TJT8ZS56AA9U9CV225PSHY6G',
    process.env.BASESCAN_API_KEY_3 || '8Y2T3V4558TJT8ZS56AA9U9CV225PSHY6G',
    process.env.BASESCAN_API_KEY_4 || '8Y2T3V4558TJT8ZS56AA9U9CV225PSHY6G'
  ].filter(key => key && key !== 'undefined'),
  
  // Configuración de la aplicación
  APP_NAME: 'Basescan Wallet Analyzer',
  MAX_TRANSACTIONS: 10000,
  REQUEST_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT_DELAY: 500,
  
  // URLs de la API
  BASESCAN_API_URL: 'https://api.basescan.org/api',
  
  // Configuración de UI
  TOKENS_PER_PAGE: 10,
  NFTS_PER_PAGE: 12,
  
  // Mensajes de error
  ERROR_MESSAGES: {
    INVALID_ADDRESS: 'Dirección de wallet inválida',
    RATE_LIMIT: 'Límite de velocidad alcanzado, intentando con otra API key...',
    TIMEOUT: 'Tiempo de espera agotado',
    NETWORK_ERROR: 'Error de red',
    API_ERROR: 'Error de la API de Basescan'
  }
};

// Función para obtener una API key aleatoria
export function getRandomApiKey(): string {
  const keys = config.BASESCAN_API_KEYS;
  return keys[Math.floor(Math.random() * keys.length)];
}

// Función para rotar API keys
let currentApiKeyIndex = 0;
export function getNextApiKey(): string {
  const keys = config.BASESCAN_API_KEYS;
  if (keys.length === 0) {
    console.error('❌ No hay claves API disponibles');
    return '';
  }
  const apiKey = keys[currentApiKeyIndex];
  console.log(`🔑 Usando API key ${currentApiKeyIndex + 1}/${keys.length}: ${apiKey.substring(0, 8)}...`);
  currentApiKeyIndex = (currentApiKeyIndex + 1) % keys.length;
  return apiKey;
}

// Función para debug de configuración
export function debugConfig() {
  console.log('🔧 Configuración actual:');
  console.log('- Claves API disponibles:', config.BASESCAN_API_KEYS.length);
  console.log('- URL de API:', config.BASESCAN_API_URL);
  console.log('- Variables de entorno:');
  console.log('  - BASESCAN_API_KEY_1:', process.env.BASESCAN_API_KEY_1 ? 'SET' : 'NOT_SET');
  console.log('  - BASESCAN_API_KEY_2:', process.env.BASESCAN_API_KEY_2 ? 'SET' : 'NOT_SET');
  console.log('  - BASESCAN_API_KEY_3:', process.env.BASESCAN_API_KEY_3 ? 'SET' : 'NOT_SET');
  console.log('  - BASESCAN_API_KEY_4:', process.env.BASESCAN_API_KEY_4 ? 'SET' : 'NOT_SET');
}
