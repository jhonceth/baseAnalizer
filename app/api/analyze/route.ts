import { NextRequest, NextResponse } from 'next/server';
import { config, getNextApiKey, debugConfig } from '@/lib/config';
import https from 'https';

// Interfaces para tipos de transacciones
interface BaseTransaction {
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
}

interface TokenTransaction extends BaseTransaction {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
}

interface NFTTransaction extends BaseTransaction {
  contractAddress: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
}

// Función usando HTTPS nativo que sabemos que funciona
function fetchData(url: string): Promise<{ status: string; result: unknown[] }> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Función simplificada para hacer peticiones con HTTPS nativo
async function fetchWithRetry(url: string, retries = config.RETRY_ATTEMPTS): Promise<{ status: string; result: unknown[] }> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`🔄 Intento ${attempt + 1} para: ${url.substring(0, 100)}...`);
      
      const data = await fetchData(url);
      console.log(`📊 Data received: status=${data.status}, result length=${data.result?.length || 0}`);
      
      if (data.status === '1') {
        console.log(`✅ Success on attempt ${attempt + 1}`);
        return data;
      } else {
        console.log(`⚠️ API returned status ${data.status}: ${data.result}`);
        if (data.status === '0' && typeof data.result === 'string' && data.result === 'Max rate limit reached') {
          console.log(config.ERROR_MESSAGES.RATE_LIMIT);
          const newUrl = url.replace(/apikey=[^&]+/, `apikey=${getNextApiKey()}`);
          if (attempt < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, config.RATE_LIMIT_DELAY));
            continue;
          }
        }
        return data; // Return even if status is not '1'
      }
    } catch (error) {
      console.error(`❌ Intento ${attempt + 1} falló:`, error instanceof Error ? error.message : error);
      if (attempt === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, config.RATE_LIMIT_DELAY * (attempt + 1)));
    }
  }
  
  // Si llegamos aquí, todos los intentos fallaron
  throw new Error('All retry attempts failed');
}

// Función para obtener transacciones con múltiples estrategias
async function fetchTransactions(address: string, action: string, apiKey: string) {
  console.log(`🔄 Obteniendo ${action} para ${address} con estrategias múltiples...`);
  
  let allTransactions: BaseTransaction[] = [];
  
  // Estrategia 1: Consulta normal
  const normalResult = await fetchTransactionsSingle(address, action, apiKey, 0, 50000000);
  allTransactions = allTransactions.concat(normalResult as BaseTransaction[]);
  
  console.log(`📊 ${action} consulta normal: ${normalResult.length} transacciones`);
  
  // Estrategia 2: Si tokentx y tenemos el límite de 10k, probar estrategias adicionales
  if (action === 'tokentx' && normalResult.length >= 10000) {
    console.log(`🚀 ${action}: Límite de 10k alcanzado, aplicando estrategias adicionales...`);
    
    // Probar con rangos de bloques más específicos donde sabemos que hay actividad
    const blockRanges = [
      { start: 20000000, end: 30000000 },
      { start: 30000000, end: 40000000 }
    ];
    
    for (const range of blockRanges) {
      const rangeResult = await fetchTransactionsSingle(address, action, apiKey, range.start, range.end);
      
      // Filtrar duplicados por hash
      const existingHashes = new Set(allTransactions.map(tx => tx.hash));
      const newTransactions = (rangeResult as BaseTransaction[]).filter(tx => !existingHashes.has(tx.hash));
      
      allTransactions = allTransactions.concat(newTransactions);
      
      if (newTransactions.length > 0) {
        console.log(`✅ ${action} rango ${range.start}-${range.end}: ${newTransactions.length} transacciones nuevas`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, config.RATE_LIMIT_DELAY));
    }
    
    // Estrategia 3: Probar con ordenamiento descendente
    console.log(`🔄 Probando ${action} con ordenamiento descendente...`);
    const descResult = await fetchTransactionsSingle(address, action, apiKey, 0, 50000000, 'desc');
    
    // Filtrar duplicados por hash
    const existingHashes = new Set(allTransactions.map(tx => tx.hash));
    const newDescTransactions = (descResult as BaseTransaction[]).filter(tx => !existingHashes.has(tx.hash));
    
    allTransactions = allTransactions.concat(newDescTransactions);
    
    if (newDescTransactions.length > 0) {
      console.log(`✅ ${action} desc: ${newDescTransactions.length} transacciones nuevas`);
    }
  }
  
  console.log(`📊 ${action} TOTAL FINAL: ${allTransactions.length} transacciones`);
  return allTransactions;
}

