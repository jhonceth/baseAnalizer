import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: { address: string } }) {
  try {
    const { address } = params;
    
    // Obtener datos reales de la API en paralelo
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    const [analysisResponse, profileResponse] = await Promise.allSettled([
      fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      }),
      fetch(`${baseUrl}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })
    ]);
    
    // Procesar datos de análisis
    let analysisData = null;
    if (analysisResponse.status === 'fulfilled' && analysisResponse.value.ok) {
      analysisData = await analysisResponse.value.json();
      console.log('✅ Datos de análisis obtenidos para OG image:', analysisData);
    }
    
    // Procesar datos de perfil
    let profileData = null;
    if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
      profileData = await profileResponse.value.json();
      console.log('✅ Datos de perfil obtenidos para OG image:', profileData);
    }
    
    // Datos por defecto si no se pueden obtener
    const defaultAnalysisData = {
      counts: { total: 0 },
      advancedStats: {
        activeAgeFormatted: '0 Days',
        uniqueDays: 0,
        longestStreak: 0,
        sinceFormatted: 'N/A'
      }
    };
    
    const defaultProfileData = {
      farcaster: {
        fid: null,
        username: null,
        displayName: null,
        avatar: null
      }
    };
    
    const data = analysisData || defaultAnalysisData;
    const userProfile = profileData || defaultProfileData;
    
    // Timestamp único para esta imagen (nunca cambiará)
    const imageTimestamp = Date.now();
    
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 800,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, sans-serif',
            background: '#000D34', // Color de fondo azul oscuro
            color: '#FFFFFF', // Texto blanco para contraste
            position: 'relative',
          }}
        >
          {/* Imagen de fondo - COMENTADA */}
          {/* 
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              backgroundImage: `url(${baseUrl}/images/baseback.png)`,
              backgroundSize: '1200px 800px',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              opacity: 1.0,
              zIndex: 1,
            }}
          />
          */}
          
          {/* Contenido principal con z-index mayor */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Avatar grande directamente sobre el fondo */}
            <div
              style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              {/* Avatar grande */}
              <img
                src={userProfile.farcaster?.avatar || `${baseUrl}/images/icon.png`}
                alt="User Avatar"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
                />
                
                {/* Username y FID */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    lineHeight: '1.2',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {userProfile.farcaster?.displayName || userProfile.farcaster?.username || 'Farcaster User'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '24px', // Más grande
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.2',
                    gap: '20px', // Espacio entre FID y Address
                  }}
                >
                  <span>FID: {userProfile.farcaster?.fid || 'N/A'}</span>
                  <span>Address: {address.slice(0, 6)}...{address.slice(-4)}</span>
                </div>
              </div>
            </div>

            {/* Logo Base del lado derecho */}
            <div
              style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src={`${baseUrl}/images/base.png`}
                alt="Base Logo"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                }}
              />
            </div>

              {/* Main Content - Datos centrados */}
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '40px',
                  paddingTop: '180px', // Subido más el contenido
                }}
              >
                {/* Título principal */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '15px', // Reducido el espacio
                  }}
                >
                {/* Título principal */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: '56px', // Letras más grandes
                    fontWeight: 'bold', // Peso Bold
                    color: '#FFFFFF', // Texto blanco para el fondo azul
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '3px',
                    textTransform: 'uppercase', // Mayúsculas
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    marginBottom: '12px',
                  }}
                >
                  MY ACTIVITY IN BASE
                </div>
                
                {/* Subtítulo */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)', // Texto blanco semi-transparente
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '1px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Wallet Activity Summary
                </div>
              </div>

              {/* Stats Grid - Layout original sin cuadros de colores */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0 20px',
                  gap: '8px', // Reducido el espacio entre filas
                  marginTop: '5px', // Reducido el margen superior
                }}
              >
                {/* Primera fila - Transactions y Active Age */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    gap: '20px',
                  }}
                >
                  {/* Transactions */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '45%',
                      padding: '20px',
                      minHeight: '140px',
                    }}
                  >
                    {/* Título arriba */}
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#FFD700',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        marginBottom: '8px',
                      }}
                    >
                      TRANSACTIONS
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '72px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      <span style={{ fontSize: '48px', marginRight: '8px' }}>🧾</span>
                      <span style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{data.counts.total || 0}</span>
                    </div>
                  </div>
                  
                  {/* Active Age */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '45%',
                      padding: '20px',
                      minHeight: '140px',
                    }}
                  >
                    {/* Título arriba */}
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#FFD700',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        marginBottom: '8px',
                      }}
                    >
                      ACTIVE AGE
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '72px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      <span style={{ fontSize: '48px', marginRight: '8px' }}>⏳</span>
                      <span style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{data.advancedStats.activeAgeFormatted || '0d'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Segunda fila - Active Days y Longest Streak */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    gap: '20px',
                    marginTop: '-15px', // Subido más
                  }}
                >
                  {/* Active Days */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '45%',
                      padding: '20px',
                      minHeight: '140px',
                    }}
                  >
                    {/* Título arriba */}
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#FFD700',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        marginBottom: '8px',
                      }}
                    >
                      ACTIVE DAYS
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '72px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      <span style={{ fontSize: '48px', marginRight: '8px' }}>📅</span>
                      <span style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{data.advancedStats.uniqueDays || 0}</span>
                    </div>
                  </div>
                  
                  {/* Longest Streak */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '45%',
                      padding: '20px',
                      minHeight: '140px',
                    }}
                  >
                    {/* Título arriba */}
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#FFD700',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        marginBottom: '8px',
                      }}
                    >
                      LONGEST STREAK
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '72px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      <span style={{ fontSize: '48px', marginRight: '8px' }}>🔥</span>
                      <span style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{data.advancedStats.longestStreak || 0} Days</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Termómetro de Niveles - Pie de página */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '30px',
                  right: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {/* Título del termómetro */}
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#FFD700',
                    textAlign: 'center',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  ACTIVITY LEVEL
                </div>
                
                {/* Termómetro horizontal */}
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '40px',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {/* Llenado dinámico según datos del usuario */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      bottom: '0',
                      width: `${(() => {
                        const total = data.counts.total || 0;
                        
                        // Primera escala: 0-1000 (25% del termómetro)
                        if (total < 1000) {
                          return `${(total / 1000) * 25}%`;
                        }
                        
                        // Segunda escala: 1000-5000 (25% del termómetro)
                        if (total < 5000) {
                          const progress = (total - 1000) / (5000 - 1000);
                          return `${25 + (progress * 25)}%`;
                        }
                        
                        // Tercera escala: 5000-20000 (25% del termómetro)
                        if (total < 20000) {
                          const progress = (total - 5000) / (20000 - 5000);
                          return `${50 + (progress * 25)}%`;
                        }
                        
                        // Cuarta escala: 20000-50000 (25% del termómetro)
                        if (total < 50000) {
                          const progress = (total - 20000) / (50000 - 20000);
                          return `${75 + (progress * 25)}%`;
                        }
                        
                        return '100%';
                      })()}`,
                      background: `${(() => {
                        const total = data.counts.total || 0;
                        if (total < 1000) return '#8A2BE2'; // Púrpura
                        if (total < 5000) return '#FFA500'; // Naranja
                        if (total < 20000) return '#87CEEB'; // Azul claro
                        if (total < 50000) return '#90EE90'; // Verde claro
                        return '#90EE90'; // Verde claro
                      })()}`,
                      borderRadius: '18px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                  
                  {/* Marcadores de niveles - 4 cuadros iguales */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* Líneas divisorias en posiciones exactas */}
                    <div style={{ position: 'absolute', left: '25%', width: '2px', height: '100%', background: 'rgba(0,0,0,0.2)' }} />
                    <div style={{ position: 'absolute', left: '50%', width: '2px', height: '100%', background: 'rgba(0,0,0,0.2)' }} />
                    <div style={{ position: 'absolute', left: '75%', width: '2px', height: '100%', background: 'rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
                
                {/* Etiquetas de niveles */}
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      GOOD FLOW
                    </div>
                  </div>
                  
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      GROWING
                    </div>
                  </div>
                  
                    <div
                      style={{
                        display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      VIRAL
                    </div>
                  </div>
                  
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                        alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      GOD MODE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
        headers: {
          'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable', // Cache estático por 1 año
          'ETag': `"${address}-${imageTimestamp}"`, // ETag único basado en dirección + timestamp
        },
      }
    );
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}