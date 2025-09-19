import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: { address: string } }) {
  try {
    const { address } = params;
    
    // Obtener datos reales de la API
    let analysisData = null;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      
      if (response.ok) {
        analysisData = await response.json();
        console.log('✅ Datos de análisis obtenidos para OG image:', analysisData);
      }
    } catch (error) {
      console.error('❌ Error obteniendo datos de análisis:', error);
    }
    
    // Datos por defecto si no se pueden obtener
    const defaultData = {
      counts: { total: 0 },
      advancedStats: {
        activeAgeFormatted: '0 Days',
        uniqueDays: 0,
        longestStreak: 0,
        sinceFormatted: 'N/A'
      }
    };
    
    const data = analysisData || defaultData;
    
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
                  backgroundImage: 'url(http://localhost:3000/images/baseback.png)',
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
                src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/d44b2c4e-35e0-4772-5c7d-9559ea045800/original"
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
                  Jhon
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
                  FID: 499880
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
                    marginBottom: '20px',
                    marginTop: '140px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '36px',
                      fontWeight: '900',
                      color: '#000000',
                      textAlign: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      letterSpacing: '2px',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '20px 40px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    MY ACTIVITY IN BASE NETWORK
                  </div>
                </div>

                {/* Stats Grid - Diseño 2x2 con 4 cuadros */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    padding: '0 20px',
                    gap: '30px',
                    marginTop: '20px',
                  }}
                >
                  {/* Primera fila - Transaction Count y Active Age */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      gap: '40px',
                    }}
                  >
                    {/* Transaction Count */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '40%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        padding: '15px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        minHeight: '160px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          textAlign: 'center',
                          marginBottom: '6px',
                          height: '60px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1.1',
                        }}
                      >
                        TRANSACTION COUNT
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '72px',
                          fontWeight: '900',
                          color: '#FFFFFF',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        {data.counts.total || 0}
                      </div>
                    </div>
                    
                    {/* Active Age */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '40%',
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        borderRadius: '12px',
                        padding: '15px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        minHeight: '160px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          textAlign: 'center',
                          marginBottom: '6px',
                          height: '60px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1.1',
                        }}
                      >
                        ACTIVE AGE
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '60px',
                          fontWeight: '900',
                          color: '#FFFFFF',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        {data.advancedStats.activeAgeFormatted || '0 Days'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Segunda fila - Unique Days y Longest Streak */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      gap: '40px',
                    }}
                  >
                    {/* Unique Days */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '40%',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: '12px',
                        padding: '15px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        minHeight: '160px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          textAlign: 'center',
                          marginBottom: '6px',
                          height: '60px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1.1',
                        }}
                      >
                        UNIQUE DAYS ACTIVE
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '72px',
                          fontWeight: '900',
                          color: '#FFFFFF',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        {data.advancedStats.uniqueDays || 0}
                      </div>
                    </div>
                    
                    {/* Longest Streak */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '40%',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        borderRadius: '12px',
                        padding: '15px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        minHeight: '160px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          textAlign: 'center',
                          marginBottom: '6px',
                          height: '60px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1.1',
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
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        {data.advancedStats.longestStreak || 0}
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
      }
    );
  } catch (e) {
    console.error('Error generating OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}