// Función auxiliar para una sola consulta
async function fetchTransactionsSingle(address: string, action: string, apiKey: string, startblock = 0, endblock = 50000000, sort = 'asc') {
  const url = `${config.BASESCAN_API_URL}?module=account&action=${action}&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=${sort}&apikey=${apiKey}`;
  
  try {
    const data = await fetchWithRetry(url);
    return data.status === '1' && Array.isArray(data.result) ? data.result : [];
  } catch (error) {
    console.error(`❌ Error en ${action}:`, error);
    return [];
  }
}

// Función para calcular estadísticas de ETH
function calculateEthStats(txlist: BaseTransaction[], txlistinternal: BaseTransaction[], address: string) {
  let ethReceived = 0;
  let ethSent = 0;
  let totalGasPaid = 0;
  
  // Calcular ETH de transacciones normales
  txlist.forEach(tx => {
    const value = parseInt(tx.value);
    const gasUsed = parseInt(tx.gasUsed || '0');
    const gasPrice = parseInt(tx.gasPrice || '0');
    const gasPaid = gasUsed * gasPrice;
    
    if (tx.to.toLowerCase() === address.toLowerCase()) {
      ethReceived += value;
    }
    if (tx.from.toLowerCase() === address.toLowerCase()) {
      ethSent += value;
      totalGasPaid += gasPaid; // Solo pagamos gas cuando somos el remitente
    }
  });
  
  // Calcular ETH de transacciones internas
  txlistinternal.forEach(tx => {
    const value = parseInt(tx.value);
    if (tx.to.toLowerCase() === address.toLowerCase()) {
      ethReceived += value;
    }
    if (tx.from.toLowerCase() === address.toLowerCase()) {
      ethSent += value;
    }
  });
  
  const netBalance = ethReceived - ethSent - totalGasPaid;
  
  return {
    received: ethReceived,
    sent: ethSent,
    gasPaid: totalGasPaid,
    net: netBalance
  };
}

// Función para formatear Active Age como Basescan
function formatActiveAge(days: number): string {
  if (days < 1) return 'Less than 1 day';
  
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  
  if (years > 0) {
    return `${years} Year${years > 1 ? 's' : ''} ${remainingDays} Day${remainingDays !== 1 ? 's' : ''}`;
  } else {
    return `${days} Day${days !== 1 ? 's' : ''}`;
  }
}

// Función para calcular actividad diaria (heatmap)
function calculateActivityHeatmap(txlist: BaseTransaction[], txlistinternal: BaseTransaction[], tokentx: TokenTransaction[], tokennfttx: NFTTransaction[]): { [key: string]: number } {
  const activityMap: { [key: string]: number } = {};
  
  // Combinar todas las transacciones
  const allTransactions = [
    ...txlist,
    ...txlistinternal,
    ...tokentx,
    ...tokennfttx
  ];
  
  // Agrupar por día
  allTransactions.forEach(tx => {
    const date = new Date(parseInt(tx.timeStamp) * 1000);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!activityMap[dateKey]) {
      activityMap[dateKey] = 0;
    }
    activityMap[dateKey]++;
  });
  
  return activityMap;
}

