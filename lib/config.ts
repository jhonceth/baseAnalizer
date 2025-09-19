// Configuración de la aplicación
export const config = {
  // API Keys de Basescan - solo variables de entorno
  BASESCAN_API_KEYS: [
    process.env.BASESCAN_API_KEY_1,
    process.env.BASESCAN_API_KEY_2,
    process.env.BASESCAN_API_KEY_3,
    process.env.BASESCAN_API_KEY_4
  ].filter(key => key && key !== 'undefined'),
  
  // Configuración de la aplicación
  APP_NAME: 'Basescan Wallet Analyzer',
  MAX_TRANSACTIONS: 10000,
  REQUEST_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT_DELAY: 500,
  
  // URLs de la API - Migrado a Etherscan V2 API
  BASESCAN_API_URL: 'https://api.etherscan.io/v2/api',
  
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
  if (keys.length === 0) {
    console.error('❌ No hay claves API disponibles');
    return '';
  }
  const selectedKey = keys[Math.floor(Math.random() * keys.length)];
  return selectedKey || '';
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
  if (!apiKey) {
    console.error('❌ API key no válida');
    return '';
  }
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
