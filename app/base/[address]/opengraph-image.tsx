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
            background: '#FFFFFF',
            color: '#000000',
            position: 'relative',
          }}
        >
          {/* Imagen de fondo */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${baseUrl}/images/baseback.png)`,
              backgroundSize: '1200px 800px',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              opacity: 1.0,
              zIndex: 1,
            }}
          />
          
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
            {/* User Info - Barra horizontal superior ocupando todo el espacio */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Lado izquierdo - Avatar y datos del usuario */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                {/* Avatar */}
                <img
                  src={userProfile.farcaster?.avatar || `${baseUrl}/images/icon.png`}
                  alt="User Avatar"
                  tw="w-16 h-16 rounded-full object-cover"
                />
                
                {/* Username y FID */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#000000',
                      lineHeight: '1.2',
                    }}
                  >
                    {userProfile.farcaster?.displayName || userProfile.farcaster?.username || 'Farcaster User'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: 'rgba(0, 0, 0, 0.6)',
                      lineHeight: '1.2',
                    }}
                  >
                    FID: {userProfile.farcaster?.fid || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Lado derecho - Address */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  flex: 1,
                  marginLeft: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'rgba(0, 0, 0, 0.7)',
                    lineHeight: '1.2',
                    marginBottom: '8px',
                  }}
                >
                  Address Analyzed:
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: 'rgba(0, 0, 0, 0.9)',
                    lineHeight: '1.2',
                    fontFamily: 'monospace',
                    background: 'rgba(0, 0, 0, 0.05)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {address}
                </div>
              </div>
            </div>

            {/* Main Content - Datos centrados */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
              }}
            >
              {/* Título principal */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '30px',
                  marginTop: '120px',
                }}
              >
                {/* Título principal */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: '48px',
                    fontWeight: '900',
                    color: '#000000',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '3px',
                    textShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '25px 50px',
                    borderRadius: '16px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    marginBottom: '12px',
                  }}
                >
                  MY ACTIVITY IN BASE NETWORK
                </div>
                
                {/* Subtítulo */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: '500',
                    color: 'rgba(0, 0, 0, 0.7)',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '1px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    padding: '12px 30px',
                    borderRadius: '12px',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Wallet Activity Summary
                </div>
              </div>

              {/* Stats Grid - Nueva distribución con iconos */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0 20px',
                  gap: '20px',
                  marginTop: '20px',
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      minHeight: '140px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '48px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      🧾 {data.counts.total || 0}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Transactions
                    </div>
                  </div>
                  
                  {/* Active Age */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '45%',
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      minHeight: '140px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '48px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      ⏳ {data.advancedStats.activeAgeFormatted || '0d'}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Active Age
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
                  }}
                >
                  {/* Active Days */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '45%',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      minHeight: '140px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '48px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      📅 {data.advancedStats.uniqueDays || 0}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Active Days
                    </div>
                  </div>
                  
                  {/* Longest Streak */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '45%',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      minHeight: '140px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '48px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      🔥 {data.advancedStats.longestStreak || 0} Days
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Longest Stk
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
          'Cache-Control': 'public, max-age=31536000, immutable', // Cache por 1 año
          'ETag': `"${address}-${imageTimestamp}"`, // ETag único basado en dirección + timestamp
        },
      }
    );
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}