// Función para calcular estadísticas avanzadas como Basescan
function calculateAdvancedStats(txlist: BaseTransaction[], txlistinternal: BaseTransaction[], tokentx: TokenTransaction[], tokennfttx: NFTTransaction[]) {
  // Combinar todas las transacciones para análisis temporal
  const allTxs = [...txlist, ...txlistinternal, ...tokentx, ...tokennfttx];
  
  // Filtrar transacciones con timestamp válido
  const validTxs = allTxs.filter(tx => tx.timeStamp && !isNaN(parseInt(tx.timeStamp)));
  
  if (validTxs.length === 0) {
    return {
      since: null,
      activeAge: 0,
      uniqueDays: 0,
      longestStreak: 0
    };
  }
  
  // Convertir timestamps a fechas
  const dates = validTxs.map(tx => {
    const timestamp = parseInt(tx.timeStamp);
    return new Date(timestamp * 1000);
  });
  
  // Encontrar primera y última transacción
  const firstTx = new Date(Math.min(...dates.map(d => d.getTime())));
  const lastTx = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Calcular Active Age (días desde la primera transacción)
  const activeAge = Math.floor((lastTx.getTime() - firstTx.getTime()) / (1000 * 60 * 60 * 24));
  
  // Obtener días únicos con actividad
  const uniqueDaysSet = new Set();
  dates.forEach(date => {
    const dayString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    uniqueDaysSet.add(dayString);
  });
  
  const uniqueDays = uniqueDaysSet.size;
  
  // Calcular racha más larga
  const sortedDays = Array.from(uniqueDaysSet).sort();
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1] as string);
    const curr = new Date(sortedDays[i] as string);
    const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }
  
  return {
    since: firstTx,
    activeAge,
    uniqueDays,
    longestStreak
  };
}

// Función para calcular estadísticas de tokens
function calculateTokenStats(tokentx: TokenTransaction[], tokennfttx: NFTTransaction[]) {
  const tokenStats: { [key: string]: { symbol: string, name: string, received: number, sent: number, decimals: number } } = {};
  const nftStats: { [key: string]: { symbol: string, name: string, count: number } } = {};
  
  // Procesar transacciones de tokens ERC-20
  tokentx.forEach(tx => {
    const tokenKey = tx.contractAddress.toLowerCase();
    const value = parseInt(tx.value);
    const decimals = parseInt(tx.tokenDecimal);
    
    if (!tokenStats[tokenKey]) {
      tokenStats[tokenKey] = {
        symbol: tx.tokenSymbol,
        name: tx.tokenName,
        received: 0,
        sent: 0,
        decimals: decimals
      };
    }
    
    if (tx.to.toLowerCase() === tx.to.toLowerCase()) {
      tokenStats[tokenKey].received += value;
    } else {
      tokenStats[tokenKey].sent += value;
    }
  });
  
  // Procesar transacciones de NFTs
  tokennfttx.forEach(tx => {
    const nftKey = tx.contractAddress.toLowerCase();
    
    if (!nftStats[nftKey]) {
      nftStats[nftKey] = {
        symbol: tx.tokenSymbol,
        name: tx.tokenName,
        count: 0
      };
    }
    
    nftStats[nftKey].count++;
  });
  
  return { tokenStats, nftStats };
}

