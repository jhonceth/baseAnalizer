export async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function loadImage(url: string): Promise<ArrayBuffer> {
  const logoImageRes = await fetch(url);

  if (!logoImageRes.ok) {
    throw new Error(`Failed to fetch logo image: ${logoImageRes.statusText}`);
  }

  return await logoImageRes.arrayBuffer();
}

// Función para formatear números grandes
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  } else {
    return num.toFixed(0);
  }
}

// Función para formatear tiempo relativo
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return `${years}y ago`;
  else if (months >= 1) return `${months}mo ago`;
  else if (days >= 1) return `${days}d ago`;
  else if (hours >= 1) return `${hours}h ago`;
  else return `${Math.max(1, minutes)}m ago`;
}

// Función para obtener color basado en cambio porcentual
export function getChangeColor(change: number): string {
  if (change > 0) return "#10B981"; // green-500
  if (change < 0) return "#EF4444"; // red-500
  return "#9CA3AF"; // gray-400
}

// Función para formatear cambio porcentual
export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}