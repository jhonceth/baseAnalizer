// Ejemplo de cómo probar el fallback
// Este archivo muestra cómo funciona el sistema de fallback

/*
CASOS DE USO DEL FALLBACK:

1. API de web3.bio no disponible:
   - Error de red
   - API rate limit
   - Servicio caído

2. Usuario sin datos en web3.bio:
   - Usuario nuevo
   - Usuario sin identidades conectadas
   - Username no encontrado

3. Error en el servidor:
   - Error 500
   - Timeout
   - Invalid response

FUNCIONAMIENTO DEL FALLBACK:

1. Se intenta obtener datos de la API de profile
2. Si falla, se usa la wallet del SDK de Farcaster
3. Se muestra un mensaje de "Modo Fallback"
4. El usuario puede seguir usando la aplicación normalmente

EJEMPLO DE RESPUESTA EN MODO FALLBACK:

{
  "isLoading": false,
  "error": "API Error: Failed to fetch. Mostrando wallet conectada del SDK.",
  "wallets": [
    {
      "address": "0x9b99b5EF89b5532263091ee2f61C93B263E8c15B",
      "platform": "ethereum",
      "identity": "0x9b99b5EF89b5532263091ee2f61C93B263E8c15B",
      "displayName": "0x9b99...c15B",
      "avatar": null,
      "description": null,
      "createdAt": null
    }
  ],
  "ethWallets": ["0x9b99b5EF89b5532263091ee2f61C93B263E8c15B"],
  "profileData": null
}

VENTAJAS DEL FALLBACK:

✅ Garantiza que siempre hay al menos una wallet disponible
✅ Mejor experiencia de usuario (no se rompe la app)
✅ Funciona offline o con problemas de red
✅ Mantiene la funcionalidad básica
✅ Informa al usuario sobre el estado

CÓMO PROBAR EL FALLBACK:

1. Desconectar internet temporalmente
2. Cambiar la URL de la API en el código
3. Usar un username que no existe
4. Simular un error 500 en el servidor
*/

export const FALLBACK_EXAMPLES = {
  // Ejemplo de wallet fallback
  fallbackWallet: {
    address: "0x9b99b5EF89b5532263091ee2f61C93B263E8c15B",
    platform: "ethereum",
    identity: "0x9b99b5EF89b5532263091ee2f61C93B263E8c15B",
    displayName: "0x9b99...c15B",
    avatar: null,
    description: null,
    createdAt: null,
  },

  // Ejemplo de error messages
  errorMessages: {
    networkError: "API Error: Failed to fetch. Mostrando wallet conectada del SDK.",
    notFound: "API Error: 404 Not Found. Mostrando wallet conectada del SDK.",
    serverError: "API Error: 500 Internal Server Error. Mostrando wallet conectada del SDK.",
    timeout: "API Error: Request timeout. Mostrando wallet conectada del SDK.",
  },

  // Estados del componente
  componentStates: {
    loading: "Cargando wallets...",
    fallback: "Modo Fallback",
    noWallets: "No se encontraron wallets conectadas",
    success: "Wallets cargadas correctamente",
  }
};