// API Route principal
export async function POST(request: NextRequest) {
  try {
    // Debug de configuración
    debugConfig();
    
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Dirección de wallet requerida' }, { status: 400 });
    }
    
    // Validar formato de dirección Ethereum
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: config.ERROR_MESSAGES.INVALID_ADDRESS }, { status: 400 });
    }
    
    console.log(`Analizando wallet: ${address}`);
    
    const startTime = Date.now();
    
    // Obtener API key inicial
    const apiKey = getNextApiKey();
    
    // Obtener todas las transacciones secuencialmente para evitar problemas
    console.log('🔄 Obteniendo transacciones secuencialmente...');
    
    const txlist = await fetchTransactions(address, 'txlist', apiKey);
    await new Promise(resolve => setTimeout(resolve, config.RATE_LIMIT_DELAY));
    
    const txlistinternal = await fetchTransactions(address, 'txlistinternal', apiKey);
    await new Promise(resolve => setTimeout(resolve, config.RATE_LIMIT_DELAY));
    
    const tokentx = await fetchTransactions(address, 'tokentx', apiKey);
    await new Promise(resolve => setTimeout(resolve, config.RATE_LIMIT_DELAY));
    
    const tokennfttx = await fetchTransactions(address, 'tokennfttx', apiKey);
    
    // Debug: Log de resultados de fetch
    console.log(`🔍 Resultados de fetch para ${address}:`);
    console.log(`  txlist: ${txlist.length} transacciones`);
    console.log(`  txlistinternal: ${txlistinternal.length} transacciones`);
    console.log(`  tokentx: ${tokentx.length} transacciones`);
    console.log(`  tokennfttx: ${tokennfttx.length} transacciones`);
    
    // Calcular estadísticas
    const ethStats = calculateEthStats(txlist, txlistinternal, address);
    const { tokenStats, nftStats } = calculateTokenStats(tokentx as TokenTransaction[], tokennfttx as NFTTransaction[]);
    const advancedStats = calculateAdvancedStats(txlist, txlistinternal, tokentx as TokenTransaction[], tokennfttx as NFTTransaction[]);
    
    // Calcular actividad diaria para el heatmap
    const activityHeatmap = calculateActivityHeatmap(txlist, txlistinternal, tokentx as TokenTransaction[], tokennfttx as NFTTransaction[]);
    
    // Contar transacciones por tipo
    const counts = {
      normalTx: txlist.length,
      internalTx: txlistinternal.length,
      tokenTx: tokentx.length,
      tokenNftTx: tokennfttx.length,
      total: txlist.length + txlistinternal.length + tokentx.length + tokennfttx.length
    };
    
    // Debug: Log de conteos
    console.log(`📊 Conteos para ${address}:`);
    console.log(`  Normal: ${counts.normalTx}`);
    console.log(`  Internal: ${counts.internalTx}`);
    console.log(`  Token: ${counts.tokenTx}`);
    console.log(`  NFT: ${counts.tokenNftTx}`);
    console.log(`  Total: ${counts.total}`);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const result = {
      address,
      counts,
      txlist,
      txlistinternal,
      tokentx,
      tokennfttx,
      ethStats: {
        received: ethStats.received.toString(),
        sent: ethStats.sent.toString(),
        gasPaid: ethStats.gasPaid.toString(),
        net: ethStats.net.toString(),
        receivedFormatted: `${(ethStats.received / 1e18).toFixed(6)} ETH`,
        sentFormatted: `${(ethStats.sent / 1e18).toFixed(6)} ETH`,
        gasPaidFormatted: `${(ethStats.gasPaid / 1e18).toFixed(6)} ETH`,
        netFormatted: `${(ethStats.net / 1e18).toFixed(6)} ETH`
      },
      advancedStats: {
        since: advancedStats.since?.toISOString() || null,
        sinceFormatted: advancedStats.since ? advancedStats.since.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) : 'N/A',
        activeAge: advancedStats.activeAge,
        activeAgeFormatted: formatActiveAge(advancedStats.activeAge),
        uniqueDays: advancedStats.uniqueDays,
        longestStreak: advancedStats.longestStreak
      },
      activityHeatmap,
      tokenStats,
      nftStats,
      analysisTime: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
    
    console.log(`Análisis completado en ${duration}ms para ${address}`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error en API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener información de la API
export async function GET() {
  return NextResponse.json({
    name: 'Basescan Analyzer API',
    version: '1.0.0',
    description: 'API optimizada para analizar transacciones de wallets en Base',
    endpoints: {
      POST: '/api/analyze - Analizar wallet',
      GET: '/api/analyze - Información de la API'
    },
    features: [
      'Análisis de transacciones normales',
      'Análisis de transacciones internas',
      'Análisis de tokens ERC-20',
      'Análisis de NFTs ERC-721/1155',
      'Cálculo de ETH recibido/enviado',
      'Estadísticas de tokens por tipo',
      'Rotación automática de API keys',
      'Retry automático en caso de fallos'
    ]
  });
}
