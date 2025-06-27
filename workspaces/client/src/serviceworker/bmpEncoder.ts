/**
 * Simple BMP encoder that converts ImageData to BMP format
 * This avoids the jimp dependency issue in service workers
 */

export function encodeBMP(imageData: ImageData): ArrayBuffer {
  const { width, height, data } = imageData;
  
  // BMP header sizes
  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const headerSize = fileHeaderSize + infoHeaderSize;
  
  // Calculate row size with padding (rows must be multiples of 4 bytes)
  const rowPadding = (4 - (width * 3) % 4) % 4;
  const rowSize = width * 3 + rowPadding;
  const pixelDataSize = rowSize * height;
  const fileSize = headerSize + pixelDataSize;
  
  // Create buffer
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  
  // File header (14 bytes)
  // Signature 'BM'
  bytes[0] = 0x42; // 'B'
  bytes[1] = 0x4D; // 'M'
  
  // File size
  view.setUint32(2, fileSize, true);
  
  // Reserved
  view.setUint32(6, 0, true);
  
  // Data offset
  view.setUint32(10, headerSize, true);
  
  // Info header (40 bytes)
  // Info header size
  view.setUint32(14, infoHeaderSize, true);
  
  // Width
  view.setInt32(18, width, true);
  
  // Height (positive = bottom-up, negative = top-down)
  view.setInt32(22, height, true);
  
  // Planes
  view.setUint16(26, 1, true);
  
  // Bits per pixel (24-bit RGB)
  view.setUint16(28, 24, true);
  
  // Compression (0 = none)
  view.setUint32(30, 0, true);
  
  // Image size (can be 0 for uncompressed)
  view.setUint32(34, pixelDataSize, true);
  
  // X pixels per meter (72 DPI)
  view.setInt32(38, 2835, true);
  
  // Y pixels per meter (72 DPI)
  view.setInt32(42, 2835, true);
  
  // Colors used (0 = all)
  view.setUint32(46, 0, true);
  
  // Important colors (0 = all)
  view.setUint32(50, 0, true);
  
  // Pixel data (bottom-up, BGR format)
  let offset = headerSize;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      // BMP uses BGR format
      bytes[offset++] = data[i + 2]; // Blue
      bytes[offset++] = data[i + 1]; // Green
      bytes[offset++] = data[i];     // Red
    }
    // Add row padding
    for (let p = 0; p < rowPadding; p++) {
      bytes[offset++] = 0;
    }
  }
  
  return buffer;
}