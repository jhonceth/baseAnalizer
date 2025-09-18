import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { loadGoogleFont, formatNumber } from '@/lib/og-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: { address: string } }) {
  try {
    const { address } = params;
    
    // Dimensiones 3:2 según documentación de Farcaster (mínimo 600x400, máximo 3000x2000)
    const width = 1200;
    const height = 800;
    
    // Formatear dirección para mostrar
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    
    // Intentar obtener datos reales del análisis y del usuario
    let analysisData = null;
    let userInfo = null;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
        cache: 'no-store',
      });
      
      if (response.ok) {
        analysisData = await response.json();
        // Extraer información del usuario si está disponible
        userInfo = analysisData.userInfo || null;
      }
    } catch (e) {
      console.warn('Failed to fetch analysis data for OG image:', e);
    }
    
    // Cargar fuentes de Google
    let fontData: ArrayBuffer | undefined;
    try {
      fontData = await loadGoogleFont('Inter', 'Base Analytics Report ' + shortAddress);
    } catch (e) {
      console.warn('Failed to load Google font:', e);
    }

    return new ImageResponse(
      (
        <div
          style={{
            width,
            height,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: fontData ? 'Inter' : 'system-ui, sans-serif',
            position: 'relative',
            background: 'linear-gradient(135deg, #6D28D9 0%, #3B82F6 100%)',
          }}
        >
          {/* Top Left - User Info */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 10,
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* User Avatar */}
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '3px solid white',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              {userInfo?.pfpUrl ? (
                <img
                  src={userInfo.pfpUrl}
                  alt={userInfo.username || 'User'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                  }}
                >
                  👤
                </div>
              )}
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
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                {userInfo?.username || 'User'}
              </div>
              
              {/* FID */}
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                FID: {userInfo?.fid || 'N/A'}
              </div>
            </div>
          </div>

          {/* Top Center - Title */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              fontSize: '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            BASE ANALYTICS REPORT
          </div>

          {/* Top Right - Full Address */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 10,
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px',
              }}
            >
              {/* Full Address */}
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                  fontFamily: 'monospace',
                  textAlign: 'right',
                  maxWidth: '300px',
                  wordBreak: 'break-all',
                }}
              >
                {address}
              </div>
              
              {/* Address Label */}
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                Wallet Address
              </div>
            </div>
          </div>

          {/* Top Section - Main Stats */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              padding: '40px 60px',
              color: '#FFFFFF',
              height: '50%',
              gap: '20px',
              position: 'relative',
              width: '100%',
              zIndex: 2,
            }}
          >
            {/* Overlay para mejorar legibilidad */}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 1,
              }}
            />
            
            {/* Contenido principal */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '20px',
                zIndex: 2,
                position: 'relative',
              }}
            >
              {/* Wallet Address */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '60px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: '12px' }}>🔍</span>{shortAddress}
              </div>
              
              {/* Analysis Status */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '44px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#3B82F6', marginRight: '8px' }}>📊</span> 
                {analysisData ? `${formatNumber(analysisData.counts?.total || 0)} Transactions` : 'Wallet Analysis'}
              </div>
            </div>
          </div>

          {/* Bottom Section - Detailed Stats */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '40px 60px',
              background: 'rgba(0, 0, 0, 0.85)',
              color: '#F9FAFB',
              height: '50%',
              gap: '40px',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Wallet Info Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                minWidth: '200px',
                flexShrink: 0,
              }}
            >
              {/* Wallet Icon */}
              <div
                style={{
                  display: 'flex',
                  width: '120px',
                  height: '120px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    border: '3px solid white',
                    fontSize: '48px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                  }}
                >
                  🔍
                </div>
              </div>

              {/* Address */}
              <div
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: 'monospace',
                }}
              >
                {shortAddress}
              </div>
            </div>

            {/* Stats Grid - Four Horizontal Cards */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* Transaction Count */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px 16px',
                  minWidth: '180px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '36px',
                    fontWeight: '800',
                    color: '#F9FAFB',
                    marginBottom: '8px',
                  }}
                >
                  {analysisData ? formatNumber(analysisData.counts?.total || 0) : '733'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#9CA3AF',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Transaction Count
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                  }}
                >
                  Since Thu, Apr 3, 2025
                </div>
              </div>

              {/* Active Age */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px 16px',
                  minWidth: '180px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '36px',
                    fontWeight: '800',
                    color: '#F9FAFB',
                    marginBottom: '8px',
                  }}
                >
                  {analysisData ? (analysisData.advancedStats?.activeAgeFormatted || '168 Days') : '168 Days'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#9CA3AF',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Active Age
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                  }}
                >
                  Since Thu, Apr 3, 2025
                </div>
              </div>

              {/* Unique Days Active */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px 16px',
                  minWidth: '180px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '36px',
                    fontWeight: '800',
                    color: '#F9FAFB',
                    marginBottom: '8px',
                  }}
                >
                  {analysisData ? formatNumber(analysisData.advancedStats?.uniqueDays || 0) : '132 Days'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#9CA3AF',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Unique Days Active
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                  }}
                >
                  Since Thu, Apr 3, 2025
                </div>
              </div>

              {/* Longest Streak */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px 16px',
                  minWidth: '180px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '36px',
                    fontWeight: '800',
                    color: '#F9FAFB',
                    marginBottom: '8px',
                  }}
                >
                  {analysisData ? formatNumber(analysisData.advancedStats?.longestStreak || 0) : '23 Days'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#9CA3AF',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Longest Streak
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                  }}
                >
                  Since Thu, Apr 3, 2025
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              zIndex: 10,
            }}
          >
            Generated by Base Analytics • {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      ),
      {
        width,
        height,
        fonts: fontData ? [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal',
          },
        ] : undefined,
        headers: {
          "Cache-Control": "public, immutable, no-transform, max-age=300",
        },
      }
    );
  } catch (e) {
    console.error('Error generating OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
