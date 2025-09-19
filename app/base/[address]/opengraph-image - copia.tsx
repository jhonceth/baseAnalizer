import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Image({ 
  params, 
  searchParams 
}: { 
  params: { address: string };
  searchParams?: { t?: string };
}) {
  try {
    const { address } = params;
    const { t } = searchParams || {};
    
    // Usar timestamp para generar imagen única
    const timestamp = t || Date.now().toString();
    
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 800,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, sans-serif',
            background: 'linear-gradient(135deg, #6D28D9 0%, #3B82F6 100%)',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Left Side - User Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* User Avatar */}
              <div
                style={{
                  display: 'flex',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '3px solid white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                  }}
                >
                  👤
                </div>
              </div>
              
              {/* User Info */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                }}
              >
                {/* Username */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}
                >
                  Farcaster User
                </div>
                
                {/* FID */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  FID: 12345
                </div>
              </div>
            </div>

            {/* Right Side - Full Address */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px',
                maxWidth: '400px',
              }}
            >
              {/* Full Address */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  textAlign: 'right',
                  wordBreak: 'break-all',
                }}
              >
                {address}
              </div>
              
              {/* Address Label */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Wallet Address
              </div>
              
              {/* Timestamp - muy sutil */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '8px',
                  fontWeight: '400',
                  color: 'rgba(255, 255, 255, 0.3)',
                  marginTop: '2px',
                }}
              >
                {new Date(parseInt(timestamp)).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: '800',
                marginBottom: '20px',
              }}
            >
              📊 BASE ANALYTICS REPORT
            </div>
            
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            
            {/* Analysis Stats */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}
              >
                📊 733 Transactions
              </div>
              
              {/* Stats Grid - Rectangular Cards */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                  width: '100%',
                  maxWidth: '1200px', // Usar todo el ancho disponible
                  gap: '24px',
                  marginTop: '40px', // Más espacio arriba
                }}
              >
                {/* Active Age */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px', // Más rectangular
                    padding: '40px 20px', // Mucho más padding
                    flex: 1,
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                    minHeight: '220px', // Mucho más alto
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '32px',
                      opacity: '0.4',
                    }}
                  >
                    📅
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '64px', // Muchísimo más grande
                      fontWeight: '900',
                      color: '#FFFFFF',
                      marginBottom: '16px',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                      letterSpacing: '-2px',
                    }}
                  >
                    168 Days
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '24px', // Más grande
                      fontWeight: '700',
                      color: '#E0E7FF',
                      textAlign: 'center',
                      textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                      letterSpacing: '1px',
                    }}
                  >
                    ACTIVE AGE
                  </div>
                </div>
                
                {/* Unique Days */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '8px', // Más rectangular
                    padding: '40px 20px', // Mucho más padding
                    flex: 1,
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)',
                    minHeight: '220px', // Mucho más alto
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '32px',
                      opacity: '0.4',
                    }}
                  >
                    🔥
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '64px', // Muchísimo más grande
                      fontWeight: '900',
                      color: '#FFFFFF',
                      marginBottom: '16px',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                      letterSpacing: '-2px',
                    }}
                  >
                    132
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '24px', // Más grande
                      fontWeight: '700',
                      color: '#FCE7F3',
                      textAlign: 'center',
                      textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                      letterSpacing: '1px',
                    }}
                  >
                    UNIQUE DAYS
                  </div>
                </div>
                
                {/* Longest Streak */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: '8px', // Más rectangular
                    padding: '40px 20px', // Mucho más padding
                    flex: 1,
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)',
                    minHeight: '220px', // Mucho más alto
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '32px',
                      opacity: '0.4',
                    }}
                  >
                    ⚡
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '64px', // Muchísimo más grande
                      fontWeight: '900',
                      color: '#FFFFFF',
                      marginBottom: '16px',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                      letterSpacing: '-2px',
                    }}
                  >
                    23
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '24px', // Más grande
                      fontWeight: '700',
                      color: '#E0F7FF',
                      textAlign: 'center',
                      textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                      letterSpacing: '1px',
                    }}
                  >
                    LONGEST STREAK
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