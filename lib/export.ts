export type StripLayout = 'strip' | 'polaroid' | 'square';

interface ExportOptions {
  photos: string[];
  layout: StripLayout;
  filterCSS?: string;
}

function applyFilterToCanvas(
  ctx: CanvasRenderingContext2D,
  filterCSS: string,
  width: number,
  height: number
): void {
  if (!filterCSS) return;
  ctx.filter = filterCSS;
}

export async function exportPhotoStrip(options: ExportOptions): Promise<void> {
  const { photos, layout, filterCSS = '' } = options;

  if (photos.length === 0) return;

  let canvas: HTMLCanvasElement;
  const ctx_ref: { ctx: CanvasRenderingContext2D | null } = { ctx: null };

  if (layout === 'polaroid') {
    canvas = createPolaroidStrip(photos, filterCSS);
  } else if (layout === 'square') {
    canvas = createSquareLayout(photos, filterCSS);
  } else {
    canvas = createFilmStrip(photos, filterCSS);
  }

  downloadCanvas(canvas, `snapbooth-${layout}-${Date.now()}.png`);
}

function createFilmStrip(photos: string[], filterCSS: string): HTMLCanvasElement {
  const photoWidth = 400;
  const photoHeight = 300;
  const stripPadding = 20;
  const photoPadding = 12;
  const headerHeight = 60;
  const footerHeight = 50;

  const stripWidth = photoWidth + stripPadding * 2;
  const stripHeight =
    headerHeight +
    photos.length * (photoHeight + photoPadding) -
    photoPadding +
    footerHeight +
    stripPadding * 2;

  const canvas = document.createElement('canvas');
  canvas.width = stripWidth;
  canvas.height = stripHeight;

  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, stripWidth, stripHeight);

  // Film strip holes left
  drawFilmHoles(ctx, 0, stripHeight, 'left');
  // Film strip holes right
  drawFilmHoles(ctx, stripWidth - 18, stripHeight, 'right');

  // Header text
  ctx.fillStyle = '#F9A8D4';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ SnapBooth', stripWidth / 2, 38);

  // Draw photos
  photos.forEach((photo, index) => {
    const img = new Image();
    img.src = photo;

    const y = headerHeight + stripPadding + index * (photoHeight + photoPadding);
    const x = stripPadding;

    ctx.save();
    if (filterCSS) {
      ctx.filter = filterCSS;
    }

    // Draw synchronously if image is already loaded
    if (img.complete) {
      ctx.drawImage(img, x, y, photoWidth, photoHeight);
    } else {
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(x, y, photoWidth, photoHeight);
    }

    ctx.restore();

    // White border
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, photoWidth, photoHeight);
  });

  // Footer text
  const footerY = stripHeight - footerHeight + 20;
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    stripWidth / 2,
    footerY
  );

  return canvas;
}

function drawFilmHoles(
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number,
  _side: 'left' | 'right'
): void {
  const holeSize = 8;
  const holeSpacing = 24;
  const startY = 20;

  ctx.fillStyle = '#0a0a0a';

  for (let y = startY; y < height - 20; y += holeSpacing) {
    ctx.beginPath();
    ctx.roundRect(x + 4, y, holeSize, holeSize * 0.7, 2);
    ctx.fill();
  }
}

function createPolaroidStrip(photos: string[], filterCSS: string): HTMLCanvasElement {
  const polaroidWidth = 320;
  const polaroidHeight = 380;
  const borderSize = 20;
  const bottomBorder = 60;
  const padding = 30;
  const cols = Math.min(photos.length, 2);
  const rows = Math.ceil(photos.length / cols);

  const canvasWidth = cols * (polaroidWidth + padding) + padding;
  const canvasHeight = rows * (polaroidHeight + padding) + padding + 80;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d')!;

  // Dark background
  ctx.fillStyle = '#0F0F0F';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Header
  ctx.fillStyle = '#F9A8D4';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ SnapBooth Moments', canvasWidth / 2, 40);

  photos.forEach((photo, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = padding + col * (polaroidWidth + padding);
    const y = 60 + padding + row * (polaroidHeight + padding);

    // Polaroid white bg
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, x, y, polaroidWidth, polaroidHeight, 4);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const img = new Image();
    img.src = photo;

    const photoX = x + borderSize;
    const photoY = y + borderSize;
    const photoW = polaroidWidth - borderSize * 2;
    const photoH = polaroidHeight - borderSize - bottomBorder;

    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    if (filterCSS) ctx.filter = filterCSS;

    if (img.complete) {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
    } else {
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(photoX, photoY, photoW, photoH);
    }

    ctx.restore();

    // Date on polaroid
    ctx.fillStyle = '#666';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      x + polaroidWidth / 2,
      y + polaroidHeight - 18
    );
  });

  return canvas;
}

function createSquareLayout(photos: string[], filterCSS: string): HTMLCanvasElement {
  const size = 400;
  const padding = 8;
  const headerH = 60;
  const count = Math.min(photos.length, 4);
  const cols = count <= 2 ? count : 2;
  const rows = Math.ceil(count / 2);

  const canvasW = cols * size + (cols + 1) * padding;
  const canvasH = headerH + rows * size + (rows + 1) * padding;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;

  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0F0F0F';
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.fillStyle = '#F9A8D4';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ SnapBooth', canvasW / 2, 38);

  photos.slice(0, 4).forEach((photo, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = padding + col * (size + padding);
    const y = headerH + padding + row * (size + padding);

    const img = new Image();
    img.src = photo;

    ctx.save();
    if (filterCSS) ctx.filter = filterCSS;

    if (img.complete) {
      ctx.drawImage(img, x, y, size, size);
    } else {
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(x, y, size, size);
    }

    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
  });

  return canvas;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export async function exportPhotoStripFromElement(
  elementId: string,
  filename?: string
): Promise<void> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: '#0F0F0F',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    downloadCanvas(canvas, filename || `snapbooth-strip-${Date.now()}.png`);
  } catch (error) {
    console.error('Export failed:', error);
  }
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function captureVideoFrame(
  video: HTMLVideoElement,
  filterCSS: string = ''
): string {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  const ctx = canvas.getContext('2d')!;

  // Mirror if front camera (we handle this via CSS but also flip on canvas)
  ctx.save();
  if (filterCSS) {
    ctx.filter = filterCSS;
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.95);
}
