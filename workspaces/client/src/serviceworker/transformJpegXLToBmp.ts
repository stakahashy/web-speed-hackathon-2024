// @ts-expect-error - This is a workaround for the missing type definition
import jsquashWasmBinary from '@jsquash/jxl/codec/dec/jxl_dec.wasm';
import { init as jsquashInit } from '@jsquash/jxl/decode';

import { encodeBMP } from './bmpEncoder';

export async function transformJpegXLToBmp(response: Response): Promise<Response> {
  const { decode } = await jsquashInit(undefined, {
    locateFile: () => {},
    wasmBinary: jsquashWasmBinary,
  });

  const imageData = decode(await response.arrayBuffer())!;
  const bmpBuffer = encodeBMP(imageData);

  return new Response(bmpBuffer, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'image/bmp',
    },
  });
}
